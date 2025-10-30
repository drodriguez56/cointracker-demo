import { ReactNode } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

import useEasterEgg from '../lib/useEasterEgg';

const Page = styled.div<{ $spooky: boolean }>`
  min-height: 100vh;
  background: #fcfcfc;
  padding: 30px;
  display: flex;
  gap: 24px;
  position: relative;
  transition: filter 0.6s ease;

  ${({ $spooky }) =>
    $spooky
      ? `
    filter: brightness(0.85);
  `
      : ''}
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 344px;
  flex-shrink: 0;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: 100%;
  gap: 24px;
`;

const SpookyBackdrop = styled.div<{ $active: boolean }>`
  position: fixed;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 15% 20%, rgba(255, 122, 24, 0.35), transparent 55%),
    linear-gradient(135deg, rgba(0, 0, 0, 0.85), rgba(140, 143, 255, 0.1));
  mix-blend-mode: multiply;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transition: opacity 0.6s ease;
  z-index: 10;
`;

const flyAcross = keyframes`
  0% {
    transform: translate3d(-20vw, 0, 0) scale(0.8);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  50% {
    transform: translate3d(40vw, -20px, 0) scale(1.05);
  }
  100% {
    transform: translate3d(120vw, 10px, 0) scale(0.95);
    opacity: 0;
  }
`;

const Bats = styled.div`
  position: fixed;
  top: 120px;
  left: -10vw;
  display: flex;
  gap: 36px;
  pointer-events: none;
  z-index: 30;

  span {
    display: inline-block;
    animation: ${flyAcross} 3.6s ease-in-out forwards;
    font-size: 28px;
  }

  span:nth-of-type(2) {
    animation-delay: 0.25s;
    font-size: 32px;
  }

  span:nth-of-type(3) {
    animation-delay: 0.45s;
    font-size: 24px;
  }
`;

const Toast = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 18px;
  background: rgba(15, 15, 15, 0.88);
  color: #f8fafc;
  border-radius: 16px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
  font-size: 14px;
  z-index: 40;
`;

const GhostTrigger = styled.button<{ $visible: boolean }>`
  position: fixed;
  bottom: 24px;
  left: 24px;
  display: ${({ $visible }) => ($visible ? 'inline-flex' : 'none')};
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.08);
  font-size: 24px;
  opacity: 0.1;
  padding: 5px;
  cursor: pointer;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease,
    background 0.2s ease;
  z-index: 40;

  &:hover,
  &:focus-visible {
    opacity: 0.9;
    background: rgba(0, 0, 0, 0.18);
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid rgba(140, 143, 255, 0.6);
    outline-offset: 2px;
  }
`;

type LayoutProps = {
  sidebar: ReactNode;
  children: ReactNode;
};

const Layout = ({ sidebar, children }: LayoutProps) => {
  const { isEnabled, isActive, trigger } = useEasterEgg();

  return (
    <>
      <SpookyBackdrop $active={isActive} aria-hidden="true" />
      <Page $spooky={isActive}>
        {isActive ? (
          <Bats aria-hidden="true">
            <span>🦇</span>
            <span>🦇</span>
            <span>🦇</span>
          </Bats>
        ) : null}
        {isActive ? <Toast role="status">👻 Boo! Happy Halloween.</Toast> : null}
        <Sidebar>{sidebar}</Sidebar>
        <Main>{children}</Main>
      </Page>
      <GhostTrigger
        type="button"
        onClick={trigger}
        aria-label="Activate spooky mode"
        $visible={isEnabled}
      >
        👻
      </GhostTrigger>
    </>
  );
};

export default Layout;
