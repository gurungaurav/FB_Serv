const { Server } = require("socket.io");
const MessageModel = require("../../models/messages");
const successHandler = require("../../utils/handler/successHandler");
const moment =require('moment')


//!So for chat i have used socket then after sending the message i have stored in a database as the sender and receiver
//!And then for creating the time stamp manually the moment library is installed and then format is used and then sent 
//!The response from the socket and the get all Messages from the database is same so i dont have to update the state different times 
const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5000",
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    // socket.on("retrive_Message",async(message)=>{
    //   console.log(message);
    //   // Retrieve messages from the database
    //   const getMessages = await MessageModel.findAll({
    //     where: {
    //       sender_id: message.sender,
    //       receiver_id: message.receiver,
    //     },
    //   });
    //   const messagea =getMessages.map((message)=>({
    //     sender:{
    //       message:message.message,
    //       user: message.sender_id,
    //     },
    //     receiver:{
    //       user:  message.receiver_id,
    //     }
    //   }))
    //   console.log("Retrieved messages:", messagea);

    //   io.emit('receive_Message',messagea)
    // })

    socket.on("send_Message", async (message) => {
      try {
        console.log(message);
        const timestamp = moment().format(); // Get the current timestamp

        // Emit the new message to all clients
        io.emit("receive_Message", {
          sender: {
            message: message.sender.message,
            user: message.sender.user,
          },
          receiver: {
            user: message.receiver.user,
          },
          timeStamp: {
            createdAt: timestamp,
          },
        });
        // Create a new message in the database
        const createdMessage = await MessageModel.create({
          message: message.sender.message,
          sender_id: message.sender.user,
          receiver_id: message.receiver.user,
        });

        if (!createdMessage) {
          console.log("No message sent!!");
        }
      } catch (error) {
        console.error("Error:", error);
        // Handle and emit error to the client, if necessary
        socket.emit("error", { message: "An error occurred" });
      }
    });
  });
};

const getAllMessages = async (req, res, next) => {
  try {
    const first_id = req.params.first_id;
    const second_id = req.params.second_id;

    const getMessages = await MessageModel.findAll({
      where: {
        sender_id: first_id,
        receiver_id: second_id,
      },
    });

    const newMessages = await MessageModel.findAll({
      where: {
        sender_id: second_id,
        receiver_id: first_id,
      },
    });

    const allMessag = [...getMessages, ...newMessages];

    // if(!getMessages){
    //   const getMessages = await MessageModel.findAll({
    //     where: {
    //       sender_id:second_id ,
    //       receiver_id: first_id,
    //     },
    //   });

    //   const messagea =getMessages.map((message)=>({
    //     sender:{
    //       message:message.message,
    //       user: message.sender_id,
    //     },
    //     receiver:{
    //       user:  message.receiver_id,
    //     }
    //   }))
    //   // console.log("Retrieved messages:", messagea);
    //   successHandler(res,'All Messages',messagea)

    // }

    const messagea = allMessag.map((message) => ({
      sender: {
        message: message.message,
        user: message.sender_id,
      },
      receiver: {
        user: message.receiver_id,
      },
      timeStamp: {
        createdAt: message.createdAt,
      },
    }));
    successHandler(res, "All Messages", messagea);
  } catch (e) {
    next(e);
  }
};

module.exports = { setupSocket, getAllMessages };
