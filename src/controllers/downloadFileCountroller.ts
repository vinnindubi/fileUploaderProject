import {type Request,type Response,type NextFunction} from 'express'
import prisma from "../lib/prisma.js";

export const downloadFile =async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const fileId = req.params.id as string;
        const userId = (req.user as any).id;
        const file = await prisma.file.findUnique({
            where:{id:fileId}
        })
        if(!file)return res.status(400).send("file not found in database");

        if(file.userId!== userId){
            return res.status(403).send("Unauthorized access.");
        }
        // //-----local storage ----
        // res.download(file.path,file.name,(error)=>{
        //     if(error){
        //         next(error);
        //     }
        // });
        // //----local storage ends here -----
        const downloadUrl = file.path.replace("/upload/","/upload/fl_attachment");
        res.redirect(downloadUrl);
    }catch(error){        
        next(error)
    }
}