"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabase/supabaseClient";
import "../app/homepade.css";
import { useCart } from "./models/cartmodel";
import { ItemModel } from "./models/ItemModel";
import { CategoryModel } from "./models/CategoryModel";

const Body = () => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [featuredItems, setFeaturedItems] = useState<ItemModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ItemModel | null>(null);
  const [amount, setAmount] = useState(1);
  const [request, setRequest] = useState("");
  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState<"idle" | "success" | "error">("idle");
  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase.from("categories").select("*");
        if (categoriesError) throw categoriesError;
        setCategories(categoriesData.map(category => CategoryModel.fromSupabase(category)));

        // Fetch featured items (first 3 items from items table)
        const { data: itemsData, error: itemsError } = await supabase
          .from("items")
          .select("*")
          .limit(3);
        if (itemsError) throw itemsError;
        setFeaturedItems(itemsData.map(item => ItemModel.fromSupabase(item)));
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openModal = (item: ItemModel) => setSelectedItem(item);

  const closeModal = () => {
    setSelectedItem(null);
    setAmount(1);
    setRequest("");
  };

  const handleAddToCart = () => {
    if (selectedItem) {
      addToCart({
        id: selectedItem.id,
        name: selectedItem.name,
        image: selectedItem.image,
        price: selectedItem.price,
        requ: request,
        quta: amount,
      });
      closeModal();
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("sub")
        .insert([{ email }]);
      
      if (error) throw error;
      
      setSubscriptionStatus("success");
      setEmail("");
      setTimeout(() => setSubscriptionStatus("idle"), 3000);
    } catch (error) {
      setSubscriptionStatus("error");
      setTimeout(() => setSubscriptionStatus("idle"), 3000);
    }
  };

  return (
    <main className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to LoveCreamCravings</h1>
          <p className="hero-subtitle">Indulge in our heavenly desserts crafted with love</p>
          <button 
            className="cta-button"
            onClick={() => router.push("/search")}
          >
            Explore Menu
          </button>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo-banner">
        <p>✨ Free delivery on orders over $20 | Order before 3PM for same-day pickup ✨</p>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2 className="section-title">Our Categories</h2>
        {loading ? (
          <div className="loading-spinner"></div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="categories-grid">
            {categories.map((category) => (
              <div
                key={category.id}
                className="category-card"
                onClick={() => router.push(`/category?categoryId=${category.id}`)}
              >
                <div className="image-container">
                  <Image
                    src={category.image.trim()}
                    alt={category.name}
                    width={300}
                    height={300}
                    className="category-image"
                    priority
                  />
                </div>
                <h3>{category.name}</h3>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <h2 className="section-title">Customer Favorites</h2>
        <div className="featured-grid">
          {featuredItems.map((item) => (
            <div key={item.id} className="featured-item" onClick={() => openModal(item)}>
              <div className="featured-badge">Featured</div>
              <Image
                src={item.image.trim()}
                alt={item.name}
                width={250}
                height={250}
                priority
              />
              <h3>{item.name}</h3>
              <p>{item.getDisplayPrice()}</p>
              <button className="add-to-cart">Add to Cart</button>
            </div>
          ))}
        </div>
      </section>

      {selectedItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <h2>{selectedItem.name}</h2>
            <Image
              src={selectedItem.image.trim()}
              alt={selectedItem.name}
              width={300}
              height={300}
              priority
            />
            <p>{selectedItem.getDisplayPrice()}</p>
            <p>{selectedItem.description}</p>
            
            <label>Select the amount</label>
            <input
              type="number"
              value={amount}
              min="1"
              onChange={(e) => setAmount(Number(e.target.value))}
            />

            <label>Enter request</label>
            <input
              type="text"
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              placeholder="Enter request details"
            />

            <button className="buy-button" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      )}

      {/* Testimonials */}
      <section className="testimonials-section">
        <h2 className="section-title">What Our Customers Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>"The best desserts in town! I order every week!"</p>
            <div className="customer-info">
              <span className="customer-name">- Vance Petillo</span>
              <div className="stars">★★★★★</div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <p>"These are to die for!"</p>
            <div className="customer-info">
              <span className="customer-name">- Ian Burns</span>
              <div className="stars">★★★★★</div>
            </div>
          </div>

          {/* V. Sylvester Testimonial */}
          <div className="testimonial-card">
            <p>"The Signature Cake I ordered was a masterpiece—both in flavor and design. The team went above and beyond to accommodate my last-minute request."</p>
            <div className="customer-info">
              <span className="customer-name">- V. Sylvester</span>
              <div className="stars">★★★★★</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <h2>Join Our Sweet Newsletter</h2>
        <p>Get exclusive offers and dessert inspiration</p>
        <form className="newsletter-form" onSubmit={handleSubscribe}>
          <input 
            type="email" 
            placeholder="Your email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
        {subscriptionStatus === "success" && (
          <p className="subscription-message success">Thank you for subscribing!</p>
        )}
        {subscriptionStatus === "error" && (
          <p className="subscription-message error">Something went wrong. Please try again.</p>
        )}
      </section>
    </main>
  );
};

export default Body;