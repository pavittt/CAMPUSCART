const stores = {
    Balaji: {
        categories: {
            Stationery: [
                { name: "Notebook", price: 50 },
                { name: "Pen", price: 10 },
                { name: "Pencil", price: 5 }
            ],
            Snacks: [
                { name: "Chips", price: 30 },
                { name: "Cookies", price: 25 }
            ],
            Beverages: [
                { name: "Water", price: 20 },
                { name: "Juice", price: 40 }
            ]
        }
    },
    Enzo: {
        categories: {
            Snacks: [
                { name: "Chips", price: 30 },
                { name: "Cookies", price: 25 }
            ],
            Beverages: [
                { name: "Water", price: 20 },
                { name: "Juice", price: 40 }
            ],
            "Daily Essentials": [
                { name: "Toothpaste", price: 60 },
                { name: "Shampoo", price: 120 }
            ]
        }
    }
};

let currentStore = null;
let currentCategory = null;
let cart = [];
let total = 0;
let productCounts = {};
let currentToken = 1000; // Starting token number

function selectStore(store) {
    if (cart.length > 0 && cart[0].store !== store) {
        alert("You cannot add products from a different store. Complete your current order first.");
        return;
    }
    currentStore = store;
    document.getElementById("store-selection").classList.add("hidden");
    document.getElementById("category-selection").classList.remove("hidden");
    document.getElementById("store-name").textContent = store;
    loadCategories(store);
}

function loadCategories(store) {
    const categoriesDiv = document.getElementById("categories");
    categoriesDiv.innerHTML = "";
    const categories = Object.keys(stores[store].categories);
    categories.forEach(category => {
        const btn = document.createElement("button");
        btn.textContent = category;
        btn.classList.add("category-btn");
        btn.onclick = () => selectCategory(category);
        categoriesDiv.appendChild(btn);
    });
}

function selectCategory(category) {
    currentCategory = category;
    document.getElementById("category-selection").classList.add("hidden");
    document.getElementById("product-selection").classList.remove("hidden");
    document.getElementById("category-name").textContent = category;
    loadProducts(category);
}

function loadProducts(category) {
    const productsDiv = document.getElementById("products");
    productsDiv.innerHTML = "";
    const products = stores[currentStore].categories[category];
    products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        if (!productCounts[product.name]) {
            productCounts[product.name] = 0;
        }

        productDiv.innerHTML = `
            <span>${product.name} - ₹${product.price}</span>
            <div class="product-controls">
                <button onclick="decrementCount('${product.name}', ${product.price})">-</button>
                <span id="count-${product.name}">${productCounts[product.name]}</span>
                <button onclick="incrementCount('${product.name}', ${product.price})">+</button>
            </div>
        `;
        productsDiv.appendChild(productDiv);
    });
}

function incrementCount(productName, productPrice) {
    productCounts[productName]++;
    document.getElementById(`count-${productName}`).textContent = productCounts[productName];
    addToCart(productName, productPrice);
}

function decrementCount(productName, productPrice) {
    if (productCounts[productName] > 0) {
        productCounts[productName]--;
        document.getElementById(`count-${productName}`).textContent = productCounts[productName];
        removeFromCart(productName, productPrice);
    }
}

function addToCart(productName, productPrice) {
    total += productPrice;
    cart.push({ name: productName, price: productPrice, store: currentStore });
}

function removeFromCart(productName, productPrice) {
    const index = cart.findIndex(item => item.name === productName && item.price === productPrice);
    if (index > -1) {
        cart.splice(index, 1);
        total -= productPrice;
    }
}

function goBackToStore() {
    document.getElementById("category-selection").classList.add("hidden");
    document.getElementById("store-selection").classList.remove("hidden");
}

function goBackToCategories() {
    document.getElementById("product-selection").classList.add("hidden");
    document.getElementById("category-selection").classList.remove("hidden");
}

function viewCart() {
    document.getElementById("cart").classList.remove("hidden");
    document.getElementById("category-selection").classList.add("hidden");
    document.getElementById("product-selection").classList.add("hidden");

    const cartItemsDiv = document.getElementById("cart-items");
    cartItemsDiv.innerHTML = "";
    cart.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");
        itemDiv.innerHTML = `<span>${item.name} - ₹${item.price}</span>`;
        cartItemsDiv.appendChild(itemDiv);
    });

    document.getElementById("total-price").textContent = total;
}

function processPayment() {
    // Increment the current token first
    currentToken++;

    // Assign the new token number to the user
    const userToken = currentToken;

    document.getElementById("cart").classList.add("hidden");
    document.getElementById("confirmation").classList.remove("hidden");
    document.getElementById("token-number").textContent = userToken;
    document.getElementById("current-token-number").textContent = userToken - 1; // Display the previous token number
    document.getElementById("chosen-store").textContent = currentStore;

    // Clear the cart and reset values
    cart = [];
    total = 0;
    productCounts = {};
}


