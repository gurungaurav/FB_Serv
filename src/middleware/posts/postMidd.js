const LikeModel = require("../../models/likes")
const PostModel = require("../../models/post")
const UserModel = require("../../models/users")
const successHandler = require("../../utils/handler/successHandler")


const postLikesMidd=async(req,res,next)=>{
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

      if(existingLike){
        throw new Error("User already liked the post")
      }
      // if (post.user_id === user_id) {
      //   throw new Error('User already liked the post!')
      // }
      
      req.post = {user_id, post_id,post}
      
      // successHandler(res,'Heheh', post)
  
      // if(post.like){
  
      // }
      next()
  
  
  
    }catch(e){
      next(e)
    }
    
  
  }

  module.exports = {postLikesMidd}