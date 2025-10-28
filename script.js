// Color names mapping
const colorNames = {
    "#000000": "Black",
    "#8F6453": "Bronze",
    "#dabca2": "Golden"
};

// All products data with categories
const allProducts = [
    // Decor products (1-4)
    { id: 1, title: "Product No. 1", price: 85.00, originalPrice: 99.00, image: "Assets/product-01-a-400x488.jpg", rating: 4.5, colors: ["#000000", "#8F6453", "#dabca2"], category: "decor" },
    { id: 2, title: "Product No. 2", price: 75.00, originalPrice: 89.00, image: "Assets/product-02-a-400x488.jpg", rating: 4.0, colors: ["#000000", "#8F6453", "#dabca2"], category: "decor" },
    { id: 3, title: "Product No. 3", price: 95.00, originalPrice: 110.00, image: "Assets/product-03-c-400x488.jpg", rating: 4.2, colors: ["#000000", "#8F6453", "#dabca2"], category: "decor" },
    { id: 4, title: "Product No. 4", price: 120.00, originalPrice: 140.00, image: "Assets/product-04-b-400x488.jpg", rating: 4.3, colors: ["#000000", "#8F6453", "#dabca2"], category: "decor" },
    
    // Office products (5-9)
    { id: 5, title: "Product No. 5", price: 185.00, originalPrice: 220.00, image: "Assets/product-05-a-400x488.jpg", rating: 4.5, colors: ["#000000", "#8F6453", "#dabca2"], category: "office" },
    { id: 6, title: "Product No. 6", price: 45.00, originalPrice: 55.00, image: "Assets/product-06-c-400x488.jpg", rating: 4.1, colors: ["#000000", "#8F6453", "#dabca2"], category: "office" },
    { id: 7, title: "Product No. 7", price: 165.00, originalPrice: 190.00, image: "Assets/product-07-b-400x488.jpg", rating: 4.7, colors: ["#000000", "#8F6453", "#dabca2"], category: "office" },
    { id: 8, title: "Product No. 8", price: 285.00, originalPrice: 320.00, image: "Assets/product-08-c-400x488.jpg", rating: 4.0, colors: ["#000000", "#8F6453", "#dabca2"], category: "office" },
    { id: 9, title: "Product No. 9", price: 225.00, originalPrice: 260.00, image: "Assets/product-09-b-400x488.jpg", rating: 4.2, colors: ["#000000", "#8F6453", "#dabca2"], category: "office" },
    
    // Living Room products (10-13)
    { id: 10, title: "Product No. 10", price: 485.00, originalPrice: 550.00, image: "Assets/product-10-c-400x488.jpg", rating: 4.2, colors: ["#000000", "#8F6453", "#dabca2"], category: "living_room" },
    { id: 11, title: "Product No. 11", price: 185.00, originalPrice: 210.00, image: "Assets/product-11-b-400x488.jpg", rating: 4.8, colors: ["#000000", "#8F6453", "#dabca2"], category: "living_room" },
    { id: 12, title: "Product No. 12", price: 145.00, originalPrice: 170.00, image: "Assets/product-12-a-400x488.jpg", rating: 4.3, colors: ["#000000", "#8F6453", "#dabca2"], category: "living_room" },
    { id: 13, title: "Product No. 13", price: 265.00, originalPrice: 295.00, image: "Assets/product-13-b-400x488.jpg", rating: 4.6, colors: ["#000000", "#8F6453", "#dabca2"], category: "living_room" },
    
    // Bedroom products (14-16)
    { id: 14, title: "Product No. 14", price: 385.00, originalPrice: 430.00, image: "Assets/product-14-b-400x488.jpg", rating: 4.4, colors: ["#000000", "#8F6453", "#dabca2"], category: "bedroom" },
    { id: 15, title: "Product No. 15", price: 125.00, originalPrice: 145.00, image: "Assets/product-15-a-400x488.jpg", rating: 4.1, colors: ["#000000", "#8F6453", "#dabca2"], category: "bedroom" },
    { id: 16, title: "Product No. 16", price: 485.00, originalPrice: 540.00, image: "Assets/product-16-a-400x488.jpg", rating: 4.7, colors: ["#000000", "#8F6453", "#dabca2"], category: "bedroom" }
];

