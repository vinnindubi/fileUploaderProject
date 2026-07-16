import multer from "multer";
import {v2 as cloudinary} from "cloudinary";
import {cloudinaryStorage} from "multer-storage-cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string ,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret:process.env.CLOUDINARY_API_SECRET as string,
});

const storage = new cloudinaryStorage({
    cloudinary:cloudinary,
    params:{
            folder:"my_drive_uploads",
            resource_type:"auto"
            } as any,
});
const fileFilter =(req:any,file:any,cb:any)=>{
    const allowedTypes = ["image/jpeg","image/png","image.gif","application/pdf"];
    if(allowedTypes.includes(file.mimetypes)){
        cb(null,true);
    }else{
        cb(new Error("Invalid file type.Only JPG, PNG, GIF, and PDF are allowed."),false);
    }
};
 export const upload = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{fileSize: 5*1024*1024} // 5MB file size
 });
// //local storage .......
// const storage = multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null,"uploads/");;
//     },
//     filename: (req,file,cb)=>{
//         const uniqueName = Date.now() + "-"+file.originalname;
//         cb(null,uniqueName);
//     }
// });
//export const upload =multer({storage})
