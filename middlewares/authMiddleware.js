const JWT = require('jsonwebtoken');
const connection = require('../database');
//protected rotes

module.exports.requireSignIn = async(req,res,next) => {
    
    try {
        const decode = JWT.verify(req.headers.authorization,'fbeuyf4vrybvyt4');
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
    }
}

module.exports.isAdmin = async(req,res,next)=>{
    try {
        const sql = 'select role from user where email=?';
        connection.query(sql,[req.user.email],(err,data)=>{
            if(err || data[0].role!='Admin'){
                return res.status(401).send({
                    success:false,
                    message:"Unauthorized Access"
                });
            }
            next();
        })
    } catch (error) {
        console.log('error');
        res.status(401).send({
            success:false,
            error,
            message:'error in admin middleware'
        });
    }
}