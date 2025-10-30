import { forwardRef, InputHTMLAttributes } from 'react';
import styled from '@emotion/styled';

const StyledInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: none;
  color: #1f2333;
  font-size: 14px;

  &:focus {
    outline: none;
    outline-offset: 2px;
  }

  &::placeholder {
    color: #bbb;
  }
`;

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <StyledInput ref={ref} {...props} />;
});

Input.displayName = 'Input';

export default Input;
