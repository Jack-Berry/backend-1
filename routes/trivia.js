const express = require('express');
const router = express.Router();
const Joi = require('joi');

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

router.use(express.json());

router.get('/', (request, response) => {
    let trivia = request.trivia;
    trivia.forEach((item, index) => {
    item.id = index + 1;
    });
    let filteredTrivia;
    let {amount, difficulty} = request.query
    amount = Number(amount);

    if (amount && (Number.isNaN(amount) || amount < 1)) {
        response.status(418).send("Amount bad. No trivia");
        return;
    }
    let _amount = amount || 3;
    if (difficulty) {
      filteredTrivia = trivia.filter((item) => {
        return item.difficulty.toLowerCase().includes(difficulty.toLowerCase());
      });
    }
    if (_amount < filteredTrivia.length) {
      filteredTrivia.length = _amount;
    }
    response.send(filteredTrivia);
})

router.delete("/:id", (request, response) => {
    const { id } = request.params;
    let trivia = request.trivia;
    trivia.forEach((item, index) => {
    item.id = index + 1;
    });

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

  router.post("/", (request, response) => {
    let trivia = request.trivia;
    trivia.forEach((item, index) => {
    item.id = index + 1;
    });
    let lastID = trivia.length; 
    const validation = schema.validate(request.body, { abortEarly: false }); 
    

    if(validation.error) {
      console.log('Error', validation.error)
      response.status(418).send(validation.error.details);
        return
    } else {
    lastID++;
    console.log(request.body, 'passed VAL')
    // request.body.id = lastID;
  
    trivia.push(request.body);
  
    response.send({ status: 1 }); }
  });

  router.put("/:id", (request, response) => {
    let trivia = request.trivia;
    trivia.forEach((item, index) => {
    item.id = index + 1;
    });
    const { id } = request.params;

    if (!id) {
        response.status(418).send("No tell ID. No edit");
        return 
    }

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

module.exports = router;