// Get current page category
function getCurrentCategory() {
    const path = window.location.pathname;
    if (path.includes('decor.html')) return 'decor';
    if (path.includes('office.html')) return 'office';
    if (path.includes('living_room.html')) return 'living_room';
    if (path.includes('bedroom.html')) return 'bedroom';
    return 'all'; // For index.html or shop all
}

// Filter products based on current page
const products = getCurrentCategory() === 'all' 
    ? allProducts 
    : allProducts.filter(product => product.category === getCurrentCategory());

// Cart functionality
let cart = [];
let displayedProducts = 6;

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const loadingContainer = document.getElementById('loadingContainer');
const customSelect = document.getElementById('customSelect');
const cartBtn = document.getElementById('cartBtn') || document.querySelector('.cart-btn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const searchBtn = document.getElementById('searchBtn');
const searchOverlay = document.getElementById('searchOverlay');
const searchInput = document.getElementById('searchInput');
const searchClose = document.getElementById('searchClose');
const searchResults = document.getElementById('searchResults');

// Infinite scroll variables
let isLoading = false;
let hasMoreProducts = true;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
    updateCartUI();
    initCustomSelect();
    initInfiniteScroll();
    
    // Event listeners
    cartBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);
    searchBtn.addEventListener('click', openSearch);
    searchClose.addEventListener('click', closeSearch);
    searchInput.addEventListener('input', handleSearch);
    
    // Mobile menu toggle - works for all pages including main page
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarNav');
    const mainContent = document.querySelector('.main');
    
    if (navbarToggler && navbarCollapse) {
        navbarCollapse.addEventListener('shown.bs.collapse', function() {
            navbarToggler.classList.add('active');
            // Push main content down by menu height (only for non-main pages)
            if (mainContent) {
                const menuHeight = navbarCollapse.offsetHeight;
                mainContent.style.marginTop = (20 + menuHeight) + 'px';
                mainContent.style.transition = 'margin-top 0.3s ease';
            }
        });
        
        navbarCollapse.addEventListener('hidden.bs.collapse', function() {
            navbarToggler.classList.remove('active');
            // Restore original margin (only for non-main pages)
            if (mainContent) {
                mainContent.style.marginTop = '20px';
            }
        });
    }
    
    // Close search on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            closeSearch();
        }
    });
    

});

// Display products
function displayProducts(productsToShow = products.slice(0, displayedProducts)) {
    productsGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
    
    // Update hasMoreProducts flag
    hasMoreProducts = displayedProducts < products.length;
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const stars = generateStars(product.rating);
    
    card.innerHTML = `
        <div class="product-image">
            ${product.originalPrice ? '<div class="sale-badge">Sale!</div>' : ''}
            <img src="${product.image}" alt="${product.title}" loading="lazy">
            <div class="product-actions">
                <button class="action-btn" onclick="addToCart(${product.id})" 
                        onmouseover="showActionTooltip(this, 'Select options')" 
                        onmouseout="hideActionTooltip(this)">
                    <i class="fas fa-shopping-basket"></i>
                </button>
                <button class="action-btn" onclick="quickView(${product.id})" 
                        onmouseover="showActionTooltip(this, 'Quick view')" 
                        onmouseout="hideActionTooltip(this)">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-price">
                ${product.originalPrice ? `$${product.price.toFixed(2)} - $${product.originalPrice.toFixed(2)}` : `$${product.price.toFixed(2)}`}
            </div>
            <div class="color-options">
                ${product.colors.map((color, index) => 
                    `<div class="color-option" 
                          style="background-color: ${color}" 
                          onmouseover="showTooltip(this, '${colorNames[color]}')" 
                          onmouseout="hideTooltip(this)" 
                          onclick="selectColor(this, '${color}')"></div>`
                ).join('')}
            </div>

        </div>
    `;
    
    return card;
}

// Generate star rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star" style="color: #ffc107;"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt" style="color: #ffc107;"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star" style="color: #ffc107;"></i>';
    }
    
    return stars;
}

// Initialize infinite scroll
function initInfiniteScroll() {
    window.addEventListener('scroll', handleScroll);
}

// Handle scroll event
function handleScroll() {
    if (isLoading || !hasMoreProducts) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Load more when user is 200px from bottom
    if (scrollTop + windowHeight >= documentHeight - 200) {
        loadMoreProducts();
    }
}

