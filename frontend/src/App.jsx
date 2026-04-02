import React, { useState, useEffect } from 'react';
import { Plane, Globe, ShieldCheck, MapPin, X, User, LogOut, Bot, Sparkles } from 'lucide-react';
import axios from 'axios';
import Chatbot from '/components/Chatbot.jsx';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [formData, setFormData] = useState({ fullname: '', email: '', password: '' });

  useEffect(() => {
    const savedUser = localStorage.getItem('aether_user');
    if (savedUser) {
      setUserName(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const packages = [
    { id: 1, title: "Maldives Serenity", price: "₹1,20,000", type: "International", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8" },
    { id: 2, title: "Himachal Heights", price: "₹35,000", type: "Domestic", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23" },
    { id: 3, title: "Parisian Elegance", price: "₹1,85,000", type: "International", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34" }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* --- NAVIGATION --- */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 sticky top-0 bg-white/90 backdrop-blur-md z-[50] border-b border-slate-50">
        <div className="text-2xl font-serif font-black tracking-tighter flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white italic text-sm">A</div>
          AETHER<span className="text-blue-600">.</span>
        </div>
        <button 
          onClick={() => isLoggedIn ? (setIsLoggedIn(false), localStorage.removeItem('aether_user')) : setShowAuthModal(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-blue-600 transition-all shadow-xl text-sm font-bold"
        >
          {isLoggedIn ? <LogOut size={16} /> : <User size={16} />}
          {isLoggedIn ? "Logout" : "Sign In"}
        </button>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="px-6 pt-24 pb-12 text-center max-w-5xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-serif font-bold leading-[1.1] mb-6 tracking-tight">
          Voyage, <br /> <span className="italic font-light text-slate-400 font-sans">Sans Compromise.</span>
        </h1>
        <p className="text-slate-500 text-lg mb-8 uppercase tracking-widest font-bold text-[10px]">
          Powered by Aurelius Multi-Agent Intelligence
        </p>
      </section>
<section className="bg-white py-20 px-6">
  <div className="max-w-7xl mx-auto text-center mb-16">
    <h2 className="text-5xl font-serif font-bold mb-4">The Intelligent Voyager</h2>
    <p className="text-slate-400 max-w-2xl mx-auto">
      Describe your dream. Our multi-agent system will scour the globe in real-time to build your perfect itinerary.
    </p>
  </div>
  
  {/* THIS IS THE CHATBOT SECTION */}
  <Chatbot currentUser={userName} />
</section>

      {/* --- PACKAGES SECTION --- */}
      <section id="packages" className="px-6 md:px-12 py-24 max-w-7xl mx-auto">
        <h2 className="text-4xl font-serif font-bold mb-12">Hand-Picked Stays</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {packages.map(pkg => (
            <div key={pkg.id} className="group relative overflow-hidden rounded-[2.5rem] h-[450px] shadow-2xl">
              <img src={pkg.img} className="h-full w-full object-cover group-hover:scale-110 transition duration-1000" alt={pkg.title} />
              <div className="absolute bottom-8 left-8 text-white">
                 <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">{pkg.type}</p>
                 <h3 className="text-2xl font-serif font-bold italic">{pkg.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Auth Modal remains the same */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl">
            <h2 className="text-2xl font-serif font-bold mb-6 text-center">Join Aether</h2>
            <button className="w-full bg-slate-900 text-white py-4 rounded-xl" onClick={() => setShowAuthModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}