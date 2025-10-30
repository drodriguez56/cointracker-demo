import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

type SyncStatusProps = {
  isSyncing: boolean;
};

const pulse = keyframes`
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
`;

const Wrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #70758f;
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #8c8fff;
  animation: ${pulse} 1s ease-in-out infinite;
`;

const SyncStatus = ({ isSyncing }: SyncStatusProps) => {
  if (!isSyncing) {
    return null;
  }

  return (
    <Wrapper aria-live="polite">
      <Dot /> Syncing...
    </Wrapper>
  );
};

export default SyncStatus;
