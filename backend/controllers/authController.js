const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Registro de usuário
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Verificar se o usuário já existe
        const existingUser = await User.findByEmail(email);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Usuário já existe' });
        }

        // Criptografar a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar o usuário no banco de dados
        await User.create(username, email, hashedPassword);

        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
};

// Login de usuário
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificar se o usuário existe
        const results = await User.findByEmail(email);
        if (results.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const user = results[0];
        // Comparar a senha informada com a senha criptografada
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Gerar um token JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login bem-sucedido', token });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao realizar login' });
    }
};
