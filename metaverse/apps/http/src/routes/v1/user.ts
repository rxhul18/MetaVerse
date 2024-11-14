import { Router } from "express";
import { UpdateMetadataSchema } from "../../types";
import client from "@repo/db/client"
import { userMiddleware } from "../../middleware/user";

export const userRouter  = Router();

userRouter.get("/metadata",userMiddleware,async(req,res)=>{
    const parseData = UpdateMetadataSchema.safeParse(req.body)
    if(!parseData.success){
        res.status(400).json({message:"Validation failed,Invalid Data"})
        return
    }
    await client.user.update({
        where:{
             id: req.userId
        },
        data: {
            avtarId: parseData.data.avatarId
        }
    })
    res.json({message:"Metadata  Updated"})
})
 
userRouter.get("/metadata/bulk",(req,res)=>{
    const userIdString = (req.query.ids ?? "[]") as string;
    const userIds = (userIdString).slice(1,userIdString?.length - 2).split(",");
    const metadata = client.user.findMany({
        where:{
            id: {
                in: userIds
            }
        }, select:{
            avatar: true
        }
    })

    res.json({
        avatars: metadata.map(m => ({
             userId: m.id,
             avatarId: m.avatar?.imageUrl
        }))
    })
})