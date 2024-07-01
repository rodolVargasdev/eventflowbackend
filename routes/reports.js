const express = require('express');
const router = express.Router();
const { generarReporteEventos } = require('../controllers/reports'); // Importa el controlador adecuado

router.get('/generate/all/all', generarReporteEventos);

module.exports = router;
