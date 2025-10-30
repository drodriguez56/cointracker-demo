import { format as formatDateFns } from 'date-fns';

const balanceFormatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const transactionBalanceFormatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export const formatDate = (iso: string): string => {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return formatDateFns(date, 'yyyy-MM-dd');
};

export const truncateAddress = (address: string, head = 5, tail = 4): string => {
  if (address.length <= head + tail) {
    return address;
  }

  return `${address.slice(0, head)}...${address.slice(-tail)}`;
};

export const formatBalance = (balance: number): string => balanceFormatter.format(balance);

export const formatTransactionAmount = (balance: number): string =>
  transactionBalanceFormatter.format(balance);

export const isValidBtcAddress = (address: string): boolean => {
  if (!address) {
    return false;
  }

  const trimmed = address.trim();
  if (!trimmed) {
    return false;
  }

  if (trimmed.startsWith('1') || trimmed.startsWith('3')) {
    return trimmed.length >= 26 && trimmed.length <= 42;
  }

  if (trimmed.toLowerCase().startsWith('bc1')) {
    return trimmed.length >= 14 && trimmed.length <= 90;
  }

  return false;
};
