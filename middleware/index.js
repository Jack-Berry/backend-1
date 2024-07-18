function attachTrivia(request, response, next) {
    request.trivia = trivia;
    next();
  }

  module.exports = {attachTrivia}