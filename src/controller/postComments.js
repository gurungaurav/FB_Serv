const CommentModel = require("../models/comment");
const PostModel = require("../models/post");
const UserModel = require("../models/users");
const successHandler = require("../utils/handler/successHandler");

const postComments = async (req, res, next) => {
  const { comment } = req.body;
  const user_id = req.params.user_id;
  const post_id = req.params.post_id;

  // const user_id = req.params.user_id
  // const post_id = req.params.post_id

  // if(!user_id || !post_id){
  //     throw new Error("Need id's")
  // }
  if (req.file) {
    const image = req.file.path;
    const postComment = await CommentModel.create({
      comment: comment,
      commentPic: image,
      user_id: user_id,
      post_id: post_id,

    });

    successHandler(res, "Comment posted, Refresh to see changes", postComment);
  } else {
    const image = null;
    const postComment = await CommentModel.create({
      comment: comment,
      commentPic: image,
      user_id: user_id,
      post_id: post_id,
    });

    successHandler(res, "Comment posted, Refresh to see changes", postComment);
  }
};

const getComments = async (req, res, next) => {
  try {
    const post_id = req.params.post_id;
    console.log('sds',post_id);

    // const post = await CommentModel.findAll({ where: { post_id: post_id } });
    const user = await CommentModel.findAll({where:{post_id: post_id}, include:{model:UserModel, foreignKey:'user_id'}})

    //!Left join 
    const comments = user.map((user)=>(
      {
        comment : user.comment,
        createdAt: user.createdAt,
        commentPic: user.commentPic,
        id:user.id,
        post_id: user.post_id,
        User:{
          user_id:user.id,
          name: user.user.user_Name,
          user_pic : user.user.image
        }
      }
    ))


    // if (!post) {
    //   throw new Error("Post not found");
    // }

    successHandler(res, "User's post comments", comments);
  } catch (e) {
    next(e);
  }
};


const deleteComments=async(req,res,next)=>{
  
  const comment_id = req.params.commentId

  
}

module.exports = { postComments, getComments };
