const User = require('../models/userModel');

// Buscar informações do perfil do usuário
exports.getUserProfile = (req, res) => {
    const userId = req.user.id; // O id do usuário está disponível via middleware de autenticação

    User.findById(userId, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar perfil do usuário' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const user = results[0];
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.created_at,
        });
    });
};

// Atualizar dados do usuário
exports.updateUserProfile = (req, res) => {
    const userId = req.user.id;
    const { username, email } = req.body;

    User.update(userId, username, email, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao atualizar perfil do usuário' });
        }

        res.json({ message: 'Perfil atualizado com sucesso!' });
    });
};

// Deletar usuário
exports.deleteUser = (req, res) => {
    const userId = req.user.id;

    User.delete(userId, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao deletar usuário' });
        }

        res.json({ message: 'Usuário deletado com sucesso!' });
    });
};
