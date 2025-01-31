"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../utils/supabase/supabaseClient";
import "../app/homepade.css";

const Body = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) {
        console.error("Error fetching categories:", error.message);
      } else {
        setCategories(data);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mainback"
        style={{
          backgroundImage: "url('https://images.immediate.co.uk/production/volatile/sites/30/2013/05/easy-lemon-layer-cake-hero-e54adca.jpg?resize=1200%2C630')", // Replace with your image path
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "60vh",
          
        }}
      >
        <h1>Welcome to the Bakery</h1>
        <p>Freshly baked goods, just for you.</p>
      </div>

      <div className="card-section">
        <div className="card-scroll-container">
          {categories.map((category, index) => (
            <div key={index} className="card">
              <Image
                src={category.image}
                alt={category.title}
                className="card-img"
                width={200}
                height={200}
              />
              <h3>{category.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Body;
