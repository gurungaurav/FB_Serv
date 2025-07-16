const jwt = require('jsonwebtoken')
require('dotenv').config()


const jwtVerify=(token)=>{
    const jwtKey = process.env.SECRET_KEY_JWT
    const res = jwt.decode(token, jwtKey)
    return res
}

module.exports = jwtVerify