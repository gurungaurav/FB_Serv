const successHandler = require("../../utils/handler/successHandler");
const jwtVerify = require("../../utils/jwt/jwtVerification");

const jwtVerific=(req,res,next)=>{

    try{
        const bearer = req.headers.authorization
        console.log(bearer);
        if(!bearer){
            throw new Error('No token received')
        }
        //!Splitting the type and token as the request comes as type and tokwn at same req
        const[bearerType,bearerToken] = bearer.split(' ');

        if(bearerType === 'bearer'){
            throw new Error('Invalid token use type bearer')
        }
        
         if(!bearerToken){
            throw new Error('Invalid token ')
        }

        // console.log(bearerToken);

        const user = jwtVerify(bearerToken)
        if(!user || !user.email){
            throw new Error('Invalid token')
        }

        const email = user.email
        const role = user.role
        const jwt = bearerToken

        // console.log('horaa',userEmail);

        req.user = {email,role,jwt}
        next();
        // successHandler(res,'HEHEH', bearerToken)

    }catch(e){
        next(e)
    }
}


module.exports = jwtVerific