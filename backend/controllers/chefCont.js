const Chef = require('../models/chef');
const bcrypt = require('bcryptjs');

// Criar novo chef
exports.createChef = async (req, res) => {
    try {
        const { nome, senha, especialidade } = req.body;
        if (!nome || !senha || !especialidade) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios" });
        }

        // Criptografar senha
        const senhaHash = await bcrypt.hash(senha, 10);
        const chef = new Chef({ nome, senha: senhaHash, especialidade });
        await chef.save();
        res.status(201).json(chef);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Listar todos os chefs
exports.getChef = async (req, res) => {
    try {
        const chefs = await Chef.find();
        res.status(200).json(chefs);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Buscar um chef específico por ID
exports.getChefById = async (req, res) => {
    try {
        const chef = await Chef.findById(req.params.id);
        if (!chef) {
            return res.status(404).json({ message: 'Chef não encontrado' });
        }
        res.status(200).json(chef);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Login do chef
exports.login = async (req, res) => {
    try {
        const { nome, senha } = req.body;
        const chef = await Chef.findOne({ nome });

        if (!chef || !(await bcrypt.compare(senha, chef.senha))) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        res.status(200).json({ message: "Login bem-sucedido", chef });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Atualizar chef
exports.updateChef = async (req, res) => {
    try {
        let updateData = req.body;

        // Se a senha for alterada, criptografar antes de atualizar
        if (updateData.senha) {
            updateData.senha = await bcrypt.hash(updateData.senha, 10);
        }

        const chef = await Chef.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!chef) return res.status(404).json({ message: "Chef não encontrado" });

        res.status(200).json(chef);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Excluir chef
exports.deleteChef = async (req, res) => {
    try {
        const chef = await Chef.findByIdAndDelete(req.params.id);
        if (!chef) {
            return res.status(404).json({ error: 'Chef não encontrado' });
        }
        res.status(200).json({ message: 'Chef deletado com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar chef:', error);
        res.status(500).json({ error: 'Erro ao deletar chef' });
    }
};

// Exportação correta
module.exports = exports;

