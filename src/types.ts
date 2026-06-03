/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Transaction {
  id: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  type: 'sent' | 'received';
  note?: string;
  contactId?: string;
  logoUrl?: string;
  initials?: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  initials: string;
  color: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  verified: boolean;
}
