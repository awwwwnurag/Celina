import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { CreditCard, CheckCircle } from 'lucide-react';

export const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, prices, couponCode, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  // Address Form State
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setLoading(true);
    setError('');

    try {
      // Map cartItems to backend expectations
      const orderItems = cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        size: item.size,
        product: item.product
      }));

      const orderPayload = {
        orderItems,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod,
        itemsPrice: prices.itemsPrice,
        taxPrice: prices.taxPrice,
        shippingPrice: prices.shippingPrice,
        totalPrice: prices.totalPrice,
        couponCode
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: user?.token ? `Bearer ${user.token}` : ''
        }
      };

      if (paymentMethod === 'Online') {
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
          setError('Failed to load Razorpay Checkout script. Check your internet connection.');
          setLoading(false);
          return;
        }

        // 1. Fetch Razorpay key ID from backend
        const { data: keyData } = await axios.get('/api/payment/razorpay/key', config);
        if (!keyData.key) {
          setError('Razorpay Key ID is not configured on the server.');
          setLoading(false);
          return;
        }

        // 2. Create Razorpay order on backend
        const { data: rzpOrder } = await axios.post('/api/payment/razorpay/order', { amount: prices.totalPrice }, config);

        // 3. Configure Razorpay checkout options
        const options = {
          key: keyData.key,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          name: 'Celina Clothing',
          description: 'Payment for E-Commerce Order',
          order_id: rzpOrder.id,
          handler: async (response) => {
            try {
              setLoading(true);
              const paidOrderPayload = {
                ...orderPayload,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature
              };

              const { data } = await axios.post('/api/orders', paidOrderPayload, config);
              clearCart();
              alert('Payment successful and order placed! Order ID: ' + data._id);
              navigate('/orders');
            } catch (err) {
              setError(err.response?.data?.message || 'Failed to verify online payment.');
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: ''
          },
          theme: {
            color: '#700d23' // Celina brand Burgundy color
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Cash on Delivery (COD) flow
        const { data } = await axios.post('/api/orders', orderPayload, config);
        clearCart();
        alert('Order placed successfully! Order ID: ' + data._id);
        navigate('/orders');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Try logging in again.');
    } finally {
      // Don't set loading false for online payment handler as it keeps running
      if (paymentMethod !== 'Online') {
        setLoading(false);
      }
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-semibold text-2xl uppercase tracking-wider text-brand-burgundy">Your Cart is Empty</h2>
        <p className="text-sm text-gray-500">You must add some products before checking out.</p>
        <Link to="/shop" className="inline-block bg-brand-burgundy text-white px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider">
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: SHIPPING FORM (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 p-6 rounded-lg shadow-sm">
            <h3 className="font-display font-semibold text-lg uppercase tracking-wider text-brand-burgundy dark:text-white border-b border-brand-border dark:border-zinc-800 pb-3 mb-6">
              Shipping Address
            </h3>

            {error && <p className="text-sm text-red-500 font-bold mb-4">{error}</p>}

            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs uppercase font-bold text-gray-500">First & Last Name</label>
                  <input
                    type="text"
                    required
                    defaultValue={user?.name || ''}
                    disabled
                    className="w-full text-sm p-3 border border-gray-300 dark:border-gray-700 dark:bg-zinc-800 rounded bg-gray-100 dark:text-gray-400 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs uppercase font-bold text-gray-500">Email Address</label>
                  <input
                    type="email"
                    required
                    defaultValue={user?.email || ''}
                    disabled
                    className="w-full text-sm p-3 border border-gray-300 dark:border-gray-700 dark:bg-zinc-800 rounded bg-gray-100 dark:text-gray-400 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase font-bold text-gray-500">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="Apartment, suite, unit, block, street address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-sm p-3 border border-gray-300 dark:border-gray-700 dark:bg-zinc-800 rounded outline-none text-brand-dark dark:text-white focus:border-brand-burgundy"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs uppercase font-bold text-gray-500">City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Noida"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-sm p-3 border border-gray-300 dark:border-gray-700 dark:bg-zinc-800 rounded outline-none text-brand-dark dark:text-white focus:border-brand-burgundy"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs uppercase font-bold text-gray-500">Postal / ZIP Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 201301"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full text-sm p-3 border border-gray-300 dark:border-gray-700 dark:bg-zinc-800 rounded outline-none text-brand-dark dark:text-white focus:border-brand-burgundy"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs uppercase font-bold text-gray-500">Country</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full text-sm p-3 border border-gray-300 dark:border-gray-700 dark:bg-zinc-800 rounded outline-none text-brand-dark dark:text-white focus:border-brand-burgundy"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-brand-border dark:border-zinc-800 mt-6">
                <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-brand-burgundy dark:text-white mb-4">
                  Payment Method
                </h4>
                <div className="flex gap-4">
                  <label className="flex-grow border border-brand-border dark:border-zinc-700 p-4 rounded-lg flex items-center gap-3 cursor-pointer hover:border-brand-burgundy">
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="text-brand-burgundy"
                    />
                    <div>
                      <span className="block font-bold text-xs uppercase tracking-wider">Cash on Delivery (COD)</span>
                      <span className="text-[10px] text-gray-500">Pay cash/UPI when your order is delivered.</span>
                    </div>
                  </label>
                  <label className="flex-grow border border-brand-border dark:border-zinc-700 p-4 rounded-lg flex items-center gap-3 cursor-pointer hover:border-brand-burgundy">
                    <input
                      type="radio"
                      name="payment"
                      value="Online"
                      checked={paymentMethod === 'Online'}
                      onChange={() => setPaymentMethod('Online')}
                      className="text-brand-burgundy"
                    />
                    <div>
                      <span className="block font-bold text-xs uppercase tracking-wider flex items-center gap-1">
                        <CreditCard size={14} /> Cards / UPI / Wallet
                      </span>
                      <span className="text-[10px] text-gray-500">Secure online gateway transactions.</span>
                    </div>
                  </label>
                </div>
              </div>

            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY (1 col) */}
        <div className="space-y-6">
          <div className="bg-brand-light dark:bg-zinc-800 border border-brand-border dark:border-zinc-700 p-6 rounded-lg">
            <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-brand-burgundy dark:text-white border-b border-brand-border dark:border-zinc-700 pb-3 mb-4">
              Order Summary
            </h3>

            {/* Cart summary items */}
            <div className="max-h-[220px] overflow-y-auto pr-1 space-y-3 scrollbar-none mb-4">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex gap-3 justify-between items-center text-xs">
                  <div className="flex gap-2.5 items-center">
                    <img src={item.image} alt={item.name} className="w-8 h-11 object-cover rounded" />
                    <div>
                      <span className="block font-bold text-brand-burgundy dark:text-white line-clamp-1">{item.name}</span>
                      <span className="text-[10px] text-gray-500 font-semibold">{item.size} / {item.color} (x{item.quantity})</span>
                    </div>
                  </div>
                  <span className="font-bold text-brand-burgundy dark:text-red-400">
                    ₹{(item.price * (1 - (item.discount / 100)) * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations breakdown */}
            <div className="space-y-2 text-xs font-semibold text-gray-700 dark:text-gray-300 border-t border-brand-border dark:border-zinc-700 pt-4">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span>₹{prices.itemsPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              {prices.promoDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Promo Coupon Discount</span>
                  <span>-₹{prices.promoDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Cost</span>
                <span>{prices.shippingPrice === 0 ? "FREE" : `₹${prices.shippingPrice.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (12%)</span>
                <span>₹{prices.taxPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <hr className="border-brand-border dark:border-zinc-700" />
              <div className="flex justify-between text-sm font-bold text-brand-burgundy dark:text-white uppercase">
                <span>Total Amount</span>
                <span>₹{prices.totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Complete checkout button */}
            {user ? (
              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="w-full bg-brand-burgundy text-white hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed py-3 rounded-full text-xs font-bold uppercase tracking-wider transition mt-6 flex justify-center items-center gap-2"
              >
                {loading ? 'Processing...' : 'Place Order (COD/Payment)'}
              </button>
            ) : (
              <div className="mt-6 text-center space-y-3">
                <p className="text-xs text-gray-500 font-semibold">Please log in to complete purchase.</p>
                <Link to="/login" className="block w-full bg-brand-burgundy text-white py-3 rounded-full text-xs font-bold uppercase tracking-wider">
                  Login / Register
                </Link>
              </div>
            )}

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              <CheckCircle size={12} className="text-green-500" />
              <span>Safe & Secure checkout</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
export default Checkout;
