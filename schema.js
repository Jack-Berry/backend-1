
export const triviaSchema = {
    type: Joi.string().required,
    difficulty: Joi.string().required,
    category: Joi.string().required,
    question: Joi.string().required,
    correct_answer: Joi.string().required,
    incorrect_answers: Joi.array().items(
        Joi.string().required()
    ),
  };
