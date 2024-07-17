const express = require("express");
const Joi = require('joi');
const app = express()
const trivia = require('./trivia.json');
trivia.forEach((item, index) => {
    item.id = index + 1;
});
let lastID = trivia.length; 
let _trivia = [...trivia];
const schema = Joi.object({
  type: Joi.string().required(),
  difficulty: Joi.string().required(),
  category: Joi.string().required(),
  question: Joi.string().required(),
  correct_answer: Joi.string().required(),
  incorrect_answers: Joi.array().items(
      Joi.string().required()
  ),
});

app.use(express.static('public'));
app.use(express.json());

app.get('/', (request, response) => {
    let {amount, difficulty} = request.query
    amount = Number(amount);

    if (amount && (Number.isNaN(amount) || amount < 1)) {
        response.status(418).send("Amount bad. No trivia");
        return;
    }
    let _amount = amount || 3;
    if (difficulty) {
      _trivia = _trivia.filter((item) => {
        return item.difficulty.toLowerCase().includes(difficulty.toLowerCase());
      });
    }
    if (_amount < _trivia.length) {
      _trivia.length = _amount;
    }
    response.send(_trivia);
})

app.delete("/:id", (request, response) => {
    const { id } = request.params;

    if (Number.isNaN(id * 3) || Number(id) > trivia.length || Number(id) === 0) {  // Added the * 3 because stuff like =e57 could get through
        response.status(418).send("No find ID. No delete");
        return
    }
    const indexOf = trivia.findIndex((item) => {
      return item.id === Number(id);
    });
  
    trivia.splice(indexOf, 1);
  
    response.send({ trivia });
  });

  app.post("/", (request, response) => {
    const validation = schema.validate(request.body, { abortEarly: false }); 

    if(validation.error) {
      console.log('Error', validation.error)
      response.status(418).send(validation.error.details);
        return
    } else {
    lastID++;
    request.body.id = lastID;
  
    trivia.push(request.body);
  
    response.send({ status: 1 }); }
  });

  app.put("/:id", (request, response) => {
    const { id } = request.params;

    if (Number.isNaN(id * 3) || Number(id) > trivia.length || Number(id) === 0) {  // Added the * 3 because stuff like =e57 could get through
      response.status(418).send("No find ID. No edit");
      return
  }
    const validation = schema.validate(request.body, { abortEarly: false }); 
  
    if(validation.error) {
      console.log('Error', validation.error)
      response.status(418).send(validation.error.details);
        return
    } 

    const indexOf = trivia.findIndex((item) => {
      return item.id === Number(id);
    });
  
    if (indexOf < 0) {
      response.send({ status: 0, reason: "Question not found" });
      return;
    }
    request.body.id = Number(id);
    trivia[indexOf] = request.body;
    response.send({ trivia});
  });

const port = process.nextTick.PORT | 6001;
app.listen(port);