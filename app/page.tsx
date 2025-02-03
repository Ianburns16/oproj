"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import Next.js navigation hook
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
        if (error) {
          throw error;
        }
        setCategories(data as Category[]);
      } catch (error) {
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

  return (
    <>
      {/* Static Background Section */}
      <div
        className="mainback"
        style={{
          backgroundImage:
            "url('https://media-hosting.imagekit.io//5ba7decbb8f446c8/Breakfast.jpeg?Expires=1833201562&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=XDF2q5Cy9ZV2OEQMvP3pimlCQJ9NXSWlnZGdQ5rvuUKfvrjgXJu2YqmzA5Z0iyXbQfUw-sdpDFLxHhPlUOg1GTaPnmbgXqo9GhaxPi6776psvsuxSzqMk0K95gC2rgmHO-apWpCJ98olaud7MX9OaWc5HrLGaKFCfsAe2kCBzi~J0H~vhAIlSkASOyw1LL~n0l7uS0n4iIBE52wEm9X0rDOhIDBiiC9SPRFMRAVAV0Bsw6SACaIIegHH6TyC0dd2cgkkGkKQ5HkQLO2ZibhZUQKoR-LKc6yiywzgSdbTtv8D48CVZIJRAPHmkkUv9ckNS1xcExsc8km8Jvzk~g9X-w__')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "60vh",
        }}
      >
        <h1>Welcome to the Bakery</h1>
        <p>Freshly baked goods, just for you.</p>
      </div>

      {/* Categories Section */}
      <div className="card-section">
        <div className="card-scroll-container">
          {loading ? (
            <div>Loading categories...</div>
          ) : error ? (
            <div>{error}</div>
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                className="card"
                onClick={() =>
                  router.push(`/category?categoryId=${category.id}`)
                }
                style={{ cursor: "pointer" }}
              >
                <Image
                  src={category.image}
                  alt={category.title}
                  className="card-img"
                  width={200}
                  height={200}
                  priority
                />
                <h3>{category.title}</h3>
              </div>
            ))
          ) : (
            <p>No categories found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Body;
