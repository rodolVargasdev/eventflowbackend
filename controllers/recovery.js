const { response } = require('express');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const { recoveryJWT } = require('../helpers/recoveryJWT.js');
const Usuario = require('../models/Usuario');
const Token = require('../models/Token');

require('dotenv').config();

// Configuración del emisor del correo
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'alejandrobackend61@gmail.com',
        pass: 'ebix ndvb qsbj tqwa '
    }
});


// Manejo de solicitud de recuperación
// de contraseña, necesario el email del usuario
const verifyUser = async (req, res = response) => {

    const { email } = req.body; //Se obtiene el email desde la petición

    try {
        //búsqueda en la base de datos
        let usuario = await Usuario.findOne({ email });

        // Verifica que el usuario no exista
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe este usuario'
            });
        }

        // Generar JWT de recuperación
        const tokenRecovery = await recoveryJWT(usuario.id, usuario.name);

        // Creación del documento que almacena el id del usuario
        const token = new Token({
            token: tokenRecovery,
            user: usuario.id
        });

        // Guardado del documento
        await token.save();

        // Enlace de recuperación
        const resetLink = `${process.env.BASE_URL}/reset-password?token=${tokenRecovery}`;

        // Cuerpo del email de recuperación de contraseña
        const mailOptions = {
            from: 'alejandrobackend61@gmail.com',
            to: email,
            subject: 'Recuperación de contraseña',
            text: `Hola ${usuario.name},
                    Para reestablecer tu contraseña de EventFlow,
                    por favor haz click el siguiente enlace:
                    ${resetLink}`
        };

        // Envío del correo
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al enviar el correo de recuperación',
                    error
                });
            } else {
                res.status(201).json({
                    ok: true,
                    msg: 'Correo de recuperación enviado',
                    name: usuario.name,
                    tokenRecovery
                });
            }
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'No existe este usuario',
        });
    }

};

// Formulario de restablecimiento de contraseña
const showResetForm = async (req, res = response) => {
    const { recoveryToken } = req.query; // Obtención del token de la url
    //Eliminar después

    try {

        const token = await Token.findOne({ recoveryToken }); //Busqueda del token en la base de datos

        if (!token) { // Respuesta en caso de que el token no sea válido o no exista
            return res.status(400).json({
                ok: false,
                msg: 'Token inválido o expirado'
            });
        }

        // Renderiza la vista del formulario de restablecimiento y pasa el token a la vista
        // res.render('resetForm', { recoveryToken });

        res.status(200).json({
            ok: true,
            msg: 'Token válido',
            recoveryToken: token.token,
            user: token.user
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error al procesar la solicitud'
        });
    }
};



// Restablecimiento de contraseña
const resetPassword = async (req, res = response) => {
    const { recoveryToken, newPassword } = req.body;

    try {

        const token = await Token.findOne({ recoveryToken });

        if (!token) {
            return res.status(400).json({
                ok: false,
                msg: 'Token inválido o expirado'
            });
        }

        // Encriptación de la nueva contraseña
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newPassword, salt);

        await Usuario.findByIdAndUpdate
            (token.user, { password: hashedPassword });

        await Token.findByIdAndDelete(token._id);

        res.status(200).json({
            ok: true,
            msg: 'Contraseña actualizada correctamente'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error al procesar la solicitud'
        });

    }
};

module.exports = {
    verifyUser,
    showResetForm,
    resetPassword
};