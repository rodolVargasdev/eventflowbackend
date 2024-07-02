const jwt = require('jsonwebtoken');

const recoveryJWT = (uid, name) => {
    return new Promise((resolve, reject) => {
        const payload = { uid, name };

        jwt.sign(payload, process.env.RECOVERY_JWT_SEED, {
            expiresIn: '1h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            }

            resolve(token);
        });
    });
};

module.exports = {
    recoveryJWT
};