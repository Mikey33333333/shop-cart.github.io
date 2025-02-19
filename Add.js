$(document).ready(function(){
   const $menuCartElement = $('.menu-cart');
   const $cartItemElement = $('.cart-list');
   const $cartElement = $('.cart');
   const $mainElement = $('.main');

   let cart = [];

   // Function to add product to the cart
   function addToCart(productElement) {
      const $productElement = $(productElement); 
      const productId = $productElement.data('product');
      const productName = $productElement.find('.product-title').text();
      const productPrice = parseFloat($productElement.find('.product-price').text().replace('$', ''));
      const productImage = $productElement.find('.prodcut-img').attr('src'); // Fixed image selector

      let existingItem = cart.find(item => item.id === productId);

      if (existingItem) {
         existingItem.quantity += 1;
      } else {
         const newItem = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage, // Fixed variable reference
            quantity: 1
         };

         cart.push(newItem);
      }

      updateCartCount();
      renderCartItems();
   }

   // Function to update cart count
   function updateCartCount() {
      const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
      $menuCartElement.find('.cart-count').text(itemCount);
   }

   // Function to render cart items
   function renderCartItems() {
      $cartItemElement.empty();

      if (cart.length === 0) {
         $cartItemElement.html(`
            <div class="cart-empty">
                <img src="imgs/10.jpg">
                <p>Your cart is Empty</p>
            </div>
         `);
      } else {
         $.each(cart, function(index, item) {
            const $cartItem = $(`
               <div class="cart-item">
                  <img class="cart-item-img" src="${item.image}" alt="${item.name}">
                  <div class="cart-item-desc">
                     <div class="cart-item-title">${item.name}</div>
                     <div class="cart-item-quantity">
                        <button class="change-quantity" data-id="${item.id}" data-action="decrement">-</button>
                        <span>${item.quantity}</span>
                        <button class="change-quantity" data-id="${item.id}" data-action="increment">+</button>
                     </div>
                  </div>
                  <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                  <button class="cart-item-remove" data-id="${item.id}"><i class="bx bx-x"></i></button>
               </div>
            `);
            $cartItemElement.append($cartItem);
         });
      }

      updateOrderSummary();
   }

   // Function to update order summary
   function updateOrderSummary() {
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const tax = subtotal * 0.10;
      const total = subtotal + tax;

      $('#total-price .cart-amount-value').text(`$${subtotal.toFixed(2)}`);
      $('#tax .cart-amount-value').text(`$${tax.toFixed(2)}`);
      $('#final-price .cart-amount-value').text(`$${total.toFixed(2)}`);
   }

   // Event listener for adding to cart
   $('.add-to-cart').on('click', function() {
      const productElement = $(this).closest('.product');
      addToCart(productElement);
   });

   // Event listener for quantity change
   $(document).on('click', '.change-quantity', function() {
      const productId = $(this).data('id');
      const action = $(this).data('action');

      let cartItem = cart.find(item => item.id == productId);

      if (cartItem) {
         if (action === "decrement") {
            cartItem.quantity = Math.max(1, cartItem.quantity - 1);
         } else if (action === "increment") {
            cartItem.quantity += 1;
         }
      }

      renderCartItems();
   });

   // Event listener for removing items from the cart
   $(document).on('click', '.cart-item-remove', function() {
      const productId = $(this).data('id');
      cart = cart.filter(item => item.id != productId);
      updateCartCount();  // Make sure this runs
      renderCartItems();
   });

   $cartItemElement.on('click','.change-quantity', function(){
      const itemId = $(this).data('id');
      const action = $(this).data('action');
      const item = cart.find(item => item.id === itemId);

      if(action === 'increament'){
         item.quantity += 1;
      }else if(action === 'decreament' && item.quantity > 1){
         item.quantity -= 1;
      }

      updateCartCount();
      renderCartItems();
   })

   $menuCartElement.on('click', () =>{
      $cartElement.toggleClass('collapesd');
      $mainElement.toggleClass('expanded', $cartElement.hasClass('collapesd'));
   })

   renderCartItems();

   
});
