var Sequelize = require('sequelize')

var sequelize = new Sequelize('testDB','root','deepak123',{
    host:'localhost',
    dialect:'mysql',
    logging: false
});


// var vall = xyz()

// function xyz(){
//     return 10;
// }

sequelize.authenticate()
.then(function(result){
    console.log('Database connected successfully')
})
.catch(function(err){
    console.log(err)
})
module.exports = {
    Sequelize,
    sequelize
}
