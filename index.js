const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');
require('dotenv').config();
const path = require('path');


console.log(process.env)

//Crear el server express
const app = express();

//Base de datos
dbConnection();

//CORS
app.use(cors())

//Directorio público
app.use(express.static('public'))

//Lectura y parseo del body
app.use( express.json ());

//Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/reports', require('./routes/reports'));
// Ruta recuperación contraseña
app.use('/api/recovery', require('./routes/recovery'));

//Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});