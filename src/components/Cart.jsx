import React from "react";
import { useNavigate } from "react-router-dom";
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingBag } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

const Cart = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getRestaurantFromCart,
  } = useCart();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const restaurant = getRestaurantFromCart();

  const handleCheckout = () => {
    // Navigate to checkout page
    navigate("/checkout");
    setIsCartOpen(false);
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-96 z-50 shadow-2xl transform transition-transform duration-300 ${
          darkMode ? "bg-card-dark text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 border-b ${
            darkMode ? "border-white/10" : "border-gray-200"
          }`}
        >
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FiShoppingBag />
            Your Cart
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className={`p-2 rounded-full transition-colors ${
              darkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
            }`}
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col h-[calc(100%-4rem)]">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <FiShoppingBag className="text-6xl text-gray-400 mb-4" />
              <p
                className={`text-lg font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Your cart is empty
              </p>
              <p
                className={`text-sm mt-2 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Add items from a restaurant to get started
              </p>
            </div>
          ) : (
            <>
              {/* Restaurant Info */}
              {restaurant && (
                <div
                  className={`p-4 border-b ${
                    darkMode
                      ? "border-white/10 bg-white/5"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {restaurant.logo_url ? (
                      <img
                        src={restaurant.logo_url}
                        alt={restaurant.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <MdStorefront className="text-2xl text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{restaurant.name}</p>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {cartItems.length} item
                        {cartItems.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-lg p-3 border ${
                      darkMode
                        ? "border-white/10 bg-white/5"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex gap-3">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <MdStorefront className="text-2xl text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-primary font-bold mt-1">
                          ${Number(item.price).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className={`p-1 rounded-full ${
                              darkMode
                                ? "bg-white/10 hover:bg-white/20"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                          >
                            <FiMinus className="text-sm" />
                          </button>
                          <span className="font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className={`p-1 rounded-full ${
                              darkMode
                                ? "bg-white/10 hover:bg-white/20"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                          >
                            <FiPlus className="text-sm" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto p-1 text-red-500 hover:bg-red-500/10 rounded-full"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div
                className={`p-4 border-t ${
                  darkMode ? "border-white/10" : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ${getCartTotal().toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={clearCart}
                  className={`w-full mt-2 py-2 rounded-lg font-medium transition-colors ${
                    darkMode
                      ? "text-gray-400 hover:bg-white/5"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
