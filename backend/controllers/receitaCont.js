const Receitas = require('../models/receitas');
const Chef = require('../models/chef.js');

// Criar nova receita
exports.createReceita = async (req, res) => {
    try {
        const { titulo, descricao, chef } = req.body;

        // Verificar se o chef existe
        const chefExists = await Chef.findById(chef);
        if (!chefExists) {
            return res.status(404).json({ message: 'Chef não encontrado' });
        }

        const receita = new Receitas({ titulo, descricao, chef });
        await receita.save();
        res.status(201).json(receita);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Listar todas as receitas
exports.getReceita = async (req, res) => {
    try {
        const receitas = await Receitas.find().populate('chef', 'nome especialidade');
        res.status(200).json(receitas);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Buscar uma receita por ID
exports.getReceitaById = async (req, res) => {
    try {
        const receita = await Receitas.findById(req.params.id).populate('chef', 'nome especialidade');
        if (!receita) {
            return res.status(404).json({ message: 'Receita não encontrada' });
        }
        res.status(200).json(receita);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Atualizar uma receita
exports.updateReceita = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descricao, chef } = req.body;

        // Verificar se o chef existe
        if (chef) {
            const chefExists = await Chef.findById(chef);
            if (!chefExists) {
                return res.status(404).json({ message: 'Chef não encontrado' });
            }
        }

        const updatedReceita = await Receitas.findByIdAndUpdate(id, { titulo, descricao, chef }, { new: true });
        if (!updatedReceita) return res.status(404).json({ message: 'Receita não encontrada' });

        res.status(200).json(updatedReceita);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Excluir uma receita
exports.deleteReceita = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReceita = await Receitas.findByIdAndDelete(id);
        if (!deletedReceita) return res.status(404).json({ message: 'Receita não encontrada' });

        res.status(200).json({ message: 'Receita excluída com sucesso' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