// Load more products with animation
function loadMoreProducts() {
    if (isLoading || !hasMoreProducts) return;
    
    isLoading = true;
    loadingContainer.classList.add('show');
    
    // Simulate loading delay (1-2 seconds)
    setTimeout(() => {
        displayedProducts += 6;
        
        // Add new products to grid
        const newProducts = products.slice(displayedProducts - 6, displayedProducts);
        newProducts.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
        
        // Update flags
        hasMoreProducts = displayedProducts < products.length;
        isLoading = false;
        loadingContainer.classList.remove('show');
        
    }, 600); // 0.8 second delay
}

// Initialize custom select
function initCustomSelect() {
    const selectSelected = customSelect.querySelector('.select-selected');
    const selectItems = customSelect.querySelector('.select-items');
    const options = selectItems.querySelectorAll('div');
    
    // Toggle dropdown
    selectSelected.addEventListener('click', function(e) {
        e.stopPropagation();
        closeAllSelect(this);
        selectItems.classList.toggle('select-hide');
        this.classList.toggle('select-arrow-active');
    });
    
    // Handle option selection
    options.forEach(option => {
        option.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            selectSelected.textContent = this.textContent;
            
            // Remove previous selection
            options.forEach(opt => opt.classList.remove('same-as-selected'));
            this.classList.add('same-as-selected');
            
            selectItems.classList.add('select-hide');
            selectSelected.classList.remove('select-arrow-active');
            
            sortProducts(value);
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', closeAllSelect);
}

// Close all select dropdowns
function closeAllSelect(elmnt) {
    const selectItems = document.querySelectorAll('.select-items');
    const selectSelected = document.querySelectorAll('.select-selected');
    
    selectItems.forEach((item, index) => {
        if (elmnt !== selectSelected[index]) {
            item.classList.add('select-hide');
            selectSelected[index].classList.remove('select-arrow-active');
        }
    });
}

// Sort products
function sortProducts(sortValue = 'default') {
    let sortedProducts = [...products];
    
    switch (sortValue) {
        case 'popularity':
            // Sort by a combination of rating and price (popularity simulation)
            sortedProducts.sort((a, b) => (b.rating * 10 + (300 - b.price)) - (a.rating * 10 + (300 - a.price)));
            break;
        case 'rating':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'latest':
            // Sort by ID (assuming higher ID = newer product)
            sortedProducts.sort((a, b) => b.id - a.id);
            break;
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        default:
            // Default sorting - original order
            sortedProducts = products;
    }
    
    // Update products array and reset display
    products.length = 0;
    products.push(...sortedProducts);
    displayedProducts = 6;
    hasMoreProducts = displayedProducts < products.length;
    displayProducts(products.slice(0, displayedProducts));
}

// Add to cart
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    showNotification('Product added to cart!');
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    displayCartItems();
}

// Increase cart item quantity
function increaseCartQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += 1;
        updateCartUI();
    }
}

// Decrease cart item quantity
function decreaseCartQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        updateCartUI();
    }
}

// Update cart UI
function updateCartUI() {
    const uniqueItems = cart.length; // Count unique products
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = uniqueItems;
    cartTotal.textContent = totalPrice.toFixed(2);
    
    displayCartItems();
}

// Display cart items
function displayCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Your cart is empty</p>';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="quantity-controls">
                    <button onclick="decreaseCartQuantity(${item.id})" style="background: #f8f9fa; border: 1px solid #ddd; width: 25px; height: 25px; cursor: pointer;">-</button>
                    <span style="margin: 0 10px;">${item.quantity}</span>
                    <button onclick="increaseCartQuantity(${item.id})" style="background: #f8f9fa; border: 1px solid #ddd; width: 25px; height: 25px; cursor: pointer;">+</button>
                </div>
            </div>
            <button onclick="removeFromCart(${item.id})" style="background: none; border: none; color: #e74c3c; cursor: pointer;">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

// Toggle cart sidebar
function toggleCart() {
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('open') ? 'hidden' : 'auto';
}

