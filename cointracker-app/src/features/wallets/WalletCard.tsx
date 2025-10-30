import styled from '@emotion/styled';

import { truncateAddress } from '../../lib/format';
import { Wallet } from '../../services/types';
import walletIcon from '../../assets/new-wallet.svg';
import syncIcon from '../../assets/icon-sync.svg';

type WalletCardProps = {
  wallet: Wallet;
  isSelected: boolean;
  isSyncing: boolean;
  onSelect: (walletId: string) => void;
};

const Item = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 9px 48px 9px 9px;
  border-radius: 60px;
  border: ${({ $selected }) => ($selected ? '1.652px solid #EDEEFF' : 'none')};
  background: ${({ $selected }) => ($selected ? '#F8F8FF' : 'none')};
  cursor: pointer;
  transition: background 0.2s ease;
  text-align: left;
  position: relative;

  &:hover {
    background: ${({ $selected }) => ($selected ? 'rgba(99, 91, 255, 0.16)' : '#f7f9ff')};
  }

  &:focus-visible {
    outline: 2px solid #8c8fff;
    outline-offset: 2px;
  }
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Avatar = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 999px;
  object-fit: cover;
`;

const Details = styled.div`
  display: flex;
  gap: 8px;
`;

const Name = styled.span`
  font-weight: 400;
  font-size: 14px;
`;

const Address = styled.span`
  color: #838383;
`;

const SyncIndicator = styled.span`
  position: absolute;
  top: 50%;
  right: 18px;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #8c8fff;
  color: #ffffff;
`;

const SyncIcon = styled.span`
  width: 14px;
  height: 17px;
  display: inline-block;
  background-color: currentColor;
  mask: url(${syncIcon}) no-repeat center / contain;
  -webkit-mask: url(${syncIcon}) no-repeat center / contain;
`;

const WalletCard = ({ wallet, isSelected, isSyncing, onSelect }: WalletCardProps) => (
  <Item
    type="button"
    onClick={() => onSelect(wallet.id)}
    $selected={isSelected}
    aria-current={isSelected ? 'true' : undefined}
  >
    <Content>
      <Avatar
        src={wallet.iconURL ? wallet.iconURL : walletIcon}
        alt={`${wallet.name} icon`}
        loading="lazy"
      />
      <Details>
        <Name>{wallet.name}</Name>
        <Address>{truncateAddress(wallet.address)}</Address>
      </Details>
    </Content>
    {isSyncing ? (
      <SyncIndicator role="status" aria-label="Wallet syncing">
        <SyncIcon aria-hidden="true" />
      </SyncIndicator>
    ) : null}
  </Item>
);

export default WalletCard;
