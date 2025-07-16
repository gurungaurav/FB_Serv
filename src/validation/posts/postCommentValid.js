const PostModel = require("../../models/post");
const successHandler = require("../../utils/handler/successHandler");

const postCommentValid = (req, res, next) => {
  try {
    const { comment } = req.body;

    const user_id = req.params.user_id;
    const post_id = req.params.post_id;

    if (!user_id || !post_id) {
      throw new Error("Need id's");
    }

    if (user_id === "" || post_id === "") {
      throw new Error("Fill up all the");
    }

    req.post = { comment, user_id, post_id };
    next();
  } catch (e) {
    next(e);
  }
};



module.exports = { postCommentValid};
