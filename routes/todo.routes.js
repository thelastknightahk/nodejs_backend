const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const controller = require("../controllers/todo.controller");
const {
  createTodoValidation,
} = require("../validations/todo.validation");

router.use(auth);

router.post("/", createTodoValidation, controller.createTodo);
router.get("/", controller.getTodos);
router.put("/:id", controller.updateTodo);
router.delete("/:id", controller.deleteTodo);

module.exports = router;
