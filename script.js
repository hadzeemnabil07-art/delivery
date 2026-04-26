// script.js - Single JavaScript file for QuickBite Mobile Web Application
// Handles: Login validation, session management, logout, order form validation & modal

(function() {
  // ==================== SESSION & AUTHENTICATION ====================
  // Check if user is logged in. Protected pages: home, gallery, order.
  const protectedPages = ['home.html', 'gallery.html', 'order.html'];
  const currentPage = window.location.pathname.split('/').pop();
  
  // If we are on a protected page, verify login flag
  if (protectedPages.includes(currentPage)) {
    const isLoggedIn = localStorage.getItem('quickbite_logged_in');
    if (!isLoggedIn || isLoggedIn !== 'true') {
      // Not logged in -> redirect to login page
      window.location.href = 'index.html';
    }
  }
  
  // For login page: if user already logged in and tries to access index, redirect to home
  if (currentPage === 'index.html' || currentPage === '' || currentPage === '/') {
    const logged = localStorage.getItem('quickbite_logged_in');
    if (logged === 'true') {
      window.location.href = 'home.html';
    }
  }
  
  // ==================== LOGIN FORM HANDLER ====================
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
      
      if (username === '' || password === '') {
        alert('❌ Validation Failed! Username and password must not be empty.');
      } else {
        localStorage.setItem('quickbite_logged_in', 'true');
        window.location.href = 'home.html';
      }
    });
  }
  
  // ==================== LOGOUT HANDLER ====================
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('quickbite_logged_in');
      window.location.href = 'index.html';
    });
  }
  
  // ==================== ORDER FORM HANDLER (with validation & modal) ====================
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    // Get modal element and initialize Bootstrap modal
    const modalElement = document.getElementById('orderModal');
    let modal = null;
    if (modalElement) {
      modal = new bootstrap.Modal(modalElement);
    }
    const modalMessageDiv = document.getElementById('modalMessage');
    
    orderForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('customerName').value.trim();
      const food = document.getElementById('foodItem').value;
      const quantity = document.getElementById('quantity').value;
      
      let errorMsg = '';
      if (name === '') errorMsg += '• Please enter your name.\n';
      if (food === '' || food === null) errorMsg += '• Please select a food item.\n';
      if (quantity === '' || parseInt(quantity) < 1) errorMsg += '• Quantity must be at least 1.\n';
      
      if (errorMsg !== '') {
        alert('❌ Validation Failed:\n' + errorMsg);
        return;
      }
      
      // Calculate price based on selection
      let price = 0;
      if (food.includes('Cheeseburger')) price = 15.90;
      else if (food.includes('Pepperoni Pizza')) price = 28.90;
      else if (food.includes('Chicken Burger')) price = 13.90;
      else if (food.includes('Loaded Cheese Fries')) price = 9.90;
      else price = 0;
      
      const total = (price * parseInt(quantity)).toFixed(2);
      const confirmationHtml = `
        <div class="text-center">
          <i class="bi bi-emoji-smile fs-1 text-success"></i>
          <p class="mt-2 fw-bold">Thank you, ${escapeHtml(name)}!</p>
          <p>Your order: <strong>${escapeHtml(food)}</strong><br>Quantity: ${quantity}<br>Total: RM ${total}</p>
          <hr>
          <small>Your meal will be prepared soon! 🍽️</small>
        </div>
      `;
      
      if (modalMessageDiv && modal) {
        modalMessageDiv.innerHTML = confirmationHtml;
        modal.show();
      } else {
        // Fallback to alert if modal not found
        alert(`Order Confirmed!\nName: ${name}\nFood: ${food}\nQuantity: ${quantity}\nTotal: RM ${total}`);
      }
    });
  }
  
  // Helper function to prevent XSS
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }
})();