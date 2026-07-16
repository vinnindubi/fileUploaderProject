import {type Request,type Response,type NextFunction} from 'express'
import prisma from "../lib/prisma.js";
export const uploadFile=async (req:Request, res :Response, next :NextFunction)=>{
try{
    const file = req.file;
    if(!file){
        return res.status(400).send("No file uploaded");
    }
    const userId =(req.user as any).id
    const {folderId}= req.body;
    await prisma.file.create({
        data:{
            name:file.originalname,
            path:file.path,
            size:file.size.toString(),
            userId: userId,
            folderId: folderId? folderId :null
        }
    });
    if(folderId){
        res.redirect(`/folders/${folderId}`);
    }else{
        res.redirect('/dashboard');
    }
}
catch(error){
    next(error);
}
}