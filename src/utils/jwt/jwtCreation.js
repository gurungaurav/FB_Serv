const jwt = require('jsonwebtoken')
require('dotenv').config()

const jwtCreate=(email,image,role)=>{
    const jwtKey = process.env.SECRET_KEY_JWT
    const res = jwt.sign({email:email, image:image, role:role},jwtKey,{expiresIn:'2hr'})
    return res
}

module.exports = jwtCreate