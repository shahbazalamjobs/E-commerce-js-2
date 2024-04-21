document.addEventListener('DOMContentLoaded', function () {
    // Retrieve product ID from local storage
    const productId = localStorage.getItem('checkedProductId');

    // Check if product ID exists
    if (productId) {
        fetchProductDetails(productId);
    } else {
        console.error('Product ID not found in local storage.');
    }

    // Add event listener to a parent element and delegate to the "Add to Cart" button
    document.addEventListener('click', function (event) {
        if (event.target && event.target.classList.contains('add-to-cart-button')) {
            addToCart(productId);
        }

        if (event.target && event.target.classList.contains('buy-now')) {
            window.location.href = 'cart.html';
        }

        // Show modal when clicking on the product image
        if (event.target && event.target.classList.contains('product-image')) {
            const modal = document.getElementById('imageModal');
            modal.style.display = "block";

            const modalImg = document.getElementById("img01");
            modalImg.src = event.target.src;

            const span = document.getElementsByClassName("close")[0];
            span.onclick = function () {
                modal.style.display = "none";
            }
        }

        // Clear cart when clicking on the "Clear Cart" link
        if (event.target && event.target.id === 'clear-storage-link') {
            clearCart();
        }
    });

    async function fetchProductDetails(productId) {
        try {
            const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch product details');
            }
            const product = await response.json();
            console.log(product);
            displayProductDetails(product);
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    }

    function displayProductDetails(product) {
        const productDetailContainer = document.querySelector('.product-detail');
        const productId = localStorage.getItem('checkedProductId');

        // Retrieve cart items from local storage
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};

        // Get the count of the current product in the cart
        const cartTotal = cartItems[productId] || 0;

        // Check if the product has a rating property
        const ratingHtml = product.rating ? generateStarRating(product.rating) : '';

        productDetailContainer.innerHTML = `
            <div class="product-detail-main">
                <div class="image">
                    <img class="product-image" src="${product.image}" alt="${product.title}">
                </div>
                <div class="content">
                    <h2>${product.title}</h2>
                    <p>Category: ${product.category}</p>
                    <p class="price">Price: $${product.price}</p>
                    <button class="add-to-cart-button">Add to Cart</button>
                    <span class="cart-total">${cartTotal}</span>
                    <button class="buy-now">Buy Now</button>   
                    <p>Description: ${product.description}</p>
                </div>
                </div> 
                    ${ratingHtml} <!-- Display the rating -->
                <div> 
            </div>
            `;
    }


    function generateStarRating(rating) {
        const starsTotal = 5;
        const starPercentage = (rating.rate / starsTotal) * 100;
        const starPercentageRounded = `${Math.floor(starPercentage / 20) * 20}%`;
        
        // Create a wrapper div for the star rating
        const starRatingHtml = document.createElement('div');
        starRatingHtml.className = 'star-rating';
    
        // Create an inner div to hold the stars
        const starsInnerHtml = document.createElement('div');
        starsInnerHtml.className = 'stars-inner';
        starsInnerHtml.style.width = starPercentageRounded;
    
        // Create 5 individual stars
        for (let i = 0; i < starsTotal; i++) {
            const starHtml = document.createElement('i');
            starHtml.className = 'fas fa-star';
            starsInnerHtml.appendChild(starHtml);
        }
    
        // Append the inner stars to the wrapper div
        starRatingHtml.appendChild(starsInnerHtml);
    
        // Return the HTML of the star rating
        return starRatingHtml.outerHTML;
    }
    
    

    function addToCart(productId) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};

        if (cartItems[productId]) {
            cartItems[productId]++;
        } else {
            cartItems[productId] = 1;
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        // Update the displayed cart total
        const cartTotalSpan = document.querySelector('.cart-total');
        if (cartTotalSpan) {
            cartTotalSpan.textContent = cartItems[productId];
        }

        console.log(`Product with ID ${productId} added to cart. Total items in cart:`, cartItems);
    }

    function clearCart() {
        localStorage.removeItem('cartItems');
        console.log('Cart cleared.');
    }
});
