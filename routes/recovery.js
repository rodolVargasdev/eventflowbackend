/*
    Rutas de recuperación y
    reseteo de contraseña /recovery
    /api/recovery
*/
const { Router } = require('express');

const { verifyUser, showResetForm, resetPassword } = require('../controllers/recovery');

const router = Router();

// Ruta de verificación del usuario /api/recovery/
router.post('/', verifyUser);

// Ruta del formulario de restablecimiento de contraseña /api/recovery/reset-password
router.get('/reset-password', showResetForm);

// Ruta para restablecer la contraseña /api/recovery/reset-password
router.post('/reset-password', resetPassword);


module.exports = router;