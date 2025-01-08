const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Rota para buscar o perfil do usuário
router.get('/profile', authMiddleware, userController.getUserProfile);

// Rota para atualizar o perfil do usuário
router.put('/profile', authMiddleware, userController.updateUserProfile);

// Rota para deletar o usuário
router.delete('/profile', authMiddleware, userController.deleteUser);

module.exports = router;
