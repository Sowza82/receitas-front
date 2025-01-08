// Manipulação do menu hambúrguer
document.getElementById('menu-btn').addEventListener('click', () => {
    const menu = document.getElementById('menu');
    const hamburger = document.getElementById('menu-btn');
    menu.classList.toggle('active');
    
    // Atualiza o atributo aria-expanded
    const isActive = menu.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
});

// Função para mostrar mensagens de erro
function showErrorMessage(message) {
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.color = 'red';
}

// Função para escapar caracteres especiais (protege contra injeção de código)
function escapeSpecialChars(str) {
    return str.replace(/[&<>"'`=\/]/g, (match) => `\\${match}`);
}

// Validação e envio do formulário de login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Limpa as mensagens de erro anteriores
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.textContent = '';
    
    // Coleta os valores dos campos
    let username = document.getElementById('username').value.trim();
    let password = document.getElementById('password').value.trim();

    // Validação dos campos
    if (!username || !password) {
        showErrorMessage('Por favor, preencha todos os campos.');
        return;
    }

    if (username.length < 3) {
        showErrorMessage('O nome de usuário deve ter pelo menos 3 caracteres.');
        return;
    }

    if (password.length < 8) {
        showErrorMessage('A senha deve ter pelo menos 8 caracteres.');
        return;
    }

    // Escape de caracteres especiais para segurança
    username = escapeSpecialChars(username);
    password = escapeSpecialChars(password);

    // Envio dos dados para o backend
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        // Se a resposta não for OK, exibe a mensagem de erro
        if (!response.ok) {
            showErrorMessage(data.message || 'Credenciais inválidas.');
            return;
        }

        // Se o login for bem-sucedido
        // Exibe um feedback visual ao invés de um alert
        const successMessageDiv = document.getElementById('success-message');
        successMessageDiv.textContent = `Bem-vindo, ${data.username || username}!`;
        successMessageDiv.style.color = 'green';
        
        // Salve o token no localStorage para uso posterior
        localStorage.setItem('token', data.token);
        
        // Redireciona para a página de sucesso do login
        setTimeout(() => {
            window.location.href = 'loginSuccess.html'; // Redireciona para a página de sucesso
        }, 1000); // Redireciona após 1 segundo

    } catch (error) {
        showErrorMessage('Erro: ' + error.message);
    }
});
