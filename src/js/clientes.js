//estoque/src/js/clientes.js

let clientId = 1; // Variável global para armazenar o próximo ID do cliente

document.getElementById('add-client').addEventListener('click', addClient);
document.getElementById('search-bar').addEventListener('input', searchClient);

function addClient() {
    const clientName = document.getElementById('client-name').value;
    const clientCpf = document.getElementById('client-cpf').value;
    const clientEmail = document.getElementById('client-email').value;
    const clientRegistrationDate = document.getElementById('client-registration-date').value;

    if (clientName === '' || clientCpf === '' || clientEmail === '' || clientRegistrationDate === '') {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const clientList = document.getElementById('client-list');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${clientId}</td>
        <td class="client-name">${clientName}</td>
        <td>${clientCpf}</td>
        <td>${clientEmail}</td>
        <td>${clientRegistrationDate}</td>
        <td>
            <button onclick="deleteClient(this)">Delete</button>
        </td>
    `;

    clientList.appendChild(row);
    clientId++;

    // Limpa os campos do formulário
    document.getElementById('client-name').value = '';
    document.getElementById('client-cpf').value = '';
    document.getElementById('client-email').value = '';
    document.getElementById('client-registration-date').value = '';

    updateAlert();
}

function deleteClient(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    updateAlert();
}

function searchClient(event) {
    const searchTerm = event.target.value.toLowerCase();
    const clientList = document.getElementById('client-list').querySelectorAll('tr');

    clientList.forEach(row => {
        const clientName = row.querySelector('.client-name').textContent.toLowerCase();
        if (clientName.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function updateAlert() {
    const clientList = document.getElementById('client-list').querySelectorAll('tr');
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = '';

    if (clientList.length === 0) {
        const alert = document.createElement('div');
        alert.className = 'alert';
        alert.textContent = 'Nenhum cliente cadastrado.';
        alertContainer.appendChild(alert);
    }
}

function generateReport() {
    const clientList = document.getElementById('client-list').querySelectorAll('tr');
    const reportData = [];

    clientList.forEach(row => {
        const clientId = row.cells[0].textContent;
        const clientName = row.cells[1].textContent;
        const clientCpf = row.cells[2].textContent;
        const clientEmail = row.cells[3].textContent;
        const clientRegistrationDate = row.cells[4].textContent;

        reportData.push({ clientId, clientName, clientCpf, clientEmail, clientRegistrationDate });
    });

    localStorage.setItem('clientReportData', JSON.stringify(reportData));
    window.location.href = './relatorio_clientes.html';
}


