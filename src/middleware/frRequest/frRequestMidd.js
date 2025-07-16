const FreqModel = require("../../models/friend")
const UserModel = require("../../models/users")




//!So for reject request i will destroy the request
const firReqMidd=async(req,res,next)=>{

    try{

        const first_id = req.params.first_id
        const second_id = req.params.second_id
    
        if(first_id === '' || second_id === ''){
            throw new Error('User is missing!!')
        }

        // const frReq = await FreqModel.findOne({where:{id:}})
    
        const first = await UserModel.findOne({where:{id:first_id}})
        const second = await UserModel.findOne({where:{id:second_id}})
    
        if(!first || !second){
            throw new Error("User not found!!")
        }

        const checkRequestFri = await FreqModel.findOne({where:{sender_Id: first_id,receiver_Id:second_id }})

        if(checkRequestFri){
            throw new Error('Friend Request has been already sent!!')
        }

        //!Injected values
        req.first_User = {first, first_id}
        req.second_User = {second, second_id}

        next()

    }catch(e){
        next(e)
    }
}


module.exports = firReqMidd

    