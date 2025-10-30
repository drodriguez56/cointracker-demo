import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Layout from '../../components/Layout';
import TransactionsPanel from '../transactions/TransactionsPanel';
import WalletList from './WalletList';
import { useGetWalletsQuery } from '../../services/api';

const WalletsPage = () => {
  const navigate = useNavigate();
  const { walletId } = useParams<{ walletId?: string }>();
  const { data: wallets } = useGetWalletsQuery();
  const [syncingWalletId, setSyncingWalletId] = useState<string | null>(null);

  useEffect(() => {
    if (!walletId && wallets && wallets.length) {
      navigate(`/wallet/${wallets[0].id}`, { replace: true });
    }
  }, [walletId, wallets, navigate]);

  const handleSelect = (nextWalletId: string) => {
    if (nextWalletId !== walletId) {
      navigate(`/wallet/${nextWalletId}`);
    }
  };

  const handleSyncingChange = useCallback((nextWalletId: string | null) => {
    setSyncingWalletId(nextWalletId);
  }, []);

  return (
    <Layout
      sidebar={
        <>
          <WalletList
            selectedWalletId={walletId ?? null}
            syncingWalletId={syncingWalletId}
            onSelect={handleSelect}
          />
        </>
      }
    >
      <TransactionsPanel walletId={walletId ?? null} onSyncingChange={handleSyncingChange} />
    </Layout>
  );
};

export default WalletsPage;
