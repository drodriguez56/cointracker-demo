import { useEffect, useMemo, useRef, useState } from 'react';
import styled from '@emotion/styled';

import { formatDate, formatTransactionAmount, truncateAddress } from '../../lib/format';
import { Transaction } from '../../services/types';
type TransactionsListProps = {
  transactions: Transaction[];
};

const PAGE_SIZE = 50;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: scroll;
  height: calc(100vh - 295px);

  //SCROLLBAR STYLES
  scrollbar-width: thin;
  scrollbar-color: rgba(140, 143, 255, 0.2) transparent;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(140, 143, 255, 0.2);
    border-radius: 10px;
    border: 2px solid transparent;
    background-clip: content-box;
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 36px;
  padding: 18px;
  height: 60px;
  border-radius: 21px;
  border: 1.5px solid rgba(140, 143, 255, 0.1);
  background: #ffffff;
`;

const Primary = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 14px;
  width: 165px;
`;

const StatusBadge = styled.span<{ $state: 'green' | 'red' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 9px;
  font-weight: 600;
  background: ${({ $state }) => ($state === 'green' ? '#E2FBE8' : '#FAE3E3')};
  color: ${({ $state }) => ($state === 'green' ? '#40774B' : '#9B3230')};
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #838383;
  width: 85px;
`;
const Confirmations = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #838383;
`;

const Amount = styled.span<{ $positive: boolean }>`
  margin-left: auto;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: ${({ $positive }) => ($positive ? '#1fbe7f' : '#f06464')};
  width: 200px;
  text-align: right;
`;

const Sentinel = styled.div`
  height: 1px;
`;
const StatusSection = styled.div`
  display: flex;

  justify-content: flex-end;
  width: 65px;
`;
const LoadingMore = styled.span`
  display: inline-flex;
  align-self: center;
  padding: 8px;
  font-size: 14px;
  color: #838383;
`;

const getStatus = (balance: number): { label: string; state: 'green' | 'red' } => {
  if (balance >= 0) {
    return { label: 'Received', state: 'green' };
  }

  return { label: 'Sent', state: 'red' };
};

const TransactionsList = ({ transactions }: TransactionsListProps) => {
  const [visibleCount, setVisibleCount] = useState(() => Math.min(PAGE_SIZE, transactions.length));
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(Math.min(PAGE_SIZE, transactions.length));
  }, [transactions]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setVisibleCount((current) => {
            if (current >= transactions.length) {
              return current;
            }

            return Math.min(current + PAGE_SIZE, transactions.length);
          });
        }
      },
      { root: null, threshold: 1 },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [transactions.length]);

  const visibleTransactions = useMemo(
    () => transactions.slice(0, visibleCount),
    [transactions, visibleCount],
  );

  const hasMore = visibleCount < transactions.length;

  return (
    <List>
      {visibleTransactions.map((transaction) => {
        const status = getStatus(transaction.balance);

        return (
          <Item key={transaction.id}>
            <Primary>
              {truncateAddress(transaction.id)}
              <StatusSection>
                <StatusBadge $state={status.state}>{status.label}</StatusBadge>
              </StatusSection>
            </Primary>

            <Meta>
              <span>{formatDate(transaction.date)}</span>
            </Meta>
            <Confirmations>
              <span>{transaction.confirmations} confirmations</span>
            </Confirmations>
            <Amount $positive={transaction.balance >= 0}>
              {transaction.balance > 0 ? '+' : '-'}{' '}
              {formatTransactionAmount(Math.abs(transaction.balance))} BTC
            </Amount>
          </Item>
        );
      })}
      {hasMore ? <LoadingMore>Loading more...</LoadingMore> : null}
      <Sentinel ref={sentinelRef} />
    </List>
  );
};

export default TransactionsList;
