const mongoose = require('mongoose');

const dbConnection = async() => {
    try{
        mongoose.connect(process.env.DB_CNN);

        console.log('DB Online')

    }catch (error){
        console.log(error);
        throw new Error('Error a lahora de inicializar BD')
    }
}

module.exports = {
    dbConnection
}