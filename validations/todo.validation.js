const { body } = require("express-validator");

exports.createTodoValidation = [
  body("title").notEmpty().withMessage("Title is required"),
];
