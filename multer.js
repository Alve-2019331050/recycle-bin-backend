const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req,res,cb){
        cb(null,"uploads/");
    },
    filename: function(req,file,cb){
        const uniquePrefix = Date.now() + "-";
        const fileName = file.originalname.split('.')[0];
        cb(null,uniquePrefix+fileName+".png");
    },
});

exports.upload = multer({storage: storage});