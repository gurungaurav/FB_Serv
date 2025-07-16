const errorHandler = require("../middleware/error/errorHanlder");
const UserModel = require("../models/users");
const successHandler = require("../utils/handler/successHandler");
const bcrypt = require("bcrypt");
const jwtCreate = require("../utils/jwt/jwtCreation");

const addUser = async (req, res, next) => {
  try {
    const { user_Name, age, email, password } = req.user;


    if (req.file) {
      const image = req.file.path;

      const hashSalt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, hashSalt);
      console.log(hashedPass);
      const user = await UserModel.create({
        user_Name: user_Name,
        age: age,
        email: email,
        password: hashedPass,
        image: image,
      });

      if (!user) {
        throw new Error("User not made");
      }
  
      successHandler(res, "User created", user);
    }else{
      let image = null;
      const hashSalt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, hashSalt);
      console.log(hashedPass);
      const user = await UserModel.create({
        user_Name: user_Name,
        age: age,
        email: email,
        password: hashedPass,
        image: image,
      });
  
      if (!user) {
        throw new Error("User not made");
      }
  
      successHandler(res, "User created", user);

    }

    // const query = "Insert into users (user_Name, age,email,password) values (?,?,?,?)"

    // const values=[user_Name,age,email,password]

    // mySQL.query(query,values,(err,data)=>{
    //     if(data){
    //         return successHandler(res,'User added', data)
    //     }
    // })
  } catch (e) {
    next(e);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.user;
    // console.log('hehe',email);

    const user = await UserModel.findOne({ where: { email: email } });

    const jwtToken = jwtCreate(user.email, user.image, user.role, user._id);
    if (!jwtToken) {
      throw new Error("Invalid Token");
    }
    successHandler(res, "Token generated", { jwt: jwtToken });
  } catch (e) {
    next(e);
  }
};

module.exports = { addUser, userLogin };
