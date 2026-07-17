import { Router } from "express";
import passport from "passport";
import {logoutUser, register} from '../controllers/authController.js';
import { isAuth } from "../middleware/authMiddleware.js";
import { createFolder, deleteFile, deleteFolder, getDashboard, getFolder } from "../controllers/createFoldersController.js";
import { uploadFile } from "../controllers/uploadController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { downloadFile } from "../controllers/downloadFileCountroller.js";
const router =Router();
router.get("/register",(req,res)=>{
    res.render("register");
})
router.get("/login",(req,res)=>{
    const messages = req.session.messages ||[];
    res.render("login",{errorMessage:messages.length > 0? messages[0]: null})
})

// ------ POST ROUTES ------
router.post("/register",register);

router.post("/login", (req, res, next) => {
  // We remove the { successRedirect, failureRedirect } object 
  // and replace it with a function that handles the result manually.
  passport.authenticate("local", (err: any, user: any, info: any) => {
    
    // 1. Database crash or server error
    if (err) return next(err);
    
    // 2. Login failed (Wrong password or username)
    if (!user) {
      // Send raw JSON data back to the browser immediately
      return res.status(401).json({ error: info.message }); 
    }

    // 3. Login success
    req.logIn(user, (err) => {
      if (err) return next(err);
      
      // Tell the browser front-end it worked and where to go
      return res.status(200).json({ success: true, redirectUrl: "/" });
    });

  })
  (req, res, next); // <--- Do not forget this part! It executes the middleware.
});
router.get('/dashboard',isAuth,getDashboard);
router.get('/folders/:id',isAuth,getFolder);
router.post('/folders',isAuth,createFolder);
router.post("/logout",logoutUser);

router.post('/files',isAuth,upload.single("file"),uploadFile);
// router.get("/files/:id/download",isAuth,downloadFile);// Local Storage way!

router.get("/files/download/:id",downloadFile);
router.post("/files/:id/delete",isAuth,deleteFile);
router.post("/folders/:id/delete",isAuth,deleteFolder);
export default router;