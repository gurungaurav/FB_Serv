const express = require("express");
const router = require("./src/routes/mainRoutes");
const http = require("http");
const cors = require("cors");
const errorHandler = require("./src/middleware/error/errorHanlder");
const UserModel = require("./src/models/users");
const PostModel = require("./src/models/post");
const CommentModel = require("./src/models/comment");
const sequelize = require("./src/config/dbConfig");
const LikeModel = require("./src/models/likes");
const FreqModel = require("./src/models/friend");
const { setupSocket } = require("./src/controller/socket.io/messenger");
const MessageModel = require("./src/models/messages");

require("dotenv").config();

const app = express();
const server = http.createServer(app);

setupSocket(server);

const cross_Port = process.env.Cross_Ports;
const main_Port = process.env.Main_Port;

//!Middleware to allow the json request only
app.use(express.json());

//!Middleware to set the cross origin ports that can only access to this api
app.use(cors(cross_Port));

//!This middleware is used to handle the incoming request from the front so that it will allow the images to display at the front
app.use("/uploads/post", express.static("uploads/post"));
app.use("/uploads/user", express.static("uploads/user"));
app.use("/uploads/comment", express.static("uploads/comment"));

app.use("/api/User", router);

app.use(errorHandler);

//!When we start the api it makes sure that every single tables on the model folder is created or not if not then it will create automatically
sequelize.sync().then(() => {
  server.listen(main_Port, () => {
    console.log(`Connected to port ${main_Port}`);
  });
});
