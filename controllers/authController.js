const path = require('path');
const connection = require('../database');
const authUtils = require('../utils/authUtils');
const JWT = require('jsonwebtoken');


module.exports.registerController = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const fileName = req.file.filename;
        const fileUrl = path.join(fileName);
        if (!name) {
            res.send({ message: 'name is required' });
        }
        if (!email) {
            res.send({ message: 'email is required' });
        }
        if (!password) {
            res.send({ message: 'password is required' });
        }
        if (!phone) {
            res.send({ message: 'phone no. is required' });
        }
        if (!fileUrl) {
            res.send({ message: 'photo is required' });
        }

        const sql = 'select * from user where email=?';
        connection.query(sql, [email], async (err, data) => {
            if (err) {
                return res.status(501).send({
                    success: false,
                    message: 'Error in checking email',
                    err
                });
            }
            if (data.length) {
                return res.status(500).send({
                    success: false,
                    message: 'Already registered, please login'
                });
            }
            const hashedPassword = await authUtils.hashPassword(password);
            const newsql = 'insert into user(name,email,password,phone,role,avatar) values(?,?,?,?,?,?)';
            connection.query(newsql, [
                name,
                email,
                hashedPassword,
                phone,
                'user',
                fileUrl
            ], (newerr, user) => {
                if (newerr) {
                    console.log(newerr)
                    return res.status(501).send({
                        success: false,
                        message: 'Could not create user',
                        newerr
                    });
                }
                return res.status(201).send({
                    success: true,
                    message: 'User created successfully',
                    user
                });
            });
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'error in registration',
            error
        });
    }
};

module.exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password"
            });
        }
        const sql = 'select * from user where email=?';
        connection.query(sql, [email], async (err, data) => {
            if (err) {
                return res.status(404).send({
                    success: false,
                    message: 'Something went wrong'
                });
            }
            if (!data.length) {
                return res.status(200).send({
                    success: false,
                    message: 'Email is not registered'
                });
            }
            const match = await authUtils.comparePassword(password, data[0].password);
            if (!match) {
                return res.status(200).send({
                    success: false,
                    message: 'Invalid Password'
                })
            }
            const token = await JWT.sign({ _id: data[0].uid }, 'fbeuyf4vrybvyt4', { expiresIn: "7d" });
            return res.status(200).send({
                success: true,
                message: 'login successful',
                user: {
                    u_id: data[0].u_id,
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
        return res.status(500).send({
            success: false,
            message: 'Error in login',
            error
        });
    }
};

module.exports.logoutController = async (req, res) => {
    try {
        res.cookie("token", null, {
            expiresIn: new Date(Date.now()),
            httpOnly: true
        });
        return res.status(201).send({
            success: true,
            message: 'Log out Successfully'
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

module.exports.userInfoController = (req, res) => {
    try {
        const { u_id } = req.params;
        const sql = 'select name,phone,avatar from user where u_id=?';
        connection.query(sql, u_id, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(501).send({
                    success: false,
                    message: err
                });
            }
            else {
                const newSql = 'select review,reviewcnt from review where s_id=?';
                connection.query(newSql, u_id, (newErr, newData) => {
                    if (newErr) {
                        console.log(newErr);
                        return res.status(502).send({
                            success: false,
                            message: newErr
                        });
                    }
                    else {
                        return res.status(200).send({
                            success: true,
                            message: 'User found',
                            data,
                            review: (newData.length ? newData[0].review : 0),
                            reviewcnt: (newData.length ? newData[0].reviewcnt : 1)
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: error
        });
    }
}