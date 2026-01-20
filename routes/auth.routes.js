const router = require("express").Router();
const controller = require("../controllers/auth.controller");
const {
  registerValidation,
  loginValidation,
} = require("../validations/auth.validation");

router.post("/register", ...registerValidation, controller.register);
router.post("/login", ...loginValidation, controller.login);
router.post("/refresh", controller.refreshToken);

module.exports = router;
