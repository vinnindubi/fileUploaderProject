import {type Request,type Response,type NextFunction} from 'express'
import prisma from "../lib/prisma.js";

export const getDashboard = async(req:Request,res:Response,next:NextFunction)=>{
try{
    const userId = (req.user as any).id;
    const dashboardContents =await prisma.user.findUnique({
        where:{id:userId},
        select:{
            folders:{
                where:{parentId:null}
            },
            files:{
                where:{
                    folderId:null
                }
            }
        }
    });
    res.render('dashboard',{user:req.user,contents:dashboardContents})

}catch(error){
    next(error);
}
}
// open specific folder...

export const getFolder= async(req:Request,res:Response,next:NextFunction)=> {
    try{
        const folderId = req.params.id as string;
        const currentFolder =await prisma.folder.findUnique({
        where:{id:folderId},
        include:{
            children:true,
            files:true,
            parent:true
        }
        });
        if(!currentFolder){
            return res.status(404).send("Folder not Found")
        }
        res.render('folder',{user:req.user,currentFolder})
    }catch(error){
        next(error);
    }
}
export const createFolder = async (req:Request,res:Response,next:NextFunction)=>{
 try{
    const userId = (req.user as any).id;
    const {name,parentId}= req.body;
    await prisma.folder.create({
        data:{
            name:name,
            userId:userId,
            parentId: parentId ? parentId : null
        }
    });
    if (parentId) {
      // Send them back into the folder they were just looking at
      res.redirect(`/folders/${parentId}`);
    } else {
      // Send them back to the main drive view
      res.redirect('/dashboard');
    }

 }catch(error){
    next(error);
 }}

export const deleteFile = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const fileId = (req.params.id as string);
        const userId = (req.user as any).id;
        const file =await prisma.file.findUnique({
            where:{id:fileId}
        });
        if (!file || file.userId != userId){
            return res.status(403).send("unauthorzed access");
        }
        await prisma.file.delete({
            where:{id:fileId}
        })
        res.redirect("/dashboard");
    }
    catch(error){
        next(error);
}}
export const deleteFolder = async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const folderId =(req.params.id as string);
        const userId =(req.user as any).id;
        const folder = await prisma.folder.findUnique({
            where:{id:folderId}
        });
        if(!folder || folder.userId != userId){
            res.status(403).send("unauthorized access");            
        }
        await prisma.folder.delete({
            where:{id:folderId}
        })
        res.redirect("/dashboard");

    }catch(error){
        next(error);
    }
}