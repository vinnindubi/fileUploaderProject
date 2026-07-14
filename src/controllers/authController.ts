import{type Request,type Response,type NextFunction, response} from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from "@prisma/client";
import prisma from "../lib/prisma.js";
// const prisma =new PrismaClient();

export const register= async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const {username,password} = req.body;
        if(!username || !password){
           return res.status(400).send("Username and password are required!!")
        }
        const existingUsername =await prisma.user.findUnique({
            where:{username:username}
        });
        if(existingUsername){
            return res.status(400).send("username taken!!");
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser =await prisma.user.create({
            data:{
                username:username,
                password:hashedPassword
            }
        })
        //automatically login the user immediately after they register
        req.login(newUser,(error)=>{
            if(error)return next(error);
            return res.redirect("/")
        });
    }catch(error){
        next(error);
    }
}
export const logoutUser =async (req:Request,res:Response,next:NextFunction)=>{
req.logout((error)=>{
    if(error)return next(error);
    //destory the session in the database as well.
    req.session.destroy(()=>{
        res.redirect("/login");
    })
})

}