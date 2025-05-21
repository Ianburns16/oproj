"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../../utils/supabase/supabaseClient";
import "../homepade.css";
import { useCart } from "../models/cartmodel";
import { ItemModel } from "../models/ItemModel";

const SearchPage = () => {
  const [items, setItems] = useState<ItemModel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ItemModel | null>(null);
  const [amount, setAmount] = useState(1);
  const [request, setRequest] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase.from("items").select("*");
        if (error) throw error;
        setItems(data.map(item => ItemModel.fromSupabase(item)));
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
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

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <main className="search-page">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search desserts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="items-grid">
        {filteredItems.map((item) => (
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

export default SearchPage;
