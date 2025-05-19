"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabase/supabaseClient";
import "../app/homepade.css";

interface Category {
  id: number;
  title: string;
  image: string;
}

const Body = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase.from("categories").select("*");
        if (error) throw error;
        setCategories(data as Category[]);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <main className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to LoveCreamCravings</h1>
          <p className="hero-subtitle">Indulge in our heavenly desserts crafted with love</p>
          <button 
            className="cta-button"
            onClick={() => router.push("/category")}
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
                    alt={category.title}
                    width={300}
                    height={300}
                    className="category-image"
                    priority
                  />
                </div>
                <h3>{category.title}</h3>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <h2 className="section-title">Customer Favorites</h2>
        <div className="featured-grid">
          {/* Chocolate Fudge Cake */}
          <div className="featured-item">
            <div className="featured-badge">Bestseller</div>
            <Image
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587"
              alt="Chocolate Cake"
              width={250}
              height={250}
            />
            <h3>Chocolate Fudge Cake</h3>
            <p>$24.99</p>
            <button className="add-to-cart">Add to Cart</button>
          </div>

          {/* Luxury Chocolate Truffle Cake */}
          <div className="featured-item">
            <div className="featured-badge">Premium</div>
            <Image
              src="https://images.unsplash.com/photo-1571115177098-24ec42ed204d"
              alt="Luxury Chocolate Truffle Cake"
              width={250}
              height={250}
            />
            <h3>Luxury Chocolate Truffle</h3>
            <p>$32.99</p>
            <button className="add-to-cart">Add to Cart</button>
          </div>

          {/* Raspberry Almond Tart */}
          <div className="featured-item">
            <div className="featured-badge">New</div>
            <Image
              src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e"
              alt="Raspberry Almond Tart"
              width={250}
              height={250}
            />
            <h3>Raspberry Almond Tart</h3>
            <p>$18.99</p>
            <button className="add-to-cart">Add to Cart</button>
          </div>
        </div>
      </section>

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
        <form className="newsletter-form">
          <input type="email" placeholder="Your email address" />
          <button type="submit">Subscribe</button>
        </form>
      </section>
    </main>
  );
};

export default Body;