const mongoose = require('mongoose');

const receitasSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef', required: true }
});

const Receitas = mongoose.model('Receitas', receitasSchema);

module.exports = Receitas;
