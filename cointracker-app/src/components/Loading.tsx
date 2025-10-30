import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid rgba(15, 23, 42, 0.1);
  border-top-color: #8c8fff;
  animation: ${spin} 0.8s linear infinite;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
`;

type LoadingProps = {
  label?: string;
};

const Loading = ({ label }: LoadingProps) => (
  <Wrapper aria-live="polite" aria-busy="true">
    <Spinner role="status" aria-label={label ?? 'Loading'} />
  </Wrapper>
);

export default Loading;
