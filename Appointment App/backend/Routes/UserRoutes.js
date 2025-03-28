const express = require("express");
const router = express.Router();

const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/AuthMiddleware");

const UserController = require("../Controllers/UserController");
const AdminController = require("../Controllers/adminController");

router.get(
  "/getAll",
  authMiddleware,
  adminMiddleware,
  UserController.getAllUsers
);

router.get("/get/:id", authMiddleware, UserController.getUser);
router.patch("/update/:id", authMiddleware, UserController.updateUserPartial);
router.delete("/delete/:id", authMiddleware, UserController.deleteUser);

//Admin Controller
router.put(
  "/EditAdmin",
  authMiddleware,
  adminMiddleware,
  AdminController.updateAdminProfile
);
module.exports = router;
