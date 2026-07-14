import passport from "passport";
import {Strategy as LocalStrategy} from 'passport-local';
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import prisma from "../lib/prisma.js";
// const prisma = new PrismaClient();

passport.use(
    new LocalStrategy(
        async(username, password,done)=>{
            try{
                const user =await prisma.user.findUnique({
                    where: {username:username} });
                    if(!user){
                        return done(null,false,{message:"Incorrect Username"});                        
                    }
                 const match =await bcrypt.compare(password,user.password);
                 if (!match){
                    return done(null, false,{message:"incorrect password"});
                 } 
                 return done(null,user);

            }catch(error){
                done(error);
            }
        }
    )
)
passport.serializeUser((user:any,done)=>{
    done(null,user.id);
});
passport.deserializeUser(async(id:string,done)=>{
    try{
        const user =await prisma.user.findUnique({
            where:{id:id}
        });
        //attach the user object to req.user
        done(null,user);
    }catch(error){
        done(error);
    }
});