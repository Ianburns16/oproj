"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase.from("categories").select("*");
        if (error) {
          throw error;
        }
        setCategories(data as Category[]); // Cast data to Category[]
      } catch (error) {
        // Type guard to check if error is an instance of Error
        if (error instanceof Error) {
          console.error("Error fetching categories:", error.message);
          setError("Failed to load categories. Please try again later.");
        } else {
          console.error("An unknown error occurred:", error);
          setError("An unknown error occurred. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }



  return (
    <div>
   
      {/* Categories Section */}
      <div className="card-section">
        <div className="card-scroll-container">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className="card">
                <Image
                  src={category.image}
                  alt={category.title}
                  className="card-img"
                  width={200}
                  height={200}
                  priority // Prioritize loading above-the-fold images
                />
                <h3>{category.title}</h3>
              </div>
            ))
          ) : (
            <p>No categories found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Body;