var userController = require('./userController');
var users = require('../Model/usermodel.js');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var secret = 'ThisIsMySecretKey';

function validator(req,res,next){
    if(req.body.Username === '' || req.body.Password === ''){
        res.status(404);
        res.json({status: 404, message:'Username is required'})
    }
    else{
        users.users.findOne({
            where: {
                username:req.body.Username
            }
        })
        .then(function(result){
            if(result === null){
                res.status(404);
                res.json({status:404, message:'User dose not exist.'});
            }
            else{
                req.passwordFromDB = result.dataValues.password;
                req.usernameFromDB = result.dataValues.username;
                next();
            }
        })
        .catch(function(err){
            res.json(err);
        })
    }
}


function passwordChecker(req,res,next){
    console.log(req.body.Password);
    console.log(req.body.Username);

    bcrypt.compare(req.body.Password, req.passwordFromDB)

    .then(function(result){
        if(result === true){
        //console.log(result.dataValues);
        next();
        }
        else{
            res.status(404);
            res.json({status:404,message:"incorrect password"});
        }
    })
    .catch(function(err){
        res.json(err);
    })    
}

function jwtTokenGen(req,res,next){
    var myPayload = {
        username: req.usernameFromDB,
        userLevel: 'superadmin'
    }
    jwt.sign(myPayload, secret, {expiresIn: "10h"},
    function(err,resultToken){
        console.log(err);
        console.log(resultToken);
        res.json({"userToken: ":resultToken})
    })
}

function verifyToken(req,res,next){
    //auth bearer token
    // headers: authorization : Bearer saldmalsmdsaml
    // URL/URIError

    if(req.headers.authorization === undefined){
        res.status(401);
        res.json({status:404, message:"unauthorized access"});
    }

    var token = req.headers.authorization;
    token = token.slice(7, token.length).trimLeft();
    jwt.verify(token,secret,
        function(err,result){
            console.log(err,result);

            if(result){
                console.log("Correct token");
                next;
            }
            if(err){
                res.json({err});
            }
        })
        next;
}

module.exports = {
    passwordChecker,
    validator,
    jwtTokenGen,
    verifyToken  
}




