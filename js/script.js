import accordionData from './js/data.js'; 

document.addEventListener('DOMContentLoaded', async function () {
    const accordion = document.querySelector('.accordion');

    if (accordion) {
        accordionData.forEach((itemData, index) => {
            const accordionItem = document.createElement('div');
            accordionItem.classList.add('accordion-item');

            const accordionTitle = document.createElement('h3');
            accordionTitle.classList.add('accordion-title');
            accordionTitle.textContent = itemData.title;

            
            const toggleIcon = document.createElement('span');
            toggleIcon.classList.add('toggle-icon');
            toggleIcon.textContent = '+';

            accordionTitle.appendChild(toggleIcon);
            accordionItem.appendChild(accordionTitle);

            const accordionContent = document.createElement('div');
            accordionContent.classList.add('accordion-content');
            accordionContent.innerHTML = `<p>${itemData.content}</p>`;

            accordionItem.appendChild(accordionContent);
            accordion.appendChild(accordionItem);

            accordionItem.addEventListener('click', function () {
                const isOpen = this.classList.contains('open');

                accordion.querySelectorAll('.accordion-item').forEach(item => {
                    item.classList.remove('open');
                    item.querySelector('.toggle-icon').innerText = '+';
                    item.querySelector('.accordion-content').style.display = 'none';
                });

                if (!isOpen) {
                    this.classList.add('open');
                    this.querySelector('.toggle-icon').innerText = '-';
                    this.querySelector('.accordion-content').style.display = 'block';
                }
            });
        });
    }

    try {
        const categories = await fetchCategories();
        const categoriesCapitalized = categories.map(category => category.charAt(0).toUpperCase() + category.slice(1).toLowerCase());
        createCategoryCards(categoriesCapitalized);
    } catch (error) {
        console.error('Error initializing:', error);
    }
});

// Fetch categories from the API
async function fetchCategories() {
    try {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

// Function to create category cards
function createCategoryCards(categories) {
    const categoryContainer = document.getElementById('category-container');

    categories.forEach(category => {
        const card = document.createElement('div');
        card.classList.add('category-card');
        card.textContent = category;
        categoryContainer.appendChild(card);
    });
}