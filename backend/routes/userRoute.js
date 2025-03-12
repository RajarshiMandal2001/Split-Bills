import express from 'express';
import { loginUser, logutUser, registerUser, showLogin, showRegister } from '../controllers/user.controller.js';

const router = express.Router();

// sign up new user
// @GET
router.route("/register").get(showRegister);
// @POST
router.route("/register").post(registerUser);

// login existing user
// @GET
router.route("/login").get(showLogin);
//@POST
router.route("/login").post(loginUser);

// logout existing user
// @GET
router.route("/logout").get(logutUser);

export default router;