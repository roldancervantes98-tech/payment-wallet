/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter, 
  ChevronRight,
  X,
  Check,
  Calendar,
  Building,
  DollarSign,
  Tag,
  Copy,
  Clock
} from 'lucide-react';
import { Transaction } from '../types';

interface HistoryListProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
}

export default function HistoryList({
  transactions,
  onSelectTransaction
}: HistoryListProps) {
  // Local states
  const [activeFilter, setActiveFilter] = useState<'all' | 'sent' | 'received'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering transactions
  const filteredTransactions = transactions.filter(tx => {
    // 1. Tab status match
    const matchesFilter = activeFilter === 'all' || tx.type === activeFilter;
    
    // 2. Keyword input match
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      tx.name.toLowerCase().includes(query) ||
      tx.category.toLowerCase().includes(query) ||
      (tx.note && tx.note.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  const formatBalance = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  return (
    <div className="flex flex-col space-y-6 pb-24">
      {/* Headings */}
      <div className="px-1">
        <h2 className="text-xl font-black font-syne text-white tracking-tight uppercase">Transactions</h2>
        <p className="text-xs text-slate-400 mt-0.5 font-medium">Verify audits, balances, and direct transfers history</p>
      </div>

      {/* Grouped Search & Controls layout */}
      <div className="space-y-4">
        
        {/* Keyword Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by vendor, category or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#141A3B] text-slate-100 text-sm rounded-2xl pl-12 pr-4 py-3.5 border border-white/5 focus:outline-none focus:border-[#4F8EF7]/55 transition-colors placeholder:text-slate-500"
            id="transaction-search-input"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex bg-[#141A3B]/45 p-1 rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeFilter === 'all' 
                ? 'bg-[#4F8EF7] text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="history-tab-all"
          >
            All Logs
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('sent')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeFilter === 'sent' 
                ? 'bg-[#4F8EF7] text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="history-tab-sent"
          >
            Sent
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('received')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeFilter === 'received' 
                ? 'bg-[#4F8EF7] text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
            id="history-tab-received"
          >
            Received
          </button>
        </div>
      </div>

      {/* Scrollable List block */}
      <div className="flex flex-col space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Displaying {filteredTransactions.length} items
          </span>
        </div>

        {filteredTransactions.length > 0 ? (
          <div className="flex flex-col space-y-2">
            {filteredTransactions.map(tx => (
              <button
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className="w-full text-left flex items-center justify-between p-4 rounded-2xl bg-[#141A3B]/60 hover:bg-[#141A3B] border border-white/5 hover:border-white/10 transition-all group"
                id={`tx-detail-btn-${tx.id}`}
              >
                <div className="flex items-center gap-3">
                  {/* Icon Avatar Circle */}
                  <div className={`w-11 h-11 flex items-center justify-center rounded-full text-xs font-extrabold shrink-0 ${
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

                  {/* Merchant Name details */}
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-slate-100 group-hover:text-white truncate transition-colors">
                      {tx.name}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-[#4F8EF7] font-semibold uppercase">{tx.category}</span>
                      <span className="w-0.75 h-0.75 bg-slate-600 rounded-full"></span>
                      <span className="text-[10px] text-slate-400 font-medium">{tx.date}</span>
                    </div>
                  </div>
                </div>

                {/* Balance amount */}
                <div className="flex items-center gap-2 pl-2 shrink-0">
                  <span className={`text-sm font-extrabold tracking-tight ${
                    tx.type === 'received' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {tx.type === 'received' ? '+' : '-'}{formatBalance(tx.amount)}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 bg-[#141A3B]/30 border border-dashed border-white/10 rounded-2xl">
            <p className="text-xs">No matching transactions found</p>
            <p className="text-[11px] text-slate-600 mt-1">Try resetting search keywords or filters</p>
          </div>
        )}
      </div>

    </div>
  );
}
