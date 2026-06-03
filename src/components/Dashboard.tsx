/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  DollarSign, 
  QrCode, 
  CreditCard, 
  ChevronRight, 
  Check, 
  Copy, 
  X,
  User,
  ExternalLink
} from 'lucide-react';
import { Transaction, UserProfile, Contact } from '../types';

interface DashboardProps {
  user: UserProfile;
  balance: number;
  recentTransactions: Transaction[];
  onNavigate: (screen: 'home' | 'send' | 'history' | 'profile') => void;
  onTopUp: (amount: number, note: string) => void;
  onPayMerchant: (merchant: string, amount: number, category: string, note: string) => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export default function Dashboard({
  user,
  balance,
  recentTransactions,
  onNavigate,
  onTopUp,
  onPayMerchant,
  onSelectTransaction
}: DashboardProps) {
  // Modal states
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);

  // Top up parameters
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpSource, setTopUpSource] = useState('Chase Debit (**** 4102)');
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  // Pay parameters
  const [payAmount, setPayAmount] = useState('');
  const [merchantName, setMerchantName] = useState('Supermarket Deli');
  const [payCategory, setPayCategory] = useState('Groceries');
  const [payNote, setPayNote] = useState('');
  const [paySuccess, setPaySuccess] = useState(false);

  // Share/Receive Copy indicator
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const executeTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) return;

    onTopUp(amount, `Received from ${topUpSource}`);
    setTopUpSuccess(true);
    setTimeout(() => {
      setTopUpSuccess(false);
      setShowTopUpModal(false);
      setTopUpAmount('');
    }, 1500);
  };

  const executePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(payAmount);
    if (isNaN(amount) || amount <= 0) return;

    onPayMerchant(merchantName, amount, payCategory, payNote || 'Payment checkout');
    setPaySuccess(true);
    setTimeout(() => {
      setPaySuccess(false);
      setShowPayModal(false);
      setPayAmount('');
      setPayNote('');
    }, 1500);
  };

  // Helper formatting helper
  const formatBalance = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  return (
    <div className="flex flex-col space-y-6 pb-24">
      
      {/* 1. Header with Avatar & Greeting */}
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col">
          <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">Welcome back</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <h1 className="text-xl font-bold font-syne text-white tracking-tight">Good morning, Alex</h1>
            <span className="flex items-center justify-center p-0.5 bg-blue-500/20 rounded-full border border-blue-400/30">
              <Check className="w-3 h-3 text-[#4F8EF7]" strokeWidth={3} />
            </span>
          </div>
        </div>
        
        {/* Profile Avatar */}
        <button 
          onClick={() => onNavigate('profile')} 
          className="relative inline-block focus:outline-none group"
          id="avatar-nav-btn"
        >
          <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-[#4F8EF7] to-indigo-500 shadow-md group-hover:scale-105 transition-transform duration-200">
            <img 
              src={user.avatarUrl} 
              alt="User profile" 
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#0A0F2C] rounded-full"></span>
        </button>
      </div>

      {/* 2. Sleek Interface Balance Card */}
      <div className="bg-gradient-to-br from-[#4F8EF7] to-[#141A3B] rounded-[24px] p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[190px]">
        {/* Subtle glowing light source */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        
        <div className="relative z-10 flex justify-between items-start">
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-white/70 font-semibold tracking-widest uppercase">Available Balance</span>
            <span className="text-3xl sm:text-4xl font-extrabold font-syne tracking-tight mt-1">
              {formatBalance(balance)}
            </span>
          </div>
          <span className="flex items-center justify-center p-2.5 bg-white/10 rounded-full border border-white/20 backdrop-blur-md">
            <QrCode className="w-5 h-5 text-white" />
          </span>
        </div>

        <div className="relative z-10 flex justify-between items-center pt-6 border-t border-white/10">
          <div className="flex gap-4">
            <div className="flex flex-col">
              <span className="text-white/60 text-[9px] uppercase tracking-wide">Card Holder</span>
              <span className="text-xs font-semibold tracking-wide">ALEX RIVERA</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/60 text-[9px] uppercase tracking-wide">Expires</span>
              <span className="text-xs font-semibold tracking-wide">09/27</span>
            </div>
          </div>
          <div className="flex -space-x-2">
            <div className="w-6 h-6 bg-red-500/80 rounded-full border border-white/10"></div>
            <div className="w-6 h-6 bg-orange-400/80 rounded-full border border-white/10"></div>
          </div>
        </div>
      </div>

      {/* 3. Quick Actions Grid */}
      <div className="grid grid-cols-4 gap-2 px-1">
        
        {/* Send Action */}
        <button 
          onClick={() => onNavigate('send')} 
          className="flex flex-col items-center space-y-2 p-3 rounded-2xl bg-[#141A3B]/60 border border-white/5 hover:border-[#4F8EF7]/30 hover:bg-[#141A3B] transition-all"
          id="action-send-btn"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#4F8EF7]/10 border border-[#4F8EF7]/20 text-[#4F8EF7]">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-300 font-medium">Send</span>
        </button>

        {/* Receive Action */}
        <button 
          onClick={() => setShowReceiveModal(true)} 
          className="flex flex-col items-center space-y-2 p-3 rounded-2xl bg-[#141A3B]/60 border border-white/5 hover:border-[#4F8EF7]/30 hover:bg-[#141A3B] transition-all"
          id="action-receive-btn"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981]">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-300 font-medium">Receive</span>
        </button>

        {/* Pay Merchant Action */}
        <button 
          onClick={() => setShowPayModal(true)} 
          className="flex flex-col items-center space-y-2 p-3 rounded-2xl bg-[#141A3B]/60 border border-white/5 hover:border-[#4F8EF7]/30 hover:bg-[#141A3B] transition-all"
          id="action-pay-btn"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <CreditCard className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-300 font-medium">Pay Portal</span>
        </button>

        {/* Top Up Wallet Action */}
        <button 
          onClick={() => setShowTopUpModal(true)} 
          className="flex flex-col items-center space-y-2 p-3 rounded-2xl bg-[#141A3B]/60 border border-white/5 hover:border-[#4F8EF7]/30 hover:bg-[#141A3B] transition-all"
          id="action-topup-btn"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-300 font-medium">Top Up</span>
        </button>
      </div>

      {/* 4. Recent Transactions Tracker */}
      <div className="flex flex-col space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-white tracking-wide uppercase font-syne">Recent Transactions</h3>
          <button 
            onClick={() => onNavigate('history')} 
            className="text-xs font-semibold text-[#4F8EF7] hover:underline flex items-center gap-0.5"
            id="view-all-transactions"
          >
            See All <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* List of 5 transactions */}
        <div className="flex flex-col space-y-2.5">
          {recentTransactions.slice(0, 5).map((tx) => (
            <button
              key={tx.id}
              onClick={() => onSelectTransaction(tx)}
              className="w-full text-left flex items-center justify-between p-3.5 rounded-2xl bg-[#141A3B]/60 hover:bg-[#141A3B] border border-white/5 hover:border-white/10 transition-all group"
              id={`tx-item-dash-${tx.id}`}
            >
              <div className="flex items-center gap-3">
                {/* Visual Avatar / Icon Circle */}
                <div className={`w-11 h-11 flex items-center justify-center rounded-full text-sm font-bold ${
                  tx.type === 'received' 
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/10 border border-red-500/20 text-rose-400'
                }`}>
                  {tx.initials ? (
                    tx.initials
                  ) : tx.type === 'received' ? (
                    <ArrowDownLeft className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>
                
                {/* Details text */}
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-slate-100 truncate group-hover:text-white transition-colors">
                    {tx.name}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{tx.category}</span>
                    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                    <span className="text-[10px] text-slate-500 font-medium">{tx.date}</span>
                  </div>
                </div>
              </div>

              {/* Amount Display */}
              <div className="flex flex-col items-end shrink-0 pl-2">
                <span className={`text-sm font-extrabold tracking-tight ${
                  tx.type === 'received' ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {tx.type === 'received' ? '+' : '-'}{formatBalance(tx.amount)}
                </span>
                <span className="text-[9px] text-slate-500 font-semibold tracking-wider uppercase mt-0.5">
                  {tx.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ================= RECEIVE MODAL OVERLAY ================= */}
      {showReceiveModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-[#141A3B] rounded-t-[32px] sm:rounded-[24px] border border-white/10 shadow-2xl overflow-hidden flex flex-col transform transition-transform duration-350">
            <div className="p-5 flex items-center justify-between border-b border-white/5">
              <h3 className="text-base font-bold font-syne text-white tracking-wide">Receive Payment Request</h3>
              <button 
                onClick={() => setShowReceiveModal(false)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                id="close-receive-modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 text-center flex flex-col items-center space-y-6">
              {/* QR Code Container */}
              <div className="bg-white p-5 rounded-2xl shadow-xl flex flex-col items-center justify-center relative group">
                <div className="border-[6px] border-slate-100 rounded-lg p-2 bg-white">
                  {/* High Quality Mock SVG QR Code */}
                  <svg className="w-36 h-36 text-[#0A0F2C]" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M5 5h30v30H5V5zm6 6v18h18V11H11zm58-6h30v30H69V5zm6 6v18h18V11H75zM5 69h30v30H5V69zm6 6v18h18V75H11zm38-51h6v6h-6v-6zm12 0h6v6h-6v-6zm0 12h6v6h-6v-6zm-12 12h6v6h-6v-6zm12 0h6v6h-6v-6zm12-12h6v6h-6v-6zm0 24h6v6h-6v-6zm-12 12h6v6h-6v-6zm-12 12h6v6h-6v-6zm24 0h6v6h-6v-6zm12 12h6v6h-6v-6zM39 80h6v6h-6v-6zm12-11h6v6h-6v-6zm12 0h6v6h-6v-6z" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-blue-600/90 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xs font-bold px-3 py-1 bg-white/15 rounded-full border border-white/20">
                    Scan for Swift Identity
                  </span>
                </div>
              </div>

              {/* Informational Details */}
              <div className="flex flex-col space-y-1.5 max-w-xs">
                <p className="text-sm font-bold text-slate-100">Scan QR Code or Link</p>
                <p className="text-xs text-slate-400">Customers can scan this code to pay you instantly back into your default Virtual Account.</p>
              </div>

              {/* Copy payment link action */}
              <div className="w-full flex items-center gap-2 p-3 bg-[#0A0F2C] rounded-xl border border-white/5">
                <span className="text-xs font-mono text-slate-400 select-all truncate text-left flex-1 pl-1">
                  https://swiftpay.me/r/alex_rivera
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 shrink-0 transition-all ${
                    copiedLink 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-[#4F8EF7] hover:bg-[#4F8EF7]/90 text-white'
                  }`}
                  id="copy-payment-link-btn"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedLink ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="w-full border-t border-white/5 pt-4">
                <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">VERIFIED SECURE ACCOUNT</p>
                <p className="text-xs text-indigo-400 font-bold mt-1">swift_user_alex@swiftpay.com</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TOP UP WALLET MODAL ================= */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-[#141A3B] rounded-t-[32px] sm:rounded-[24px] border border-white/10 shadow-2xl overflow-hidden flex flex-col transform transition-transform duration-350">
            <div className="p-5 flex items-center justify-between border-b border-white/5">
              <h3 className="text-base font-bold font-syne text-white tracking-wide">Top Up Wallet Funds</h3>
              <button 
                onClick={() => setShowTopUpModal(false)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                id="close-topup-modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {topUpSuccess ? (
              <div className="p-8 text-center flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center pulse-primary">
                  <Check className="w-8 h-8" strokeWidth={3} />
                </div>
                <h4 className="text-lg font-bold font-syne text-white mt-1">Top-up Successful!</h4>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Funds have been loaded and are available instantly in your default Virtual Account wallet.
                </p>
              </div>
            ) : (
              <form onSubmit={executeTopUp} className="p-6 space-y-5">
                
                {/* Selected Bank details */}
                <div className="flex flex-col space-y-2">
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Funding Source</label>
                  <select 
                    value={topUpSource}
                    onChange={(e) => setTopUpSource(e.target.value)}
                    className="w-full bg-[#0A0F2C] text-slate-100 text-sm font-semibold rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-[#4F8EF7]/55 transition-colors"
                  >
                    <option value="Chase Debit (**** 4102)">Chase checking (**** 4102)</option>
                    <option value="Apple Pay Credit (**** 9510)">Apple Pay (**** 9510)</option>
                    <option value="Bank of America Savings (**** 3844)">BofA savings (**** 3844)</option>
                  </select>
                </div>

                {/* Amount input block */}
                <div className="flex flex-col space-y-2 relative">
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Billing Amount</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-400 font-extrabold text-xl font-syne">$</span>
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      step="0.01"
                      min="1"
                      required
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      className="w-full bg-[#0A0F2C] text-white font-extrabold text-xl font-syne rounded-xl pl-9 pr-4 py-3 border border-white/10 focus:outline-none focus:border-[#4F8EF7] transition-all"
                      id="topup-amount-input"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">Maximum daily top-up limit: $5,000.00</p>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowTopUpModal(false)}
                    className="flex-1 py-3 text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 text-xs font-bold text-white bg-[#4F8EF7] hover:bg-[#4F8EF7]/90 active:scale-95 transition-all rounded-xl shadow-lg shadow-blue-500/20"
                    id="submit-topup-btn"
                  >
                    Confirm Top Up
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= PAY CHECKOUT MODAL ================= */}
      {showPayModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-[#141A3B] rounded-t-[32px] sm:rounded-[24px] border border-white/10 shadow-2xl overflow-hidden flex flex-col transform transition-transform duration-350">
            <div className="p-5 flex items-center justify-between border-b border-white/5">
              <h3 className="text-base font-bold font-syne text-white tracking-wide">Pay Merchant Portal</h3>
              <button 
                onClick={() => setShowPayModal(false)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                id="close-pay-modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {paySuccess ? (
              <div className="p-10 text-center flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center pulse-primary">
                  <Check className="w-8 h-8" strokeWidth={3} />
                </div>
                <h4 className="text-lg font-bold font-syne text-white mt-1">Payment Completed!</h4>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Payment successfully authorized to {merchantName} for ${parseFloat(payAmount).toFixed(2)}.
                </p>
              </div>
            ) : (
              <form onSubmit={executePayment} className="p-6 space-y-4">
                
                {/* Select Merchant */}
                <div className="flex flex-col space-y-2">
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Biller/Merchant</label>
                  <select 
                    value={merchantName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setMerchantName(val);
                      if (val === 'Subway Diner') {
                        setPayCategory('Food & Drinks');
                      } else if (val === 'Supermarket Deli') {
                        setPayCategory('Groceries');
                      } else {
                        setPayCategory('Rent/Housing');
                      }
                    }}
                    className="w-full bg-[#0A0F2C] text-slate-100 text-sm font-semibold rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-[#4F8EF7]/55 transition-colors"
                  >
                    <option value="Supermarket Deli">Supermarket Deli (Groceries)</option>
                    <option value="Subway Diner">Subway Diner (Food & Drinks)</option>
                    <option value="Housing Association">Housing Rent (Housing)</option>
                  </select>
                </div>

                {/* Amount input block */}
                <div className="flex flex-col space-y-2">
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Receipt Total</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-400 font-extrabold text-xl font-syne">$</span>
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      step="0.01"
                      min="0.5"
                      required
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      className="w-full bg-[#0A0F2C] text-white font-extrabold text-xl font-syne rounded-xl pl-9 pr-4 py-3 border border-white/10 focus:outline-none focus:border-[#4F8EF7] transition-all"
                      id="pay-amount-input"
                    />
                  </div>
                </div>

                {/* Optional Note */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Reference / Optional Note</label>
                  <input 
                    type="text" 
                    placeholder="E.g. Invoice #9284"
                    value={payNote}
                    onChange={(e) => setPayNote(e.target.value)}
                    className="w-full bg-[#0A0F2C] text-slate-100 text-sm rounded-xl px-4 py-3.5 border border-white/10 focus:outline-none focus:border-[#4F8EF7]/55 transition-colors"
                  />
                </div>

                {/* User validation balance line */}
                <div className="p-3.5 bg-[#0A0F2C]/60 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Available Wallet Balance</span>
                  <span className="text-white font-bold">{formatBalance(balance)}</span>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPayModal(false)}
                    className="flex-1 py-3 text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5"
                  >
                    Declined
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 text-xs font-bold text-white bg-violet-600 hover:bg-violet-600/90 active:scale-95 transition-all rounded-xl shadow-lg"
                    id="submit-pay-btn"
                  >
                    Pay Bill Now
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
