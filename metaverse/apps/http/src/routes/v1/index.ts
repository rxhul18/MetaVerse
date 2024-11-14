import { Router } from "express";
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";
import { SigninSchema, SignupSchema } from "../../types";
import { hash, compare } from "../../scrypt";
import client from "@repo/db/client"
import jwt  from "jsonwebtoken";
import { JWT_PASSWORD } from "../../config";

export const router = Router();

router.post('/signup',async(req,res)=>{
    const parseData = SignupSchema.safeParse(req.body)
    if(!parseData.success){
        res.status(400).json({message:"Validation failed,Invalid Data"})
        return
    }

    const hashedPassword = await hash(parseData.data.password) 

    try {
        const user = await client.user.create({
            data:{
                username:parseData.data.username,
                password: hashedPassword,
                role:parseData.data.type === "admin" ? "Admin" : "user"
            }
        })
        res.json({
            userId: user.id
        })
    } catch (e) {
        console.log(e,"sdafsd");
        res.status(400).json() 
    }   
})

router.get('/signin',async(req,res)=>{
    const parseData = SigninSchema.safeParse(req.body)
    if(!parseData.success){
        res.status(403 ).json({message:"Validation failed,Invalid Data"})
        return
    }

    try{
         const user = await client.user.findUnique({
            where:{
                username:parseData.data.username
            }
         })
         if(!user){
             res.status(403).json({message:"User not found"})
             return
         }
         const isVaild = await compare(parseData.data.password,user.password)
         if(!isVaild){
             res.status(403).json({message:"Invalid Password"})
             return
         }

         const token = jwt.sign({
                userId:user.id,
                role:user.role
         },JWT_PASSWORD)

         res.json({
            token
         })
    } catch(e){
        res.status(400).json({message:"Server error"})  
    }

    // res.json({
    //     message:"Signin"
    // }) 
})

router.get('/elements',(req,res)=>{

})


router.get('/avatars',(req,res)=>{

})

router.use("/user",userRouter)
router.use("/space",spaceRouter)
router.use("/admin",adminRouter)