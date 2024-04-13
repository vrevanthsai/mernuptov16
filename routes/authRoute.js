import express from "express";
import {registerController,loginController, testController, forgotPasswordController} from '../controllers/authControllers.js';
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

// router object
const router = express.Router();

// routing
// REGISTER || METHOD POST
router.post('/register', registerController);

// LOGIN || METHOD POST
router.post('/login',loginController);

// FORGOT PASSWORD || METHOD POST
router.post('/forgot-password', forgotPasswordController);

// test routes(token)
router.get('/test',requireSignIn , isAdmin ,testController);

// protected User route(auth) for user-dashboard
router.get('/user-auth', requireSignIn , (req,res)=>{
    res.status(200).send({ ok: true });
})

// protected Admin route(auth) with 2 conditions for admin-dashboard
router.get('/admin-auth', requireSignIn , isAdmin, (req,res)=>{
    res.status(200).send({ ok: true });
})

export default router;