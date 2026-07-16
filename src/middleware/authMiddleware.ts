
import{type Request,type Response,type NextFunction} from 'express';
export const isAuth = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect("/login");
    }catch(error){
        console.log(error);
    }

}