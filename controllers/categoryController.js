const connection = require('../database');

module.exports = createCategoryController = (req,res) => {
    try {
        const {name,slug} = req.body;
        if(!name){
            return res.status(401).send({message:'name is required'});
        }
        const sql = 'select * from category where name=?';
        connection.query(sql,name,(err,data)=>{
            if(err){
                return res.status(401).send({message:'error in database',err});
            }
            else if(data.length){
                return res.status(200).send({
                    success:true,
                    message:'Category already exists'
                })
            }
            else{
                const newSql = 'insert into category (name,slug) values(?,?)';
                connection.query(newSql,[name,slug],(newerr,newdata)=>{
                    if(newerr){
                        return res.status(401).send({message:'error in database',newerr});
                    }
                    else{
                        return res.status(201).send({
                            success:true,
                            message:'Created Category Successfully',
                            category: newdata
                        })
                    }
                })
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:'Error in creating category'
        })
    }
}

module.exports = getCategoriesController = (req,res)=>{
    try {
        var sql = 'select * from category';
        connection.query(sql,(err,categories)=>{
            if(err){
                return res.status(500).send({
                    success:false,
                    err,
                    message:'Error in getting all categories'
                });
            }
            else{
                return res.status(200).send({
                    success:true,
                    message:'All categories list',
                    categories
                })
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error getting all categories"
        });
    }
}

module.exports = singleCategoryController = (req,res)=>{
    try {
        const {slug} = req.params;
        var sql = 'select * from category where slug=?';
        connection.query(sql,slug,(err,categories)=>{
            if(err){
                return res.status(500).send({
                    success:false,
                    err,
                    message:'Error in getting single category'
                });
            }
            else if(categories.length==0){
                return res.status(200).send({
                    success:true,
                    message:'No such category'
                })
            }
            else{
                return res.status(200).send({
                    success:true,
                    message:'Single Category get Successful',
                    categories
                })
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error getting single category"
        });
    }
}