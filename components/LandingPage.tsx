
import React from 'react';
import { Link } from 'react-router-dom';
import { FAQ_DATA } from '../constants';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gray-950 text-white selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">S</div>
            <span className="text-xl font-bold tracking-tight">Super AI</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/auth" className="text-sm font-medium hover:text-blue-400 transition-colors">Login</Link>
            <Link to="/auth" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-sm font-semibold transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] -z-10 rounded-full"></div>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-blue-400 mb-6 uppercase tracking-widest">
            ✨ Premium AI Comparison
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            Compare Multiple AIs with One Prompt
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Get side-by-side answers from ChatGPT, Gemini, Claude, DeepSeek & more — all in one place. Save time and find the best response instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/20 transition-all hover:scale-105">
              Start Comparing AI
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">
              See How It Works
            </a>
          </div>
        </div>
      </header>

      {/* AI Models Strip */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-sm font-semibold text-gray-500 mb-8 uppercase tracking-widest">
            Powered by the world's most advanced AI models
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
            <span className="text-2xl font-bold">ChatGPT</span>
            <span className="text-2xl font-bold">Gemini</span>
            <span className="text-2xl font-bold">Claude</span>
            <span className="text-2xl font-bold">DeepSeek</span>
            <span className="text-2xl font-bold">Perplexity</span>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400">Comparing AI is now as easy as 1-2-3</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Enter one prompt", desc: "Type your query into the unified search bar just once." },
              { step: "02", title: "Compare responses", desc: "Watch 5 different AIs generate answers side-by-side." },
              { step: "03", title: "Choose the best", desc: "Instantly identify which AI gives the most accurate response." }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 transition-all group">
                <div className="text-4xl font-black text-blue-500/30 mb-4 group-hover:text-blue-500 transition-colors">{item.step}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Simple Pricing</h2>
            <p className="text-gray-400">Start for free, upgrade when you need more power.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="p-10 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center">
              <h3 className="text-xl font-bold mb-2">Free Plan</h3>
              <div className="text-4xl font-extrabold mb-6">₹0<span className="text-lg text-gray-500">/mo</span></div>
              <ul className="space-y-4 mb-8 text-gray-400 text-sm">
                <li className="flex items-center gap-2">✅ Unlimited chat comparisons</li>
                <li className="flex items-center gap-2">✅ Access to all basic models</li>
                <li className="flex items-center gap-2">✅ Global community access</li>
              </ul>
              <Link to="/auth" className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl font-semibold text-center transition-all">Get Started</Link>
            </div>
            {/* Pro Plan */}
            <div className="p-10 rounded-3xl bg-blue-600 border border-blue-400/30 flex flex-col items-center relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white text-blue-600 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase">Popular</div>
              <h3 className="text-xl font-bold mb-2 text-white">Pro Plan</h3>
              <div className="text-4xl font-extrabold mb-6 text-white">₹99<span className="text-lg text-blue-200">/mo</span></div>
              <ul className="space-y-4 mb-8 text-blue-50 text-sm">
                <li className="flex items-center gap-2">⭐ Image generation (DALL-E style)</li>
                <li className="flex items-center gap-2">⭐ Priority faster responses</li>
                <li className="flex items-center gap-2">⭐ Advanced technical models</li>
                <li className="flex items-center gap-2">⭐ Manual Pro verification badge</li>
              </ul>
              <Link to="/auth" className="w-full py-3 bg-white text-blue-600 hover:bg-gray-100 rounded-xl font-bold text-center transition-all">Upgrade Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {FAQ_DATA.map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <h4 className="font-bold text-lg mb-2">{faq.question}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center font-bold text-sm text-white">S</div>
            <span className="font-bold text-lg text-white">Super AI</span>
          </div>
          <p className="text-gray-500 text-xs">© 2024 Super AI Comparison Platform. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
