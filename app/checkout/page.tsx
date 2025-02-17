"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "../models/cartmodel";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabase/supabaseClient";
import dynamic from "next/dynamic";
import { today, getLocalTimeZone } from "@internationalized/date";

// If the Calendar component isn’t SSR-safe, you can load it dynamically:
const Calendar = dynamic(
  () => import("@heroui/react").then((mod) => mod.Calendar),
  { ssr: false }
);

interface UserInfo {
  name: string;
  phonenumber: string;
  address: string;
  specialInstructions: string;
  date: string; // This will hold our combined date and time (ISO string)
}

export default function CheckoutPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    phonenumber: "",
    address: "",
    date: "",
    specialInstructions: ""
  });

  // New states for date and time selection
  // We initialize the date with today's date using your helper function.
  const [selectedDate, setSelectedDate] = useState(today(getLocalTimeZone()));

  const [selectedTime, setSelectedTime] = useState("12:00");

  // Combine the date and time into one ISO datetime string.
  // (You may want to adjust how you convert the calendar value to a string.)
  useEffect(() => {
    // Assume selectedDate.toString() returns something like "2025-02-10"
    // and combine it with the selected time.
    const combinedDateTime = `${selectedDate.toString()}T${selectedTime}`;
    setUserInfo((prev) => ({ ...prev, date: combinedDateTime }));
  }, [selectedDate, selectedTime]);

  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quta, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Insert user data into your "user" table
      const { data: userData, error: userError } = await supabase
        .from("user")
        .insert([
          {
            name: userInfo.name,
            phonenumber: userInfo.phonenumber,
            location: userInfo.address,
            special: userInfo.specialInstructions,
            date: userInfo.date
          }
        ])
        .select();

      if (userError) throw userError;

      // Get inserted user ID
      const userId = userData[0].id;

      const helper = cart.map((item) => ({
        user_id: userId,
        item: item.id,
        request: item.requ,
        quat: item.quta
      }));

      // Insert helper data into your "helper" table
      const { error: helperError } = await supabase.from("helper").insert(helper);

      if (helperError) throw helperError;

      // Clear the cart and redirect
      clearCart();
      router.push("/confirmation");
    } catch (error) {

      console.error("Order submission error:", error);
      alert("Failed to submit order. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {cart.length === 0 ? (
        <p className="text-lg">Your cart is empty.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Cart Items */}
          {cart.map((item, index) => (
            <div key={index} className="flex items-center gap-4 border-b pb-4">
              <Image
                src={item.image}
                alt={item.name}
                width={100}
                height={100}
                className="rounded"
              />
              <div className="flex-grow">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p>Quantity: {item.quta}</p>
                <p>Price: ${item.price} each</p>
                <p>Total: ${item.price * item.quta}</p>
                {item.requ && (
                  <p className="italic text-gray-600">Request: {item.requ}</p>
                )}
              </div>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => removeFromCart(index)}
              >
                Remove
              </button>
            </div>
          ))}

          {/* Total */}
          <div className="text-right text-2xl font-bold">
            Total: ${getTotal().toFixed(2)}
          </div>

          {/* Checkout Form */}
          {showCheckoutForm ? (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-white p-6 rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-semibold mb-4">
                Customer Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded"
                    value={userInfo.name}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full p-2 border rounded"
                    value={userInfo.phonenumber}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, phonenumber: e.target.value })
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded"
                    value={userInfo.address}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, address: e.target.value })
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Select Date
                  </label>
                  <Calendar
                    aria-label="Date Picker"
                    value={selectedDate}
                    onChange={setSelectedDate}
                    defaultValue={today(getLocalTimeZone())}
                    minValue={today(getLocalTimeZone())}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Select Time
                  </label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Special Instructions
                  </label>
                  <textarea
                    className="w-full p-2 border rounded h-24"
                    value={userInfo.specialInstructions}
                    onChange={(e) =>
                      setUserInfo({
                        ...userInfo,
                        specialInstructions: e.target.value
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  onClick={() => setShowCheckoutForm(false)}
                  disabled={loading}
                >
                  Back to Cart
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Place Order"}
                </button>
              </div>
            </form>
          ) : (
            <button
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 self-end"
              onClick={() => setShowCheckoutForm(true)}
            >
              Proceed to Checkout
            </button>
          )}
        </div>
      )}
    </div>
  );
}
