"use client";
const CartPage = () => {
  // This would normally come from your cart state
  const cartItems = []; // Empty for now

  return (
    <main className="page-container">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button className="continue-shopping-btn">Continue Shopping</button>
        </div>
      ) : (
        <div className="cart-items">
          {/* Cart items would be listed here */}
          <div className="cart-total">
            <p>Total: $0.00</p>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default CartPage;