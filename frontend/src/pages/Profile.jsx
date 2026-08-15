import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  User, ClipboardList, CheckCircle, Package, Truck, XCircle,
  MapPin, CreditCard, Tag, Plus, Trash2, Copy, Calendar, X,
  Phone, Mail, Home, Briefcase, Heart, Bell, Download, Award, Wallet, RefreshCw
} from 'lucide-react';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';

const inputCls = 'w-full text-sm p-3 border-b border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:border-brand-burgundy text-brand-dark dark:text-white placeholder-gray-400 transition';
const labelCls = 'block text-[10px] uppercase font-bold text-gray-400 mb-0.5';

export const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const { wishlistItems } = useContext(CartContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab') || 'orders';
  const [activeTab, setActiveTab] = useState(tabParam);

  useEffect(() => {
    if (searchParams.get('tab')) setActiveTab(searchParams.get('tab'));
  }, [searchParams]);

  const handleTabChange = (t) => { setActiveTab(t); setSearchParams({ tab: t }); };

  // ─── Profile data ────────────────────────────────────────────────
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // ─── Settings state ──────────────────────────────────────────────
  const [name, setName]         = useState(user?.name || '');
  const [email, setEmail]       = useState(user?.email || '');
  const [mobile, setMobile]     = useState('');
  const [editMobile, setEditMobile] = useState(false);
  const [gender, setGender]     = useState('');
  const [birthday, setBirthday] = useState('');
  const [altMobileNum, setAltMobileNum] = useState('');
  const [altMobileHint, setAltMobileHint] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsError, setSettingsError]     = useState('');

  // ─── Orders state ────────────────────────────────────────────────
  const [orders, setOrders]             = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError]   = useState('');

  // ─── Address modal state ─────────────────────────────────────────
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addrName, setAddrName]           = useState('');
  const [addrMobile, setAddrMobile]       = useState('');
  const [addrPincode, setAddrPincode]     = useState('');
  const [addrState, setAddrState]         = useState('');
  const [addrHouse, setAddrHouse]         = useState('');
  const [addrAddress, setAddrAddress]     = useState('');
  const [addrLocality, setAddrLocality]   = useState('');
  const [addrCity, setAddrCity]           = useState('');
  const [addrType, setAddrType]           = useState('Home');
  const [addrSaturday, setAddrSaturday]   = useState(false);
  const [addrSunday, setAddrSunday]       = useState(false);
  const [addrDefault, setAddrDefault]     = useState(false);
  const [addressError, setAddressError]   = useState('');

  // ─── Card state ──────────────────────────────────────────────────
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardHolder, setCardHolder]     = useState('');
  const [cardNumber, setCardNumber]     = useState('');
  const [expiry, setExpiry]             = useState('');
  const [cardType, setCardType]         = useState('Visa');
  const [cardError, setCardError]       = useState('');
  const [cardSuccess, setCardSuccess]   = useState('');

  // ─── Coupon ──────────────────────────────────────────────────────
  const [copiedCode, setCopiedCode] = useState(null);

  // ─── Returns / exchange / cancellation state ─────────────────────
  const [returnRequests, setReturnRequests] = useState([]);
  const [returnsLoading, setReturnsLoading] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnOrder, setReturnOrder] = useState(null);
  const [returnType, setReturnType] = useState('Return');
  const [returnReason, setReturnReason] = useState('Wrong size');
  const [returnReasonDetail, setReturnReasonDetail] = useState('');
  const [returnSubmitting, setReturnSubmitting] = useState(false);
  const [returnError, setReturnError] = useState('');

  // ─── Fetch helpers ───────────────────────────────────────────────
  const fetchUserProfile = async () => {
    setProfileLoading(true);
    try {
      const { data } = await axios.get('/api/users/profile');
      setProfileData(data);
      setName(data.name);
      setEmail(data.email);
      setMobile(data.mobileNumber || '');
      setGender(data.gender || '');
      setBirthday(data.birthday || '');
      setAltMobileNum(data.altMobile?.number || '');
      setAltMobileHint(data.altMobile?.hint || '');
    } catch (_) {}
    finally { setProfileLoading(false); }
  };

  const fetchMyOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data } = await axios.get('/api/orders/myorders');
      setOrders(data || []);
    } catch (err) {
      setOrdersError(err.response?.data?.message || 'Failed to load orders.');
    } finally { setOrdersLoading(false); }
  };

  const fetchMyReturns = async () => {
    setReturnsLoading(true);
    try {
      const { data } = await axios.get('/api/returns/my');
      setReturnRequests(data || []);
    } catch (_) {
      setReturnRequests([]);
    } finally {
      setReturnsLoading(false);
    }
  };

  useEffect(() => {
    if (user) { fetchUserProfile(); fetchMyOrders(); fetchMyReturns(); }
  }, [user]);

  // ─── Settings submit ─────────────────────────────────────────────
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSettingsError(''); setSettingsSuccess('');
    if (password && password.length < 6) return setSettingsError('Password must be at least 6 characters.');
    if (password !== confirmPassword) return setSettingsError('Passwords do not match.');
    try {
      await updateProfile({ name, email, password, mobileNumber: mobile, gender, birthday, altMobile: { number: altMobileNum, hint: altMobileHint } });
      setSettingsSuccess('Profile details saved successfully!');
      setPassword(''); setConfirmPassword('');
      fetchUserProfile();
    } catch (err) {
      setSettingsError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  // ─── Address handlers ────────────────────────────────────────────
  const resetAddressForm = () => {
    setAddrName(''); setAddrMobile(''); setAddrPincode(''); setAddrState('');
    setAddrHouse(''); setAddrAddress(''); setAddrLocality(''); setAddrCity('');
    setAddrType('Home'); setAddrSaturday(false); setAddrSunday(false); setAddrDefault(false);
    setAddressError('');
  };

  const handleAddAddress = async (e) => {
    e.preventDefault(); setAddressError('');
    if (!addrName || !addrMobile || !addrPincode || !addrState || !addrHouse || !addrAddress || !addrLocality || !addrCity) {
      return setAddressError('All fields marked * are required.');
    }
    try {
      const payload = {
        name: addrName, mobile: addrMobile, pincode: addrPincode, state: addrState,
        houseNumber: addrHouse, address: addrAddress, locality: addrLocality, city: addrCity,
        addressType: addrType, openOnSaturday: addrSaturday, openOnSunday: addrSunday, isDefault: addrDefault
      };
      const { data } = await axios.post('/api/users/profile/address', payload);
      setProfileData(prev => ({ ...prev, addresses: data }));
      setShowAddressModal(false); resetAddressForm();
    } catch (err) {
      setAddressError(err.response?.data?.message || 'Failed to save address.');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Remove this address?')) return;
    try {
      const { data } = await axios.delete(`/api/users/profile/address/${id}`);
      setProfileData(prev => ({ ...prev, addresses: data }));
    } catch (_) {}
  };

  // ─── Card handlers ───────────────────────────────────────────────
  const handleAddCard = async (e) => {
    e.preventDefault(); setCardError(''); setCardSuccess('');
    const clean = cardNumber.replace(/\s+/g, '');
    if (!cardHolder || !cardNumber || !expiry) return setCardError('All card fields are required.');
    if (clean.length < 13 || clean.length > 19) return setCardError('Invalid card number.');
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return setCardError('Expiry must be MM/YY.');
    try {
      const { data } = await axios.post('/api/users/profile/card', { cardName: cardHolder, cardNumber: clean, expiry, cardType });
      setProfileData(prev => ({ ...prev, cards: data }));
      setCardSuccess('Card saved!');
      setCardHolder(''); setCardNumber(''); setExpiry(''); setShowCardForm(false);
    } catch (err) {
      setCardError(err.response?.data?.message || 'Failed to save card.');
    }
  };

  const handleDeleteCard = async (id) => {
    if (!window.confirm('Remove this card?')) return;
    try {
      const { data } = await axios.delete(`/api/users/profile/card/${id}`);
      setProfileData(prev => ({ ...prev, cards: data }));
    } catch (_) {}
  };

  const formatCardNumber = (num) => {
    const c = num.replace(/\s+/g, '');
    return c.length < 4 ? c : `•••• •••• •••• ${c.slice(-4)}`;
  };

  const copyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const openRequestModal = (order, type) => {
    setReturnOrder(order);
    setReturnType(type);
    setReturnReason(type === 'Cancellation' ? 'Ordered by mistake' : 'Wrong size');
    setReturnReasonDetail('');
    setReturnError('');
    setShowReturnModal(true);
  };

  const submitReturnRequest = async (e) => {
    e.preventDefault();
    if (!returnOrder) return;
    setReturnSubmitting(true);
    setReturnError('');

    try {
      const items = returnOrder.orderItems.map(item => ({
        product: item.product,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color
      }));

      await axios.post('/api/returns', {
        orderId: returnOrder._id,
        type: returnType,
        items,
        reason: returnReason,
        reasonDetail: returnReasonDetail
      });

      setShowReturnModal(false);
      setReturnOrder(null);
      fetchMyOrders();
      fetchMyReturns();
    } catch (err) {
      setReturnError(err.response?.data?.message || 'Failed to submit request.');
    } finally {
      setReturnSubmitting(false);
    }
  };

  // ─── Order status badge ──────────────────────────────────────────
  const getStatusBadge = (status) => {
    const map = {
      Processing: { bg: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300', Icon: Package },
      Shipped:    { bg: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300', Icon: Truck },
      Delivered:  { bg: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300', Icon: CheckCircle },
      Cancelled:  { bg: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300', Icon: XCircle }
    };
    const entry = map[status];
    if (!entry) return status;
    const { bg, Icon } = entry;
    return <span className={`inline-flex items-center gap-1 ${bg} text-[10px] font-bold px-2 py-0.5 rounded`}><Icon size={10}/>{status}</span>;
  };

  // ─── Sidebar nav item ────────────────────────────────────────────
  const NavBtn = ({ tab, icon: Icon, label, badge }) => (
    <button
      onClick={() => handleTabChange(tab)}
      className={`flex-grow md:w-full text-left px-4 py-3 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition ${
        activeTab === tab ? 'bg-brand-burgundy text-white' : 'bg-brand-light dark:bg-zinc-800 text-brand-dark dark:text-gray-300 hover:bg-gray-200'
      }`}
    >
      <Icon size={15}/> {label} {badge !== undefined && `(${badge})`}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">

        {/* ── SIDEBAR ────────────────────────────────────── */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-4">
          <div className="bg-brand-light dark:bg-zinc-800 p-6 rounded-lg text-center space-y-2 border border-brand-border dark:border-zinc-700">
            {profileData?.avatar
              ? <img src={profileData.avatar} alt={user?.name} className="w-16 h-16 rounded-full object-cover mx-auto border border-gray-200"/>
              : <div className="w-16 h-16 rounded-full bg-brand-burgundy text-white font-bold flex items-center justify-center text-2xl mx-auto">{user?.name?.charAt(0).toUpperCase()}</div>
            }
            <h4 className="font-display font-bold text-sm uppercase text-brand-burgundy dark:text-white mt-2">{user?.name}</h4>
            <p className="text-xs text-gray-500 font-semibold">{user?.email}</p>
            <span className="inline-block text-[9px] uppercase font-bold tracking-widest bg-gray-200 dark:bg-zinc-700 px-3 py-0.5 rounded-full text-brand-dark dark:text-gray-300">{user?.role}</span>
          </div>
          <div className="flex flex-wrap md:flex-col gap-2">
            <NavBtn tab="orders"    icon={ClipboardList} label="My Orders"       badge={orders.length}/>
            <NavBtn tab="wishlist"  icon={Heart}         label="Wishlist"        badge={wishlistItems.length}/>
            <NavBtn tab="coupons"   icon={Tag}           label="Coupons"/>
            <NavBtn tab="rewards"   icon={Award}         label="Reward Points"/>
            <NavBtn tab="notifications" icon={Bell}      label="Notifications"/>
            <NavBtn tab="downloads" icon={Download}      label="Downloads"/>
            <NavBtn tab="addresses" icon={MapPin}         label="Saved Addresses"/>
            <NavBtn tab="cards"     icon={CreditCard}    label="Saved Cards"/>
            <NavBtn tab="settings"  icon={User}           label="Edit Profile"/>
          </div>
        </aside>

        {/* ── MAIN CONTENT ───────────────────────────────── */}
        <main className="flex-grow">

          {/* ── TAB: ORDERS ── */}
          {activeTab === 'orders' && (
            <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 p-6 rounded-lg shadow-sm space-y-6">
              <h3 className="font-display font-semibold text-lg uppercase tracking-wider text-brand-burgundy dark:text-white border-b border-brand-border dark:border-zinc-800 pb-3">Order History</h3>
              {ordersLoading ? (
                <div className="text-center py-10 font-bold text-brand-burgundy animate-pulse">Loading orders…</div>
              ) : ordersError ? (
                <p className="text-sm text-red-500 font-bold text-center">{ordersError}</p>
              ) : orders.length === 0 ? (
                <div className="text-center py-20 text-gray-500 italic">You haven't placed any orders yet.</div>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order._id} className="border border-brand-border dark:border-zinc-800 rounded-lg p-4 space-y-4">
                      <div className="flex flex-wrap justify-between items-center bg-brand-light dark:bg-zinc-800 p-3 rounded text-xs font-semibold gap-4">
                        <div><span className="text-gray-400 uppercase tracking-wider">Order ID: </span><span className="text-brand-dark dark:text-white">{order._id}</span></div>
                        <div><span className="text-gray-400 uppercase tracking-wider">Placed: </span><span className="text-brand-dark dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</span></div>
                        <div><span className="text-brand-burgundy font-bold">₹{order.totalPrice.toLocaleString('en-IN', {minimumFractionDigits:2})}</span></div>
                        <div>{getStatusBadge(order.status)}</div>
                      </div>
                      <div className="space-y-3">
                        {order.orderItems.map((item, idx) => (
                          <div key={idx} className="flex gap-4 justify-between items-center text-xs">
                            <div className="flex gap-3 items-center">
                              <img src={item.image} alt={item.name} className="w-10 h-14 object-cover rounded bg-gray-50"/>
                              <div>
                                <span className="block font-bold text-brand-burgundy dark:text-white uppercase">{item.name}</span>
                                <span className="text-[10px] text-gray-500">Size: {item.size} | Qty: {item.quantity}</span>
                              </div>
                            </div>
                            <span className="font-bold text-brand-dark dark:text-gray-300">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                      {order.status === 'Processing' && (
                        <div className="flex justify-end pt-2">
                          <button
                            onClick={async () => {
                              if (!window.confirm('Cancel this order?')) return;
                              try { await axios.put(`/api/orders/${order._id}/status`, { status: 'Cancelled' }); fetchMyOrders(); } catch(_) {}
                            }}
                            className="border border-red-500 text-red-500 hover:bg-red-50 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition"
                          >Cancel Order</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 p-6 rounded-lg shadow-sm space-y-6">
              <h3 className="font-display font-semibold text-lg uppercase tracking-wider text-brand-burgundy dark:text-white border-b border-brand-border dark:border-zinc-800 pb-3">Wishlist</h3>
              {wishlistItems.length === 0 ? (
                <div className="text-center py-14 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-dashed border-gray-200 dark:border-zinc-700">
                  <Heart size={30} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">No wishlist items yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistItems.map(item => (
                    <a key={item._id} href={`/product/${item._id}`} className="border border-brand-border dark:border-zinc-800 rounded-lg p-3 flex gap-3 hover:border-brand-burgundy transition">
                      <img src={typeof item.images?.[0] === 'string' ? item.images[0] : (item.images?.[0]?.url || '/placeholder.jpg')} alt={item.name} className="w-16 h-20 object-cover rounded bg-gray-100" />
                      <div className="min-w-0">
                        <h4 className="font-black text-xs uppercase text-brand-dark dark:text-white line-clamp-2">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">₹{Number(item.price || 0).toLocaleString('en-IN')}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB: COUPONS ── */}
          {activeTab === 'coupons' && (
            <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 p-6 rounded-lg shadow-sm space-y-6">
              <h3 className="font-display font-semibold text-lg uppercase tracking-wider text-brand-burgundy dark:text-white border-b border-brand-border dark:border-zinc-800 pb-3">Coupons & Offers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { code:'FLAT10',    discount:'Flat 10% OFF',       desc:'Save 10% on all orders. No minimum.',           expiry:'Dec 31, 2026' },
                  { code:'FREESHIP',  discount:'Free Shipping',       desc:'Free delivery on all orders.',                  expiry:'Dec 31, 2026' },
                  { code:'CELINA20',  discount:'20% OFF Collections', desc:'Applicable on ethnic & festive wear.',           expiry:'Oct 30, 2026' },
                  { code:'FESTIVE30', discount:'30% OFF Special',     desc:'Select apparel and accessories collections.',   expiry:'Nov 15, 2026' }
                ].map(c => (
                  <div key={c.code} className="border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-xl p-4 flex flex-col justify-between hover:border-brand-burgundy transition">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="bg-brand-burgundy text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">{c.discount}</span>
                        <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-1"><Calendar size={10}/> Exp: {c.expiry}</span>
                      </div>
                      <h4 className="font-bold text-sm text-gray-800 dark:text-white uppercase tracking-wider">{c.code}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
                    </div>
                    <button
                      onClick={() => copyCoupon(c.code)}
                      className={`w-full mt-4 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${copiedCode===c.code ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-neutral-800'}`}
                    >
                      <Copy size={12}/> {copiedCode===c.code ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 p-6 rounded-lg shadow-sm space-y-6">
              <h3 className="font-display font-semibold text-lg uppercase tracking-wider text-brand-burgundy dark:text-white border-b border-brand-border dark:border-zinc-800 pb-3">Reward Points</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg bg-brand-burgundy text-white p-5">
                  <p className="text-[10px] uppercase tracking-widest font-black opacity-80">Available Balance</p>
                  <h4 className="text-3xl font-black mt-1">{orders.length * 125 + wishlistItems.length * 25}</h4>
                  <p className="text-xs opacity-80 mt-1">points ready to redeem</p>
                </div>
                {['Earn 5 points per Rs. 100 spent', 'Redeem points on checkout', 'Bonus points on referrals'].map(rule => (
                  <div key={rule} className="rounded-lg border border-brand-border p-5 text-xs font-bold text-gray-600 flex items-center gap-3">
                    <Award size={18} className="text-brand-burgundy" /> {rule}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 p-6 rounded-lg shadow-sm space-y-4">
              <h3 className="font-display font-semibold text-lg uppercase tracking-wider text-brand-burgundy dark:text-white border-b border-brand-border dark:border-zinc-800 pb-3">Notifications</h3>
              {[
                'Your latest order updates will appear here.',
                'Wishlist price drops and back-in-stock alerts are enabled.',
                'Newsletter and festival deal alerts are active.'
              ].map((note, idx) => (
                <div key={note} className="rounded-lg border border-brand-border p-4 flex items-center gap-3 text-xs font-semibold text-gray-600">
                  <Bell size={15} className={idx === 0 ? 'text-green-600' : 'text-brand-burgundy'} /> {note}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'downloads' && (
            <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 p-6 rounded-lg shadow-sm space-y-4">
              <h3 className="font-display font-semibold text-lg uppercase tracking-wider text-brand-burgundy dark:text-white border-b border-brand-border dark:border-zinc-800 pb-3">Downloads</h3>
              {orders.length === 0 ? (
                <div className="text-center py-12 text-xs text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">Invoices and digital downloads appear after your first order.</div>
              ) : (
                orders.map(order => (
                  <div key={order._id} className="rounded-lg border border-brand-border p-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black text-black uppercase">Invoice #{order._id.slice(-8)}</p>
                      <p className="text-[10px] text-gray-400">Placed {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button className="px-4 py-2 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                      <Download size={12} /> Download
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── TAB: SAVED ADDRESSES ── */}
          {activeTab === 'addresses' && (
            <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 p-6 rounded-lg shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-brand-border dark:border-zinc-800 pb-3">
                <h3 className="font-display font-semibold text-lg uppercase tracking-wider text-brand-burgundy dark:text-white">Saved Addresses</h3>
                <button
                  onClick={() => { setShowAddressModal(true); resetAddressForm(); }}
                  className="bg-brand-burgundy text-white hover:opacity-90 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition"
                >
                  <Plus size={14}/> Add New Address
                </button>
              </div>

              {profileLoading ? (
                <div className="text-center py-6 font-bold text-brand-burgundy">Loading…</div>
              ) : !profileData?.addresses?.length ? (
                <div className="text-center py-10 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-dashed border-gray-200 dark:border-zinc-700">
                  <MapPin size={28} className="text-gray-300 mx-auto mb-2"/>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">No Addresses Saved</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Add an address to speed up checkout.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData.addresses.map(addr => (
                    <div key={addr._id} className={`border rounded-xl p-4 flex flex-col justify-between transition ${addr.isDefault ? 'border-brand-burgundy' : 'border-gray-200 dark:border-zinc-800'}`}>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 ${addr.addressType === 'Office' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {addr.addressType === 'Office' ? <Briefcase size={9}/> : <Home size={9}/>} {addr.addressType}
                          </span>
                          {addr.isDefault && <span className="bg-brand-burgundy text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Default</span>}
                        </div>
                        <p className="text-xs font-black text-brand-dark dark:text-white">{addr.name} <span className="font-normal text-gray-500">· {addr.mobile}</span></p>
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{addr.houseNumber}, {addr.address}</p>
                        <p className="text-xs text-gray-500">{addr.locality}, {addr.city}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{addr.state} – {addr.pincode}</p>
                        {addr.addressType === 'Office' && (addr.openOnSaturday || addr.openOnSunday) && (
                          <p className="text-[10px] text-blue-500 font-semibold mt-0.5">
                            Open: {[addr.openOnSaturday && 'Saturday', addr.openOnSunday && 'Sunday'].filter(Boolean).join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-end border-t border-gray-100 dark:border-zinc-800 pt-3 mt-3">
                        <button onClick={() => handleDeleteAddress(addr._id)} className="text-red-500 hover:text-red-700 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition">
                          <Trash2 size={12}/> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB: SAVED CARDS ── */}
          {activeTab === 'cards' && (
            <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 p-6 rounded-lg shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-brand-border dark:border-zinc-800 pb-3">
                <h3 className="font-display font-semibold text-lg uppercase tracking-wider text-brand-burgundy dark:text-white">Saved Cards</h3>
                <button onClick={() => { setShowCardForm(!showCardForm); setCardError(''); setCardSuccess(''); }} className="bg-brand-burgundy text-white hover:opacity-90 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition">
                  <Plus size={14}/> {showCardForm ? 'Cancel' : 'Add Card'}
                </button>
              </div>

              {showCardForm && (
                <form onSubmit={handleAddCard} className="bg-brand-light/40 dark:bg-zinc-800/40 p-5 rounded-lg border border-brand-border dark:border-zinc-700 space-y-4 max-w-xl">
                  {cardError   && <p className="text-xs text-red-500 font-bold bg-red-50 p-2 rounded">{cardError}</p>}
                  {cardSuccess && <p className="text-xs text-green-600 font-bold bg-green-50 p-2 rounded">{cardSuccess}</p>}
                  <div className="space-y-1">
                    <label className={labelCls}>Card Holder Name</label>
                    <input type="text" required value={cardHolder} onChange={e => setCardHolder(e.target.value)} placeholder="e.g. Anurag Aryan" className={inputCls}/>
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Card Number</label>
                    <input
                      type="text" required value={cardNumber} maxLength="19" placeholder="4321 0987 6543 2109"
                      onChange={e => { const d = e.target.value.replace(/\D/g,''); setCardNumber(d.replace(/(\d{4})/g,'$1 ').trim()); }}
                      className={inputCls}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className={labelCls}>Expiry (MM/YY)</label>
                      <input type="text" required value={expiry} maxLength="5" placeholder="MM/YY"
                        onChange={e => { const d=e.target.value.replace(/\D/g,''); setExpiry(d.length>2?`${d.slice(0,2)}/${d.slice(2,4)}`:d); }}
                        className={inputCls}/>
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>Network</label>
                      <select value={cardType} onChange={e => setCardType(e.target.value)} className={inputCls}>
                        {['Visa','Mastercard','Rupay','Amex'].map(n => <option key={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="bg-brand-burgundy text-white hover:opacity-90 py-2.5 px-6 rounded-full text-xs font-bold uppercase tracking-wider transition">Save Card</button>
                </form>
              )}

              {profileLoading ? (
                <div className="text-center py-6 font-bold text-brand-burgundy">Loading…</div>
              ) : !profileData?.cards?.length ? (
                <div className="text-center py-10 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-dashed border-gray-200 dark:border-zinc-700">
                  <CreditCard size={28} className="text-gray-300 mx-auto mb-2"/>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">No Saved Cards</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Save a card to checkout faster.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData.cards.map(c => (
                    <div key={c._id} className="bg-gradient-to-br from-zinc-800 to-black text-white rounded-2xl p-5 flex flex-col justify-between h-44 shadow-lg border border-zinc-700/50 hover:-translate-y-1 transition duration-300 select-none">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[9px] uppercase tracking-widest font-black text-gray-400">Payment Card</p>
                          <h4 className="font-bold text-xs uppercase tracking-wider text-gray-200 mt-1">{c.cardType}</h4>
                        </div>
                        <CreditCard size={24} className="text-gray-400"/>
                      </div>
                      <p className="font-Poppins font-bold text-sm tracking-widest text-gray-100">{formatCardNumber(c.cardNumber)}</p>
                      <div className="flex justify-between items-end border-t border-zinc-800 pt-3">
                        <div>
                          <p className="text-[8px] uppercase tracking-wider text-gray-500">Card Holder</p>
                          <p className="text-xs font-bold uppercase truncate max-w-[120px] text-gray-300">{c.cardName}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-[8px] uppercase tracking-wider text-gray-500">Expires</p>
                            <p className="text-xs font-bold text-gray-300">{c.expiry}</p>
                          </div>
                          <button onClick={() => handleDeleteCard(c._id)} className="text-red-400 hover:text-red-600 transition" title="Remove">
                            <Trash2 size={14}/>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB: SETTINGS (Myntra-style) ── */}
          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-brand-border dark:border-zinc-800">
                <h3 className="font-display font-semibold text-lg text-brand-burgundy dark:text-white">Edit Details</h3>
              </div>

              <form onSubmit={handleSettingsSubmit} className="divide-y divide-gray-100 dark:divide-zinc-800">

                {/* Mobile Number */}
                <div className="flex items-center justify-between px-6 py-5 gap-4">
                  <div className="flex-grow">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Mobile Number *</p>
                    {editMobile ? (
                      <input
                        type="tel" maxLength="10" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g,''))}
                        className="text-sm font-bold text-brand-dark dark:text-white border-b border-brand-burgundy bg-transparent outline-none w-44"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-brand-dark dark:text-white">{mobile || 'Not added'}</span>
                        {mobile && <CheckCircle size={14} className="text-green-500"/>}
                      </div>
                    )}
                  </div>
                  <button type="button" onClick={() => setEditMobile(!editMobile)}
                    className="text-xs font-black uppercase tracking-widest border border-gray-300 dark:border-zinc-700 px-5 py-2 rounded hover:border-brand-burgundy hover:text-brand-burgundy transition min-w-[80px]">
                    {editMobile ? 'DONE' : (mobile ? 'CHANGE' : 'ADD')}
                  </button>
                </div>

                {/* Email */}
                <div className="flex items-center justify-between px-6 py-5 gap-4">
                  <div className="flex-grow">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Email</p>
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      className="text-sm font-bold text-brand-dark dark:text-white bg-transparent border-b border-gray-200 dark:border-zinc-700 focus:border-brand-burgundy outline-none w-full transition"
                    />
                  </div>
                  {!email && (
                    <button type="button" className="text-xs font-black uppercase tracking-widest border border-gray-300 dark:border-zinc-700 px-5 py-2 rounded hover:border-brand-burgundy hover:text-brand-burgundy transition min-w-[80px]">ADD</button>
                  )}
                </div>

                {/* Full Name */}
                <div className="px-6 py-5">
                  <label className={labelCls}>Full Name</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)}
                    className="w-full text-sm font-bold border border-gray-200 dark:border-zinc-700 rounded p-3 bg-transparent dark:text-white outline-none focus:border-brand-burgundy transition"/>
                </div>

                {/* Gender toggle */}
                <div className="px-6 py-5">
                  <p className={labelCls}>Gender</p>
                  <div className="flex gap-0 mt-2 max-w-xs border border-gray-200 dark:border-zinc-700 rounded overflow-hidden">
                    {['Male','Female'].map(g => (
                      <button key={g} type="button" onClick={() => setGender(g)}
                        className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition ${gender===g ? 'bg-brand-burgundy text-white' : 'bg-white dark:bg-zinc-900 text-gray-500 hover:bg-gray-50'}`}
                      >
                        {gender===g && <CheckCircle size={12}/>} {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Birthday */}
                <div className="px-6 py-5">
                  <label className={labelCls}>Birthday (DD/MM/YYYY)</label>
                  <input type="text" value={birthday} onChange={e => setBirthday(e.target.value)} placeholder="dd/mm/yyyy"
                    className="w-full max-w-xs text-sm font-bold border border-gray-200 dark:border-zinc-700 rounded p-3 bg-transparent dark:text-white outline-none focus:border-brand-burgundy transition"/>
                </div>

                {/* Alternate Mobile */}
                <div className="px-6 py-5 space-y-3">
                  <p className="text-sm font-bold text-brand-dark dark:text-white">Alternate mobile details</p>
                  <div className="flex gap-2 items-center max-w-md">
                    <span className="text-sm font-bold text-gray-400 border border-gray-200 dark:border-zinc-700 px-3 py-3 rounded bg-gray-50 dark:bg-zinc-800">+91</span>
                    <input type="tel" maxLength="10" value={altMobileNum} onChange={e => setAltMobileNum(e.target.value.replace(/\D/g,''))} placeholder="Mobile Number"
                      className="flex-1 text-sm font-bold border border-gray-200 dark:border-zinc-700 rounded p-3 bg-transparent dark:text-white outline-none focus:border-brand-burgundy transition"/>
                  </div>
                  <input type="text" value={altMobileHint} onChange={e => setAltMobileHint(e.target.value)} placeholder="Joint name (optional)"
                    className="w-full max-w-md text-sm font-bold border border-gray-200 dark:border-zinc-700 rounded p-3 bg-transparent dark:text-white outline-none focus:border-brand-burgundy transition"/>
                </div>

                {/* Password */}
                <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>New Password (Optional)</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Leave blank to keep"
                      className="w-full text-sm font-bold border border-gray-200 dark:border-zinc-700 rounded p-3 bg-transparent dark:text-white outline-none focus:border-brand-burgundy transition"/>
                  </div>
                  <div>
                    <label className={labelCls}>Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full text-sm font-bold border border-gray-200 dark:border-zinc-700 rounded p-3 bg-transparent dark:text-white outline-none focus:border-brand-burgundy transition"/>
                  </div>
                </div>

                {/* Feedback */}
                {settingsSuccess && <div className="mx-6 text-xs text-green-600 font-bold bg-green-50 p-3 rounded">{settingsSuccess}</div>}
                {settingsError   && <div className="mx-6 text-xs text-red-500 font-bold bg-red-50 p-3 rounded">{settingsError}</div>}

                {/* Submit */}
                <div className="px-6 py-6">
                  <button type="submit" className="w-full bg-brand-burgundy text-white hover:opacity-90 py-3.5 rounded text-xs font-black uppercase tracking-widest transition">
                    SAVE DETAILS
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* ── ADDRESS MODAL ──────────────────────────────────────────── */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4" onClick={() => { setShowAddressModal(false); resetAddressForm(); }}>
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"/>

          <div
            className="relative bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-900 z-10">
              <h3 className="font-black text-sm uppercase tracking-widest text-brand-dark dark:text-white">Add New Address</h3>
              <button onClick={() => { setShowAddressModal(false); resetAddressForm(); }} className="text-gray-400 hover:text-brand-dark transition">
                <X size={18}/>
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="px-6 py-6 space-y-5">
              {addressError && <p className="text-xs text-red-500 font-bold bg-red-50 p-2 rounded">{addressError}</p>}

              {/* Name */}
              <div>
                <label className={labelCls}>Name *</label>
                <input value={addrName} onChange={e=>setAddrName(e.target.value)} required placeholder="Full name" className={inputCls}/>
              </div>

              {/* Mobile */}
              <div>
                <label className={labelCls}>Mobile *</label>
                <input value={addrMobile} onChange={e=>setAddrMobile(e.target.value.replace(/\D/g,''))} maxLength="10" required placeholder="10-digit mobile number" className={inputCls}/>
              </div>

              {/* Pincode + State */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Pincode *</label>
                  <input value={addrPincode} onChange={e=>setAddrPincode(e.target.value.replace(/\D/g,''))} maxLength="6" required placeholder="6-digit PIN" className={inputCls}/>
                </div>
                <div>
                  <label className={labelCls}>State *</label>
                  <input value={addrState} onChange={e=>setAddrState(e.target.value)} required placeholder="e.g. Maharashtra" className={inputCls}/>
                </div>
              </div>

              {/* House */}
              <div>
                <label className={labelCls}>House Number / Tower / Block *</label>
                <input value={addrHouse} onChange={e=>setAddrHouse(e.target.value)} required placeholder="e.g. Flat 402, Tower B" className={inputCls}/>
              </div>

              {/* Address */}
              <div>
                <label className={labelCls}>Address (Building, Street, Area) *</label>
                <input value={addrAddress} onChange={e=>setAddrAddress(e.target.value)} required placeholder="e.g. Royal Gardens, MG Road" className={inputCls}/>
              </div>

              {/* Locality */}
              <div>
                <label className={labelCls}>Locality / Town *</label>
                <input value={addrLocality} onChange={e=>setAddrLocality(e.target.value)} required placeholder="e.g. Bandra West" className={inputCls}/>
              </div>

              {/* City */}
              <div>
                <label className={labelCls}>City / District *</label>
                <input value={addrCity} onChange={e=>setAddrCity(e.target.value)} required placeholder="e.g. Mumbai" className={inputCls}/>
              </div>

              {/* Address Type */}
              <div>
                <p className={labelCls}>Type of Address *</p>
                <div className="flex gap-6 mt-2">
                  {['Home','Office'].map(t => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="radio" name="addrType" value={t} checked={addrType===t} onChange={() => setAddrType(t)}
                        className="accent-brand-burgundy w-4 h-4"/>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Office weekend checkboxes */}
              {addrType === 'Office' && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-semibold">Is your office open on weekends?</p>
                  {[['addrSaturday','Open on Saturday',addrSaturday,setAddrSaturday],['addrSunday','Open on Sunday',addrSunday,setAddrSunday]].map(([id,label,val,setter]) => (
                    <label key={id} className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" id={id} checked={val} onChange={e=>setter(e.target.checked)} className="accent-brand-burgundy w-4 h-4"/>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Default */}
              <label className="flex items-center gap-2 cursor-pointer select-none border-t border-gray-100 dark:border-zinc-800 pt-4">
                <input type="checkbox" checked={addrDefault} onChange={e=>setAddrDefault(e.target.checked)} className="accent-brand-burgundy w-4 h-4"/>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Make this as my default address</span>
              </label>

              {/* Actions */}
              <div className="flex border-t border-gray-100 dark:border-zinc-800 pt-4 -mx-6 px-0">
                <button type="button" onClick={() => { setShowAddressModal(false); resetAddressForm(); }}
                  className="flex-1 py-3.5 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-brand-dark dark:hover:text-white border-r border-gray-100 dark:border-zinc-800 transition">
                  CANCEL
                </button>
                <button type="submit"
                  className="flex-1 py-3.5 text-xs font-black uppercase tracking-widest text-brand-burgundy hover:bg-brand-burgundy hover:text-white transition">
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
