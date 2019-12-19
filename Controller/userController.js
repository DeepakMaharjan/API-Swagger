
var bcrypt = require('bcrypt');
var params = require('params');
var users = require('../Model/usermodel.js');
var jwt = require('jsonwebtoken');
var secret = 'ThisIsMySecretKey';

function validator(req,res,next){
    if(req.body.Username === ''){
        res.json({status: 404, message:'Username is required'})
    }
    else if(req.body.Password === ''){
        res.json({status: 404, message: 'Password is required'})
    }

    else{
        res.json({status: 200, message:'Status is OK'})
    }
}

function genHash(req,res,next){

    var saltRounds = 10;    
    bcrypt.hash(req.body.Password, saltRounds, function(err, hash){
    
        if(hash){
            console.log(hash);
            req.hashKey = hash;
            actualRegister(req,res,next);
            // res.json(hash)
            // next();
        }
        else
        {
            res.json({status: 200, message:'Cannot hash password'})
        }
     });
}

function actualRegister(req,res,next){

    users.users.create({
        username: req.body.Username,
        // password: req.body.Password
        password: req.hashKey
    })

    .then(function(result){
        console.log(result)
        res.json(result);
    })
    .catch(function(err){
        console.log(err)
        res.json(err);
    })
    
}

function checkUserAlreadyExists(req,res,next){
    //db-> USername already exists
    users.users.findOne({
        where:{username:req.body.Username}
    })

    .then(function(result){
        console.log(result)

        if(result === ''){
            next;
        }
        else {
            res.json({status:409,message:'User already exists.'})
        }
    })

    .catch(function(err){
        console.log(err)
        res.json(err);
    })
}




// var token = req.headers.authorization;
// token = token.slice(7, token.length).trimLeft();
// jwt.verify(token,secret,
//     function(err,result){
//         console.log(err,result);

//         if(result){
//             console.log("Correct token");
//             next;
//         }
//         if(err){
//             res.json({err});
//         }
//     })
//     next;

function deleteUser(req,res,next){
    if(req.params.id === null || req.params.id === undefined){
        res.status(404);
        res.json({status:404, message:'Id is not provided'})
    }

    if(req.headers.authorization === undefined){
        res.status(401);
        res.json({status:404, message:"Unauthorized Access"});
    }

    var token = req.headers.authorization;
    token = token.slice(7, token.length).trimLeft();
    jwt.verify(token,secret,
        function(err,result){
            console.log(err,result);

            if(result){
                users.users.destroy({
                    where:{
                        id:req.params.id
                    }
                })
                .then(function(result){
                    console.log(result);
                    if(result === 0){
                        res.status(500);
                        res.json({status:409, message:"Couldnot delete user."})
                    }
                    res.status(200);
                    res.json({status:201, message:"User delete successfully."})
                })
            
            
                .catch(function(err){
                    console.log(err)
                    res.json(err);
                })
                next;
            }
            if(err){
                res.json({err});
            }
        })
        next;



    
}



module.exports = {
    validator,
    genHash,
    actualRegister,
    checkUserAlreadyExists,
    deleteUser
}

