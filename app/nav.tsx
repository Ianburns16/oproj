"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import "../app/homepade.css";
import { useCart } from "./models/cartmodel"; // Adjust path if needed

export default function Nav() {
  const { cart, removeFromCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <div className="topbar">
      <div className="contact-links">
        <span>📞628-6349 </span>
        <span>✉️ info@cakebakery.com</span>
        <span><a href="#">Facebook</a></span>
        <span><a href="#">Instagram</a></span>
      </div>

      <div className="logo-container">
        <Image
          src="https://c8.alamy.com/comp/2R49607/cakes-shop-vector-template-logo-2R49607.jpg"
          alt="LoveCreamCravings Logo"
          className="logo"
          width={50}
          height={50}
        />
        <h1>LoveCreamCravings</h1>
      </div>

      <nav id="topbar">
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/desserts">Desserts</Link></li>
          <li><Link href="/drinks">Drinks</Link></li>
          <li><Link href="/search">Search</Link></li>
          <li><Link href="/about">About</Link></li>
        </ul>
      </nav>

      {/* Cart Button */}
      <button className="cart-button" onClick={openCart}>
        View Cart ({cart.length})
      </button>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="cart-overlay" onClick={closeCart}>
          <div className="cart-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={closeCart}>&times;</span>
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <div className="cart-items">
                {cart.map((cartItem, index) => (
                  <div key={index} className="cart-item">
                    <Image
                      src={cartItem.image}
                      alt={cartItem.name}
                      width={100}
                      height={100}
                      className="cart-item-image"
                    />
                    <div className="cart-details">
                      <h3>{cartItem.name}</h3>
                      <p>Quantity: {cartItem.quta}</p>
                      <p>Request: {cartItem.requ || "None"}</p>
                      <p>
                        Price: ${cartItem.price} x {cartItem.quta} = $
                        {cartItem.price * cartItem.quta}
                      </p>
                    </div>
                    <button className="remove-button" onClick={() => removeFromCart(index)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
