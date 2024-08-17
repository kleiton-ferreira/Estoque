//inventario.js

let productId = 1; // Variável global para armazenar o próximo ID do produto

document.getElementById('add-product').addEventListener('click', addProduct);
document.getElementById('generate-report').addEventListener('click', generateReport);
document.getElementById('search-bar').addEventListener('input', searchProduct);

function addProduct() {
    const productName = document.getElementById('product-name').value;
    const productQuantity = document.getElementById('product-quantity').value;
    const productPrice = document.getElementById('product-price').value;

    if (productName === '' || productQuantity === '' || productPrice === '') {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    if (productQuantity < 0 || productPrice < 0) {
        alert('Quantidade e preço não podem ser negativos.');
        return;
    }

    const productList = document.getElementById('product-list');
    const row = document.createElement('tr');

    const totalPrice = (parseFloat(productPrice) * parseFloat(productQuantity)).toFixed(2);

    row.innerHTML = `
        <td>${productId}</td>
        <td class="product-name">${productName}</td>
        <td><input type="number" value="${productQuantity}" class="quantity-input"></td>
        <td><input type="number" value="${parseFloat(productPrice).toFixed(2)}" class="price-input"></td>
        <td>R$<span class="total-price">${totalPrice}</span></td>
        <td>
            <button onclick="deleteProduct(this)">Delete</button>
        </td>
    `;

    productList.appendChild(row);
    productId++; // Incrementa o ID do produto

    document.getElementById('product-name').value = '';
    document.getElementById('product-quantity').value = '';
    document.getElementById('product-price').value = '';

    checkLowStock(row);
    updateAlert();
}

function deleteProduct(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    clearAlerts();
    updateAlert();
}

document.getElementById('product-list').addEventListener('change', updateValues);

function updateValues(event) {
    if (event.target.classList.contains('quantity-input') || event.target.classList.contains('price-input')) {
        const row = event.target.parentNode.parentNode;
        const quantity = row.querySelector('.quantity-input').value;
        const price = row.querySelector('.price-input').value;

        if (quantity < 0) {
            alert('A quantidade não pode ser negativa.');
            row.querySelector('.quantity-input').value = 0;
        }

        if (price < 0) {
            alert('O preço não pode ser negativo.');
            row.querySelector('.price-input').value = 0;
        }

        const totalPrice = (parseFloat(quantity) * parseFloat(price)).toFixed(2);
        row.querySelector('.total-price').textContent = `R$${totalPrice}`;

        checkLowStock(row);
        updateAlert();
    }
}

function checkLowStock(row) {
    const quantity = row.querySelector('.quantity-input').value;
    if (quantity < 10) {
        row.style.backgroundColor = '#ffcccc'; // Cor de fundo vermelho claro
    } else {
        row.style.backgroundColor = ''; // Remove a cor de fundo se o estoque não estiver baixo
    }
}

function showAlert(message) {
    const alertContainer = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = 'alert';
    alert.textContent = message;
    alertContainer.appendChild(alert);
}

function clearAlerts() {
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = '';
}

function updateAlert() {
    const productList = document.getElementById('product-list').querySelectorAll('tr');
    let hasLowStock = false;

    productList.forEach(row => {
        const quantity = row.querySelector('.quantity-input').value;
        if (quantity < 10) {
            hasLowStock = true;
        }
    });

    clearAlerts();
    if (hasLowStock) {
        showAlert('Atenção: Estoque baixo');
    }
}

function generateReport() {
    const productList = document.getElementById('product-list').querySelectorAll('tr');
    const reportData = [];

    productList.forEach(row => {
        const productId = row.cells[0].textContent;
        const productName = row.cells[1].textContent;
        const quantity = row.querySelector('.quantity-input').value;
        const price = row.querySelector('.price-input').value;
        const totalPrice = row.querySelector('.total-price').textContent.replace('R$', '');
        const lowStock = quantity < 10 ? 'Sim' : 'Não';

        reportData.push({ productId, productName, quantity, price, totalPrice, lowStock });
    });

    localStorage.setItem('reportData', JSON.stringify(reportData));
    window.location.href = './relatorio.html';
}

function searchProduct() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const productList = document.getElementById('product-list').querySelectorAll('tr');

    productList.forEach(row => {
        const productName = row.querySelector('.product-name').textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

 // Logout
 document.getElementById('logout-button').addEventListener('click', () => {
    localStorage.removeItem('email');
    localStorage.removeItem('senha');
    window.location.href = './login.html';
});

// Navegação para a página de contato
document.getElementById('contact-button').addEventListener('click', () => {
    window.location.href = '../view/contato.html';
});