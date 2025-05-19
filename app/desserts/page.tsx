"use client";
import Image from "next/image";

export default function DessertsPage() {
  const desserts = [
    {
      id: 1,
      name: "Chocolate Cake",
      price: "$24.99",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
    },
    {
      id: 2,
      name: "Cheesecake",
      price: "$18.99",
      image: "https://images.unsplash.com/photo-1558312651-bb7c4b301c41"
    }
  ];

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Our Desserts Menu</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {desserts.map((dessert) => (
          <div key={dessert.id} className="border rounded-lg p-4">
            <div className="relative h-48 mb-2">
              <Image
                src={dessert.image}
                alt={dessert.name}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <h2 className="text-xl font-semibold">{dessert.name}</h2>
            <p className="text-gray-600">{dessert.price}</p>
            <button className="mt-2 w-full bg-amber-500 text-white py-1 rounded">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}