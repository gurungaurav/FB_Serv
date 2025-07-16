const express = require("express");
const { addUser, userLogin } = require("../controller/userController");
const { authCheck, checkAuthUser } = require("../middleware/user/userMidd");
const jwtVerific = require("../middleware/jwt/jwtVerification");
const {
  postUser,
  getPost,
  deletePost,
  getUser,
} = require("../controller/userPosts");
const multer = require("multer");
const { postComments, getComments } = require("../controller/postComments");
const {
  userValid,
  userLoginValid,
} = require("../validation/user/userValidation");
const { postCommentValid } = require("../validation/posts/postCommentValid");
const { postLikesMidd } = require("../middleware/posts/postMidd");
const { postLike, getLikesPost } = require("../controller/postLike");
const firReqMidd = require("../middleware/frRequest/frRequestMidd");
const {
  sendFriendRequest,
  acceptReuquest,
  rejectRequest,
  checkStatusReq,
  getSenderRequests,
  getReceiverRequests,
  unfriend,
  listFriends,
  getFriends,
  checkFriendReqStatus,
} = require("../controller/friendRequest");
const searchFilter = require("../controller/searchFilter");
const { getAllMessages } = require("../controller/socket.io/messenger");



const upload = multer({ dest: "uploads/user" });
const uploadPost = multer({ dest: "uploads/post" });
const uploadComment = multer({ dest: "uploads/comment" });


const router = express.Router();

// router.get("/users", userValid, (req,res) => {
//   const {user_Name} = req.user
//   console.log(user_Name);
// });

router.post("/userLogin", userLoginValid, userLogin);

router.get("/userAuthen", jwtVerific, authCheck);

router.post("/addUsers", upload.single("image"), userValid, addUser);

//!User post admin cant post so i havent called the admin check middleware here
router.post(
  "/addPost/:id",
  uploadPost.single("image"),
  jwtVerific,
  checkAuthUser,
  postUser
);

router.get("/getPost", getPost);

router.post(
  "/addComment/:user_id/:post_id",
  uploadComment.single("image"),
  jwtVerific,
  checkAuthUser,
  postCommentValid,
  postComments
);

router.get("/getComments/:post_id", getComments);

router.delete("/deletePost/:post_id", jwtVerific, checkAuthUser, deletePost);

//!Post Likes
router.post("/likePost/:user_id/:post_id", jwtVerific, checkAuthUser, postLike);

router.get("/getLikedPosts",getLikesPost)

router.get("/getUser/:id", getUser);

//!Main routes for adding user
router.post(
  "/addFriend/:first_id/:second_id",
  jwtVerific,
  checkAuthUser,
  firReqMidd,
  sendFriendRequest
);

//!For accepting the reqest
router.patch(
  "/acceptRequest/:sender_id/:receiver_id",
  jwtVerific,
  checkAuthUser,
  acceptReuquest
);

//!For rejecting request
router.delete(
  "/rejectRequest/:sender_id/:receiver_id",
  jwtVerific,
  checkAuthUser,
  rejectRequest
);

//!Checking status
router.get("/checkStatus/:user_id", listFriends);

//!Two routes are created so that the sender and receiver will be spearated
//!Friend requests
router.get("/getSenderRequests/:user_id", getSenderRequests);

router.get("/getReceiversReuqests/:user_id", getReceiverRequests);

//!For unfriend
router.delete(
  "/unFriend/:sender_id/:receiver_id",
  jwtVerific,
  checkAuthUser,
  unfriend
);

router.get('/checkFreqStatus/:first_id/:second_id', checkFriendReqStatus)

//!Suggested Friends
router.get('/getSuggestions',

getFriends
)

router.get('/searchFilter', searchFilter)


router.get('/getAllMessages/:first_id/:second_id', getAllMessages)


module.exports = router;
