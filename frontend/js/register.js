document.getElementById('menu-btn').addEventListener('click', () => {
    const menu = document.getElementById('menu');
    const hamburger = document.getElementById('menu-btn');
    menu.classList.toggle('active');
    const isActive = menu.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
});

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
    feedback.className = `strength-${strength.toLowerCase()}`;
});

// Função para validar o email
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
};

// Função para validar o telefone (com parênteses, espaços e hífen)
const validatePhone = (telefone) => {
    const phoneRegex = /^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/;
    return phoneRegex.test(telefone);
};

document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const telefone = document.getElementById('telefone');
    const password = document.getElementById('password');
    const data_nascimento = document.getElementById('data_nascimento');
    const foto_perfil = document.getElementById('foto_perfil');
    const feedback = document.getElementById('feedback');
    
    let messages = [];
    feedback.innerHTML = '';

    // Validação obrigatória para nome
    if (username.value.trim().length < 3) {
        messages.push('O nome deve ter no mínimo 3 caracteres.');
        username.classList.add('input-error');
    } else {
        username.classList.remove('input-error');
    }

    // Validação obrigatória para email
    if (!validateEmail(email.value)) {
        messages.push('Por favor, insira um email válido.');
        email.classList.add('input-error');
    } else {
        email.classList.remove('input-error');
    }

    // Validação obrigatória para telefone
    if (!validatePhone(telefone.value.trim())) {
        messages.push('Por favor, insira um telefone válido no formato (xx) xxxx-xxxx ou xx xxxxx-xxxx.');
        telefone.classList.add('input-error');
    } else {
        telefone.classList.remove('input-error');
    }

    // Validação obrigatória para senha
    if (password.value.length < 8) {
        messages.push('A senha deve ter no mínimo 8 caracteres.');
        password.classList.add('input-error');
    } else {
        password.classList.remove('input-error');
    }

    // Verifica se houve mensagens de erro
    if (messages.length > 0) {
        displayFeedback(feedback, messages, 'error-message');
        return;
    }

    // Envio do formulário (caso não haja erros)
    try {
        const formData = new FormData();
        formData.append('username', username.value);
        formData.append('email', email.value);
        formData.append('telefone', telefone.value);
        formData.append('password', password.value);
        
        if (data_nascimento.value) formData.append('data_nascimento', data_nascimento.value);  // Opcional
        if (foto_perfil.files.length > 0) formData.append('foto_perfil', foto_perfil.files[0]);  // Opcional

        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro na requisição: ' + response.statusText);
        }

        displayFeedback(feedback, 'Cadastro realizado com sucesso! Você será redirecionado para a página de login.', 'success-message');
        
        clearFormFields();

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 3000);

    } catch (error) {
        displayFeedback(feedback, 'Erro: ' + error.message, 'error-message');
    }
});

// Função para mostrar mensagens de feedback
function displayFeedback(feedbackElement, messages, type) {
    feedbackElement.innerHTML = Array.isArray(messages) ? messages.join('<br>') : messages;
    feedbackElement.classList.remove('error-message', 'success-message');
    feedbackElement.classList.add(type);
}

// Função para limpar os campos do formulário
function clearFormFields() {
    document.getElementById('registerForm').reset();
}
