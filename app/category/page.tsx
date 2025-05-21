// pages/CategoryPage.tsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../utils/supabase/supabaseClient";
import "../homepade.css";
import { useCart } from "../models/cartmodel";
import { ItemModel } from "../models/ItemModel";
import { CategoryModel } from "../models/CategoryModel";

const CategoryPage = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const [items, setItems] = useState<ItemModel[]>([]);
  const [category, setCategory] = useState<CategoryModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ItemModel | null>(null);
  const [amount, setAmount] = useState(1);
  const [request, setRequest] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) return;

      try {
        // Fetch category details
        const { data: categoryData, error: categoryError } = await supabase
          .from("categories")
          .select("*")
          .eq("id", categoryId)
          .single();

        if (categoryError) throw categoryError;
        setCategory(CategoryModel.fromSupabase(categoryData));

        // Fetch items for this category
        const { data: itemsData, error: itemsError } = await supabase
          .from("items")
          .select("*")
          .eq("categoryid", categoryId);

        if (itemsError) throw itemsError;
        setItems(itemsData.map(item => ItemModel.fromSupabase(item)));
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

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

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!category) return <div className="error-message">Category not found</div>;

  return (
    <main className="category-page">
      <h1 className="category-title">{category.name}</h1>
      <div className="items-grid">
        {items.map((item) => (
          <div key={item.id} className="item-card" onClick={() => openModal(item)}>
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
    </main>
  );
};

export default CategoryPage;
