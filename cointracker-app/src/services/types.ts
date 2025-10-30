export type Wallet = {
  id: string;
  address: string;
  name: string;
  iconURL: string;
};

export type Transaction = {
  id: string;
  walletId: string;
  date: string;
  balance: number;
  confirmations: number;
};

export type Health = {
  status: string;
  timestamp: string;
};
