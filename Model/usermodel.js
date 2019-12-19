var dbConfig = require('../Config/databaseConfig.js');

//Create database table with atributes
var users = dbConfig.sequelize.define('user',
//attributes
{
    id:{
        type:dbConfig.Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    username:{
        type:dbConfig.Sequelize.TEXT,
        allowNull: false
    },
    password:{
        type: dbConfig.Sequelize.TEXT,
        allowNull:false
    }
},
{
    paranoid:true,
    freezeTableName:true,
    tableName:'user_table'
}
)

users.sync({force:false})
.then(function(result){
    console.log(result)
})
.catch(function(err){
    console.log(err)
})

module.exports = {users}

