
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var dbConfig = require('./Config/databaseConfig.js');
// console.log(dbConfig.sequelize)


//Swagger to create an application documentation
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerUI = require('swagger-ui-express');

var swaggerDefinition = {
    info: {
        title: 'myApplication',
        description: 'This is my application documentation',
        version: '1.0.1'
    },
    securityDefinitions: {
        bearerAuth:{
            type:'apiKey',
            name:'authorization',
            in:'header',
            scheme:'bearer',
        }
    },
    host:'localhost:3043',
    basePath: '/'
}

var swaggerOptions = {
    swaggerDefinition,
    apis:['./index.js']
}

var swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

//End Swagger




var userModel = require('./Model/usermodel.js')

var userController = require('./Controller/userController.js');

var userAuthentication = require('./Controller/authController');

app.use(bodyParser.urlencoded({extended:true}));


//Documentation for Registration using YAML Format
/**
 * @swagger
 * /registration:
 *  post:
 *   tags:
 *    - Users
 *   security:
 *    - bearerAuth: []
 *   description:
 *    - User registration testing
 *   produces:
 *    - application/json
 *   consumes:
 *    - application/x-www-form-urlencoded
 *   parameters:
 *    - name: Username
 *      in: formData
 *      type: string
 *      required: true
 *      description: Please provide unique username
 *    - name: Password
 *      in: formData
 *      type: string
 *      required: true
 *      description: Please provide password
 *   responses:
 *    201:
 *     description: registered successfully
 *    409:
 *     description: user already exists
 *    500:
 *     description: internal server error
 */



app.post('/registration',
    userController.genHash,
    userController.checkUserAlreadyExists,
    userController.actualRegister);


    //Documentation for Registration using YAML Format
/**
 * @swagger
 * /login:
 *  post:
 *   tags:
 *    - Users
 *   security:
 *    - bearerAuth: []
 *   description:
 *    - User login testing
 *   produces:
 *    - application/json
 *   consumes:
 *    - application/x-www-form-urlencoded
 *   parameters:
 *    - name: Username
 *      in: formData
 *      type: string
 *      required: true
 *      description: Please provide unique username
 *    - name: Password
 *      in: formData
 *      type: string
 *      required: true
 *      description: Please provide password
 *   responses:
 *    201:
 *     description: logged successfully
 *    409:
 *     description: wrong user name or password
 *    500:
 *     description: internal server error
 */
app.post('/login',
    userAuthentication.validator, 
    userAuthentication.passwordChecker, 
    userAuthentication.jwtTokenGen
    );


//Documentation for Delete User using YAML Format
/**
 * @swagger
 * /deleteUser/{id}:
 *  delete:
 *   tags:
 *    - Users
 *   security:
 *    - bearerAuth: []
 *   description:
 *    - User registration testing
 *   produces:
 *    - application/json
 *   consumes:
 *    - application/x-www-form-urlencoded
 *   parameters:
 *    - name: id
 *      in: path
 *      type: integer
 *      required: true
 *      description: Enter user id.
 *   responses:
 *    201:
 *     description: User Deleted successfully
 *    409:
 *     description: User not deleted.
 *    500:
 *     description: internal server error
 */
app.delete('/deleteUser/:id',
        userController.deleteUser
    );
app.listen(3043);


// console.log(app);

// //GET
// app.get('/list', function(req,res,next){
//     console.log(req.query);

//     //actual
//     res.send('Request received :-P :-P');
// })

// //POST
// app.post('/registration', function(req,res,next){
//     console.log(req.body);
// })

// app.listen(3001);



// function cb(req,res,next){   
//     console.log('in registration');

//     var x = {name: "Deepak Maharjan",test:'Received'}
//     res.json(x);
//     res.status(200);
//     }

// app.get('/booking',
//     function(req,res,next){
//         console.log('In the first middleware do something');
//         next();
//     },
//     function(req,res,next){
//         console.log('In the second middleware // send something');
//         res.status(200);
//         next();
//     },
// );



// app.get('/registration', cb);


