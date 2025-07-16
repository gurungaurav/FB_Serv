const LikeModel = require("../models/likes");
const PostModel = require("../models/post");
const UserModel = require("../models/users");
const successHandler = require("../utils/handler/successHandler");


const postLike=async(req,res,next)=>{
    try{

            const user_id = req.params.user_id
            const post_id = req.params.post_id
        
            const post = await PostModel.findOne({where:{id:post_id}})
      
            const user = await UserModel.findOne({where:{id:user_id}})
        
            if(!post){
              throw new Error("No post found")
            }
      
            if(!user){
              throw new Error('No user found')
            }
      
            const existingLike = await LikeModel.findOne({where:{user_id:user_id, post_id:post_id}})

            const update = {status:"unliked"}
      
            if(existingLike){
                // const updatedPost = await LikeModel.update(update,{where:{id:existingLike.id}})
                const deleteLike = await LikeModel.destroy({where:{id:existingLike.id}})
                if(!deleteLike){
                    throw new Error("Like failed!!!")
                }

                const updatedLikes = await LikeModel.findAll()

                successHandler(res,'Unliked Post', updatedLikes)

            }else{

                const postLike = await LikeModel.create({post_id:post_id, user_id:user_id})
            
                if(!postLike){
                    throw new Error('Failed')
                }

                const updatedLikes = await LikeModel.findAll()
            
                successHandler(res,'Liked Post',updatedLikes)
            }
           
    
    }catch(e){
        next(e)
    }


}


const getLikesPost=async(req,res,next)=>{

    try{
        const likedPosts = await LikeModel.findAll()

        if(!likedPosts){
            throw new Error("No liked Posts!!")
        }

        successHandler(res,'Liked Posts',likedPosts)
    }catch(e){
        next(e)
    }

}

module.exports = {postLike, getLikesPost}