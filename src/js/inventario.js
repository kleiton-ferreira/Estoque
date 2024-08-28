//estoque/src/js/inventario.js

let productId = 1; // Variável global para armazenar o próximo ID do produto

document.getElementById('add-product').addEventListener('click', addProduct);
document.getElementById('generate-report').addEventListener('click', generateReport);
document.getElementById('search-bar').addEventListener('input', searchProduct);


function addProduct() {
    const productName = document.getElementById('product-name').value;
    const productQuantity = document.getElementById('product-quantity').value;
    const productPrice = document.getElementById('product-price').value;
    let productDiscount = document.getElementById('product-discount').value;

    // Se o campo de desconto estiver vazio, defina como 0
    if (productDiscount === '') {
        productDiscount = 0;
    }

    if (productName === '' || productQuantity === '' || productPrice === '') {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    if (productQuantity < 0 || productPrice < 0 || productDiscount < 0) {
        alert('Quantidade, preço e desconto não podem ser negativos.');
        return;
    }

    const productList = document.getElementById('product-list');
    const row = document.createElement('tr');

    // Calcula o valor total com desconto
    const discountAmount = (parseFloat(productPrice) * parseFloat(productDiscount)) / 100;
    const discountedPrice = parseFloat(productPrice) - discountAmount;
    const totalPrice = (discountedPrice * parseFloat(productQuantity)).toFixed(2);

    row.innerHTML = `
        <td>${productId}</td>
        <td class="product-name">${productName}</td>
        <td><input type="number" value="${productQuantity}" class="quantity-input"></td>
        <td><input type="number" value="${parseFloat(productPrice).toFixed(2)}" class="price-input" data-original-price="${productPrice}" data-discount="${productDiscount}"></td>
        <td>R$<span class="total-price">${totalPrice}</span></td>
        <td><input type="number" value="${productDiscount}" class="discount-input"></td>
        <td>
            <button onclick="deleteProduct(this)">Delete</button>
        </td>
    `;

    productList.appendChild(row);
    productId++; // Incrementa o ID do produto

    // Limpa os campos do formulário
    document.getElementById('product-name').value = '';
    document.getElementById('product-quantity').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-discount').value = '';

    checkLowStock(row);
    updateAlert();
}


function deleteProduct(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    clearAlerts();
    updateAlert();
}

document.getElementById('product-list').addEventListener('input', updateValues);

function updateValues(event) {
    if (event.target.classList.contains('quantity-input') || 
        event.target.classList.contains('price-input') || 
        event.target.classList.contains('discount-input')) {

        const row = event.target.parentNode.parentNode;
        let quantity = parseFloat(row.querySelector('.quantity-input').value);
        let price = parseFloat(row.querySelector('.price-input').value);
        let discount = parseFloat(row.querySelector('.discount-input').value);

        let alertMessage = '';

        if (quantity < 0) {
            alertMessage += 'A quantidade não pode ser negativa. ';
            row.querySelector('.quantity-input').value = 0;
            quantity = 0; // Redefinir a quantidade para 0
        }

        if (price < 0) {
            alertMessage += 'O preço não pode ser negativo. ';
            row.querySelector('.price-input').value = 0;
            price = 0; // Redefinir o preço para 0
        }

        if (discount < 0) {
            alertMessage += 'O desconto não pode ser negativo. ';
            row.querySelector('.discount-input').value = 0;
            discount = 0;  // Redefinir o desconto para 0%
        }

        if (alertMessage !== '') {
            alert(alertMessage);
        }

        // Calcula o valor total com desconto
        const discountAmount = (price * discount) / 100;
        const discountedPrice = price - discountAmount;
        const totalPrice = (discountedPrice * quantity).toFixed(2);

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
        const discount = row.cells[5].textContent; // A porcentagem de desconto está na coluna 5
        const lowStock = quantity < 10 ? 'Sim' : 'Não';

        reportData.push({ productId, productName, quantity, price, totalPrice, discount, lowStock });
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
