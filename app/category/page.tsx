"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../utils/supabase/supabaseClient";
import "../homepade.css";

interface Item {
  id: number;
  name: string;
  image: string;
  categoryid: number;
  price: number;
  description: string;
}

export default function CategoryPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) {
      setError("No category selected.");
      setLoading(false);
      return;
    }
    
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from("items")
          .select("*")
          .eq("categoryid", categoryId);
        if (error) {
          throw error;
        }
        setItems(data as Item[]);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [categoryId]);

  if (loading) {
    return <div>Loading items...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const openModal = (item: Item) => {
    setSelectedItem(item);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <div>
      <h1>All Items</h1>
      <div className="card-section2">
        {items.map((item) => (
          <div key={item.id} className="card2" onClick={() => openModal(item)}>
            <Image
              src={item.image}
              alt={item.name}
              className="card-img"
              width={200}
              height={200}
              priority
            />
            <h3>{item.name}</h3>
          </div>
        ))}
      </div>

  
      {selectedItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={closeModal}>&times;</span>
            <h2>{selectedItem.name}</h2>
            <Image
              src={selectedItem.image}
              alt={selectedItem.name}
              className="modal-img"
              width={300}
              height={300}
              priority
            />
           <p>{`$${selectedItem.price}`}</p>
           <p>{selectedItem.description}</p>
           <p>Select the amount</p>
             <input type="number" placeholder="Enter amount" />
           <p>Enter request</p>
             <input type="text" placeholder="Enter request details" />

            <button className="buy-button">Add to Cart</button>
          </div>
        </div>
      )}
    </div>
  );
}