const db = require('../config/db');  // Configuração do banco de dados

const User = {
    // Função para criar um usuário
    create: async (username, email, password) => {
        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        
        try {
            // Executa a query para inserir os dados do usuário
            const [result] = await db.query(query, [username, email, password]);
            return result;  // Retorna o resultado da inserção
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            throw error;  // Lança erro caso algo aconteça
        }
    },

    // Função para buscar um usuário pelo e-mail
    findByEmail: async (email) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        
        try {
            // Executa a query para buscar o usuário pelo email
            const [results] = await db.query(query, [email]);
            return results;  // Retorna os resultados da busca
        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
            throw error;  // Lança erro caso algo aconteça
        }
    },

    // Função para buscar um usuário pelo ID
    findById: async (id) => {
        const query = 'SELECT * FROM users WHERE id = ?';
        
        try {
            // Executa a query para buscar o usuário pelo ID
            const [results] = await db.query(query, [id]);
            return results[0];  // Retorna o primeiro usuário encontrado (se houver)
        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
            throw error;  // Lança erro caso algo aconteça
        }
    },

    // Função para atualizar o perfil do usuário
    update: async (id, username, email) => {
        const query = 'UPDATE users SET username = ?, email = ? WHERE id = ?';
        
        try {
            // Executa a query para atualizar os dados do usuário
            const [result] = await db.query(query, [username, email, id]);
            return result;  // Retorna o resultado da atualização
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            throw error;  // Lança erro caso algo aconteça
        }
    },

    // Função para deletar um usuário
    delete: async (id) => {
        const query = 'DELETE FROM users WHERE id = ?';
        
        try {
            // Executa a query para deletar o usuário
            const [result] = await db.query(query, [id]);
            return result;  // Retorna o resultado da exclusão
        } catch (error) {
            console.error("Erro ao deletar usuário:", error);
            throw error;  // Lança erro caso algo aconteça
        }
    }
};

module.exports = User;
