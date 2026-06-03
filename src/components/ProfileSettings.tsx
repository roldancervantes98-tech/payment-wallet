/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Lock, 
  CreditCard, 
  HelpCircle, 
  LogOut, 
  Check, 
  ChevronRight, 
  ShieldCheck,
  X,
  Plus
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileSettingsProps {
  user: UserProfile;
  onLogout: () => void;
  balance: number;
}

export default function ProfileSettings({
  user,
  onLogout,
  balance
}: ProfileSettingsProps) {
  // Option lists states
  const [notificationState, setNotificationState] = useState(true);
  const [showLinkedCards, setShowLinkedCards] = useState(false);
  const [helpState, setHelpState] = useState(false);
  const [securityState, setSecurityState] = useState(false);
  
  // Settings biometric
  const [biometricsActive, setBiometricsActive] = useState(true);
  
  // Card input states
  const [userCards, setUserCards] = useState([
    { brand: 'Visa Debit', last4: '5824', exp: '09/29' },
    { brand: 'Apple Cash', last4: '9510', exp: '12/28' }
  ]);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardBrand, setNewCardBrand] = useState('Mastercard');
  const [newCardExp, setNewCardExp] = useState('');
  const [addCardMsg, setAddCardMsg] = useState('');

  const handleAddNewCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCardNumber.length < 4) return;
    
    const last4 = newCardNumber.slice(-4);
    setUserCards([...userCards, {
      brand: newCardBrand,
      last4: last4 || '9999',
      exp: newCardExp || '10/30'
    }]);

    setNewCardNumber('');
    setNewCardExp('');
    setAddCardMsg('Card Linked Successfully!');
    setTimeout(() => setAddCardMsg(''), 2000);
  };

  return (
    <div className="flex flex-col space-y-6 pb-24">
      {/* 1. Header with Avatar & Details */}
      <div className="flex flex-col items-center text-center p-6 bg-[#141A3B]/60 rounded-3xl border border-white/5 space-y-3 relative overflow-hidden">
        {/* Glow backdrop accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        {/* Avatar with Verified status banner */}
        <div className="relative group">
          <div className="w-20 h-20 rounded-full p-0.5 bg-gradient-to-tr from-[#4F8EF7] to-indigo-500 shadow-xl">
            <img 
              src={user.avatarUrl} 
              alt="Avatar Profile" 
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          {user.verified && (
            <span className="absolute -bottom-1 -right-1 bg-blue-500 border border-[#0A0F2C] p-1.5 rounded-full text-white shadow-md flex items-center justify-center pulse-primary">
              <ShieldCheck className="w-4 h-4" />
            </span>
          )}
        </div>

        {/* User descriptor text */}
        <div className="flex flex-col">
          <div className="flex items-center justify-center gap-1.5">
            <h3 className="text-base font-bold font-syne text-white tracking-tight">{user.name}</h3>
            <span className="text-[9px] font-extrabold bg-[#4F8EF7]/20 border border-[#4F8EF7]/30 text-blue-400 px-1.5 py-0.5 rounded uppercase">Tier 1</span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">{user.email}</p>
          <p className="text-[11px] text-slate-500 font-mono font-medium mt-0.5">{user.phone}</p>
        </div>
      </div>

      {/* 2. Interactive Settings Lines list */}
      <div className="flex flex-col space-y-2">
        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider px-1">Control Center</span>
        
        <div className="bg-[#141A3B]/50 rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
          
          {/* Notifications config */}
          <div className="flex items-center justify-between p-4 bg-transparent">
            <div className="flex items-center gap-3 text-slate-200">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold font-syne">Activity Notifications</span>
            </div>
            
            {/* Toggle Switch */}
            <button 
              type="button"
              onClick={() => setNotificationState(!notificationState)}
              className={`w-10 h-5.5 rounded-full flex items-center p-0.5 transition-colors duration-200 ${
                notificationState ? 'bg-[#4F8EF7]' : 'bg-slate-700'
              }`}
              id="notifications-toggle"
            >
              <span className={`w-4.5 h-4.5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                notificationState ? 'translate-x-4.5' : 'translate-x-0'
              }`}></span>
            </button>
          </div>

          {/* Security details settings */}
          <button 
            type="button"
            onClick={() => setSecurityState(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
            id="security-btn"
          >
            <div className="flex items-center gap-3 text-slate-200">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold font-syne">Bio Lock & Authorization</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-emerald-400 font-bold uppercase bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
          </button>

          {/* Linked Cards details */}
          <button 
            type="button"
            onClick={() => setShowLinkedCards(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
            id="linked-cards-btn"
          >
            <div className="flex items-center gap-3 text-slate-200">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold font-syne">Linked Funding Sources</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-bold font-mono">({userCards.length})</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
          </button>

          {/* Help details */}
          <button 
            type="button"
            onClick={() => setHelpState(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left"
            id="help-btn"
          >
            <div className="flex items-center gap-3 text-slate-200">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold font-syne">Support Hotline & Helpdesk</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

        </div>
      </div>

      {/* 3. Session Reset/Log Out trigger */}
      <button
        type="button"
        onClick={onLogout}
        className="w-full py-3.5 bg-red-500/10 hover:bg-red-500/15 text-red-400 font-bold font-syne text-xs uppercase tracking-wide rounded-2xl border border-red-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all mt-4"
        id="logout-reset-btn"
      >
        <LogOut className="w-4 h-4" />
        Log Out / Reset App Data
      </button>

      {/* ================= BIOMETRIC SECURITY MODAL ================= */}
      {securityState && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-[#141A3B] rounded-t-[32px] sm:rounded-[24px] border border-white/10 shadow-2xl p-6 flex flex-col space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h4 className="text-sm font-bold text-slate-100 font-syne uppercase">Security Preferences</h4>
              <button onClick={() => setSecurityState(false)} className="p-1 rounded-full hover:bg-white/5">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              We leverage highly secure protocols to guard transactions and data.
            </p>

            <div className="p-4 bg-[#0A0F2C] rounded-xl border border-white/5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Require Biometrics</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Scans Face ID or credentials before authorizing payments.</span>
              </div>
              <button 
                type="button"
                onClick={() => setBiometricsActive(!biometricsActive)}
                className={`w-10 h-5.5 rounded-full flex items-center p-0.5 transition-colors duration-200 shrink-0 ${
                  biometricsActive ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span className={`w-4.5 h-4.5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                  biometricsActive ? 'translate-x-4.5' : 'translate-x-0'
                }`}></span>
              </button>
            </div>

            <button 
              type="button"
              onClick={() => setSecurityState(false)}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ================= LINKED CARDS CONFIG MODAL ================= */}
      {showLinkedCards && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-[#141A3B] rounded-t-[32px] sm:rounded-[24px] border border-white/10 shadow-2xl p-6 flex flex-col space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h4 className="text-sm font-bold text-slate-100 font-syne uppercase">Funding Sources</h4>
              <button onClick={() => setShowLinkedCards(false)} className="p-1 rounded-full hover:bg-white/5">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* List existing cards */}
            <div className="space-y-2">
              {userCards.map((card, i) => (
                <div key={i} className="p-3.5 bg-[#0A0F2C] rounded-xl border border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7.5 h-7.5 bg-indigo-500/10 text-indigo-400 flex items-center justify-center rounded">
                      <CreditCard className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{card.brand}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Expires {card.exp}</span>
                    </div>
                  </div>
                  <span className="font-mono font-extrabold text-slate-300">**** {card.last4}</span>
                </div>
              ))}
            </div>

            {/* Link New Form */}
            <form onSubmit={handleAddNewCard} className="space-y-3 pt-3 border-t border-white/5">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Link New Bank Card</span>
              
              <div className="grid grid-cols-2 gap-2">
                <select 
                  value={newCardBrand}
                  onChange={(e) => setNewCardBrand(e.target.value)}
                  className="bg-[#0A0F2C] text-slate-100 text-xs rounded-xl px-3 py-2 border border-white/10 focus:outline-none"
                >
                  <option value="Visa Credit">Visa Credit</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="Amex Silver">Amex Silver</option>
                </select>

                <input 
                  type="text" 
                  placeholder="Exp (MM/YY)" 
                  required
                  value={newCardExp}
                  onChange={(e) => setNewCardExp(e.target.value)}
                  className="bg-[#0A0F2C] text-slate-100 text-xs rounded-xl px-3 py-2 border border-white/10 focus:outline-none"
                />
              </div>

              <input 
                type="number" 
                placeholder="Card Number (16 digits)" 
                required
                value={newCardNumber}
                onChange={(e) => setNewCardNumber(e.target.value)}
                className="w-full bg-[#0A0F2C] text-slate-100 text-xs rounded-xl px-3 py-2 border border-white/10 focus:outline-none"
              />

              {addCardMsg && <p className="text-[11px] text-emerald-400 text-center font-bold">{addCardMsg}</p>}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#4F8EF7] hover:bg-[#4F8EF7]/90 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Source
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= HELP MODAL OVERLAY ================= */}
      {helpState && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-[#141A3B] rounded-t-[32px] sm:rounded-[24px] border border-white/10 shadow-2xl p-6 flex flex-col space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h4 className="text-sm font-bold text-slate-100 font-syne uppercase">Help & Support</h4>
              <button onClick={() => setHelpState(false)} className="p-1 rounded-full hover:bg-white/5">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <p className="font-bold text-slate-100">Need assistant with a charge?</p>
              <p className="leading-relaxed">
                Contact our customer desk at <span className="text-[#4F8EF7] font-semibold">1-800-SWIFTPAY</span>. We are available 24/7.
              </p>
              <div className="p-3 bg-[#0A0F2C] rounded-xl border border-white/5 space-y-1.5 text-[11px]">
                <p className="font-bold text-white">Frequently Asked Questions:</p>
                <p className="text-slate-400">- How long do sent transfers take? (Instant)</p>
                <p className="text-slate-400">- Are there transfer credit fees? (Free limit)</p>
                <p className="text-slate-400">- Is my linked card protected? (Bank tier SSL)</p>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => setHelpState(false)}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl"
            >
              Close Help
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
