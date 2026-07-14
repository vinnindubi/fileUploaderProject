import { Router } from "express";
import passport from "passport";
import {logoutUser, register} from '../controllers/authController.js';

const router =Router();
router.get("/register",(req,res)=>{
    res.render("register");
})
router.get("/login",(req,res)=>{
    res.render("login")
})

// ------ POST ROUTES ------
router.post("/register",register);

router.post("/login",passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login",

}));
router.post("/logout",logoutUser);
export default router;