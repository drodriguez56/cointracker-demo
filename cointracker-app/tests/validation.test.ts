import { describe, expect, it } from 'vitest';

import {
  formatBalance,
  formatDate,
  formatTransactionAmount,
  isValidBtcAddress,
  truncateAddress,
} from '../src/lib/format';

describe('isValidBtcAddress', () => {
  it('accepts legacy addresses starting with 1', () => {
    expect(isValidBtcAddress('1BoatSLRHtKNngkdXEeobR76b53LETtpyT')).toBe(true);
  });

  it('accepts legacy addresses starting with 3', () => {
    expect(isValidBtcAddress('3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy')).toBe(true);
  });

  it('accepts bech32 addresses starting with bc1', () => {
    expect(isValidBtcAddress('bc1qw4te46hjks8u7wgu7gs0uv8ehagatw5d96q2ux')).toBe(true);
  });

  it('rejects other prefixes', () => {
    expect(isValidBtcAddress('0x1234567890abcdef')).toBe(false);
    expect(isValidBtcAddress('')).toBe(false);
  });
});

describe('format helpers', () => {
  it('formats ISO date strings to yyyy-MM-dd', () => {
    expect(formatDate('2024-03-20T12:00:00.000Z')).toBe('2024-03-20');
  });

  it('falls back to original string when date is invalid', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date');
  });

  it('truncates addresses with head and tail segments', () => {
    expect(truncateAddress('1234567890', 3, 2)).toBe('123...90');
  });

  it('formats balances with two decimals', () => {
    expect(formatBalance(1.23456789)).toBe('1.23');
    expect(formatBalance(-0.5)).toBe('-0.50');
  });

  it('formats transaction amounts with one decimal', () => {
    expect(formatTransactionAmount(1.23456789)).toBe('1.2');
    expect(formatTransactionAmount(-0.5)).toBe('-0.5');
  });
});
