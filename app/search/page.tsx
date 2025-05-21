"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../utils/supabase/supabaseClient";
import "../homepade.css";
import { useCart } from "../models/cartmodel";

interface Item {
  id: number;
  name: string;
  image: string;
  categoryid: number;
  price: number;
  description: string;
}

export default function SearchPage() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState(1);
  const [request, setRequest] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from("items")
          .select("*");
        if (error) throw error;
        setItems(data as Item[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const openModal = (item: Item) => setSelectedItem(item);

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

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading items...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="search-container">
      <div className="search-input-container">
        <input
          className="search-input"
          type="text"
          placeholder="Search for desserts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="card-section2">
        {filteredItems.map((item) => (
          <div key={item.id} className="card2" onClick={() => openModal(item)}>
            <Image
              src={item.image.trim()}
              alt={item.name}
              className="card-img"
              width={200}
              height={200}
              priority
            />
            <h3>{item.name}</h3>
            <p>${item.price}</p>
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
            <p>{`$${selectedItem.price}`}</p>
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
    </div>
  );
}
