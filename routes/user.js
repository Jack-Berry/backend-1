const express = require("express");
const router = express.Router();
const Joi = require('joi');
const sha256 = require("sha256");
const { genToken } = require("../utils");

const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(32).required(),
});

function checkToken(req, res, next) {
    const { token } = req.headers;
    if (!token) {
      res.status(400).send({ status: 0, reason: "No token" });
      return;
    }
  
    const user = req.users.find((user) => {
      return user.tokens.includes(token);
    });
  
    if (!user) {
      res.status(400).send({ status: 0, reason: "Invalid token" });
      return;
    }
  
    req.authedUser = user;
    next();
}

router.get("/ALL", (request, response) => {
    response.send(request.users);
});

router.post("/", (request, response) => {
    const validation = schema.validate(request.body, { abortEarly: false });

    if(validation.error) {
        console.log('Error', validation.error)
        response.status(418).send(validation.error.details);
          return
    }

    const indexOf = request.users.findIndex((user) => {
        return user.email.toLowerCase() === request.body.email.toLowerCase();
      });
    
      if (indexOf >= 0) {
        response.status(400).send({ status: 0, reason: "Existing user" });
        return;
      }
    
      request.body.password = sha256(process.env.SALT + request.body.password);
    
    request.users.push(request.body);
    response.send({ status: 1 });
}) 

router.post("/login", (request, response) => {
    const candidatePassword = sha256(process.env.SALT + request.body.password);
  
    //check the creds match what was originally entered
    const user = request.users.find((user) => {
      return (
        user.email.toLowerCase() === request.body.email.toLowerCase() &&
        user.password === candidatePassword
      );
    });
  
    if (!user) {
      response.status(400).send({ status: 0, reason: "Invalid email/password combo" });
      return;
    }
  
    //generate a shared secret
    const token = genToken();
  
    //store the shared secret locally
    user.tokens = user.tokens ? [...user.tokens, token] : [token];
  
    //send the shared secret to the user
    response.send({ status: 1, token });
  });

  router.patch("/", checkToken, (request, response) => {
    request.authedUser.secret = request.body.secret;
    response.send({ status: 1 });
  });

  router.get("/", checkToken, (request, response) => {
    response.send({ user: request.authedUser });
  });

module.exports = router;