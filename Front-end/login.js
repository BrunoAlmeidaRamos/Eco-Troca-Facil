document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const email = document.getElementById('input-email');
    const senha = document.getElementById('input-passaword');
    const cadastroLink = document.querySelector('.cadastro-link');

    // Mostrar/ocultar senha
    document.querySelectorAll('.toggle-password').forEach(function (icon) {
        icon.addEventListener('click', function () {
            const targetInput = document.getElementById(this.getAttribute('data-target'));
            const isPassword = targetInput.getAttribute('type') === 'password';
            targetInput.setAttribute('type', isPassword ? 'text' : 'password');
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Envio do formulário com validação e fetch para o PHP
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Validação de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            alert('Por favor, insira um e-mail válido.');
            return;
        }

        // Validação da senha
        const senhaValor = senha.value.trim();
        if (senhaValor === '') {
            alert('Por favor, insira sua senha.');
            return;
        }

        if (senhaValor.length < 8 || senhaValor.length > 15) {
            alert('A senha deve ter entre 8 e 15 caracteres.');
            return;
        }

        if (!/[A-Z]/.test(senhaValor)) {
            alert('A senha deve conter pelo menos uma letra MAIÚSCULA.');
            return;
        }

        if (!/[a-z]/.test(senhaValor)) {
            alert('A senha deve conter pelo menos uma letra minúscula.');
            return;
        }

        if (!/[0-9]/.test(senhaValor)) {
            alert('A senha deve conter pelo menos um número.');
            return;
        }

        if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]/.test(senhaValor)) {
            alert('A senha deve conter pelo menos um caractere especial.');
            return;
        }

        // Enviar os dados via fetch para login.php
        const formData = new FormData(form);

        fetch('../Back-end/login.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(data => {
                console.log('⚠️ Resposta bruta recebida do login.php:', JSON.stringify(data));

                const resposta = data.trim().replace(/\r/g, '').replace(/\n/g, '');
                console.log('🔍 Resposta final limpa:', JSON.stringify(resposta));

                if (resposta === 'success') {
                    alert('Login realizado com sucesso!');
                    setTimeout(() => {
                        window.location.href = 'troca.html';
                    }, 500);
                } else if (resposta === 'senha_incorreta') {
                    alert('❌ Senha incorreta.');
                } else if (resposta === 'usuario_nao_encontrado') {
                    alert('❌ Usuário não encontrado.');
                } else {
                    alert('Erro inesperado: ' + resposta);
                }
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
                alert('Erro de conexão com o servidor.');
            });
    });

    // Redirecionamento para a página de cadastro
    cadastroLink.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = 'cadastro.html';
    });
});
