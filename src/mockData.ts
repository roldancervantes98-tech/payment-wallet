/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Contact, Transaction, UserProfile } from './types';

export const INITIAL_USER: UserProfile = {
  name: 'Alex Rivera',
  email: 'alex@swiftpay.com',
  phone: '+1 (555) 0192-384',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
  verified: true
};

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Maria Santos',
    email: 'maria.santos@domain.com',
    phone: '+1 (555) 2384-912',
    initials: 'MS',
    color: '#EC4899' // Pink-500
  },
  {
    id: 'c2',
    name: 'Jake Lim',
    email: 'jake.lim@domain.com',
    phone: '+1 (555) 8934-210',
    initials: 'JL',
    color: '#8B5CF6' // Violet-500
  },
  {
    id: 'c3',
    name: 'Chen Wei',
    email: 'chen.wei@domain.com',
    phone: '+1 (555) 5431-984',
    initials: 'CW',
    color: '#10B981' // Emerald-500
  },
  {
    id: 'c4',
    name: 'Priya Nair',
    email: 'priya.nair@domain.com',
    phone: '+1 (555) 3491-032',
    initials: 'PN',
    color: '#F59E0B' // Amber-500
  },
  {
    id: 'c5',
    name: 'Tom Reyes',
    email: 'tom.reyes@domain.com',
    phone: '+1 (555) 7812-445',
    initials: 'TR',
    color: '#3B82F6' // Blue-500
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    name: 'Starbucks Coffee',
    category: 'Food & Drinks',
    date: 'Jun 03, 2026',
    amount: 14.75,
    type: 'sent',
    note: 'Morning latte & croissant',
    status: 'Completed'
  },
  {
    id: 't2',
    name: 'Maria Santos',
    category: 'Transfer',
    date: 'Jun 02, 2026',
    amount: 120.00,
    type: 'received',
    note: 'Dinner split last night!',
    contactId: 'c1',
    initials: 'MS',
    status: 'Completed'
  },
  {
    id: 't3',
    name: 'Spotify Premium',
    category: 'Entertainment',
    date: 'May 28, 2026',
    amount: 14.99,
    type: 'sent',
    note: 'Monthly family plan subscription',
    status: 'Completed'
  },
  {
    id: 't4',
    name: 'Monthly Rent Payment',
    category: 'Housing',
    date: 'May 01, 2026',
    amount: 1200.00,
    type: 'sent',
    note: 'May apartment rent',
    status: 'Completed'
  },
  {
    id: 't5',
    name: 'Direct Deposit / Salary',
    category: 'Income',
    date: 'May 25, 2026',
    amount: 3250.00,
    type: 'received',
    note: 'Bi-weekly payroll payout',
    status: 'Completed'
  },
  {
    id: 't6',
    name: 'Whole Foods Market',
    category: 'Groceries',
    date: 'May 23, 2026',
    amount: 84.20,
    type: 'sent',
    status: 'Completed'
  },
  {
    id: 't7',
    name: 'Priya Nair',
    category: 'Transfer',
    date: 'May 18, 2026',
    amount: 45.00,
    type: 'received',
    note: 'Ticket share for movie night',
    contactId: 'c4',
    initials: 'PN',
    status: 'Completed'
  }
];
