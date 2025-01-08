const mysql = require('mysql2/promise');
require('dotenv').config(); 

// Criação do pool de conexões
const db = mysql.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,
    waitForConnections: true, 
    connectionLimit: 10, 
    queueLimit: 0 
});

// Teste inicial da conexão
(async () => {
    try {
        const connection = await db.getConnection();
        console.log('Conectado ao banco de dados!');
        connection.release(); // Liberando a conexão após o teste
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        process.exit(1); // Encerra o processo se não conseguir conectar
    }
})();

// Função para verificar se o e-mail existe
const checkEmailExists = async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows.length > 0;
};

// Função para buscar o usuário pelo nome de usuário
const getUserByUsername = async (username) => {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
};

// Função para criar um novo usuário
const createUser = async (username, email, telefone, password) => {
    const [result] = await db.query(
        'INSERT INTO users (username, email, telefone, password) VALUES (?, ?, ?, ?)', 
        [username, email, telefone, password]
    );
    return result.insertId;
};

// Função para criar o perfil do usuário
const createProfile = async (userId, data_nascimento, foto_perfil) => {
    await db.query(
        'INSERT INTO profiles (user_id, data_nascimento, foto_perfil) VALUES (?, ?, ?)', 
        [userId, data_nascimento, foto_perfil]
    );
};

module.exports = {
    db,
    checkEmailExists,
    getUserByUsername,
    createUser,
    createProfile
};
