const jwt = require('jsonwebtoken');

// Middleware para autenticação via JWT
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Armazena os dados do usuário decodificado no objeto `req`
        next(); // Passa para a próxima rota ou middleware
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
};

module.exports = authMiddleware;
