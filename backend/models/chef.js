const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const chefSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    senha: { type: String, required: true },
    especialidade: { type: String, required: true }
});

// Middleware para criptografar senha antes de salvar
chefSchema.pre('save', async function (next) {
    if (!this.isModified('senha')) return next();
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
});

const Chef = mongoose.model('Chef', chefSchema);

module.exports = Chef;