// Select color
function selectColor(element, color) {
    const colorOptions = element.parentElement.querySelectorAll('.color-option');
    const productCard = element.closest('.product-card');
    const priceElement = productCard.querySelector('.product-price');
    const imageElement = productCard.querySelector('.product-image img');
    
    // Select new color
    colorOptions.forEach(option => option.classList.remove('active'));
    element.classList.add('active');
    
    // Update image based on color
    const currentSrc = imageElement.src;
    let newSrc;
    
    if (color === '#000000') {
        // Black color - use 'a' variant
        newSrc = currentSrc.replace('-b-400x488.jpg', '-a-400x488.jpg').replace('-c-400x488.jpg', '-a-400x488.jpg');
        priceElement.innerHTML = '<span style="text-decoration: line-through; color: #999;">$105.00</span> $85.00';
    } else if (color === '#8F6453') {
        // Bronze color - use 'b' variant  
        newSrc = currentSrc.replace('-a-400x488.jpg', '-b-400x488.jpg').replace('-c-400x488.jpg', '-b-400x488.jpg');
        priceElement.innerHTML = '<span style="text-decoration: line-through; color: #999;">$110.00</span> $95.00';
    } else if (color === '#dabca2') {
        // Gold color - use 'c' variant
        newSrc = currentSrc.replace('-a-400x488.jpg', '-c-400x488.jpg').replace('-b-400x488.jpg', '-c-400x488.jpg');
        priceElement.innerHTML = '<span style="text-decoration: line-through; color: #999;">$125.00</span> $99.00';
    }
    
    imageElement.src = newSrc;
}



// Quick view (placeholder)
function quickView(productId) {
    const product = allProducts.find(p => p.id === productId);
    alert(`Quick view for: ${product.title}\nPrice: $${product.price}\nRating: ${product.rating} stars`);
}

// Add to wishlist (placeholder)
function addToWishlist(productId) {
    const product = allProducts.find(p => p.id === productId);
    showNotification(`${product.title} added to wishlist!`);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Show tooltip
function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'color-tooltip';
    tooltip.textContent = text;
    element.appendChild(tooltip);
}

// Hide tooltip
function hideTooltip(element) {
    const tooltip = element.querySelector('.color-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Show action tooltip
function showActionTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'action-tooltip';
    tooltip.textContent = text;
    element.appendChild(tooltip);
}

// Hide action tooltip
function hideActionTooltip(element) {
    const tooltip = element.querySelector('.action-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Search functionality
function openSearch() {
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        searchInput.focus();
    }, 100);
}

function closeSearch() {
    searchOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
    searchInput.value = '';
    searchResults.innerHTML = '';
}

function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === '') {
        searchResults.innerHTML = '';
        return;
    }
    
    // Search in all products for better results
    const filteredProducts = allProducts.filter(product => 
        product.title.toLowerCase().includes(query)
    );
    
    if (filteredProducts.length === 0) {
        searchResults.innerHTML = '<p style="color: #666; text-align: center; padding: 2rem;">No products found</p>';
        return;
    }
    
    searchResults.innerHTML = filteredProducts.map(product => `
        <a href="#" class="search-result-item" onclick="selectSearchResult(${product.id})">
            <img src="${product.image}" alt="${product.title}" class="search-result-image">
            <div class="search-result-info">
                <h4>${product.title}</h4>
                <p>$${product.price.toFixed(2)}</p>
            </div>
        </a>
    `).join('');
}

function selectSearchResult(productId) {
    closeSearch();
    // Scroll to product or show product details
    const productCard = document.querySelector(`[onclick*="addToCart(${productId})"]`)?.closest('.product-card');
    if (productCard) {
        productCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        productCard.style.boxShadow = '0 0 20px rgba(193, 154, 131, 0.5)';
        setTimeout(() => {
            productCard.style.boxShadow = '';
        }, 2000);
    }
}

// Add CSS animation and tooltip styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .color-tooltip {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: #333;
        color: white;
        padding: 6px 10px;
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
        margin-bottom: 8px;
        pointer-events: none;
    }
    
    .color-tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 5px solid transparent;
        border-top-color: #333;
    }
    
    .color-option {
        position: relative;
    }
    
    .action-tooltip {
        position: absolute;
        right: 100%;
        top: 50%;
        transform: translateY(-50%);
        background: #333;
        color: white;
        padding: 6px 10px;
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
        margin-right: 8px;
        pointer-events: none;
    }
    
    .action-tooltip::after {
        content: '';
        position: absolute;
        left: 100%;
        top: 50%;
        transform: translateY(-50%);
        border: 5px solid transparent;
        border-left-color: #333;
    }
    
    .action-btn {
        position: relative;
    }
`;
document.head.appendChild(style);