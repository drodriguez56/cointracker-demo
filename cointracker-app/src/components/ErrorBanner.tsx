import styled from '@emotion/styled';

import Button from './Button';

type ErrorBannerProps = {
  message: string;
  onRetry?: () => void;
};

const Banner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 10px;
  background: rgba(235, 87, 87, 0.15);
  border: 1px solid rgba(235, 87, 87, 0.4);
  color: #1f2333;
  gap: 8px;
`;

const Message = styled.span`
  font-size: 14px;
`;

const ErrorBanner = ({ message, onRetry }: ErrorBannerProps) => (
  <Banner role="alert" aria-live="polite">
    <Message>{message}</Message>
    {onRetry ? (
      <Button variant="ghost" size="sm" onClick={onRetry}>
        Retry
      </Button>
    ) : null}
  </Banner>
);

export default ErrorBanner;
