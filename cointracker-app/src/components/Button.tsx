import { ButtonHTMLAttributes, forwardRef } from 'react';
import styled from '@emotion/styled';

const StyledButton = styled.button<{ variant: ButtonVariant; size: ButtonSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 15px 21px;
  border-radius: 100px;
  border: 1px solid transparent;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    opacity 0.2s ease,
    background 0.2s ease;
  color: ${({ variant }) =>
    variant === 'primary' || variant === 'danger' ? '#ffffff' : '#1f2333'};
  background: ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return '#8c8fff';
      case 'danger':
        return '#f06464';
      case 'secondary':
        return '#f7f9ff';
      case 'ghost':
      default:
        return 'transparent';
    }
  }};
  border-color: ${({ variant }) =>
    variant === 'ghost' || variant === 'secondary' ? '#e2e7f1' : 'transparent'};

  &:hover:not(:disabled) {
    opacity: 0.95;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid #8c8fff;
    outline-offset: 2px;
  }
`;

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, ...rest }, ref) => {
    return (
      <StyledButton ref={ref} variant={variant} size={size} {...rest}>
        {children}
      </StyledButton>
    );
  },
);

Button.displayName = 'Button';

export default Button;
