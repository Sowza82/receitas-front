// Manipulação do menu hambúrguer
document.getElementById('menu-btn').addEventListener('click', () => {
    const menu = document.getElementById('menu');
    menu.classList.toggle('active');
    
    // Atualiza o atributo aria-expanded
    const hamburger = document.getElementById('menu-btn');
    const isActive = menu.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isActive);
});

// Validação de força da senha
document.getElementById('password').addEventListener('input', function () {
    const password = this.value;
    const feedback = document.getElementById('password-strength');
    let strength = 'Fraca';

    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const isLongEnough = password.length >= 8;

    if (isLongEnough && hasNumbers && hasSpecialChars && hasUpperCase) {
        strength = 'Forte';
    } else if (isLongEnough && (hasNumbers || hasSpecialChars || hasUpperCase)) {
        strength = 'Média';
    }

    feedback.textContent = `Força da senha: ${strength}`;
    feedback.className = strength.toLowerCase();
});

// Validação e envio do formulário de registro
document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const telefone = document.getElementById('telefone');
    const password = document.getElementById('password');
    const feedback = document.getElementById('feedback');
    let messages = [];

    feedback.innerHTML = ''; // Limpa mensagens anteriores

    messages.push(validateField(username, username.value.trim().length >= 3, 'O nome deve ter no mínimo 3 caracteres.'));
    messages.push(validateField(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value), 'Por favor, insira um email válido.'));
    messages.push(validateField(telefone, /^\(\d{2}\) \d{4,5}-\d{4}$/.test(telefone.value.trim()), 'Por favor, insira um telefone válido no formato (xx) xxxx-xxxx.'));
    messages.push(validateField(password, password.value.length >= 8, 'A senha deve ter no mínimo 8 caracteres.'));

    messages = messages.filter(msg => msg !== null); // Remove mensagens nulas
    if (messages.length > 0) {
        feedback.innerHTML = `<p>${messages.join('<br>')}</p>`;
        feedback.classList.add('error-message');
        return;
    }

    // Envio dos dados para o backend
    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username.value,
                email: email.value,
                telefone: telefone.value,
                password: password.value
            })
        });

        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.statusText);
        }

        feedback.innerText = 'Cadastro realizado com sucesso!';
        feedback.classList.remove('error-message');
        feedback.classList.add('success-message');
        document.getElementById('registerForm').reset();
    } catch (error) {
        feedback.innerText = 'Erro: ' + error.message;
        feedback.classList.add('error-message');
    }
});

// Função de validação
function validateField(field, condition, errorMessage) {
    if (!condition) {
        field.classList.add('input-error');
        return errorMessage;
    } else {
        field.classList.remove('input-error');
        return null;
    }
}
