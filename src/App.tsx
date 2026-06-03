/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Home as HomeIcon, 
  Send as SendIcon, 
  History as HistoryIcon, 
  User as UserIcon,
  Plus,
  Wifi,
  Battery,
  X,
  Check,
  Calendar,
  Tag,
  FileText,
  Copy,
  Info,
  DollarSign
} from 'lucide-react';

import { Transaction, Contact, UserProfile } from './types';
import { INITIAL_USER, INITIAL_CONTACTS, INITIAL_TRANSACTIONS } from './mockData';

// Component imports
import Dashboard from './components/Dashboard';
import SendMoney from './components/SendMoney';
import HistoryList from './components/HistoryList';
import ProfileSettings from './components/ProfileSettings';

export default function App() {
  // 1. Navigation state
  const [activeScreen, setActiveScreen] = useState<'home' | 'send' | 'history' | 'profile'>('home');

  // 2. Persisted State layers using localStorage for transient fidelity
  const [balance, setBalance] = useState<number>(() => {
    const cached = localStorage.getItem('swiftpay_balance');
    return cached ? parseFloat(cached) : 4280.50;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const cached = localStorage.getItem('swiftpay_transactions');
    return cached ? JSON.parse(cached) : INITIAL_TRANSACTIONS;
  });

  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [copiedTxId, setCopiedTxId] = useState(false);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('swiftpay_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('swiftpay_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Actions Callbacks
  const handleTopUp = (amount: number, note: string) => {
    // Increment balance
    setBalance(prev => prev + amount);

    // Formulate transaction item
    const newTx: Transaction = {
      id: `topup-${Date.now()}`,
      name: 'Linked Funding Source',
      category: 'Top Up',
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount: amount,
      type: 'received',
      note: note,
      status: 'Completed'
    };

    setTransactions(prev => [newTx, ...prev]);
  };

  const handlePayMerchant = (merchant: string, amount: number, category: string, note: string) => {
    // Decrement balance safely
    setBalance(prev => Math.max(0, prev - amount));

    const newTx: Transaction = {
      id: `pay-${Date.now()}`,
      name: merchant,
      category: category,
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount: amount,
      type: 'sent',
      note: note,
      status: 'Completed'
    };

    setTransactions(prev => [newTx, ...prev]);
  };

  const handleSendMoneyUser = (contact: Contact, amount: number, note: string) => {
    // Decrement balance safely
    setBalance(prev => Math.max(0, prev - amount));

    // Compile transaction record
    const newTx: Transaction = {
      id: `send-${Date.now()}`,
      name: contact.name,
      category: 'Transfer',
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount: amount,
      type: 'sent',
      note: note,
      contactId: contact.id,
      initials: contact.initials,
      status: 'Completed'
    };

    setTransactions(prev => [newTx, ...prev]);
  };

  // Hard Reset Log out behavior
  const handleHardResetLogout = () => {
    localStorage.removeItem('swiftpay_balance');
    localStorage.removeItem('swiftpay_transactions');
    setBalance(4280.50);
    setTransactions(INITIAL_TRANSACTIONS);
    setActiveScreen('home');
  };

  const handleCopyTxId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedTxId(true);
    setTimeout(() => setCopiedTxId(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070b24] text-white flex justify-center items-center p-0 md:p-6 select-none relative overflow-x-hidden">
      
      {/* Visual background gradient blurs for desktop aesthetics */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4F8EF7]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* MOBILE DEVICE SIMULATOR CONTAINER */}
      <div className="w-full max-w-md bg-[#0A0F2C] md:rounded-[36px] min-h-screen md:min-h-[812px] md:h-[844px] flex flex-col shadow-[0_24px_60px_rgba(0,0,0,0.8)] border-0 md:border-[10px] md:border-slate-800/80 relative overflow-hidden">
        
        {/* Mock Status Bar (Desktop Mockup mode) */}
        <div className="hidden md:flex items-center justify-between px-6 pt-3 pb-1 text-slate-400 font-medium text-[11px] font-sans">
          <span className="font-semibold tracking-tight text-slate-300">08:26 AM</span>
          {/* Dynamic Speaker Notch */}
          <div className="w-24 h-4.5 bg-slate-900 rounded-full absolute left-1/2 -translate-x-1/2 top-1.5 flex items-center justify-center">
            <span className="w-3 h-1 bg-slate-800/80 rounded-full mr-2"></span>
            <span className="w-1.5 h-1.5 bg-slate-800/80 rounded-full"></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">5G</span>
            <Battery className="w-4 h-4 text-slate-300" />
          </div>
        </div>

        {/* CONTAINER CONTENT WRAPPER */}
        <div className="flex-1 overflow-y-auto px-5 pt-4 md:pt-2">
          
          {/* SCREEN COMPONENT SWITCHER */}
          {activeScreen === 'home' && (
            <Dashboard 
              user={INITIAL_USER}
              balance={balance}
              recentTransactions={transactions}
              onNavigate={setActiveScreen}
              onTopUp={handleTopUp}
              onPayMerchant={handlePayMerchant}
              onSelectTransaction={setSelectedTx}
            />
          )}

          {activeScreen === 'send' && (
            <SendMoney 
              contacts={INITIAL_CONTACTS}
              balance={balance}
              onSendMoney={handleSendMoneyUser}
              onNavigate={setActiveScreen}
            />
          )}

          {activeScreen === 'history' && (
            <HistoryList 
              transactions={transactions}
              onSelectTransaction={setSelectedTx}
            />
          )}

          {activeScreen === 'profile' && (
            <ProfileSettings 
              user={INITIAL_USER}
              onLogout={handleHardResetLogout}
              balance={balance}
            />
          )}

        </div>

        {/* FLOATING ACTION BUTTON (FAB) FOR INSTANT SEND IN HOME */}
        {activeScreen === 'home' && (
          <button
            type="button"
            onClick={() => setActiveScreen('send')}
            className="absolute bottom-[92px] right-6 w-13 h-13 bg-[#4F8EF7] hover:bg-[#4F8EF7]/95 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all z-20"
            id="fab-plus"
            title="Quick Transfer"
          >
            <Plus className="w-6 h-6" strokeWidth={3} />
          </button>
        )}

        {/* BOTTOM TAB NAVIGATION BAR */}
        <nav className="absolute bottom-0 left-0 right-0 bg-[#141A3B]/95 border-t border-white/5 backdrop-blur-lg px-6 py-3.5 z-30 flex items-center justify-between text-slate-400">
          
          {/* Home Tab */}
          <button
            onClick={() => setActiveScreen('home')}
            className={`flex flex-col items-center gap-1.5 transition-all relative ${
              activeScreen === 'home' ? 'text-[#4F8EF7] scale-105 font-bold' : 'hover:text-slate-200'
            }`}
            id="bottom-nav-home"
          >
            <HomeIcon className="w-5 h-5" />
            <span className="text-[10px] tracking-wide">Home</span>
            {activeScreen === 'home' && (
              <span className="absolute -top-3.5 w-5 h-0.75 bg-[#4F8EF7] rounded-full"></span>
            )}
          </button>

          {/* Send Tab */}
          <button
            onClick={() => setActiveScreen('send')}
            className={`flex flex-col items-center gap-1.5 transition-all relative ${
              activeScreen === 'send' ? 'text-[#4F8EF7] scale-105 font-bold' : 'hover:text-slate-200'
            }`}
            id="bottom-nav-send"
          >
            <SendIcon className="w-5 h-5" />
            <span className="text-[10px] tracking-wide">Send</span>
            {activeScreen === 'send' && (
              <span className="absolute -top-3.5 w-5 h-0.75 bg-[#4F8EF7] rounded-full"></span>
            )}
          </button>

          {/* History Tab */}
          <button
            onClick={() => setActiveScreen('history')}
            className={`flex flex-col items-center gap-1.5 transition-all relative ${
              activeScreen === 'history' ? 'text-[#4F8EF7] scale-105 font-bold' : 'hover:text-slate-200'
            }`}
            id="bottom-nav-history"
          >
            <HistoryIcon className="w-5 h-5" />
            <span className="text-[10px] tracking-wide">History</span>
            {activeScreen === 'history' && (
              <span className="absolute -top-3.5 w-5 h-0.75 bg-[#4F8EF7] rounded-full"></span>
            )}
          </button>

          {/* Profile Tab */}
          <button
            onClick={() => setActiveScreen('profile')}
            className={`flex flex-col items-center gap-1.5 transition-all relative ${
              activeScreen === 'profile' ? 'text-[#4F8EF7] scale-105 font-bold' : 'hover:text-slate-200'
            }`}
            id="bottom-nav-profile"
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-[10px] tracking-wide">Profile</span>
            {activeScreen === 'profile' && (
              <span className="absolute -top-3.5 w-5 h-0.75 bg-[#4F8EF7] rounded-full"></span>
            )}
          </button>

        </nav>

      </div>

      {/* ================= DETAILED RECEIPT DETAILED MODAL ================= */}
      {selectedTx && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm card-glass p-6 rounded-[28px] border border-white/10 shadow-3xl text-center space-y-6 transform scale-100 transition-all">
            
            {/* Header row */}
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h4 className="text-xs font-bold text-slate-300 font-syne uppercase tracking-wider">Transaction Invoice</h4>
              <button 
                onClick={() => setSelectedTx(null)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                id="close-receipt-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt visual values */}
            <div className="flex flex-col items-center space-y-4">
              {/* Type Category Indicator */}
              <div className={`w-14 h-14 rounded-full flex items-center justify-center border ${
                selectedTx.type === 'received' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-red-500/10 border-red-500/20 text-rose-400'
              }`}>
                {selectedTx.type === 'received' ? <Check className="w-6 h-6 text-emerald-400" /> : <SendIcon className="w-5.5 h-5.5" />}
              </div>

              <div className="flex flex-col space-y-0.5">
                <span className="text-sm font-bold text-slate-300">{selectedTx.name}</span>
                <span className={`text-3xl font-extrabold font-syne tracking-tight ${
                  selectedTx.type === 'received' ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {selectedTx.type === 'received' ? '+' : '-'}${selectedTx.amount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Breakdown parameters Grid block */}
            <div className="bg-[#0A0F2C] p-4 rounded-2xl border border-white/5 text-left space-y-3">
              
              {/* Audit Date */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" /> Date
                </span>
                <span className="text-slate-200 font-semibold">{selectedTx.date}</span>
              </div>

              {/* Category */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-500" /> Category
                </span>
                <span className="text-slate-200 font-semibold uppercase tracking-wider text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/5">
                  {selectedTx.category}
                </span>
              </div>

              {/* Security ID transaction reference */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" /> Receipt ID
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyTxId(selectedTx.id)}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 font-mono font-medium text-[10px] border border-white/5 bg-white/5 px-2 py-0.5 rounded cursor-pointer"
                  title="Copy Receipt ID"
                >
                  {selectedTx.id.substring(0, 14)}
                  <Copy className="w-3 h-3 text-slate-400" />
                </button>
              </div>

              {/* Status */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-500" /> Status
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Completed
                </span>
              </div>

              {/* Optional Memo Notes */}
              {selectedTx.note && (
                <div className="border-t border-white/5 pt-3 flex flex-col space-y-1.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Customer Reference Note</span>
                  <p className="text-xs text-slate-300 italic">"{selectedTx.note}"</p>
                </div>
              )}

            </div>

            {/* Quick Share option */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="flex-1 py-3 text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5"
              >
                Close Receipt
              </button>
              <button
                type="button"
                onClick={() => handleCopyTxId(selectedTx.id)}
                className="flex-1 py-3 text-xs font-bold text-[#0A0F2C] bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors shadow-lg shadow-emerald-400/10 cursor-pointer"
              >
                {copiedTxId ? 'Copied' : 'Share Receipt'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
