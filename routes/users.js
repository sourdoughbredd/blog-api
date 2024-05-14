import express from "express";
const router = express.Router();

import usersController from "../controllers/usersController.js";

router.get("/", usersController.getAllUsers);

router.post("/signup", usersController.signup);

router.post("/login", usersController.login);

router.post("/logout", usersController.logout);

router.post("/token", usersController.refreshAccessToken);

router.get("/:userId", usersController.getUser);

router.put("/:userId", usersController.updateUser);

router.delete("/:userId", usersController.deleteUser);

export default router;
