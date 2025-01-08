const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./db'); // Importando o db.js

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do Multer para upload de foto de perfil
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Pasta para salvar as fotos
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Renomeia para evitar conflitos
    }
});

const upload = multer({ storage: storage, limits: { fileSize: 5000000 } }); // Limite de 5MB

app.use(cors());
app.use(express.json()); 

// Verificação da existência da pasta 'uploads'
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

// Função para validar o email
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
};

// Função para validar o telefone
const validatePhone = (telefone) => {
    const phoneRegex = /^[0-9]{10,11}$/; // Para um telefone com 10 ou 11 dígitos
    return phoneRegex.test(telefone);
};

// Rota de cadastro de usuário
app.post('/register', upload.single('foto_perfil'), async (req, res) => {
    const { username, email, telefone, password, data_nascimento } = req.body;

    // Verifica se os campos obrigatórios foram preenchidos
    if (!username || !email || !telefone || !password) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    // Valida o email
    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Email inválido.' });
    }

    // Valida o telefone
    if (!validatePhone(telefone)) {
        return res.status(400).json({ message: 'Telefone inválido.' });
    }

    // Verifica se o email já existe no banco de dados
    const emailExists = await db.checkEmailExists(email);
    if (emailExists) {
        return res.status(400).json({ message: 'Email já está em uso.' });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Cria o usuário no banco
        const userId = await db.createUser(username, email, telefone, hashedPassword);

        // Insere o perfil do usuário
        const fotoPerfil = req.file ? req.file.filename : null; // Se houver foto, salva o nome do arquivo
        await db.createProfile(userId, data_nascimento, fotoPerfil);

        res.status(201).json({ message: 'Cadastro realizado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao registrar o usuário. Tente novamente.' });
    }
});

// Rota de login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    try {
        // Busca o usuário no banco de dados
        const user = await db.getUserByUsername(username);
        if (!user) {
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }

        // Verifica se a senha corresponde
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }

        // Cria o token JWT
        const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Responde com o token e mensagem de sucesso
        res.status(200).json({
            message: 'Login realizado com sucesso!',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            }
        });

    } catch (error) {
        console.error('Erro ao processar o login:', error);
        res.status(500).json({ message: 'Erro interno ao processar o login.' });
    }
});

// Teste de conexão e inicialização do servidor
db.db.getConnection()
    .then(() => {
        console.log('Conectado ao banco de dados!');
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Erro ao conectar ao banco de dados:', error.message);
        process.exit(1); 
    });
