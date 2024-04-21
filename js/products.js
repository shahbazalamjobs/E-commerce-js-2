document.addEventListener('DOMContentLoaded', function () {
    const productsContainer = document.querySelector('.products-container');
    const paginationContainer = document.querySelector('.pagination-container');
    const categoryFilter = document.getElementById('category-filter');
    const clearCartBtn = document.getElementById('clear-cart');
    
    let currentPage = 1;
    const productsPerPage = 6;
    const cartKey = 'cartItems'; // Key for storing cart items in local storage

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

    function displayProducts(products) {
        productsContainer.innerHTML = '';
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = Math.min(startIndex + productsPerPage, products.length);
        const currentProducts = products.slice(startIndex, endIndex);
        createProductCards(currentProducts);
    }

    function createProductCards(products) {
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            const productContent = document.createElement('div');
            productContent.classList.add('product-content');

            // Product image
            const img = document.createElement('img');
            img.src = product.image;
            img.alt = product.title;
            productContent.appendChild(img);

            // Product title
            const title = document.createElement('h2');
            title.textContent = product.title.length > 25 ? product.title.slice(0, 25) + "..." : product.title;
            productContent.appendChild(title);

            // Product category
            const category = document.createElement('p');
            category.textContent = `Category: ${product.category}`;
            productContent.appendChild(category);

            // Product price
            const price = document.createElement('p');
            price.textContent = `$${product.price}`;
            price.classList.add('price');
            productContent.appendChild(price);

            // Button Container
            const buttonContainer = document.createElement('div')

            // Add to Cart button
            const addToCartBtn = document.createElement('button');
            addToCartBtn.textContent = 'Add to Cart';
            addToCartBtn.addEventListener('click', function () {
                addToCart(product.id);
            });
            buttonContainer.appendChild(addToCartBtn);
            buttonContainer.classList.add('button-container');

            // Check button
            const checkBtn = document.createElement('button');
            checkBtn.classList.add('check-btn');
            checkBtn.textContent = 'Check';
            checkBtn.addEventListener('click', function () {
                localStorage.setItem('checkedProductId', product.id);
                console.log(`Product ${product.id} ID stored in local storage.`);
                window.location.href = 'product-detail.html';
            });

            buttonContainer.appendChild(checkBtn);
            productCard.appendChild(productContent);
            productCard.appendChild(buttonContainer);
            productsContainer.appendChild(productCard);
        });
    }

    function updatePaginationButtons(products) {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(products.length / productsPerPage);

        const prevButton = createPaginationButton('Prev', () => {
            if (currentPage > 1) {
                currentPage--;
                fetchAndDisplayProducts();
            }
        });
        paginationContainer.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const pageNumberButton = createPaginationButton(i, () => {
                currentPage = i;
                fetchAndDisplayProducts();
            });
            paginationContainer.appendChild(pageNumberButton);
        }

        const nextButton = createPaginationButton('Next', () => {
            if (currentPage < totalPages) {
                currentPage++;
                fetchAndDisplayProducts();
            }
        });
        paginationContainer.appendChild(nextButton);
    }

    function createPaginationButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', onClick);
        return button;
    }

    async function fetchAndDisplayProducts() {
        try {
            const products = await fetchProducts();
            console.log(products)
            displayProducts(products);
            updatePaginationButtons(products);
        } catch (error) {
            console.error('Error fetching and displaying products:', error);
        }
    }

    async function initialize() {
        try {
            await fetchAndDisplayProducts();
            populateCategoryFilter(await fetchProducts());
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    initialize();

    function addToCart(productId) {
        try {
            let cartItems = JSON.parse(localStorage.getItem(cartKey)) || {};

            if (cartItems[productId]) {
                cartItems[productId]++;
            } else {
                cartItems[productId] = 1;
            }

            localStorage.setItem(cartKey, JSON.stringify(cartItems));

            console.log(`Product with ID ${productId} added to cart. Total items in cart:`, cartItems);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    }

    function clearCart() {
        localStorage.removeItem(cartKey);
        console.log('Cart cleared.');
    }

    clearCartBtn.addEventListener('click', clearCart);

    function populateCategoryFilter(products) {
        const categories = ['all', ...new Set(products.map(product => product.category))];
        categoryFilter.innerHTML = '';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categoryFilter.appendChild(option);
        });
    }

    categoryFilter.addEventListener('change', async () => {
        const selectedCategory = categoryFilter.value;
        const products = await fetchProducts();
        const filteredProducts = selectedCategory === 'all' ? products : products.filter(product => product.category === selectedCategory);
        displayProducts(filteredProducts);
        updatePaginationButtons(filteredProducts);
    });
});
