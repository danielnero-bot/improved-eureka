import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiClock, FiCreditCard } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { supabase } from "../supabase";

const Checkout = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { cartItems, getCartTotal, getRestaurantFromCart, clearCart } =
    useCart();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [specialInstructions, setSpecialInstructions] = useState("");

  const restaurant = getRestaurantFromCart();

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) setUser(user);
        else navigate("/login");
      } catch {
        navigate("/login");
      }
    };
    getUser();
  }, [navigate]);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/dashboard");
    }
  }, [cartItems, navigate]);

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      alert("Please enter a delivery address");
      return;
    }

    setLoading(true);
    try {
      // Create order in database
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            restaurant_id: restaurant.id,
            total_amount: getCartTotal(),
            status: "pending",
            delivery_address: deliveryAddress,
            payment_method: paymentMethod,
            special_instructions: specialInstructions,
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: orderData.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart and navigate to orders page
      clearCart();
      alert("Order placed successfully!");
      navigate("/userOrders");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!restaurant) return null;

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-background-dark text-white"
          : "bg-background-light text-gray-900"
      }`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-10 backdrop-blur-md border-b ${
          darkMode
            ? "bg-card-dark/80 border-border-dark"
            : "bg-white/80 border-gray-200"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-full transition-colors ${
              darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
            }`}
          >
            <FiArrowLeft className="text-xl" />
          </button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Restaurant Info */}
            <div
              className={`p-6 rounded-lg border ${
                darkMode
                  ? "bg-card-dark border-border-dark"
                  : "bg-white border-gray-200"
              }`}
            >
              <h2 className="text-lg font-bold mb-4">Ordering from</h2>
              <div className="flex items-center gap-3">
                {restaurant.logo_url ? (
                  <img
                    src={restaurant.logo_url}
                    alt={restaurant.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <MdStorefront className="text-3xl text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg">{restaurant.name}</h3>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Est. delivery: 30-45 min
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div
              className={`p-6 rounded-lg border ${
                darkMode
                  ? "bg-card-dark border-border-dark"
                  : "bg-white border-gray-200"
              }`}
            >
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FiMapPin />
                Delivery Address
              </h2>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter your delivery address..."
                className={`w-full p-3 rounded-lg border resize-none ${
                  darkMode
                    ? "bg-background-dark border-border-dark text-white"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
                rows="3"
              />
            </div>

            {/* Payment Method */}
            <div
              className={`p-6 rounded-lg border ${
                darkMode
                  ? "bg-card-dark border-border-dark"
                  : "bg-white border-gray-200"
              }`}
            >
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FiCreditCard />
                Payment Method
              </h2>
              <div className="space-y-3">
                {["card", "cash", "mobile"].map((method) => (
                  <label
                    key={method}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      paymentMethod === method
                        ? "border-primary bg-primary/10"
                        : darkMode
                        ? "border-border-dark hover:bg-white/5"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-primary"
                    />
                    <span className="capitalize">{method} Payment</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            <div
              className={`p-6 rounded-lg border ${
                darkMode
                  ? "bg-card-dark border-border-dark"
                  : "bg-white border-gray-200"
              }`}
            >
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FiClock />
                Special Instructions
              </h2>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requests? (optional)"
                className={`w-full p-3 rounded-lg border resize-none ${
                  darkMode
                    ? "bg-background-dark border-border-dark text-white"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
                rows="3"
              />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div
              className={`p-6 rounded-lg border sticky top-24 ${
                darkMode
                  ? "bg-card-dark border-border-dark"
                  : "bg-white border-gray-200"
              }`}
            >
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div
                className={`border-t pt-4 mb-4 ${
                  darkMode ? "border-white/10" : "border-gray-200"
                }`}
              >
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Delivery Fee</span>
                  <span>$3.99</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">
                    ${(getCartTotal() + 3.99).toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
