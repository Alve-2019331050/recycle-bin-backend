const connection = require('../database');

module.exports.addReviewController = (req,res)=>{
    const {u_id,count} = req.body;
    const sql = 'select review,reviewcnt from review where s_id=?';
    connection.query(sql,u_id,(err,data)=>{
        if(err){
            console.log(err);
            res.status(500).send({
                success:false,
                message:'Database Problem'
            });
        }
        else if(!data.length){
            const newSql = 'insert into review(s_id,review,reviewcnt) values(?,?,?)';
            connection.query(newSql,[u_id,count,1],(newErr,newData)=>{
                if(newErr){
                    console.log(newErr);
                    res.status(501).send({
                        success:false,
                        message:'Database Problem'
                    });
                }
                else{
                    res.status(200).send({
                        success:true,
                        message:'Rating Provided'
                    });
                }
            });
        }
        else{
            const newSql = 'update review set review=?,reviewcnt=? where s_id=?';
            connection.query(newSql,[data[0].review+count,data[0].reviewcnt+1,u_id],(newErr,newData)=>{
                if(newErr){
                    console.log(newErr);
                    res.status(502).send({
                        success:false,
                        message:'Database Problem'
                    });
                }
                else{
                    res.status(200).send({
                        success:true,
                        message:'Rating Provided'
                    });
                }
            });
        }
    });
};