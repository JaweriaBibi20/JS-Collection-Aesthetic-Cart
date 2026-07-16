// --- DOM Selectors ---
const cartToggle = document.getElementById('cart-toggle');
const cartClose = document.getElementById('cart-close');
const cartSidebar = document.getElementById('cart-sidebar');
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const toastContainer = document.getElementById('toast-container');

// Filter & Grid Selectors
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

// Promo Elements
const promoInput = document.getElementById('promo-input');
const promoApply = document.getElementById('promo-apply');
const discountMsg = document.getElementById('discount-msg');

// Cart State Management
let cart = [];
let discountApplied = false;

// --- 1. Toggle Sidebar ---
cartToggle.addEventListener('click', () => cartSidebar.classList.add('open'));
cartClose.addEventListener('click', () => cartSidebar.classList.remove('open'));

// --- 2. Interactive Category Filter ---
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Toggle Active States
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        // Show / Hide Products
        productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (filterValue === 'all' || cardCategory === filterValue) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// --- 3. Add Item To Cart ---
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));

        addItemToCart(id, name, price);
        showToast(`✨ ${name} added to your collection!`);
    });
});

function addItemToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    updateCartUI();
}

// --- 4. Remove Item ---
function removeItemFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

// --- 5. Promo Code Application (20% off with Code: JS20) ---
promoApply.addEventListener('click', () => {
    const code = promoInput.value.trim().toUpperCase();
    if (code === 'JS20') {
        discountApplied = true;
        discountMsg.textContent = 'Discount applied: 20% OFF! 🎉';
        discountMsg.style.color = '#2bcbba';
    } else {
        discountApplied = false;
        discountMsg.textContent = 'Invalid promo code';
        discountMsg.style.color = '#ef4444';
    }
    updateCartUI();
});

// --- 6. Update User Interface & Calculations ---
function updateCartUI() {
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-message">Your cart is empty.</p>';
        cartCount.textContent = '0';
        cartTotal.textContent = '$0.00';
        return;
    }

    let totalBill = 0;
    let totalItemsCount = 0;

    cart.forEach(item => {
        totalBill += item.price * item.quantity;
        totalItemsCount += item.quantity;

        const itemHTML = `
            <div class="cart-item">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <button class="remove-item-btn" onclick="removeItemFromCart('${item.id}')">Remove</button>
            </div>
        `;
        cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
    });

    // Apply Promo Discount if applicable
    if (discountApplied) {
        totalBill = totalBill * 0.8; // Apply 20% discount
    }

    cartCount.textContent = totalItemsCount;
    cartTotal.textContent = `$${totalBill.toFixed(2)}`;
}

// --- 7. Toast Notification Handler ---
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = message;
    toastContainer.appendChild(toast);

    // Auto cleanup Toast element after animation completes
    setTimeout(() => {
        toast.remove();
    }, 2800);
}

// Global scope mapping
window.removeItemFromCart = removeItemFromCart;