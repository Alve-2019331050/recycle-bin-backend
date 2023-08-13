const path = require('path');
const connection = require('../database');
const authUtils = require('../utils/authUtils');
const JWT = require('jsonwebtoken');


module.exports.registerController = async(req,res)=>{
    try {
        const {name,email,password,phone} = req.body;
        const fileName = req.file.filename;
        const fileUrl = path.join(fileName);
        if(!name){
            res.send({message:'name is required'});
        }
        if(!email){
            res.send({message:'email is required'});
        }
        if(!password){
            res.send({message:'password is required'});
        }
        if(!phone){
            res.send({message:'phone no. is required'});
        }
        if(!fileUrl){
            res.send({message:'photo is required'});
        }

        const sql = 'select * from user where email=?';
        connection.query(sql,[email],async(err,data)=>{
            if(err){
                res.status(501).send({
                    success:false,
                    message:'Error in checking email',
                    err
                });
            }
            if(data.length){
                res.status(500).send({
                    success:false,
                    message:'Already registered, please login'
                });
            }
            const hashedPassword = await authUtils.hashPassword(password);
            const newsql = 'insert into user(name,email,password,phone,role,avatar) values(?,?,?,?,?,?)';
            connection.query(newsql,[
                name,
                email,
                hashedPassword,
                phone,
                'user',
                fileUrl
            ],(newerr,user)=>{
                if(newerr){
                    res.status(501).send({
                        success:false,
                        message:'Could not create user',
                        newerr
                    });
                }
                res.status(201).send({
                    success:true,
                    message:'User created successfully',
                    user
                });
            });
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'error in registration',
            error
        });
    }
};

module.exports.loginController = async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:"Invalid email or password"
            });
        }
        const sql = 'select * from user where email=?';
        connection.query(sql,[email],async(err,data)=>{
            if(err){
                return res.status(404).send({
                    success:false,
                    message:'Email is not registered'
                });
            }
            const match = await authUtils.comparePassword(password,data[0].password);
            if(!match){
                return res.status(200).send({
                    success:false,
                    message:'Invalid Password'
                })
            }
            const token = await JWT.sign({_id:data[0].uid},'fbeuyf4vrybvyt4',{expiresIn:"7d"});
            res.status(200).send({
                success:true,
                message:'login successful',
                user:{
                    name: data[0].name,
                    email: data[0].email,
                    phone: data[0].phone,
                    role: data[0].role,
                    avatar: data[0].avatar
                },
                token
            })
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error in login',
            error
        });
    }
}