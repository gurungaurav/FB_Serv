const { Sequelize } = require("sequelize");
const successHandler = require("../utils/handler/successHandler");
const UserModel = require("../models/users");

const searchFilter = async (req, res, next) => {
    try{

        const {searchParams} = req.query;

        if(!searchParams){
            throw new Error("Search term is required")
        }
      
        const users = await UserModel.findAll({
            where: {
              user_Name: {
                [Sequelize.Op.like]: `%${searchParams}%`, 
              },
            },
          });

        if(!users || users.length === 0){
            throw new Error("No results found!!")
        }
      
        successHandler(res,'Searched',users)

    }catch(e){
        next(e)
    }
};

module.exports = searchFilter