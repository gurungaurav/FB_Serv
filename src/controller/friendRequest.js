//! Make a middlwware for request check

const FreqModel = require("../models/friend");
const UserModel = require("../models/users");
const successHandler = require("../utils/handler/successHandler");

const sendFriendRequest = async (req, res, next) => {
  try {
    const { first, first_id } = req.first_User;
    const { second, second_id } = req.second_User;

    const friend = await FreqModel.create({
      sender_Id: first_id,
      receiver_Id: second_id,
    });

    if (!friend) {
      throw new Error("Khai k bho friend req ma");
    }

    successHandler(res, "Request Sent", friend);
  } catch (e) {
    next(e);
  }
};

const acceptReuquest = async (req, res, next) => {
  try {
    // const first_id = req.params.first_id;
    // const second_id = req.params.second_id;
    const sender_id = req.params.sender_id;
    const receiver_id = req.params.receiver_id;

    // if(!first_id || !second_id || !freq_id){
    //     throw new Error('')
    // }

    const existReq = await FreqModel.findOne({
      where: { sender_Id: sender_id, receiver_Id: receiver_id },
    });

    if (!existReq) {
      throw new Error("Req dosen't exists!!");
    }

    if (existReq.status === "accepted") {
      throw new Error("Request already accepted!!");
    }

    const updatedData = { status: "accepted" };

    const acceptReq = await FreqModel.update(updatedData, {
      where: { id: existReq.id },
    });

    if (!acceptReq) {
      throw new Error("Errroooo!!");
    }
    const updatedRequest = await FreqModel.findOne({
      where: { id: existReq.id },
    });

    successHandler(res, "FrieRend request Accepted", updatedRequest);
  } catch (e) {
    next(e);
  }
};

const rejectRequest = async (req, res, next) => {
  try {
    const sender_id = req.params.sender_id;
    const receiver_id = req.params.receiver_id;

    const request = await FreqModel.findOne({
      where: { sender_Id: sender_id, receiver_Id: receiver_id },
    });

    if (request.status === "accepted") {
      throw new Error("Reuqest already accepted cant delete it!!");
    }

    if (!request) {
      throw new Error("Request already deleted or not found!!");
    }

    const destroyReq = await FreqModel.destroy({ where: { id: request.id } });

    if (!destroyReq) {
      throw new Error("Not deleted");
    }

    successHandler(res, "Request rejected!!");
  } catch (e) {
    next(e);
  }
};

const listFriends = async (req, res, next) => {
  try {
    const userId = req.params.user_id; // Assuming you have a single 'user_id' parameter

    // Find friends where the user is the sender
    const senderFriends = await FreqModel.findAll({
      where: { sender_Id: userId, status: "accepted" }, // Assuming 'accepted' status means they are friends
    });

    // Find friends where the user is the receiver
    const receiverFriends = await FreqModel.findAll({
      where: { receiver_Id: userId, status: "accepted" },
    });

    // Extract friend IDs from sender and receiver results
    const friendIds = [
      ...senderFriends.map((friend) => friend.receiver_Id),
      ...receiverFriends.map((friend) => friend.sender_Id),
    ];

    if (friendIds.length === 0) {
      throw new Error("No friends found");
    }

    // Find the friend user data
    const friendUsers = await UserModel.findAll({
      where: { id: friendIds },
    });

    // Structure the response with friend user data
    const friendList = friendUsers.map((friendUser) => {
      return {
        id: friendUser.id,
        createdAt: friendUser.createdAt,
        image: friendUser.image,
        user_Name: friendUser.user_Name,
      };
    });
    // console.log(friendList);
    successHandler(res, "Friends list found", friendList);
  } catch (e) {
    next(e);
  }
};

const getSenderRequests = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;

    if (!user_id) {
      throw new Error("No id's!!");
    }

    const sender = await UserModel.findOne({ where: { id: user_id } });

    if (!sender) {
      throw new Error("User not found");
    }

    const req_Friend = await FreqModel.findAll({
      where: { sender_Id: user_id },
    });

    if (!req_Friend || req_Friend.length === 0) {
      throw new Error("No requests!!");
    }

    //!Promises is used cuz of the async operation
    const receiverPromises = req_Friend.map(async (value) => {
      const receiver = await UserModel.findOne({
        where: { id: value.receiver_Id },
      });

      return {
        req_Id: value.id,
        status: value.status,
        createdAt: value.createdAt,
        sender: {
          id: sender.id,
          createdAt: sender.createdAt,
          image: sender.image,
          user_Name: sender.user_Name,
        },
        receiver: {
          id: receiver.id,
          createdAt: receiver.createdAt,
          image: receiver.image,
          user_Name: receiver.user_Name,
        },
      };
    });

    const receivers = await Promise.all(receiverPromises);

    successHandler(res, "Sender's requests", receivers);
  } catch (e) {
    next(e);
  }
};

