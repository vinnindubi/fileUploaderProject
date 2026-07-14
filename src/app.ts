import express from 'express';
import path from 'node:path';
import passport from 'passport';
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client/extension';
import "./config/passport.js";
import authRoutes from './routes/authRoutes.js';
const app = express()
app.set("views","./src/views");
app.set("views","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(express.static('public'));

const prisma = new PrismaClient();
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
    res.send('Server i running');
})
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("server is listening at port 3000")
})