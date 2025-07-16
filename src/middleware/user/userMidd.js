const UserModel = require("../../models/users");
const successHandler = require("../../utils/handler/successHandler");
const jwtCreate = require("../../utils/jwt/jwtCreation");

// const userLoginCheck=async(req,res,next)=>{

//     const{email,password} = req.user
//     // console.log('hehe',email);

//     const user = await UserModel.findOne({where:{email:email}})

//     const jwtToken =  jwtCreate(user.user_Name)
//     // console.log(jwtToken);
//     successHandler(res,'Token generated', {jwt:jwtToken})

// }

//!Auth check for login only
const authCheck = async (req, res, next) => {
  try {
    const { email,jwt } = req.user;

    const user = await UserModel.findOne({ where: { email: email } });

    if (!user) {
      throw new Error("User is not registered");
    }

    if (user.role === "user") {
      successHandler(res, " User is authenticated", {
        name: user.user_Name,
        role: user.role,
        image: user.image,
        id:user.id,
        jwt: jwt
      });
    } else if (user.role === "admin") {
      successHandler(res, "Admin is authenticated", {
        name: user.user_Name,
        role: user.role,
        image: user.image,
        id:user.id,
        jwt:jwt

      });
    }
  } catch (e) {
    next(e);
  }
};


//!Auth for like only user to upload the post
//!Can use the injected value or can get the req directly by body
const checkAuthUser = (req, res, next) => {
  try {
    
    //!Can only receive role first to check is user role is valid or not
    const { role } = req.user;
    
    if (role === "user") {
    //   req.add = { title, text,id};
      next();
    } else {
      throw new Error("Unauthorized role");
    }
  } catch (e) {
    next(e);
  }
};

//!This is so to give the permission according to their roles 
//!So lets say admin can use to upload photos of the website so this middleware will be called so that it will
//!Check if the role is admin or not so that he/she can add the images
const checkAuthAdmin = (req, res, next) => {
    try { 
      //!Can only receive role first to check is user role is valid or not
      const { role } = req.user;
      
      if (role === "admin") {
      //   req.add = { title, text,id};
        next();
      } else {
        throw new Error("Unauthorized role");
      }
    } catch (e) {
      next(e);
    }
  };


module.exports = { authCheck, checkAuthAdmin, checkAuthUser};
