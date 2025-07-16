const bcrypt = require('bcrypt');
const UserModel = require('../../models/users');


const userValid = async (req, res, next) => {
  try {

    console.log(req.body);
    const { user_Name, age, email, password } = req.body;
   

    // const query = "SELECT email FROM users WHERE email = ?";
    // mySQL.query(query,[email], (err,ress)=>{
    //     console.log(ress);
    // })
    // mySQL.query(query, [email], (error, results) => {
    //   if (error) {
    //     console.error('Error executing query:', error);
    //     return next(error);
    //   }

    //   if (results.length > 0) {
    //     throw new Error('User with this email already exists')
    //   } else {
    //     console.log('Email is unique');
    //   }
    // });
    if (!user_Name || !age || !email || !password) {
      throw new Error("Fill up all the forms!!");
    }
    const user = await UserModel.findOne({ where: { email: email } });

    if (user) {
      throw new Error("User already exists");
    }


    req.user = { user_Name, age, email, password };

    next();
  } catch (e) {
    next(e);
  }
};


//!Login Validation
const userLoginValid = async (req, res,next) => {
  try {

    console.log(req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      throw new Error("Fill up all the forms");
    }
    const user = await UserModel.findOne({ where: { email: email } });

    if (!user) {
      throw new Error("User is not registered yet");
    }

    const checkPass = await bcrypt.compare(password,user.password)
    
    if(!checkPass){
      throw new Error('Password didnt matched')
    }

    //!Injected variables 
    req.user = { email, password };
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = { userValid,userLoginValid };
