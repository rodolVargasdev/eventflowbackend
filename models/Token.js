const { Schema, model } = require('mongoose');

// Esquema del modelo Recovery

const TokenSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 1800  // el token expirará en 1 hora (3600 segundos)
    }
});

module.exports = model('Token', TokenSchema);