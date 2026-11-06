//req router
const router = require("express").Router();

//req controller
const authController = require("../controller/authController.js");
const { authMiddleware } = require("../middleware/authMiddleware.js");
const { validateMiddleware } = require("../middleware/validatorMiddleware.js");
const authValidator = require("../validation/authValidation.js");

// login
router.post(
  "/login",
  validateMiddleware(authValidator.loginSchema),
  authController.login,
);

// register
router.post(
  "/register",
  validateMiddleware(authValidator.registerSchema),
  authController.register,
);

router.get("/me", authMiddleware, authController.getMe);
// exports router
module.exports = router;
