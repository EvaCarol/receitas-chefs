const express = require('express');
const router = express.Router();
const { createChef, getChef, login, updateChef, deleteChef, getChefById } = require('../controllers/chefCont');

// Rotas de chefs
router.post('/', createChef);
router.get('/', getChef);
router.get('/:id', getChefById);
router.post('/login', login);
router.put('/:id', updateChef);
router.delete('/:id', deleteChef);

module.exports = router;
