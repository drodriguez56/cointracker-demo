import styled from '@emotion/styled';
import { useMemo } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import ErrorBanner from '../../components/ErrorBanner';
import Loading from '../../components/Loading';

import { useGetWalletsQuery } from '../../services/api';
import WalletCard from './WalletCard';
import AddWalletForm from './AddWalletForm';

type WalletListProps = {
  selectedWalletId: string | null;
  syncingWalletId: string | null;
  onSelect: (walletId: string) => void;
};

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;

  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.04);

  border-radius: 42px;
  border: 1px solid #f7f7ff;

  background: #fff;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const Title = styled.h2`
  font-size: 21px;
`;

const WalletStack = styled.div`
  display: flex;
  flex-direction: column;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  text-align: center;
  color: #70758f;
  background: #ffffff;
  border: 1px dashed #e2e7f1;
`;

// const sampleAddresses = [
//   '1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
//   '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
//   'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kygt080',
// ];

const parseError = (error: unknown): string => {
  const fetchError = error as FetchBaseQueryError | undefined;

  if (!fetchError) {
    return 'Unable to load wallets.';
  }

  if ('data' in fetchError && fetchError.data && typeof fetchError.data === 'object') {
    const data = fetchError.data as { message?: string };
    if (data.message) {
      return data.message;
    }
  }

  if ('status' in fetchError) {
    return `Request failed (${String(fetchError.status)}).`;
  }

  return 'Unable to load wallets.';
};

const WalletList = ({ selectedWalletId, syncingWalletId, onSelect }: WalletListProps) => {
  const { data, isLoading, error, refetch } = useGetWalletsQuery();

  const errorMessage = useMemo(() => (error ? parseError(error) : null), [error]);

  if (isLoading) {
    return (
      <Panel>
        <Loading label="Loading wallets" />
      </Panel>
    );
  }

  if (errorMessage) {
    return (
      <Panel>
        <ErrorBanner message={errorMessage} onRetry={() => void refetch()} />
      </Panel>
    );
  }

  const wallets = data ?? [];

  if (!wallets.length) {
    return (
      <Panel>
        <Header>
          <Title>Wallets</Title>
        </Header>
        <EmptyState>
          <p>No wallets yet. Add one to start syncing transactions</p>
        </EmptyState>
        <AddWalletForm />
      </Panel>
    );
  }

  return (
    <Panel>
      <WalletStack>
        {wallets.map((wallet) => (
          <WalletCard
            key={wallet.id}
            wallet={wallet}
            isSelected={wallet.id === selectedWalletId}
            isSyncing={wallet.id === syncingWalletId}
            onSelect={onSelect}
          />
        ))}
        <AddWalletForm />
      </WalletStack>
    </Panel>
  );
};

export default WalletList;
