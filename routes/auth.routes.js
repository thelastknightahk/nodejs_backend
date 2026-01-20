const router = require("express").Router();
const controller = require("../controllers/auth.controller");
const {
  registerValidation,
  loginValidation,
} = require("../validations/auth.validation");
const authMiddleware = require("../middlewares/auth.middleware");
const { authLimiter } = require("../middlewares/rateLimit.middleware");

router.post(
  "/register",
  authLimiter,
  ...registerValidation,
  controller.register
);

router.post(
  "/login",
  authLimiter,
  ...loginValidation,
  controller.login
);

router.post("/refresh", authLimiter, controller.refreshToken);

router.post("/logout", authMiddleware, controller.logout);
module.exports = router;
