/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Search, 
  DollarSign, 
  Check, 
  ArrowRight,
  Sparkles,
  Info,
  ChevronRight
} from 'lucide-react';
import { Contact, UserProfile } from '../types';

interface SendMoneyProps {
  contacts: Contact[];
  balance: number;
  onSendMoney: (contact: Contact, amount: number, note: string) => void;
  onNavigate: (screen: 'home' | 'send' | 'history' | 'profile') => void;
}

export default function SendMoney({
  contacts,
  balance,
  onSendMoney,
  onNavigate
}: SendMoneyProps) {
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [amountStr, setAmountStr] = useState('');
  const [noteText, setNoteText] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [successComplete, setSuccessComplete] = useState(false);
  const [sendError, setSendError] = useState('');

  // Filter contacts
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setSendError('');
  };

  const clearSelection = () => {
    setSelectedContact(null);
    setAmountStr('');
    setNoteText('');
    setSendError('');
  };

  const handleInitiateSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) {
      setSendError('Please select a recipient first');
      return;
    }

    const value = parseFloat(amountStr);
    if (isNaN(value) || value <= 0) {
      setSendError('Please enter a valid amount greater than $0');
      return;
    }

    if (value > balance) {
      setSendError(`Insufficient balance! Your current balance is $${balance.toFixed(2)}`);
      return;
    }

    setSendError('');
    setShowConfirmModal(true);
  };

  const handleConfirmSend = () => {
    if (!selectedContact) return;
    const value = parseFloat(amountStr);
    
    // Execute state callback on parent
    onSendMoney(selectedContact, value, noteText || 'Transfer wire payment');
    
    setSuccessComplete(true);
    
    // Wait for animations and redirect back to home
    setTimeout(() => {
      // Clean up states
      setShowConfirmModal(false);
      setSuccessComplete(false);
      clearSelection();
      onNavigate('home');
    }, 2800);
  };

  // Helper formatting logic
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(val);
  };

  return (
    <div className="flex flex-col space-y-6 pb-24">
      {/* Page Title */}
      <div className="px-1">
        <h2 className="text-xl font-black font-syne text-white tracking-tight uppercase">Send Money</h2>
        <p className="text-xs text-slate-400 mt-0.5">Transfer funds instantly to verified contacts</p>
      </div>

      {!selectedContact ? (
        // STAGE 1: SEARCH & SELECT RECIPIENT
        <div className="flex flex-col space-y-4">
          {/* Search bar inside brand outline */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, email or mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141A3B] text-slate-100 text-sm rounded-2xl pl-12 pr-4 py-3.5 border border-white/5 focus:outline-none focus:border-[#4F8EF7]/55 transition-colors placeholder:text-slate-500"
              id="contact-search-input"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider px-1">Verified Contacts</span>
            
            {filteredContacts.length > 0 ? (
              <div className="flex flex-col space-y-2">
                {filteredContacts.map(contact => (
                  <button
                    key={contact.id}
                    onClick={() => handleSelectContact(contact)}
                    type="button"
                    className="w-full text-left flex items-center justify-between p-3.5 rounded-2xl bg-[#141A3B]/60 hover:bg-[#141A3B] border border-white/5 hover:border-[#4F8EF7]/30 transition-all group"
                    id={`contact-select-${contact.id}`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar initial circle */}
                      <div 
                        className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0 border border-white/10"
                        style={{ backgroundColor: contact.color }}
                      >
                        {contact.initials}
                      </div>
                      
                      {/* Contact metadata */}
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{contact.name}</span>
                        <span className="text-xs text-slate-400 truncate">{contact.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-medium font-mono">{contact.phone}</span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 bg-[#141A3B]/30 rounded-2xl border border-dashed border-white/10">
                <p className="text-xs">No contacts match "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // STAGE 2: INPUT AMOUNT & NOTES FOR SELECTED CONTACT
        <form onSubmit={handleInitiateSend} className="space-y-6">
          {/* Chosen Recipient Slate Card */}
          <div className="p-4 rounded-2xl bg-[#141A3B] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-sm"
                style={{ backgroundColor: selectedContact.color }}
              >
                {selectedContact.initials}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">{selectedContact.name}</span>
                <span className="text-[11px] text-[#4F8EF7] font-semibold tracking-wider font-mono uppercase">Verified Recipient</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={clearSelection}
              className="p-1 px-3 text-[10px] font-bold tracking-wider text-slate-400 hover:text-white bg-white/5 rounded-full border border-white/5 hover:border-white/10 transition-colors uppercase"
              id="change-recipient-btn"
            >
              Change
            </button>
          </div>

          {/* Large Amount Centered Selector */}
          <div className="flex flex-col space-y-3 p-6 rounded-2xl bg-[#141A3B]/40 border border-white/5 text-center items-center justify-center">
            <label className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">ENTER TRANSFER AMOUNT</label>
            
            <div className="relative flex items-center justify-center max-w-full">
              <span className="text-slate-400 font-extrabold text-3xl font-syne mr-1.5">$</span>
              <input 
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0.01"
                required
                autoFocus
                value={amountStr}
                onChange={(e) => {
                  setAmountStr(e.target.value);
                  setSendError('');
                }}
                className="bg-transparent text-white font-extrabold text-4xl sm:text-5xl font-syne focus:outline-none placeholder:text-slate-700 text-center max-w-[200px] sm:max-w-[260px]"
                id="send-amount-input"
              />
            </div>

            {/* Wallet details line */}
            <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-[#141A3B]/80 rounded-full border border-white/5">
              <span className="text-[11px] text-slate-400 font-semibold">Available balance:</span>
              <span className="text-xs text-slate-100 font-bold">{formatCurrency(balance)}</span>
            </div>
          </div>

          {/* Reference/Notes parameter */}
          <div className="flex flex-col space-y-2">
            <label className="text-[11px] text-slate-400 uppercase tracking-wider font-bold px-1">Payment Memo / Note</label>
            <input 
              type="text"
              placeholder="What is this wire transfer for? (Optional)"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full bg-[#141A3B]/80 text-slate-100 text-sm rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:border-[#4F8EF7]/55 transition-colors"
              id="send-memo-input"
            />
          </div>

          {/* Quick presets buttons */}
          <div className="flex items-center gap-2.5 px-1 py-1.5 overflow-x-auto">
            {['$5.00', '$15.00', '$50.00', '$100.00'].map(val => (
              <button
                type="button"
                key={val}
                onClick={() => setAmountStr(val.replace('$', ''))}
                className="px-3.5 py-1.5 text-xs text-slate-300 font-semibold bg-[#141A3B]/60 hover:bg-[#141A3B] border border-white/5 rounded-full transition-colors shrink-0"
              >
                {val}
              </button>
            ))}
          </div>

          {/* Error warning box */}
          {sendError && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{sendError}</span>
            </div>
          )}

          {/* Action CTA Button */}
          <button
            type="submit"
            className="w-full py-4 bg-[#4F8EF7] hover:bg-[#4F8EF7]/90 text-white font-bold font-syne text-sm uppercaseTracking tracking-wider active:scale-[0.98] rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
            id="send-now-submit-btn"
          >
            Review and Send
            <ArrowRight className="w-4.5 h-4.5" />
          </button>
        </form>
      )}

      {/* ================= CONFIRMATION SUCCESS MODAL ================= */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#141A3B] p-6 rounded-[24px] border border-white/10 shadow-2xl overflow-hidden flex flex-col text-center">
            
            {!successComplete ? (
              // STEP A: CONFIRM WIRE SPECS
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <h4 className="text-sm font-bold text-slate-300 font-syne uppercase tracking-wide">Review Authorized Bill</h4>
                  <button 
                    onClick={() => setShowConfirmModal(false)}
                    className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-400"
                    id="cancel-confirm-btn"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="py-4 space-y-4">
                  {/* Total Value */}
                  <div className="flex flex-col space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Authorized Value</span>
                    <span className="text-4xl font-extrabold text-white font-syne tracking-tight">
                      {formatCurrency(parseFloat(amountStr) || 0)}
                    </span>
                  </div>

                  {/* Recipient breakdown line */}
                  <div className="p-4 bg-[#0A0F2C] rounded-2xl border border-white/5 text-left space-y-2.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Recipient Name</span>
                      <span className="text-white font-bold">{selectedContact?.name}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Ref Code</span>
                      <span className="text-slate-400 font-mono font-medium">SPF-{Math.floor(100000 + Math.random() * 900000)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Processing Fee</span>
                      <span className="text-emerald-400 font-bold">Free</span>
                    </div>
                    {noteText && (
                      <div className="flex flex-col border-t border-white/5 pt-2 mt-2 gap-1">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Memo</span>
                        <span className="text-xs text-slate-300 italic">"{noteText}"</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Confirm Swipe Action Button */}
                <button
                  type="button"
                  onClick={handleConfirmSend}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-[#0A0F2C] font-extrabold font-syne text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                  id="authorize-send-btn"
                >
                  Pay Securely Now
                </button>
              </div>
            ) : (
              // STEP B: GORGEOUS SUCCESS CHECKMARK ANIMATION
              <div className="py-8 space-y-5 flex flex-col items-center">
                {/* Checkmark wrapper circles */}
                <div className="relative w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center pulse-primary">
                  <div className="absolute inset-2 bg-emerald-500/20 rounded-full blur-sm"></div>
                  <Check className="w-10 h-10 relative z-10" strokeWidth={3.5} />
                </div>

                <div className="space-y-1">
                  <h4 className="text-xl font-bold font-syne text-white tracking-tight">Transfer Complete!</h4>
                  <p className="text-xs text-slate-400">Your funds have been dispatched.</p>
                </div>

                {/* Transferred info */}
                <div className="p-3 bg-[#0A0F2C]/60 border border-white/5 rounded-xl w-full flex items-center justify-between text-xs">
                  <span className="text-slate-400">{selectedContact?.name}</span>
                  <span className="text-emerald-400 font-bold">-{formatCurrency(parseFloat(amountStr) || 0)}</span>
                </div>

                <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-[#4F8EF7] font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Authorized by SwiftPay Security</span>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
