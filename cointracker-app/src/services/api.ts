import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { Health, Transaction, Wallet } from './types';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

type CreateWalletRequest = {
  address: string;
};

type GetTransactionsArgs = {
  walletId: string;
};

type WalletTag = { type: 'Wallets'; id: string };
type TransactionTag = { type: 'Transactions'; id: string };

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Wallets', 'Transactions'],
  endpoints: (builder) => ({
    getWallets: builder.query<Wallet[], void>({
      query: () => '/wallets',
      providesTags: (result) => {
        if (!result) {
          return [{ type: 'Wallets', id: 'LIST' } satisfies WalletTag];
        }

        return [
          { type: 'Wallets', id: 'LIST' } satisfies WalletTag,
          ...result.map((wallet) => ({ type: 'Wallets', id: wallet.id } satisfies WalletTag)),
        ];
      },
    }),
    createWallet: builder.mutation<Wallet[], CreateWalletRequest>({
      query: (body) => ({
        url: '/wallets',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Wallets', id: 'LIST' } satisfies WalletTag],
    }),
    deleteWallet: builder.mutation<void, { walletId: string }>({
      query: ({ walletId }) => ({
        url: `/wallets/${walletId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { walletId }) => [
        { type: 'Wallets', id: 'LIST' } satisfies WalletTag,
        { type: 'Transactions', id: walletId } satisfies TransactionTag,
      ],
    }),
    getTransactions: builder.query<Transaction[], GetTransactionsArgs>({
      query: ({ walletId }) => `/wallets/${walletId}`,
      providesTags: (result, error, { walletId }) => [
        { type: 'Transactions', id: walletId } satisfies TransactionTag,
      ],
    }),
    syncWallet: builder.mutation<void, { walletId: string }>({
      query: ({ walletId }) => ({
        url: `/wallets/${walletId}/sync`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { walletId }) => [
        { type: 'Wallets', id: 'LIST' } satisfies WalletTag,
        { type: 'Transactions', id: walletId } satisfies TransactionTag,
      ],
    }),
    health: builder.query<Health, void>({
      query: () => '/health',
    }),
  }),
});

export const {
  useGetWalletsQuery,
  useCreateWalletMutation,
  useDeleteWalletMutation,
  useGetTransactionsQuery,
  useSyncWalletMutation,
  useHealthQuery,
} = api;
