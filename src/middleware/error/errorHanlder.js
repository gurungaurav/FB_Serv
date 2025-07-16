

const errorHandler=(err,req,res,next)=>{
    return res.send({
         success:false,
         message:err?.message || 'Something went wrong'
     })
 }
 
 module.exports = errorHandler