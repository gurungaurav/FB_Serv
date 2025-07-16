const { where } = require("sequelize");
const PostModel = require("../models/post");
const UserModel = require("../models/users");
const successHandler = require("../utils/handler/successHandler");
const CommentModel = require("../models/comment");

const postUser = async (req, res, next) => {
  try {
    const { post } = req.body;

    const id = req.params.id;
    const user = await UserModel.findOne({ where: { id: id } });
    const userImage = user.image;

    if (req.file) {
      const image = req.file.path;
      const userPost = await PostModel.create({
        text: post,
        user_id: id,
        userImage: userImage,
        postImage: image,
      });

      if (!userPost) {
        throw new Error("Something went wrong");
      }
      successHandler(res, "Posted, Refresh to see the changes!!", userPost);
    } else {
      let image = null;
      const userPost = await PostModel.create({
        text: post,
        user_id: id,
        userImage: userImage,
        postImage: image,
      });

      if (!userPost) {
        throw new Error("Something went wrong");
      }

      successHandler(res, "Posted, Refresh to see the changes!!", userPost);
    }
  } catch (e) {
    next(e);
  }
};

const getPost = async (req, res, next) => {
  try {
    const post = await PostModel.findAll({
      include: { model: UserModel, foreignKey: "user_id" },
    });

    //!Left Outer Join
    const postsWithUserDetails = post.map((post) => ({
      id: post.id,
      text: post.text,
      userImage: post.userImage,
      postImage: post.postImage,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      // Access user details from the 'user' property
      user: {
        id: post.user.id,
        username: post.user.user_Name, // Replace with actual user properties
        // Add other user properties you want to include
      },
    }));

    successHandler(res, "user post", postsWithUserDetails);
  } catch (e) {
    next(e);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post_id = req.params.post_id;

    if (!post_id) {
      throw new Error("Post not found");
    }

    const post = await PostModel.findOne({ where: { id: post_id } });

    if (!post) {
      throw new Error("Please try again");
    }

    const postComments = await CommentModel.destroy({
      where: { post_id: post_id },
      include: { model: PostModel, foreignKey: "post_id" },
    });

    const deletedComments = await PostModel.destroy({ where: { id: post_id } });

    // if(!deletedComments){
    //   throw new Error('Comment not deleted')
    // }

    successHandler(res, "Comment deleted!");
  } catch (e) {
    next(e);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = req.params.id;

    if(!user){
      throw new Error('No id received')
    }

    const existUser = await UserModel.findOne({ where: { id: user } });

    const userPosts = await PostModel.findAll({where:{user_id: existUser.id}})

    if (!existUser) {
      throw new Error("User dosen't exists");
    }

    const userData={
      existUser,
      userPosts
    }

    successHandler(res, "User details", userData);
  } catch (e) {
    next(e);
  }
};

module.exports = { postUser, getPost, deletePost, getUser };
