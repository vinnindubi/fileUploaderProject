import express from 'express';
import path from 'path';
import passport from 'passport';
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import "./config/passport.js";
import authRoutes from './routes/authRoutes.js';
import {fileURLToPath} from "url";
const app = express()
app.set("views","./src/views");
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('public'));
const __firname =fileURLToPath(import.meta.url);
const __dirname= path.dirname(__firname);
app.set("views", path.join(__dirname, "./views"));

import prisma from "./lib/prisma.js";
import "express-session";
// Tell TypeScript that Passport will occasionally add a 'messages' array to the session
declare module "express-session" {
  interface SessionData {
    messages?: string[];
  }
}
app.use(
    session({
        store: new PrismaSessionStore(prisma,{
            checkPeriod:2*60*1000,
            dbRecordIdIsSessionId:true,
            // dbRecordIdFunction:undefined  // cannot be undefined as per typescript
        }),
        secret:process.env.SESSION_SECRET!,
        resave:true,
        saveUninitialized:true,
        cookie:{
            maxAge: 7* 24 *60* 60*1000, //one week
        }
    })
)
app.use(passport.session());

app.use('/',authRoutes);
app.get('/',(req,res)=>{
    res.render('index',{user:req.user});
})
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("server is listening at port 3000")
})