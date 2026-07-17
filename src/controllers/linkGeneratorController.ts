import crypto from 'crypto';
import {type Request,type Response,type NextFunction} from 'express'
import prisma from '../lib/prisma.js';
import { SHARE_ENV } from 'worker_threads';
export const generateFolderShareLink = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const folderId = req.params.id as string ;
        const {duration}= req.body;
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate()+ parseInt(duration));

        const newSharedId = crypto.randomUUID();
        await prisma.folder.update({
            where:{id:folderId},
            data:{
                sharedId:newSharedId,
                expiresAt:expirationDate
            }
        })
        res.json({sharedId:newSharedId})
    }
    catch(error){
        res.status(500).json({ error: "Could not generate link" });
    }
}
export const viewSharedFolder= async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const sharedId = req.params.sharedId as string;
        const folder =await prisma.folder.findFirst({
            where:{sharedId:sharedId},
            include:{
                files:true,
                children:true
                    }
        });
        if(!folder){
            return res.status(404).send("This shared folder does not exist!");
        }
        if(folder.expiresAt && new Date() > folder.expiresAt){
            return res.status(403).send("This share link has expired");
        }
        res.render("public-folder",{folder});
    }catch(error){

    }
}