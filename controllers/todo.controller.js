const Todo = require("../models/Todo");
const { validationResult } = require("express-validator");

exports.createTodo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const todo = await Todo.create({
    title: req.body.title,
    user: req.user.id,
  });

  res.status(201).json(todo);
};

exports.getTodos = async (req, res) => {
  const todos = await Todo.find({ user: req.user.id });
  res.json(todos);
};

exports.updateTodo = async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );

  if (!todo)
    return res.status(404).json({ message: "Todo not found" });

  res.json(todo);
};

exports.deleteTodo = async (req, res) => {
  const todo = await Todo.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!todo)
    return res.status(404).json({ message: "Todo not found" });

  res.json({ message: "Todo deleted" });
};
