let currentStore = null;
let currentCart = [];
let totalPrice = 0;
let tokenCounter = 1;

const stores = {
  Enzo: {
    categories: {
      food: [
        { name: "Samosa", price: 15 },
        { name: "Garlic Bread", price: 50 },
        { name: "Sandwich", price: 40 }
      ],
      drinks: [
        { name: "Monster", price: 120 },
        { name: "Frooti", price: 20 },
        { name: "Ice Tea", price: 40 }
      ],
      essentials: [
        { name: "Perfume", price: 150 },
        { name: "Handwash", price: 50 },
        { name: "Shampoo", price: 80 }
      ]
    }
  },
  Balaji: {
    categories: {
      stationary: [
        { name: "Pen", price: 10 },
        { name: "Pencil", price: 5 },
        { name: "Calculator", price: 150 }
      ],
      beverages: [
        { name: "Coke", price: 40 },
        { name: "Pepsi", price: 40 },
        { name: "Redbull", price: 120 }
      ],
      snacks: [
        { name: "Lays", price: 20 },
        { name: "Bingo", price: 20 },
        { name: "Kurkure", price: 20 }
      ]
    }
  }
};

function selectStore(storeName) {
  if (currentStore && currentStore !== storeName && currentCart.length > 0) {
    alert('Each store must have its own bill. You can only add items from the same store.');
    return;
  }
  currentStore = storeName;
  document.getElementById("storeSelection").style.display = "none";
  document.getElementById("categories").style.display = "block";
  document.getElementById("storeName").innerText = `Selected Store: ${storeName}`;
  showCategories(storeName);
}

function showCategories(storeName) {
  const categorySelection = document.getElementById("categorySelection");
  categorySelection.innerHTML = '';

  const categories = stores[storeName].categories;
  for (let category in categories) {
    const btn = document.createElement("button");
    btn.classList.add('category-btn');
    btn.innerText = category;
    btn.onclick = () => showProducts(category);
    categorySelection.appendChild(btn);
  }
}

function showProducts(category) {
  document.getElementById("categories").style.display = "none";
  document.getElementById("products").style.display = "block";
  document.getElementById("categoryName").innerText = `Category: ${category}`;

  const productList = document.getElementById("productList");
  productList.innerHTML = '';

  const products = stores[currentStore].categories[category];
  products.forEach((product, index) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add('product-card');
    productDiv.innerHTML = `
      <img src="https://via.placeholder.com/100?text=${product.name}" alt="${product.name}">
      <p>${product.name} - ₹${product.price}</p>
      <button onclick="updateCart(${index}, '${category}', 1)">+</button>
      <span id="count-${index}-${category}">0</span>
      <button onclick="updateCart(${index}, '${category}', -1)">-</button>
    `;
    productList.appendChild(productDiv);
  });
}

function updateCart(index, category, count) {
  const product = stores[currentStore].categories[category][index];
  const productCount = document.getElementById(`count-${index}-${category}`);
  let currentCount = parseInt(productCount.innerText);
  currentCount += count;
  
  if (currentCount < 0) currentCount = 0;

  productCount.innerText = currentCount;

  if (count > 0) {
    currentCart.push(product);
    totalPrice += product.price;
  } else if (count < 0 && currentCart.includes(product)) {
    const idx = currentCart.indexOf(product);
    if (idx > -1) {
      currentCart.splice(idx, 1);
      totalPrice -= product.price;
    }
  }

  document.getElementById("totalPrice").innerText = totalPrice;
}

function goBackToCategories() {
  document.getElementById("products").style.display = "none";
  document.getElementById("categories").style.display = "block";
}

function goBackToStoreSelection() {
  document.getElementById("categories").style.display = "none";
  document.getElementById("storeSelection").style.display = "block";
  currentStore = null;
  currentCart = [];
  totalPrice = 0;
  document.getElementById("totalPrice").innerText = 0;
}

function goToCart() {
  if (currentCart.length === 0) {
    alert("Your cart is empty! Please add items before proceeding to checkout.");
    return;
  }
  document.getElementById("products").style.display = "none";
  document.getElementById("cart").style.display = "block";

  const cartItemsDiv = document.getElementById("cartItems");
  cartItemsDiv.innerHTML = '';
  currentCart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.innerText = `${item.name} - ₹${item.price}`;
    cartItemsDiv.appendChild(itemDiv);
  });

  document.getElementById("totalPrice").innerText = totalPrice;
}

function checkout() {
  document.getElementById("cart").style.display = "none";
  document.getElementById("checkout").style.display = "block";
  document.getElementById("tokenNumber").innerText = tokenCounter++;
}
