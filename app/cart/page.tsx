"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../models/cartmodel";
import { ItemModel } from "../models/ItemModel";
import "../homepade.css";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // Here you would typically handle the checkout process
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push("/checkout");
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quta, 0);

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <button onClick={() => router.push("/")}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <main className="cart-page">
      <h1>Your Cart</h1>
      <div className="cart-items">
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <Image
              src={item.image.trim()}
              alt={item.name}
              width={100}
              height={100}
              className="cart-item-image"
            />
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p>${item.price.toFixed(2)}</p>
              {item.requ && <p className="special-request">Request: {item.requ}</p>}
            </div>
            <div className="cart-item-quantity">
              <button
                onClick={() => updateQuantity(item.id, Math.max(1, item.quta - 1))}
                disabled={item.quta <= 1}
              >
                -
              </button>
              <span>{item.quta}</span>
              <button onClick={() => updateQuantity(item.id, item.quta + 1)}>+</button>
            </div>
            <button
              className="remove-item"
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2>Order Summary</h2>
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Tax (10%):</span>
          <span>${(total * 0.1).toFixed(2)}</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>${(total * 1.1).toFixed(2)}</span>
        </div>
        <button
          className="checkout-button"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? "Processing..." : "Proceed to Checkout"}
        </button>
      </div>
    </main>
  );
};

export default CartPage;