const express = require('express');
const router = express.Router();
const { createReceita, getReceita, updateReceita, deleteReceita, getReceitaById } = require('../controllers/receitaCont');

// Rotas de receitas
router.post('/', createReceita);
router.get('/', getReceita);
router.get('/:id', getReceitaById);
router.put('/:id', updateReceita);
router.delete('/:id', deleteReceita);

module.exports = router;