const getReceiverRequests = async (req, res, next) => {
  try {
    const user_id = req.params.user_id;

    if (!user_id) {
      throw new Error("No id's!!");
    }

    const receiver = await UserModel.findOne({ where: { id: user_id } });

    if (!receiver) {
      throw new Error("User not found");
    }

    const req_Friend = await FreqModel.findAll({
      where: { receiver_Id: user_id },
    });

    if (!req_Friend || req_Friend.length === 0) {
      throw new Error("No requests!!");
    }

    //!Promises is used cuz of the async operation
    const receiverPromises = req_Friend.map(async (value) => {
      const sender = await UserModel.findOne({
        where: { id: value.sender_Id },
      });

      return {
        req_Id: value.id,
        status: value.status,
        createdAt: value.createdAt,
        receiver: {
          id: receiver.id,
          createdAt: receiver.createdAt,
          image: receiver.image,
          user_Name: receiver.user_Name,
        },
        sender: {
          id: sender.id,
          createdAt: sender.createdAt,
          image: sender.image,
          user_Name: sender.user_Name,
        },
      };
    });

    const receivers = await Promise.all(receiverPromises);

    successHandler(res, "Receiver's requests", receivers);
  } catch (e) {
    next(e);
  }
};

// const getFriendRequests2 = async (req, res, next) => {
//   try {
//     const user_id = req.params.user_id;

//     if (!user_id) {
//       throw new Error("No id's!!");
//     }

//     const sender = await UserModel.findOne({ where: { id: user_id } });

//     if (!sender) {
//       throw new Error("User not found");
//     }

//     const req_Friend = await FreqModel.findAll({
//       where: { sender_Id: user_id},
//     });

//     if (!req_Friend || req_Friend.length === 0) {
//       throw new Error("No requests!!");
//     }

//     // Extract the sender IDs and receiver IDs
//     const senderIds = req_Friend.map((value) => value.sender_Id);
//     const receiverIds = req_Friend.map((value) => value.receiver_Id);

//     // Find all senders and receivers
//     const [senders, receivers] = await Promise.all([
//       UserModel.findAll({ where: { id: senderIds } }),
//       UserModel.findAll({ where: { id: receiverIds } }),
//     ]);

//     // Create an array of user details with sender and receiver information
//       const userDetails = req_Friend.map((request) => {
//       const sender = senders.find((user) => user.id === request.sender_Id);
//       const receiver = receivers.find((user) => user.id === request.receiver_Id);

//       return {
//         req_id: request.id,
//         status: request.status,
//         createdAt: request.createdAt,
//         sender,
//         receiver,
//       };

//     });

//     successHandler(res, "User's requests", userDetails);
//   } catch (e) {
//     next(e);
//   }
// };

const unfriend = async (req, res, next) => {
  try {
    const sender_id = req.params.sender_id;
    const receiver_id = req.params.receiver_id;

    console.log("rec", receiver_id, "sedn", sender_id);

    const checkReq = await FreqModel.findOne({
      where: { sender_Id: sender_id, receiver_Id: receiver_id },
    });

    if (!checkReq) {
      const newResult = await FreqModel.findOne({
        where: { sender_Id: receiver_id, receiver_Id: sender_id },
      });

      const result = await FreqModel.destroy({ where: { id: newResult.id } });

      successHandler(res, "Friend Removed");
    }

    const result = await FreqModel.destroy({ where: { id: checkReq.id } });

    if (!result) {
      throw new Error("Can't unfriend it !!");
    }

    successHandler(res, "Friend Removed");
  } catch (e) {
    next(e);
  }
};

const getFriends = async (req, res, next) => {
  try {
    const getAll = await UserModel.findAll();

    const results = getAll.map((friends) => {
      return {
        id: friends.id,
        user_Name: friends.user_Name,
        image: friends.image,
      };
    });

    successHandler(res, "Suggested Friends", results);
  } catch (e) {
    next(e);
  }
};

const checkFriendReqStatus = async (req, res, next) => {
  try {
    const first_id = req.params.first_id;
    const second_id = req.params.second_id;

    const first_User = await UserModel.findOne({ where: { id: first_id } });

    const second_User = await UserModel.findOne({ where: { id: second_id } });

    if (!first_User || !second_User) {
      throw new Error("No user!!!");
    }

    const first = await FreqModel.findOne({ where: { sender_Id: first_id, receiver_Id:second_id } });
    // const second = await FreqModel.findOne({where:{sender_Id:second_id, receiver_Id: first_id}});

    // const all = [...first, ...second]

    // const 
    if(!first){
      const second = await FreqModel.findOne({where:{sender_Id:second_id, receiver_Id: first_id}});

      if(!second){
        throw new Error("No req found!!")
      }

      successHandler(res,"Status:", second)

      // const results = 
    }

    successHandler(res,"Status:", first)
  } catch (e) {
    next(e);
  }
};

module.exports = {
  sendFriendRequest,
  acceptReuquest,
  rejectRequest,
  listFriends,
  getSenderRequests,
  getReceiverRequests,
  unfriend,
  getFriends,
  checkFriendReqStatus
};
