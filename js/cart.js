document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const subtotalCostElement = document.getElementById('subtotal-cost');
    const totalItemsElement = document.getElementById('total-items');
    const totalCostElement = document.getElementById('total-cost');
    const subtotalRow = document.getElementById('subtotal-row');
    const cartKey = 'cartItems'; // Key for storing cart items in local storage

    // Function to calculate total items and total cost
    function calculateTotal(cartItems, products) {
        let totalItems = 0;
        let totalCost = 0;

        for (const productId in cartItems) {
            if (cartItems.hasOwnProperty(productId)) {
                const quantity = cartItems[productId];
                const product = products.find(product => product.id === parseInt(productId));

                if (product) {
                    totalItems += quantity;
                    totalCost += quantity * product.price;
                }
            }
        }

        return { totalItems, totalCost };
    }

    // Function to display cart items
    function displayCartItems(cartItems, products) {
        cartItemsContainer.innerHTML = '';

        for (const productId in cartItems) {
            if (cartItems.hasOwnProperty(productId)) {
                const quantity = cartItems[productId];
                const product = products.find(product => product.id === parseInt(productId));

                if (product) {
                    const cartItemElement = document.createElement('div');
                    cartItemElement.classList.add('cart-item');

                    cartItemElement.innerHTML = `
                        <div class="product-info">
                            <img src="${product.image}" alt="${product.title}">
                            <div>
                                <h2>${product.title}</h2>
                                <p>Quantity: <span class="quantity">${quantity}</span></p>
                                <p>Price: $${product.price}</p>
                            </div>
                        </div>
                        <div class="button-container">
                            <button class="increase-quantity" data-product-id="${productId}">+</button>
                            <button class="decrease-quantity" data-product-id="${productId}">-</button>
                            <button class="remove-product" data-product-id="${productId}">Remove</button>
                        </div>
                        <div class="total-price">
                            <p>Total: $${quantity * product.price}</p>
                        </div>
                    `;

                    cartItemsContainer.appendChild(cartItemElement);
                }
            }
        }

        const { totalItems, totalCost } = calculateTotal(cartItems, products);

        totalItemsElement.textContent = `Total Items: ${totalItems}`;
        totalCostElement.textContent = `Total Cost: $${totalCost}`;

        // Calculate and display subtotal
        subtotalCostElement.textContent = `$${totalCost}`;
    }

    // Function to fetch products from the API
    async function fetchProducts() {
        try {
            const response = await fetch('https://fakestoreapi.com/products');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    // Function to retrieve cart items from local storage
    function getCartItems() {
        return JSON.parse(localStorage.getItem(cartKey)) || {};
    }

    // Function to update cart items in local storage
    function updateCartItems(cartItems) {
        localStorage.setItem(cartKey, JSON.stringify(cartItems));
    }

    // Initialize the cart page
    async function initializeCart() {
        const cartItems = getCartItems();
        const products = await fetchProducts();

        displayCartItems(cartItems, products);

        // Event listeners for increasing, decreasing, and removing products
        cartItemsContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains('increase-quantity')) {
                const productId = event.target.getAttribute('data-product-id');
                cartItems[productId]++;
                updateCartItems(cartItems);
                displayCartItems(cartItems, products);
            } else if (event.target.classList.contains('decrease-quantity')) {
                const productId = event.target.getAttribute('data-product-id');
                if (cartItems[productId] > 1) {
                    cartItems[productId]--;
                    updateCartItems(cartItems);
                    displayCartItems(cartItems, products);
                }
            } else if (event.target.classList.contains('remove-product')) {
                const productId = event.target.getAttribute('data-product-id');
                delete cartItems[productId];
                updateCartItems(cartItems);
                displayCartItems(cartItems, products);
            }
        });
    }

    initializeCart();
});
