// Manipulação do menu hambúrguer
document.getElementById('menu-btn').addEventListener('click', () => {
    const menu = document.getElementById('menu');
    menu.classList.toggle('active');
    
    // Atualiza o atributo aria-expanded
    const hamburger = document.getElementById('menu-btn');
    const isActive = menu.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isActive);
});

// Validação e envio do formulário de login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validação dos campos
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Envio dos dados para o backend
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error('Credenciais inválidas.');
        }

        const data = await response.json();
        alert(`Bem-vindo, ${data.username}!`);
        // Redirecionar ou carregar o conteúdo da página principal
    } catch (error) {
        alert('Erro: ' + error.message);
    }
});
