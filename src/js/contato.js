// contato.js

// Verificação de autenticação
const isAuthenticated = localStorage.getItem('email') !== null && localStorage.getItem('senha') !== null;
if (!isAuthenticated) {
    window.location.href = './login.html';
}