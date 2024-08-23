let userId = 1; // Variável global para armazenar o próximo ID do usuário

document.getElementById('add-user').addEventListener('click', addUser);
document.getElementById('search-bar').addEventListener('input', searchUser);

function addUser() {
    const userName = document.getElementById('user-name').value;
    const userCpf = document.getElementById('user-cpf').value;
    const userPhone = document.getElementById('user-phone').value;
    const userEmail = document.getElementById('user-email').value;

    if (userName === '' || userCpf === '' || userPhone === '' || userEmail === '') {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const userList = document.getElementById('user-list');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${userId}</td>
        <td class="user-name">${userName}</td>
        <td>${userCpf}</td>
        <td>${userPhone}</td>
        <td>${userEmail}</td>
        <td>
            <button onclick="deleteUser(this)">Delete</button>
        </td>
    `;

    userList.appendChild(row);
    userId++; // Incrementa o ID do usuário

    // Limpa os campos do formulário
    document.getElementById('user-name').value = '';
    document.getElementById('user-cpf').value = '';
    document.getElementById('user-phone').value = '';
    document.getElementById('user-email').value = '';

    updateAlert();
}

function deleteUser(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    updateAlert();
}

function searchUser(event) {
    const searchTerm = event.target.value.toLowerCase();
    const userList = document.getElementById('user-list').querySelectorAll('tr');

    userList.forEach(row => {
        const userName = row.querySelector('.user-name').textContent.toLowerCase();
        if (userName.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function updateAlert() {
    const userList = document.getElementById('user-list').querySelectorAll('tr');
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = '';

    if (userList.length === 0) {
        const alert = document.createElement('div');
        alert.className = 'alert';
        alert.textContent = 'Nenhum usuário cadastrado.';
        alertContainer.appendChild(alert);
    }
}

function generateReport() {
    const userList = document.getElementById('user-list').querySelectorAll('tr');
    const reportData = [];

    userList.forEach(row => {
        const userId = row.cells[0].textContent;
        const userName = row.cells[1].textContent;
        const userCpf = row.cells[2].textContent;
        const userPhone = row.cells[3].textContent;
        const userEmail = row.cells[4].textContent;

        reportData.push({ userId, userName, userCpf, userPhone, userEmail });
    });

    localStorage.setItem('userReportData', JSON.stringify(reportData));
    window.location.href = './relatorio_usuarios.html';
}
