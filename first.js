// Drawing Marketplace JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Hide loader when page is fully loaded
    hideLoader();

    // Safety check for console errors
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.message);
        // Prevent the error from breaking the entire page
        e.preventDefault();
    });

    // Initialize the application state
    const appState = {
        cart: [],
        currentUser: null,
        products: [
            { id: 1, name: "Godess", artist: "John Doe", price: 200, image: "image-2.jpg", category: "portrait" },
            { id: 2, name: "Third Eye", artist: "Sarah Smith", price: 150, image: "image-3.jpg", category: "abstract" },
            { id: 3, name: "HELL-SKULL", artist: "Mike Johnson", price: 175, image: "image-4.jpg", category: "dark" },
            { id: 4, name: "Decay and Rebirth", artist: "Emily Chen", price: 220, image: "image-5.jpg", category: "conceptual" },
            { id: 5, name: "Mask of Mortality", artist: "David Wilson", price: 190, image: "image-6.jpg", category: "portrait" },
            { id: 6, name: "Mirror", artist: "Lisa Brown", price: 230, image: "image-8.jpg", category: "landscape" },
            { id: 7, name: "Urban Decay", artist: "Carlos Mendez", price: 210, image: "image-9.jpg", category: "urban" },
            { id: 8, name: "Abstract Thoughts", artist: "Jessica Taylor", price: 240, image: "image-10.jpg", category: "abstract" },
            { id: 9, name: "Neon Dreams", artist: "Alex Rivera", price: 275, image: "neon-dreams.jpg", category: "urban" },
            { id: 10, name: "Digital Eden", artist: "Maya Peters", price: 320, image: "digital-eden.jpg", category: "landscape" },
            { id: 11, name: "Fractured Reality", artist: "James Wilson", price: 190, image: "fractured-reality.jpg", category: "abstract" },
            { id: 12, name: "Liquid Memories", artist: "Sophie Chen", price: 260, image: "liquid-memories.jpg", category: "abstract" },
            { id: 13, name: "Cosmic Vision", artist: "Omar Hassan", price: 350, image: "cosmic-vision.jpg", category: "conceptual" },
            { id: 14, name: "Marble Dreams", artist: "Eliza Johnson", price: 180, image: "marble-dreams.jpg", category: "abstract" },
            { id: 15, name: "Dystopian Horizon", artist: "Thomas Black", price: 290, image: "dystopian-horizon.jpg", category: "dark" },
            { id: 16, name: "Flora Abstraction", artist: "Nina García", price: 230, image: "flora-abstraction.jpg", category: "abstract" }
        ],
        users: [
            { username: "user1", password: "pass1", isSeller: false },
            { username: "artist1", password: "pass1", isSeller: true }
        ]
    };

    // Setup Navigation Interactivity
    setupNavigation();
    
    // Initialize Shopping Cart
    initializeCart();
    
    // Setup Product Interactions
    setupProductInteractions();
    
    // Add User Authentication
    setupUserAuth();
    
    // Initialize Shop Now Button
    const shopNowBtn = document.querySelector('.btn');
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', function() {
            // Add ripple effect
            createRippleEffect(this);
            // Scroll to products
            scrollToProducts();
        });
    }

    // Setup Menu Functionality
    setupMenu();
    
    // Setup Horizontal Search Bar
    setupHorizontalSearch();
    
    // Setup Trendy Gallery
    setupTrendyGallery();
    
    // Setup Artists Slider
    setupArtistsSlider();
    
    // Initialize ScrollAnimation
    initScrollAnimation();
    
    // Setup Footer Functionality
    setupFooter();
    
    // Ensure any broken images have fallbacks
    setupImageErrorHandling();
    
    // Function to handle broken images
    function setupImageErrorHandling() {
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', function() {
                this.src = 'placeholder.jpg'; // Fallback image
                this.alt = 'Image not available';
                this.style.opacity = '0.7';
            });
        });
    }
    
    // Helper Functions
    function setupNavigation() {
        // Add active state to navigation items
        const navItems = document.querySelectorAll('.nav-part-1 ul li');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                navItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                // Handle navigation
                if (this.textContent === 'Shop') {
                    scrollToProducts();
                } else if (this.textContent === 'Gallery') {
                    showGallery();
                } else if (this.textContent === 'Artist') {
                    showArtists();
                }
            });
        });
        
        // Search functionality
        const searchIcon = document.querySelector('.ri-search-line');
        searchIcon.addEventListener('click', function() {
            // Add click animation
            this.classList.add('clicked');
            setTimeout(() => this.classList.remove('clicked'), 300);
            
            const searchModal = createModal('Search Artwork');
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'Search by title, artist, or style...';
            searchInput.className = 'search-input';
            searchInput.autofocus = true;
            
            searchInput.addEventListener('input', function() {
                const query = this.value.toLowerCase();
                const results = appState.products.filter(product => 
                    product.name.toLowerCase().includes(query) || 
                    product.artist.toLowerCase().includes(query) ||
                    product.category.toLowerCase().includes(query)
                );
                
                displaySearchResults(results, searchModal);
            });
            
            searchModal.querySelector('.modal-content').appendChild(searchInput);
            document.body.appendChild(searchModal);
            
            // Focus on the input field
            setTimeout(() => searchInput.focus(), 300);
        });
    }
    
    function setupHorizontalSearch() {
        const searchInput = document.getElementById('horizontal-search');
        const categoryFilter = document.getElementById('category-filter');
        const priceFilter = document.getElementById('price-filter');
        const searchButton = document.getElementById('search-button');
        const quickTags = document.querySelectorAll('.tag');
        
        // Search function
        function performSearch() {
            const query = searchInput.value.toLowerCase();
            const category = categoryFilter.value;
            const priceRange = priceFilter.value;
            
            let results = appState.products.filter(product => {
                // Name, artist, or category match
                const textMatch = product.name.toLowerCase().includes(query) || 
                                 product.artist.toLowerCase().includes(query) ||
                                 product.category.toLowerCase().includes(query);
                
                // Category filter
                const categoryMatch = category === '' || product.category === category;
                
                // Price filter
                let priceMatch = true;
                if (priceRange) {
                    if (priceRange === '0-100') {
                        priceMatch = product.price < 100;
                    } else if (priceRange === '100-200') {
                        priceMatch = product.price >= 100 && product.price < 200;
                    } else if (priceRange === '200-300') {
                        priceMatch = product.price >= 200 && product.price < 300;
                    } else if (priceRange === '300+') {
                        priceMatch = product.price >= 300;
                    }
                }
                
                return textMatch && categoryMatch && priceMatch;
            });
            
            // Show results in a modal
            const searchResultsModal = createModal('Search Results');
            const resultsContainer = document.createElement('div');
            resultsContainer.className = 'search-results-grid';
            
            if (results.length === 0) {
                resultsContainer.innerHTML = '<p class="no-results">No artworks found matching your criteria.</p>';
            } else {
                results.forEach(product => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'search-result-item';
                    
                    resultItem.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <div class="result-details">
                            <h4>${product.name}</h4>
                            <p>${product.artist}</p>
                            <p class="price">$${product.price}</p>
                        </div>
                    `;
                    
                    resultItem.addEventListener('click', function() {
                        searchResultsModal.remove();
                        showProductDetail(product);
                    });
                    
                    resultsContainer.appendChild(resultItem);
                });
            }
            
            searchResultsModal.querySelector('.modal-content').appendChild(resultsContainer);
            document.body.appendChild(searchResultsModal);
        }
        
        // Search button click
        searchButton.addEventListener('click', performSearch);
        
        // Enter key in search input
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Quick tag clicks
        quickTags.forEach(tag => {
            tag.addEventListener('click', function() {
                searchInput.value = tag.textContent;
                performSearch();
            });
        });
    }
    
    function initializeCart() {
        const cartIcon = document.querySelector('.ri-shopping-cart-line');
        cartIcon.addEventListener('click', function() {
            // Add click animation
            this.classList.add('clicked');
            setTimeout(() => this.classList.remove('clicked'), 300);
            
            displayCart();
        });
        
        // Add cart counter
        const cartCounter = document.createElement('span');
        cartCounter.className = 'cart-counter';
        cartCounter.textContent = '0';
        cartIcon.appendChild(cartCounter);
        
        // Update cart counter
        function updateCartCounter() {
            const counter = document.querySelector('.cart-counter');
            counter.textContent = appState.cart.length;
        }
        
        // Make updateCartCounter available globally
        window.updateCartCounter = updateCartCounter;
    }
    
    function setupProductInteractions() {
        // Add click events to featured products
        const productBoxes = document.querySelectorAll('.box-1, .box-2, .box-3, .box-4, .box-6, .box-7, .box-8');
        productBoxes.forEach(box => {
            box.addEventListener('click', function() {
                const productName = this.querySelector('h2').textContent;
                const product = appState.products.find(p => p.name === productName);
                if (product) {
                    showProductDetail(product);
                }
            });
        });
        
        // Add click event to main product
        const mainProduct = document.querySelector('.product');
        if (mainProduct) {
            mainProduct.addEventListener('click', function() {
                const productName = this.querySelector('h4').textContent;
                const product = appState.products.find(p => p.name === productName);
                if (product) {
                    showProductDetail(product);
                }
            });
        }
    }
    
    function setupUserAuth() {
        // Use the user icon for authentication
        const userIcon = document.getElementById('user-icon');
        userIcon.addEventListener('click', function() {
            // Add click animation
            this.classList.add('clicked');
            setTimeout(() => this.classList.remove('clicked'), 300);
            
            if (appState.currentUser) {
                showUserDashboard();
            } else {
                showLoginForm();
            }
        });
    }
    
    function setupMenu() {
        const menuIcon = document.getElementById('menu-icon');
        const menuOverlay = document.getElementById('menu-overlay');
        const closeMenu = document.getElementById('close-menu');
        const menuItems = document.querySelectorAll('.menu-items li');
        const body = document.body;
        
        if (!menuIcon || !menuOverlay || !closeMenu) {
            console.error('Menu elements not found');
            return;
        }
        
        // Open menu
        menuIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Add click animation
            this.classList.add('clicked');
            setTimeout(() => this.classList.remove('clicked'), 300);
            
            // Open menu
            menuOverlay.classList.add('active');
            body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
            
            // Reset menu item animations
            menuItems.forEach(item => {
                item.style.animation = 'none';
                void item.offsetWidth; // Trigger reflow
                item.style.animation = '';
            });
        });
        
        // Close menu
        closeMenu.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            menuOverlay.classList.remove('active');
            body.style.overflow = ''; // Restore scrolling
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (menuOverlay.classList.contains('active') && 
                !menuOverlay.contains(e.target) && 
                e.target !== menuIcon) {
                menuOverlay.classList.remove('active');
                body.style.overflow = '';
            }
        });
        
        // Handle menu item clicks
        menuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                menuOverlay.classList.remove('active');
                body.style.overflow = '';
                
                // Handle navigation
                if (this.textContent === 'Shop') {
                    scrollToProducts();
                } else if (this.textContent === 'Gallery') {
                    showGallery();
                } else if (this.textContent === 'Artist') {
                    showArtists();
                } else if (this.textContent === 'Home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (this.textContent === 'Contact') {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }
            });
        });
        
        // Handle Escape key press
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
                menuOverlay.classList.remove('active');
                body.style.overflow = '';
            }
        });
        
        // Fix for touch events on mobile
        menuOverlay.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        });
        
        // Add data attributes to menu items for navigation
        menuItems.forEach(item => {
            if (item.textContent === 'Home') {
                item.setAttribute('data-target', 'home');
            } else if (item.textContent === 'Shop') {
                item.setAttribute('data-target', 'shop');
            } else if (item.textContent === 'Artist') {
                item.setAttribute('data-target', 'artist');
            } else if (item.textContent === 'Gallery') {
                item.setAttribute('data-target', 'gallery');
            } else if (item.textContent === 'Contact') {
                item.setAttribute('data-target', 'contact');
            }
        });
    }
    
    function createRippleEffect(button) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        button.appendChild(ripple);
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
        
        ripple.classList.add('active');
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    function showLoginForm() {
        const loginModal = createModal('Login / Register');
        const form = document.createElement('form');
        
        form.innerHTML = `
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" required>
            </div>
            <div class="form-actions">
                <button type="button" id="login-btn">Login</button>
                <button type="button" id="register-btn">Register</button>
            </div>
        `;
        
        loginModal.querySelector('.modal-content').appendChild(form);
        
        // Handle login
        form.querySelector('#login-btn').addEventListener('click', function() {
            const username = form.querySelector('#username').value;
            const password = form.querySelector('#password').value;
            
            const user = appState.users.find(u => u.username === username && u.password === password);
            if (user) {
                appState.currentUser = user;
                loginModal.remove();
                showNotification('Login successful!');
                
                // Update UI for logged in user
                document.querySelector('.user-auth').innerHTML = '<i class="ri-user-fill"></i>';
                
                if (user.isSeller) {
                    // Show seller options
                    showSellerDashboard();
                }
            } else {
                showNotification('Invalid username or password', 'error');
            }
        });
        
        // Handle registration
        form.querySelector('#register-btn').addEventListener('click', function() {
            const username = form.querySelector('#username').value;
            const password = form.querySelector('#password').value;
            
            if (username && password) {
                // Check if username already exists
                if (appState.users.some(u => u.username === username)) {
                    showNotification('Username already exists', 'error');
                    return;
                }
                
                // Add new user
                const newUser = { username, password, isSeller: false };
                appState.users.push(newUser);
                appState.currentUser = newUser;
                loginModal.remove();
                showNotification('Registration successful!');
                
                // Update UI for logged in user
                document.querySelector('.user-auth').innerHTML = '<i class="ri-user-fill"></i>';
            }
        });
        
        document.body.appendChild(loginModal);
    }
    
    function showProductDetail(product) {
        const detailModal = createModal(product.name);
        const content = document.createElement('div');
        content.className = 'product-detail';
        
        content.innerHTML = `
            <div class="detail-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="detail-info">
                <h2>${product.name}</h2>
                <p class="artist">by ${product.artist}</p>
                <p class="category">Category: ${product.category}</p>
                <p class="price">$${product.price}</p>
                <button class="add-to-cart-btn">Add to Cart</button>
            </div>
        `;
        
        detailModal.querySelector('.modal-content').appendChild(content);
        
        // Add to cart functionality
        content.querySelector('.add-to-cart-btn').addEventListener('click', function() {
            appState.cart.push(product);
            window.updateCartCounter();
            showNotification('Added to cart!');
        });
        
        document.body.appendChild(detailModal);
    }
    
    function displayCart() {
        const cartModal = createModal('Your Cart');
        const cartContent = document.createElement('div');
        cartContent.className = 'cart-content';
        
        if (appState.cart.length === 0) {
            cartContent.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        } else {
            let totalPrice = 0;
            let cartHTML = '<div class="cart-items">';
            
            appState.cart.forEach((item, index) => {
                totalPrice += item.price;
                cartHTML += `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="item-details">
                            <h4>${item.name}</h4>
                            <p>${item.artist}</p>
                            <p>$${item.price}</p>
                        </div>
                        <button class="remove-btn" data-index="${index}">
                            <i class="ri-delete-bin-line"></i>
                        </button>
                    </div>
                `;
            });
            
            cartHTML += '</div>';
            cartHTML += `
                <div class="cart-summary">
                    <p>Total: $${totalPrice}</p>
                    <button class="checkout-btn">Proceed to Checkout</button>
                </div>
            `;
            
            cartContent.innerHTML = cartHTML;
        }
        
        cartModal.querySelector('.modal-content').appendChild(cartContent);
        
        // Add remove functionality
        const removeButtons = cartModal.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                appState.cart.splice(index, 1);
                window.updateCartCounter();
                // Refresh cart display
                cartModal.remove();
                displayCart();
            });
        });
        
        // Add checkout functionality
        const checkoutBtn = cartModal.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                if (!appState.currentUser) {
                    showNotification('Please login to checkout', 'warning');
                    return;
                }
                
                // Process checkout
                showCheckoutForm(totalPrice);
                cartModal.remove();
            });
        }
        
        document.body.appendChild(cartModal);
    }
    
    function showCheckoutForm(totalPrice) {
        const checkoutModal = createModal('Checkout');
        const form = document.createElement('form');
        
        form.innerHTML = `
            <div class="checkout-info">
                <p>Total Amount: $${totalPrice}</p>
            </div>
            <div class="form-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" required>
            </div>
            <div class="form-group">
                <label for="address">Shipping Address</label>
                <textarea id="address" required></textarea>
            </div>
            <div class="form-group">
                <label for="payment">Payment Method</label>
                <select id="payment">
                    <option value="credit">Credit Card</option>
                    <option value="paypal">PayPal</option>
                </select>
            </div>
            <button type="button" id="complete-order">Complete Order</button>
        `;
        
        checkoutModal.querySelector('.modal-content').appendChild(form);
        
        // Handle order completion
        form.querySelector('#complete-order').addEventListener('click', function() {
            // Validate form
            const name = form.querySelector('#name').value;
            const email = form.querySelector('#email').value;
            const address = form.querySelector('#address').value;
            
            if (name && email && address) {
                // Process order
                appState.cart = [];
                window.updateCartCounter();
                checkoutModal.remove();
                showNotification('Order placed successfully!');
            } else {
                showNotification('Please fill all required fields', 'error');
            }
        });
        
        document.body.appendChild(checkoutModal);
    }
    
    function showSellerDashboard() {
        const dashboardModal = createModal('Seller Dashboard');
        const dashboard = document.createElement('div');
        dashboard.className = 'seller-dashboard';
        
        dashboard.innerHTML = `
            <div class="dashboard-nav">
                <button class="active" data-tab="listings">My Listings</button>
                <button data-tab="add-listing">Add New Listing</button>
                <button data-tab="sales">Sales History</button>
            </div>
            <div class="dashboard-content">
                <div class="tab-content active" id="listings">
                    <h3>Your Current Listings</h3>
                    <div class="listings-container">
                        <!-- Will be populated dynamically -->
                    </div>
                </div>
                <div class="tab-content" id="add-listing">
                    <h3>Add New Artwork</h3>
                    <form id="new-listing-form">
                        <div class="form-group">
                            <label for="artwork-name">Artwork Name</label>
                            <input type="text" id="artwork-name" required>
                        </div>
                        <div class="form-group">
                            <label for="artwork-price">Price ($)</label>
                            <input type="number" id="artwork-price" min="1" required>
                        </div>
                        <div class="form-group">
                            <label for="artwork-category">Category</label>
                            <select id="artwork-category">
                                <option value="portrait">Portrait</option>
                                <option value="landscape">Landscape</option>
                                <option value="abstract">Abstract</option>
                                <option value="conceptual">Conceptual</option>
                                <option value="dark">Dark</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="artwork-image">Image URL</label>
                            <input type="text" id="artwork-image" placeholder="image-name.jpg">
                        </div>
                        <button type="button" id="submit-artwork">List Artwork</button>
                    </form>
                </div>
                <div class="tab-content" id="sales">
                    <h3>Your Sales</h3>
                    <p>No sales yet</p>
                </div>
            </div>
        `;
        
        dashboardModal.querySelector('.modal-content').appendChild(dashboard);
        
        // Tab switching functionality
        const tabButtons = dashboard.querySelectorAll('.dashboard-nav button');
        const tabContents = dashboard.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Show corresponding tab
                const tabName = this.getAttribute('data-tab');
                tabContents.forEach(tab => tab.classList.remove('active'));
                dashboard.querySelector(`#${tabName}`).classList.add('active');
            });
        });
        
        // Add new listing functionality
        const submitArtwork = dashboard.querySelector('#submit-artwork');
        submitArtwork.addEventListener('click', function() {
            const name = dashboard.querySelector('#artwork-name').value;
            const price = parseFloat(dashboard.querySelector('#artwork-price').value);
            const category = dashboard.querySelector('#artwork-category').value;
            const image = dashboard.querySelector('#artwork-image').value;
            
            if (name && price && image) {
                const newProduct = {
                    id: appState.products.length + 1,
                    name,
                    price,
                    category,
                    image,
                    artist: appState.currentUser.username
                };
                
                appState.products.push(newProduct);
                showNotification('Artwork listed successfully!');
                
                // Reset form
                dashboard.querySelector('#new-listing-form').reset();
            } else {
                showNotification('Please fill all required fields', 'error');
            }
        });
        
        document.body.appendChild(dashboardModal);
    }
    
    // Utility Functions
    function createModal(title) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="close-modal">&times;</button>
                </div>
            </div>
        `;
        
        // Close modal functionality
        modal.querySelector('.close-modal').addEventListener('click', function() {
            modal.remove();
        });
        
        // Close when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        return modal;
    }
    
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Automatically remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
    
    function scrollToProducts() {
        document.querySelector('.content-bottom').scrollIntoView({ behavior: 'smooth' });
    }
    
    function showGallery() {
        const galleryModal = createModal('Art Gallery');
        const galleryContent = document.createElement('div');
        galleryContent.className = 'gallery-grid';
        
        // Create gallery items for each product
        appState.products.forEach(product => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const image = document.createElement('img');
            image.src = product.image;
            image.alt = product.name;
            
            const info = document.createElement('div');
            info.className = 'gallery-info';
            info.innerHTML = `
                <h3>${product.name}</h3>
                <p>by ${product.artist}</p>
                <p class="gallery-price">$${product.price}</p>
            `;
            
            galleryItem.appendChild(image);
            galleryItem.appendChild(info);
            
            // Add click event to show product detail
            galleryItem.addEventListener('click', function() {
                galleryModal.remove();
                showProductDetail(product);
            });
            
            galleryContent.appendChild(galleryItem);
        });
        
        galleryModal.querySelector('.modal-content').appendChild(galleryContent);
        document.body.appendChild(galleryModal);
    }
    
    function showArtists() {
        const artistsModal = createModal('Featured Artists');
        const artistsList = document.createElement('div');
        artistsList.className = 'artists-list';
        
        // Get unique artists
        const artists = [...new Set(appState.products.map(p => p.artist))];
        
        // Create artist cards
        artists.forEach(artistName => {
            const artistWorks = appState.products.filter(p => p.artist === artistName);
            
            const artistCard = document.createElement('div');
            artistCard.className = 'artist-card';
            
            const artistInfo = document.createElement('div');
            artistInfo.innerHTML = `
                <h3>${artistName}</h3>
                <p>${artistWorks.length} artwork${artistWorks.length > 1 ? 's' : ''}</p>
            `;
            
            const artistSamples = document.createElement('div');
            artistSamples.className = 'artist-samples';
            
            // Show up to 3 samples of artist's work
            artistWorks.slice(0, 3).forEach(work => {
                const sample = document.createElement('img');
                sample.src = work.image;
                sample.alt = work.name;
                artistSamples.appendChild(sample);
            });
            
            const viewButton = document.createElement('button');
            viewButton.className = 'view-artist';
            viewButton.textContent = 'View Works';
            viewButton.addEventListener('click', function() {
                artistsModal.remove();
                
                // Filter gallery to show only this artist's works
                const filteredGalleryModal = createModal(`Works by ${artistName}`);
                const galleryContent = document.createElement('div');
                galleryContent.className = 'gallery-grid';
                
                artistWorks.forEach(product => {
                    const galleryItem = document.createElement('div');
                    galleryItem.className = 'gallery-item';
                    
                    const image = document.createElement('img');
                    image.src = product.image;
                    image.alt = product.name;
                    
                    const info = document.createElement('div');
                    info.className = 'gallery-info';
                    info.innerHTML = `
                        <h3>${product.name}</h3>
                        <p>by ${product.artist}</p>
                        <p class="gallery-price">$${product.price}</p>
                    `;
                    
                    galleryItem.appendChild(image);
                    galleryItem.appendChild(info);
                    
                    galleryItem.addEventListener('click', function() {
                        filteredGalleryModal.remove();
                        showProductDetail(product);
                    });
                    
                    galleryContent.appendChild(galleryItem);
                });
                
                filteredGalleryModal.querySelector('.modal-content').appendChild(galleryContent);
                document.body.appendChild(filteredGalleryModal);
            });
            
            artistCard.appendChild(artistInfo);
            artistCard.appendChild(artistSamples);
            artistCard.appendChild(viewButton);
            artistsList.appendChild(artistCard);
        });
        
        artistsModal.querySelector('.modal-content').appendChild(artistsList);
        document.body.appendChild(artistsModal);
    }
    
    function displaySearchResults(results, modal) {
        // Remove previous results if any
        const prevResults = modal.querySelector('.search-results');
        if (prevResults) prevResults.remove();
        
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results';
        
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>No results found</p>';
        } else {
            results.forEach(product => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div class="result-details">
                        <h4>${product.name}</h4>
                        <p>${product.artist}</p>
                        <p>$${product.price}</p>
                    </div>
                `;
                
                resultItem.addEventListener('click', function() {
                    modal.remove();
                    showProductDetail(product);
                });
                
                resultsContainer.appendChild(resultItem);
            });
        }
        
        modal.querySelector('.modal-content').appendChild(resultsContainer);
    }
    
    function setupTrendyGallery() {
        const viewButtons = document.querySelectorAll('.view-btn');
        
        viewButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent event bubbling
                
                // Get artwork details from parent elements
                const overlay = this.parentElement;
                const name = overlay.querySelector('h3').textContent;
                
                // Find the product in our catalog
                const product = appState.products.find(p => p.name === name);
                
                if (product) {
                    showProductDetail(product);
                }
            });
        });
        
        // Make the entire grid item clickable
        const gridItems = document.querySelectorAll('.grid-item');
        gridItems.forEach(item => {
            item.addEventListener('click', function() {
                const name = this.querySelector('h3').textContent;
                const product = appState.products.find(p => p.name === name);
                
                if (product) {
                    showProductDetail(product);
                }
            });
        });
    }
    
    function setupArtistsSlider() {
        const slider = document.querySelector('.artists-slider');
        const prevButton = document.getElementById('prev-artist');
        const nextButton = document.getElementById('next-artist');
        const dots = document.querySelectorAll('.dot');
        const artistProfiles = document.querySelectorAll('.artist-profile');
        const modal = document.getElementById('artist-modal');
        const modalClose = modal.querySelector('.artist-modal-close');
        
        // Artist data store - expanded details for the modal
        const artistData = [
            {
                id: 1,
                name: "John Doe",
                specialty: "Portrait Artist",
                bio: "John Doe is a renowned portrait artist whose work has been featured in galleries across Europe and North America. With over 15 years of experience, John has developed a unique style that combines traditional techniques with contemporary perspectives. His portraits are known for their emotional depth and ability to capture the subject's personality through subtle details and nuanced expressions. John holds a Master of Fine Arts from the Royal Academy and has received numerous awards for his contributions to the art world.",
                works: [
                    { title: "Godess", image: "image-2.jpg", price: 200 },
                    { title: "Fractured Reality", image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1000&auto=format&fit=crop", price: 190 },
                    { title: "Inner Reflection", image: "https://images.unsplash.com/photo-1605106702734-205df224ecce?q=80&w=1000&auto=format&fit=crop", price: 250 }
                ]
            },
            {
                id: 2,
                name: "Sarah Smith",
                specialty: "Abstract Expressionist",
                bio: "Sarah Smith is an abstract expressionist who pushes the boundaries of color and form. Based in New York, her works explore the intersection of emotion and chaos through bold brushstrokes and vibrant color palettes. Sarah's paintings often incorporate elements of chance and spontaneity, reflecting her belief that art should capture the energy of the moment rather than simply reproduce visual reality. Her work has been exhibited in contemporary art museums worldwide and is part of several prestigious private collections.",
                works: [
                    { title: "Third Eye", image: "image-3.jpg", price: 150 },
                    { title: "Marble Dreams", image: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=1000&auto=format&fit=crop", price: 180 },
                    { title: "Color Field #7", image: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1000&auto=format&fit=crop", price: 260 }
                ]
            },
            {
                id: 3,
                name: "Mike Johnson",
                specialty: "Dark Art Specialist",
                bio: "Mike Johnson specializes in dark art that explores the depths of human psychology and existential themes. His haunting imagery incorporates surrealist elements with gothic aesthetics to create pieces that are both disturbing and captivating. Drawing inspiration from literary works of horror and philosophical concepts of the sublime, Mike creates visual narratives that invite viewers to confront their own fears and fascinations. His meticulous attention to detail and mastery of light and shadow have established him as a leading figure in contemporary dark art.",
                works: [
                    { title: "HELL-SKULL", image: "image-4.jpg", price: 175 },
                    { title: "Dystopian Horizon", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop", price: 290 },
                    { title: "Abyssal Gaze", image: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=1000&auto=format&fit=crop", price: 320 }
                ]
            },
            {
                id: 4,
                name: "Emily Chen",
                specialty: "Conceptual Artist",
                bio: "Emily Chen is a conceptual artist whose work challenges conventional thinking about art, society, and identity. Through mixed media installations, photography, and digital art, she creates pieces that provoke thought and dialogue about contemporary issues. Emily's art often incorporates interactive elements that invite audience participation, blurring the line between observer and creator. Her innovative approaches have earned her residencies at major art institutions and her work has been featured in biennales around the world.",
                works: [
                    { title: "Decay and Rebirth", image: "image-5.jpg", price: 220 },
                    { title: "Digital Eden", image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1000&auto=format&fit=crop", price: 320 },
                    { title: "Cosmic Vision", image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1000&auto=format&fit=crop", price: 350 }
                ]
            },
            {
                id: 5,
                name: "David Wilson",
                specialty: "Portrait Photographer",
                bio: "David Wilson is a portrait photographer whose images reveal the hidden dimensions of his subjects through masterful composition and lighting. His philosophy centers on the belief that every face tells a story, and his work aims to capture authentic moments that reveal character and emotion. David's distinctive style combines classical portraiture techniques with contemporary aesthetics, resulting in photographs that feel both timeless and modern. His portraits have been published in leading magazines and have won numerous awards in international photography competitions.",
                works: [
                    { title: "Mask of Mortality", image: "image-6.jpg", price: 190 },
                    { title: "Mirror", image: "image-8.jpg", price: 230 },
                    { title: "Neon Dreams", image: "https://images.unsplash.com/photo-1615184697985-c9bde1b07da7?q=80&w=1000&auto=format&fit=crop", price: 275 }
                ]
            }
        ];
        
        // Variables for slider functionality
        let slideIndex = 0;
        const slidesToShow = window.innerWidth < 768 ? 1 : 3;
        const slideWidth = slider.querySelector('.artist-profile').offsetWidth + parseInt(window.getComputedStyle(slider).getPropertyValue('gap'));
        
        // Next slide
        nextButton.addEventListener('click', function() {
            if (slideIndex < slider.children.length - slidesToShow) {
                slideIndex++;
                updateSlider();
            }
        });
        
        // Previous slide
        prevButton.addEventListener('click', function() {
            if (slideIndex > 0) {
                slideIndex--;
                updateSlider();
            }
        });
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                const dotIndex = parseInt(this.getAttribute('data-index'));
                slideIndex = dotIndex * slidesToShow;
                if (slideIndex > slider.children.length - slidesToShow) {
                    slideIndex = slider.children.length - slidesToShow;
                }
                updateSlider();
                
                // Update active dot
                dots.forEach(d => d.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Update slider position
        function updateSlider() {
            slider.scrollTo({
                left: slideIndex * slideWidth,
                behavior: 'smooth'
            });
            
            // Update active dot
            const activeDotIndex = Math.floor(slideIndex / slidesToShow);
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeDotIndex);
            });
            
            // Update button states
            prevButton.disabled = slideIndex === 0;
            nextButton.disabled = slideIndex >= slider.children.length - slidesToShow;
            
            // Visual feedback for disabled buttons
            prevButton.style.opacity = prevButton.disabled ? '0.5' : '1';
            nextButton.style.opacity = nextButton.disabled ? '0.5' : '1';
        }
        
        // Open artist modal
        function openArtistModal(artistId) {
            const artist = artistData.find(a => a.id === artistId);
            
            if (!artist) return;
            
            // Populate modal content
            document.getElementById('modal-avatar').style.backgroundImage = document.querySelector(`.artist-profile[data-artist-id="${artistId}"] .artist-avatar`).style.backgroundImage;
            document.getElementById('modal-artist-name').textContent = artist.name;
            document.getElementById('modal-artist-specialty').textContent = artist.specialty;
            document.getElementById('modal-artist-bio').textContent = artist.bio;
            
            // Clear previous gallery items
            const galleryContainer = document.getElementById('modal-artist-gallery');
            galleryContainer.innerHTML = '';
            
            // Add artist works to gallery
            artist.works.forEach(work => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'artist-gallery-item';
                
                galleryItem.innerHTML = `
                    <img src="${work.image}" alt="${work.title}">
                    <div class="artwork-overlay">
                        <h3>${work.title}</h3>
                        <span class="price">$${work.price}</span>
                    </div>
                `;
                
                galleryItem.addEventListener('click', function() {
                    const product = appState.products.find(p => 
                        p.name === work.title || 
                        p.image === work.image
                    );
                    
                    if (product) {
                        modal.classList.remove('show');
                        showProductDetail(product);
                    }
                });
                
                galleryContainer.appendChild(galleryItem);
            });
            
            // Show modal with animation
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
        
        // Handle clicks on artist profiles
        artistProfiles.forEach(profile => {
            profile.addEventListener('click', function(e) {
                if (e.target.classList.contains('view-portfolio') || e.target.closest('.view-portfolio')) {
                    e.preventDefault();
                    const artistId = parseInt(this.getAttribute('data-artist-id'));
                    openArtistModal(artistId);
                }
            });
        });
        
        // Close modal
        modalClose.addEventListener('click', function() {
            modal.classList.remove('show');
            document.body.style.overflow = ''; // Restore scrolling
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
        
        // Handle Escape key press
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                modal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
        
        // Initialize slider
        updateSlider();
        
        // Update slider on window resize
        window.addEventListener('resize', function() {
            const newSlidesToShow = window.innerWidth < 768 ? 1 : 3;
            if (newSlidesToShow !== slidesToShow) {
                slideIndex = 0;
                updateSlider();
            }
        });
        
        // Add hover effect to artist profiles
        artistProfiles.forEach(profile => {
            profile.addEventListener('mouseenter', function() {
                this.querySelector('.artist-description').style.overflow = 'visible';
                this.querySelector('.artist-description').style.maxHeight = 'none';
                this.querySelector('.artist-description').style.webkitLineClamp = 'unset';
            });
            
            profile.addEventListener('mouseleave', function() {
                this.querySelector('.artist-description').style.overflow = 'hidden';
                this.querySelector('.artist-description').style.maxHeight = '60px';
                this.querySelector('.artist-description').style.webkitLineClamp = '3';
            });
        });
    }
    
    function initScrollAnimation() {
        // Elements to animate on scroll
        const elementsToAnimate = document.querySelectorAll('.content-bottom-left, .shop-section, .trendy-gallery, .featured-artists');
        
        // Add animation classes to elements
        elementsToAnimate.forEach(element => {
            element.classList.add('animate-on-scroll');
        });
        
        // Create intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Add animation class when element is visible
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, {
            root: null, // Use viewport as root
            threshold: 0.15, // Trigger when 15% of element is visible
            rootMargin: '0px' // No margin
        });
        
        // Observe each element
        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
        
        // Add floating animation to specific elements
        const floatingElements = document.querySelectorAll('.product, .pic img');
        floatingElements.forEach((element, index) => {
            element.style.animation = `float ${6 + index % 3}s ease-in-out infinite ${index * 0.5}s`;
        });
        
        // Add shine effect to buttons
        const buttons = document.querySelectorAll('.btn, .view-btn, .artist-link');
        buttons.forEach(button => {
            button.addEventListener('mouseover', function() {
                this.style.transition = 'all 0.3s ease';
                this.style.transform = 'translateY(-5px)';
                
                // Add shine effect
                const shine = document.createElement('span');
                shine.classList.add('btn-shine');
                this.appendChild(shine);
                
                // Remove shine after animation completes
                setTimeout(() => {
                    if (shine && shine.parentNode === this) {
                        this.removeChild(shine);
                    }
                }, 1000);
            });
            
            button.addEventListener('mouseout', function() {
                this.style.transform = '';
            });
        });
        
        // Add hover effect to product boxes
        const productBoxes = document.querySelectorAll('.box-content');
        productBoxes.forEach((box, index) => {
            // Apply staggered animation delay for initial appearance
            box.style.opacity = '0';
            box.style.transform = 'translateY(30px)';
            box.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                box.style.opacity = '1';
                box.style.transform = 'translateY(0)';
            }, 100 + index * 150);
        });
    }
    
    function setupFooter() {
        // Back to top button functionality
        const backToTopButton = document.getElementById('back-to-top');
        if (backToTopButton) {
            backToTopButton.addEventListener('click', function() {
                // Smooth scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                // Add shine effect
                const shine = document.createElement('span');
                shine.classList.add('btn-shine');
                this.appendChild(shine);
                
                // Remove shine after animation completes
                setTimeout(() => {
                    if (shine && shine.parentNode === this) {
                        this.removeChild(shine);
                    }
                }, 1000);
            });
        }
        
        // Footer navigation functionality
        const footerNavItems = document.querySelectorAll('.footer-panel-2 ul li');
        footerNavItems.forEach(item => {
            item.addEventListener('click', function() {
                const target = this.getAttribute('data-target');
                
                // Handle navigation based on target
                switch(target) {
                    case 'home':
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        break;
                    case 'shop':
                        scrollToProducts();
                        break;
                    case 'artist':
                        showArtists();
                        break;
                    case 'gallery':
                        showGallery();
                        break;
                    case 'contact':
                        // Scroll to bottom or show contact form
                        window.scrollTo({ 
                            top: document.body.scrollHeight, 
                            behavior: 'smooth' 
                        });
                        break;
                }
                
                // Visual feedback
                const allItems = document.querySelectorAll('.footer-panel-2 ul li');
                allItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Show back to top button only when scrolled
        window.addEventListener('scroll', function() {
            if (backToTopButton) {
                if (window.scrollY > 300) {
                    backToTopButton.classList.add('visible');
                } else {
                    backToTopButton.classList.remove('visible');
                }
            }
        });
        
        // Add hover effects to social icons
        const socialIcons = document.querySelectorAll('.social-icon');
        socialIcons.forEach(icon => {
            icon.addEventListener('mouseover', function() {
                // Add animation
                this.style.transition = 'all 0.3s ease';
                this.style.transform = 'translateY(-5px)';
            });
            
            icon.addEventListener('mouseout', function() {
                this.style.transform = '';
            });
        });
        
        // Add animation to footer on scroll
        const footer = document.querySelector('footer');
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Add staggered animation to child elements
                    const footerElements = entry.target.querySelectorAll('.footer-panel-1, .footer-panel-2, .footer-panel-3, .footer-social, .footer-bottom');
                    footerElements.forEach((el, index) => {
                        el.style.opacity = '0';
                        el.style.transform = 'translateY(20px)';
                        el.style.transition = 'all 0.5s ease';
                        
                        setTimeout(() => {
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0)';
                        }, 100 + index * 150);
                    });
                    
                    footerObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15
        });
        
        if (footer) {
            footer.style.opacity = '0';
            footer.style.transform = 'translateY(30px)';
            footer.style.transition = 'all 0.5s ease';
            footerObserver.observe(footer);
        }
    }

    // Function to hide the loader
    function hideLoader() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            // Slight delay to ensure smooth transition
            setTimeout(() => {
                loader.classList.add('hidden');
                // Remove from DOM after transition completes
                setTimeout(() => {
                    loader.remove();
                }, 500);
            }, 600);
        }
    }
});
