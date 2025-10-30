import styled from '@emotion/styled';
import { useEffect, useMemo, useState } from 'react';
import { FetchBaseQueryError, skipToken } from '@reduxjs/toolkit/query';

import Button from '../../components/Button';
import ErrorBanner from '../../components/ErrorBanner';
import Loading from '../../components/Loading';
import copyIcon from '../../assets/copyIcon.svg';
import editIcon from '../../assets/icon-edit.svg';
import syncIcon from '../../assets/icon-sync.svg';
import { api, useGetTransactionsQuery, useSyncWalletMutation } from '../../services/api';
import { formatBalance, truncateAddress } from '../../lib/format';
import TransactionsList from './TransactionsList';

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 9px;
  min-height: 100%;
  width: 100%;
  border-radius: 42px;
  border: 1px solid #f7f7ff;

  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.04);
  background: #fff;
  position: relative;
`;

const Label = styled.h3`
  color: #838383;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%; /* 14px */
  letter-spacing: -0.07px;
  padding: 9px;
`;
const EmptyPanel = styled(Panel)`
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #70758f;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
  padding: 9px 9px 9px 18px;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
`;

const Title = styled.h2`
  font-size: 21px;
  letter-spacing: -0.01em;
  font-weight: 400;
  font-weight: 400;
`;

const Subtitle = styled.span`
  color: #838383;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  position: relative;
  font-weight: 400;
  font-size: 21px;
`;

const BalanceBlock = styled.div`
  padding: 9px 9px 48px 9px;
`;

const BalanceValue = styled.span`
  color: #202020;

  /* Regular/36 */

  font-size: 36px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%; /* 36px */
  letter-spacing: -0.54px;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  flex-wrap: wrap;
`;

const PlaceholderHighlight = styled.span`
  font-weight: 600;
  color: #1f2333;
`;

const FetchingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(1px);
  z-index: 5;
  pointer-events: all;
`;

const CopyButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.12s ease;

  &:hover:not(:disabled) {
    background: rgba(140, 143, 255, 0.18);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:focus-visible {
    outline: 2px solid #8c8fff;
    outline-offset: 2px;
  }
`;

const CopyIcon = styled.img`
  width: 20px;
  height: 20px;
`;
const EmptyState = styled.p`
  color: #70758f;
  padding: 18px;
  text-align: center;
  font-weight: 400;
`;
const EditIcon = styled.span`
  width: 13px;
  height: 16px;
  display: inline-block;
  background-color: currentColor;
  mask: url(${editIcon}) no-repeat center / contain;
  -webkit-mask: url(${editIcon}) no-repeat center / contain;
`;

const SyncIcon = styled.span`
  width: 16px;
  height: 16px;
  display: inline-block;
  background-color: currentColor;
  mask: url(${syncIcon}) no-repeat center / contain;
  -webkit-mask: url(${syncIcon}) no-repeat center / contain;
`;

const CopyFeedback = styled.span<{ variant: 'copied' | 'error' }>`
  font-size: 12px;
  font-weight: 500;
  color: ${({ variant }) => (variant === 'copied' ? '#8c8fff' : '#f06464')};
  background: ${({ variant }) =>
    variant === 'copied' ? 'rgba(140, 143, 255, 0.1)' : 'rgba(248, 75, 75, 0.1)'};
  padding: 4px 8px;
  border-radius: 999px;
  transition: opacity 0.2s ease;
`;

type TransactionsPanelProps = {
  walletId: string | null;
  onSyncingChange?: (walletId: string | null) => void;
};

const parseError = (error: unknown): string => {
  const fetchError = error as FetchBaseQueryError | undefined;

  if (!fetchError) {
    return 'Unable to load transactions.';
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

  return 'Unable to load transactions.';
};

const TransactionsPanel = ({ walletId, onSyncingChange }: TransactionsPanelProps) => {
  const walletState = api.endpoints.getWallets.useQueryState();
  const wallets = walletState.data ?? [];
  const wallet = walletId ? wallets.find((item) => item.id === walletId) : undefined;
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const {
    data: transactions,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetTransactionsQuery(walletId ? { walletId } : skipToken);

  const [syncWallet, { isLoading: isSyncing }] = useSyncWalletMutation();

  const errorMessage = useMemo(() => (error ? parseError(error) : null), [error]);
  const totalBalance = useMemo(() => {
    if (!transactions || !transactions.length) {
      return 0;
    }

    return transactions.reduce((accumulator, transaction) => accumulator + transaction.balance, 0);
  }, [transactions]);

  const showFetchingOverlay = isFetching && !isLoading;

  useEffect(() => {
    if (copyStatus === 'idle') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCopyStatus('idle');
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [copyStatus]);

  useEffect(() => {
    setCopyStatus('idle');
  }, [wallet?.id]);

  useEffect(() => {
    if (!onSyncingChange) {
      return;
    }

    const nextWallet = isSyncing && walletId ? walletId : null;
    onSyncingChange(nextWallet);

    return () => {
      onSyncingChange(null);
    };
  }, [isSyncing, walletId, onSyncingChange]);

  const handleCopyAddress = () => {
    if (!wallet?.address) {
      return;
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard
        .writeText(wallet.address)
        .then(() => {
          setCopyStatus('copied');
        })
        .catch(() => {
          setCopyStatus('error');
        });
      return;
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = wallet.address;
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopyStatus(success ? 'copied' : 'error');
    } catch {
      setCopyStatus('error');
    }
  };

  if (!walletId) {
    return (
      <EmptyPanel>
        {wallets.length ? (
          <span>Select a wallet from the sidebar to view its activity.</span>
        ) : (
          <span>Add a wallet to get started. Your transaction history will appear here.</span>
        )}
      </EmptyPanel>
    );
  }

  if (isLoading) {
    return <Loading label="Loading transactions" />;
  }

  return (
    <Panel aria-busy={showFetchingOverlay}>
      {showFetchingOverlay ? (
        <FetchingOverlay>
          <Loading label="Loading transactions for selected wallet" />
        </FetchingOverlay>
      ) : null}
      <Header>
        <TitleGroup>
          <Title>{wallet ? wallet.name : 'Wallet'}</Title>
          <Subtitle>
            {wallet ? truncateAddress(wallet.address) : walletId}
            {wallet ? (
              <>
                <CopyButton type="button" onClick={handleCopyAddress} aria-label="Copy address">
                  <CopyIcon src={copyIcon} alt="" aria-hidden="true" />
                </CopyButton>
                {copyStatus === 'copied' ? (
                  <CopyFeedback variant="copied" role="status">
                    Copied to clipboard
                  </CopyFeedback>
                ) : null}
                {copyStatus === 'error' ? (
                  <CopyFeedback variant="error" role="alert">
                    Copy failed
                  </CopyFeedback>
                ) : null}
              </>
            ) : null}
          </Subtitle>
        </TitleGroup>
        <Actions>
          <Button
            type="button"
            style={{ gap: '5px', fontWeight: 400, height: 44 }}
            onClick={() => {
              if (walletId) {
                void syncWallet({ walletId });
              }
            }}
            disabled={!walletId || isSyncing}
          >
            {isSyncing ? 'Syncing...' : 'Sync'}
            <SyncIcon aria-hidden="true" />
          </Button>
          <Button
            style={{ color: '#646464', gap: '5px', fontWeight: 400, height: 44 }}
            type="button"
            variant="ghost"
          >
            Edit
            <EditIcon aria-hidden="true" />
          </Button>
        </Actions>
      </Header>

      <BalanceBlock>
        <BalanceValue>${formatBalance(totalBalance)}</BalanceValue>
      </BalanceBlock>

      {errorMessage ? <ErrorBanner message={errorMessage} onRetry={() => void refetch()} /> : null}

      <Label>Transactions</Label>
      {transactions && transactions.length ? (
        <TransactionsList transactions={transactions} />
      ) : !errorMessage ? (
        <EmptyState>
          No transactions yet for{' '}
          <PlaceholderHighlight>{wallet?.name ?? walletId}</PlaceholderHighlight>.
        </EmptyState>
      ) : null}
    </Panel>
  );
};

export default TransactionsPanel;
