import React, { useState } from 'react';
import { ShoppingCart, Trash2, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
}

const Cart: React.FC = () => {
  const { items, removeFromCart, clearCart } = useCart();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const totalAmount = items.reduce((total, item) => total + item.price, 0);

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Payment successful!');
      clearCart();
    } catch (error) {
      alert('Payment error. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-4">
          <ShoppingCart className="h-8 w-8" />
          Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4" />
            <p className="text-xl">Your cart is empty</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6">
            <ul className="divide-y divide-gray-700">
              {items.map(item => (
                <li key={item.id} className="py-4 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.title} className="h-16 w-16 object-cover rounded" />
                    <div>
                      <h3 className="text-white font-medium">{item.title}</h3>
                      <p className="text-gray-400">${item.price}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-gray-700 pt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-white text-lg">Total:</span>
                <span className="text-white text-xl font-bold">${totalAmount}</span>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessingPayment}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard className="h-5 w-5" />
                {isProcessingPayment ? 'Processing payment...' : 'Pay now'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
