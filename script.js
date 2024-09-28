
const products = [
    { id: 1, name: "Hamburguesa de Pollo", price: 16000, image: "https://images.unsplash.com/photo-1615297928064-24977384d0da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80", category: "Burger" },
    { id: 2, name: "Pollo Broaster", price: 43000, image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80", category: "Pollo" },
    { id: 3, name: "Agua Mineral", price: 3000, image: "https://tinyurl.com/255wgl6v", category: "Bebidas" },
    { id: 5, name: "Papitas Fritas", price: 5000, image: "https://tinyurl.com/25egzljn", category: "Extras" },
    { id: 6, name: "Cocacola 2 lts", price: 5500, image: "https://www.icnorte.com/arquivos/ids/156073-300-300/Gaseosa-sabor-Original-Coca-Cola-2-Lts-2-357.jpg?v=637345691863600000", category: "Bebidas" },
    { id: 8, name: "Pollo Asado entero", price: 34000, image: "https://tinyurl.com/26obth6n", category: "Pollo" },
    { id: 9, name: "Ración de Yuca", price: 3500, image: "https://tinyurl.com/28o3tc53", category: "Extras" },
    { id: 10, name: "Doble Jamón y Queso", price: 30000, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80", category: "Pizza" },
    { id: 11, name: "Doble Queso", price: 35000, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",  category: "Pizza" },
    { id: 12, name: "4 Estaciones", price: 30000, image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80", category: "Pizza" },
    { id: 13, name: "Combo Doble", price: 38000, image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80", category: "Pizza" },
    { id: 14, name: "Charcutera", price: 30000, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80", category: "Pizza" },
];

const cart = {};
let total = 0;
let ticketNumber = 1000;
let salesHistory = [];
let paymentMethodTotals = {
    "Tarjeta de débito": 0,
    "Pago Móvil": 0,
    "Punto de Venta": 0,
    "Efectivo": 0,
    "Exento de pago": 0
};

const itemsPerPage = 8;
let currentPage = 1;
let selectedPaymentMethod = null;

function displayProducts(productsToShow = products, page = 1) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = productsToShow.slice(startIndex, endIndex);

    paginatedProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "col";
        productCard.innerHTML = `
            <div class="card product-card" onclick="addToCart(${product.id})">
                <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">$${product.price.toFixed(2)}</p>
                </div>
            </div>
        `;
        productList.appendChild(productCard);
    });

    updatePagination(productsToShow.length, page);
}

function updatePagination(totalItems, currentPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
        paginationElement.appendChild(li);
    }
}

function changePage(page) {
    currentPage = page;
    const activeCategory = document.querySelector('.category-button.active');
    const category = activeCategory ? activeCategory.dataset.category : '';
    const filteredProducts = category ? products.filter(p => p.category === category) : products;
    displayProducts(filteredProducts, page);
}

function filterProducts(category = '') {
    const filteredProducts = category ? products.filter(p => p.category === category) : products;
    currentPage = 1;
    displayProducts(filteredProducts, currentPage);
    updateCategoryButtons(category);
}

function updateCategoryButtons(activeCategory) {
    const buttons = document.querySelectorAll('.category-button');
    buttons.forEach(button => {
        if (button.dataset.category === activeCategory) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (cart[productId]) {
        cart[productId].quantity++;
    } else {
        cart[productId] = { ...product, quantity: 1 };
    }
    updateCart();
    showConfirmation();
}

function showConfirmation() {
    const confirmationModal = document.getElementById('confirmationModal');
    confirmationModal.style.display = 'block';
    setTimeout(() => {
        confirmationModal.style.display = 'none';
    }, 2000);
}

function removeFromCart(productId) {
    if (cart[productId]) {
        if (cart[productId].quantity > 1) {
            cart[productId].quantity--;
        } else {
            delete cart[productId];
        }
        updateCart();
    }
}

function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartItemCount = document.getElementById("cartItemCount");
    cartItems.innerHTML = "";
    total = 0;
    let itemCount = 0;

    for (const productId in cart) {
        const item = cart[productId];
        const subtotal = item.price * item.quantity;
        total += subtotal;
        itemCount += item.quantity;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${subtotal.toFixed(2)}</td>
            <td><span class="remove-item" onclick="removeFromCart(${productId})">❌</span></td>
        `;
        cartItems.appendChild(row);
    }

    cartTotal.textContent = total.toFixed(2);
    cartItemCount.textContent = itemCount;
    updateCartDate();
}

function updateCartDate() {
    const cartDate = document.getElementById("cart-date");
    const now = new Date();
    cartDate.textContent = now.toLocaleString();
}

function showCart() {
    updateCart();
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    cartModal.show();
    updatePaymentMethodButtons();
    initializePaymentMethodButtons();
}

function acceptPurchase() {
    if (Object.keys(cart).length === 0) {
        alert("El carrito está vacío. Agregue productos antes de finalizar la compra.");
        return;
    }
    if (!selectedPaymentMethod) {
        alert("Por favor, seleccione un método de pago antes de finalizar la compra.");
        return;
    }
    finalizePurchase();
}

function finalizePurchase() {
    const receiptContent = document.getElementById("receiptContent");
    const now = new Date();
    ticketNumber++;

    let receiptHTML = `
        <h6>Ticket #${ticketNumber}</h6>
        <p>Fecha: ${now.toLocaleString()}</p>
        <p>Forma de Pago: ${selectedPaymentMethod}</p>
        <hr>
        <table class="table table-sm">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cant.</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (const productId in cart) {
        const item = cart[productId];
        const subtotal = item.price * item.quantity;
        receiptHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${subtotal.toFixed(2)}</td>
            </tr>
        `;

        // Agregar a la historia de ventas
        salesHistory.push({
            date: now,
            ticketNumber: ticketNumber,
            productName: item.name,
            quantity: item.quantity,
            price: item.price,
            subtotal: subtotal,
            paymentMethod: selectedPaymentMethod
        });
    }

    receiptHTML += `
            </tbody>
        </table>
        <hr>
        <p class="text-end"><strong>Total: $${total.toFixed(2)}</strong></p>
    `;

    receiptContent.innerHTML = receiptHTML;

    // Actualizar totales de formas de pago
    paymentMethodTotals[selectedPaymentMethod] += total;

    const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    cartModal.hide();

    const receiptModal = new bootstrap.Modal(document.getElementById('receiptModal'));
    receiptModal.show();

    // Limpiar el carrito después de finalizar la compra
    Object.keys(cart).forEach(key => delete cart[key]);
    updateCart();
    selectedPaymentMethod = null;
    updatePaymentMethodButtons();
}

function printReceipt() {
    const receiptContent = document.getElementById("receiptContent").innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Recibo de Compra</title>');
    printWindow.document.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">');
    printWindow.document.write('<style>@media print { body { width: 57mm; } }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Broaster1-JNLLDnamafP3kGLc111K3gvd24XMVK.jpg" alt="Terreno Broaster Logo" style="width: 100%; max-width: 200px;">');
    printWindow.document.write(receiptContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

function showHome() {
    const mainContent = document.getElementById("mainContent");
    mainContent.innerHTML = `
        <div class="row">
            <div class="col-md-12">
                <h2>Menú</h2>
                <div class="mb-3">
                    <div id="categoryButtons" class="d-flex flex-wrap justify-content-center">
                        <button class="category-button active" data-category="">
                            <i class="fas fa-utensils"></i>
                            <span>Todas</span>
                        </button>
                        <button class="category-button" data-category="Burger">
                            <i class="fas fa-hamburger"></i>
                            <span>Hamburguesas</span>
                        </button>
                        <button class="category-button" data-category="Pollo">
                            <i class="fas fa-drumstick-bite"></i>
                            <span>Pollo</span>
                        </button>
                        <button class="category-button" data-category="Bebidas">
                            <i class="fas fa-glass-cheers"></i>
                            <span>Bebidas</span>
                        </button>
                        <button class="category-button" data-category="Extras">
                            <i class="fas fa-pepper-hot"></i>
                            <span>Extras</span>
                        </button>
                        <button class="category-button" data-category="Pizza">
                            <i class="fas fa-pizza-slice"></i>
                            <span>Pizza</span>
                        </button>
                    </div>
                </div>
                <div id="product-list" class="row row-cols-1 row-cols-md-4 g-4"></div>
                <nav aria-label="Product pagination">
                    <ul class="pagination" id="pagination"></ul>
                </nav>
            </div>
        </div>
    `;
    displayProducts();
    initializeProductCarousel();
    initializeCategoryButtons();
}

function showProductSales() {
    const mainContent = document.getElementById("mainContent");
    let salesHTML = `
        <h2>Historial de Ventas por Productos</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Número de Ticket</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
    `;

    let totalSales = 0;
    salesHistory.forEach(sale => {
        salesHTML += `
            <tr>
                <td>${sale.date.toLocaleString()}</td>
                <td>${sale.ticketNumber}</td>
                <td>${sale.productName}</td>
                <td>${sale.quantity}</td>
                <td>$${sale.price.toFixed(2)}</td>
                <td>$${sale.subtotal.toFixed(2)}</td>
            </tr>
        `;
        totalSales += sale.subtotal;
    });

    salesHTML += `
            </tbody>
        </table>
        <h3>Total de Ventas: $${totalSales.toFixed(2)}</h3>
    `;

    mainContent.innerHTML = salesHTML;
}

function showPaymentMethods() {
    const mainContent = document.getElementById("mainContent");
    let paymentMethodsHTML = `
        <h2>Ventas por Forma de Pago</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>Forma de Pago</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (const method in paymentMethodTotals) {
        paymentMethodsHTML += `
            <tr>
                <td>${method}</td>
                <td>$${paymentMethodTotals[method].toFixed(2)}</td>
            </tr>
        `;
    }

    paymentMethodsHTML += `
            </tbody>
        </table>
    `;

    mainContent.innerHTML = paymentMethodsHTML;
}

function showDailySales() {
    const mainContent = document.getElementById("mainContent");
    const today = new Date().toDateString();
    let dailySales = 0;

    salesHistory.forEach(sale => {
        if (sale.date.toDateString() === today) {
            dailySales += sale.subtotal;
        }
    });

    mainContent.innerHTML = `
        <h2>Ventas Totales del Día</h2>
        <h3>Fecha: ${today}</h3>
        <h4>Total: $${dailySales.toFixed(2)}</h4>
    `;
}

function showTopSellingProducts() {
    const mainContent = document.getElementById("mainContent");
    const productSales = {};

    salesHistory.forEach(sale => {
        if (productSales[sale.productName]) {
            productSales[sale.productName].quantity += sale.quantity;
            productSales[sale.productName].total += sale.subtotal;
        } else {
            productSales[sale.productName] = {
                quantity: sale.quantity,
                total: sale.subtotal
            };
        }
    });

    const sortedProducts = Object.entries(productSales).sort((a, b) => b[1].quantity - a[1].quantity);

    let topProductsHTML = `
        <h2>Productos Más Vendidos</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad Vendida</th>
                    <th>Total Vendido</th>
                </tr>
            </thead>
            <tbody>
    `;

    sortedProducts.forEach(([productName, data]) => {
        topProductsHTML += `
            <tr>
                <td>${productName}</td>
                <td>${data.quantity}</td>
                <td>$${data.total.toFixed(2)}</td>
            </tr>
        `;
    });

    topProductsHTML += `
            </tbody>
        </table>
    `;

    mainContent.innerHTML = topProductsHTML;
}

function showSalesByPaymentMethod() {
    const mainContent = document.getElementById("mainContent");
    let salesByMethodHTML = `
        <h2>Ventas por Forma de Pago</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>Forma de Pago</th>
                    <th>Total Vendido</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (const method in paymentMethodTotals) {
        salesByMethodHTML += `
            <tr>
                <td>${method}</td>
                <td>$${paymentMethodTotals[method].toFixed(2)}</td>
            </tr>
        `;
    }

    salesByMethodHTML += `
            </tbody>
        </table>
    `;

    mainContent.innerHTML = salesByMethodHTML;
}

function showExportOptions() {
    const mainContent = document.getElementById("mainContent");
    mainContent.innerHTML = `
        <h2>Exportar Datos</h2>
        <div class="d-flex justify-content-center mt-4">
            <button class="btn btn-primary me-3" onclick="exportToCSV()">Exportar a CSV</button>
            <button class="btn btn-success" onclick="exportToExcelXML()">Exportar a Excel XML</button>
        </div>
    `;
}

function exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Fecha,Número de Ticket,Producto,Cantidad,Precio,Subtotal,Forma de Pago\n";

    salesHistory.forEach(sale => {
        let row = `${sale.date.toLocaleString()},${sale.ticketNumber},${sale.productName},${sale.quantity},${sale.price},${sale.subtotal},${sale.paymentMethod}`;
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ventas_terreno_broaster.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportToExcelXML() {
    let xmlContent = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>';
    xmlContent += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">';
    xmlContent += '<Worksheet ss:Name="Ventas"><Table>';

    // Encabezados
    xmlContent += '<Row>';
    ['Fecha', 'Número de Ticket', 'Producto', 'Cantidad', 'Precio', 'Subtotal', 'Forma de Pago'].forEach(header => {
        xmlContent += `<Cell><Data ss:Type="String">${header}</Data></Cell>`;
    });
    xmlContent += '</Row>';

    // Datos
    salesHistory.forEach(sale => {
        xmlContent += '<Row>';
        [
            sale.date.toLocaleString(),
            sale.ticketNumber,
            sale.productName,
            sale.quantity,
            sale.price,
            sale.subtotal,
            sale.paymentMethod
        ].forEach(value => {
            xmlContent += `<Cell><Data ss:Type="String">${value}</Data></Cell>`;
        });
        xmlContent += '</Row>';
    });

    xmlContent += '</Table></Worksheet></Workbook>';

    const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'ventas_terreno_broaster.xls';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exitApplication() {
    if (confirm("¿Estás seguro de que quieres salir de la aplicación?")) {
        window.close();
    }
}

function initializeProductCarousel() {
    const carousel = $('#productCarousel');
    carousel.empty();
    products.forEach(product => {
        carousel.append(`
            <div class="item">
                <img src="${product.image}" alt="${product.name}" onclick="addToCart(${product.id})">
            </div>
        `);
    });
    carousel.owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        responsive: {
            0: {
                items: 3
            },
            600: {
                items: 5
            },
            1000: {
                items: 7
            }
        }
    });
}

function initializeCategoryButtons() {
    const categoryButtons = document.querySelectorAll('.category-button');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            filterProducts(category);
        });
    });
}

function initializePaymentMethodButtons() {
    const paymentMethodButtons = document.querySelectorAll('.payment-method-button');
    paymentMethodButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedPaymentMethod = button.dataset.paymentMethod;
            updatePaymentMethodButtons();
            showPaymentConfirmation(selectedPaymentMethod);
        });
    });
}

function updatePaymentMethodButtons() {
    const buttons = document.querySelectorAll('.payment-method-button');
    buttons.forEach(button => {
        if (button.dataset.paymentMethod === selectedPaymentMethod) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function showPaymentConfirmation(paymentMethod) {
    const confirmationElement = document.getElementById('paymentConfirmation');
    const selectedMethodElement = document.getElementById('selectedPaymentMethod');
    selectedMethodElement.textContent = `Has seleccionado: ${paymentMethod}`;
    confirmationElement.style.display = 'block';
    setTimeout(() => {
        confirmationElement.style.display = 'none';
    }, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
    showHome();
    initializePaymentMethodButtons();
});