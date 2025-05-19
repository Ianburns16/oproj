"use client";
import Image from "next/image";

export default function DrinksPage() {
  const drinks = [
    {
      id: 1,
      name: "Iced Coffee",
      price: "$4.99",
      image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5"
    },
    {
      id: 2,
      name: "Fruit Smoothie",
      price: "$5.99",
      image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71"
    }
  ];

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Our Drinks Menu</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {drinks.map((drink) => (
          <div key={drink.id} className="border rounded-lg p-4">
            <div className="relative h-48 mb-2">
              <Image
                src={drink.image}
                alt={drink.name}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <h2 className="text-xl font-semibold">{drink.name}</h2>
            <p className="text-gray-600">{drink.price}</p>
            <button className="mt-2 w-full bg-amber-500 text-white py-1 rounded">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}