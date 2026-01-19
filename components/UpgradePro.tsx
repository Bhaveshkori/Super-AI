
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, PlanType } from '../types';

interface UpgradeProProps {
  user: User;
}

const UpgradePro: React.FC<UpgradeProProps> = ({ user }) => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [transactionId, setTransactionId] = useState('');
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleManualPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      alert("Payment submitted successfully! Our team will verify and upgrade your account within 24 hours.");
      navigate('/home');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/home" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          Back to Dashboard
        </Link>

        {step === 1 ? (
          <div className="space-y-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Upgrade to Pro</h1>
              <p className="text-gray-400 max-w-xl mx-auto">Unlock image generation, faster response times, and premium AI models.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div 
                onClick={() => setSelectedPlan('monthly')}
                className={`p-10 rounded-[40px] border-2 cursor-pointer transition-all ${selectedPlan === 'monthly' ? 'bg-blue-600 border-blue-400 shadow-2xl shadow-blue-900/20 scale-105' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Monthly</h3>
                  <div className="w-6 h-6 rounded-full border-2 border-white/20 flex items-center justify-center">
                    {selectedPlan === 'monthly' && <div className="w-3 h-3 bg-white rounded-full"></div>}
                  </div>
                </div>
                <div className="text-5xl font-black mb-2">₹99</div>
                <p className="text-blue-100/60 text-sm">Billed every month</p>
              </div>

              <div 
                onClick={() => setSelectedPlan('yearly')}
                className={`p-10 rounded-[40px] border-2 cursor-pointer transition-all relative ${selectedPlan === 'yearly' ? 'bg-blue-600 border-blue-400 shadow-2xl shadow-blue-900/20 scale-105' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
              >
                <div className="absolute top-6 right-10 bg-white text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Best Value</div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Yearly</h3>
                  <div className="w-6 h-6 rounded-full border-2 border-white/20 flex items-center justify-center">
                    {selectedPlan === 'yearly' && <div className="w-3 h-3 bg-white rounded-full"></div>}
                  </div>
                </div>
                <div className="text-5xl font-black mb-2">₹999</div>
                <p className="text-blue-100/60 text-sm">Save ₹189 per year</p>
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              className="w-full py-6 bg-white text-blue-600 hover:bg-gray-100 rounded-3xl font-bold text-xl transition-all shadow-xl shadow-white/5 active:scale-[0.98]"
            >
              Continue to Payment
            </button>
          </div>
        ) : (
          <div className="max-w-xl mx-auto bg-white/[0.03] border border-white/5 rounded-[40px] p-10">
            <h2 className="text-3xl font-bold mb-6 text-center">Complete Payment</h2>
            <p className="text-gray-400 text-sm mb-8 text-center leading-relaxed">
              Scan the QR code or pay to the UPI ID below. After payment, upload the screenshot and enter Transaction ID.
            </p>

            <div className="bg-white p-6 rounded-3xl mb-8 flex flex-col items-center">
               <img src="https://picsum.photos/250/250?text=UPI+QR" alt="UPI QR" className="mb-4" />
               <p className="text-black font-mono font-bold">bhaveshkori@fam</p>
            </div>

            <form onSubmit={handleManualPayment} className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-2 ml-1">Transaction ID</label>
                <input 
                  type="text" 
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all" 
                  placeholder="Enter 12-digit UTR No."
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-2 ml-1">Screenshot Proof</label>
                <input 
                  type="file" 
                  accept="image/*"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700" 
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold text-lg transition-all flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : 'Submit Payment Details'}
              </button>
              <button type="button" onClick={() => setStep(1)} className="w-full py-3 text-sm font-medium text-gray-500 hover:text-white transition-colors">Go Back</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpgradePro;
