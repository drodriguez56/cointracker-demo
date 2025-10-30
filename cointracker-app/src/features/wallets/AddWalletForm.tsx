import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/Button';
import ErrorBanner from '../../components/ErrorBanner';
import Input from '../../components/Input';
import newWalletIcon from '../../assets/new-wallet.svg';
import { isValidBtcAddress } from '../../lib/format';
import { useCreateWalletMutation } from '../../services/api';
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AddWalletButton = styled.button`
  margin-top: 30px;
  font-size: 14px;
  display: flex;
  padding: var(--space-21, 21px);
  justify-content: center;
  align-items: center;
  gap: 6px;
  border: none;
  border-radius: 100px;
  background: #8c8fff;
  color: white;
  cursor: pointer;
`;
const Avatar = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 999px;
  object-fit: cover;
`;
const FormCard = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FieldGroup = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px;
`;

const ErrorStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const btcPlaceholder = 'Paste or add address here...';

const getErrorMessage = (error: unknown): string => {
  if (!error) {
    return 'Something went wrong.';
  }

  if (typeof error === 'string') {
    return error;
  }

  const fetchError = error as FetchBaseQueryError;

  if ('data' in fetchError && fetchError.data && typeof fetchError.data === 'object') {
    const data = fetchError.data as { message?: string };
    if (data.message) {
      return data.message;
    }
  }

  if ('status' in fetchError) {
    return `Request failed (${String(fetchError.status)}).`;
  }

  return 'Unable to add wallet right now.';
};

const AddWalletForm = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [address, setAddress] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [createWallet, { isLoading, error }] = useCreateWalletMutation();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmedAddress = address.trim();
  const apiErrorMessage = useMemo(() => (error ? getErrorMessage(error) : null), [error]);
  const canRetry = useMemo(() => isValidBtcAddress(trimmedAddress), [trimmedAddress]);

  const resetForm = () => {
    setAddress('');
    setLocalError(null);
  };

  const handleCollapse = () => {
    resetForm();
    setIsExpanded(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);

    if (!trimmedAddress) {
      setLocalError('Address is required.');
      return;
    }

    if (!isValidBtcAddress(trimmedAddress)) {
      setLocalError('Enter a valid BTC address (starting with 1, 3, or bc1).');
      return;
    }

    try {
      const submittedAddress = trimmedAddress;
      const updatedWallets = await createWallet({ address: submittedAddress }).unwrap();
      const newlyAddedWallet = updatedWallets.find((wallet) => wallet.address === submittedAddress);

      if (newlyAddedWallet) {
        navigate(`/wallet/${newlyAddedWallet.id}`);
        setIsExpanded(false);
      }

      setAddress('');
    } catch (mutationError) {
      setLocalError(getErrorMessage(mutationError));
    }
  };

  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    }
  }, [isExpanded]);

  if (!isExpanded) {
    return (
      <AddWalletButton onClick={() => setIsExpanded(true)}>Add another wallet +</AddWalletButton>
    );
  }

  return (
    <Container>
      <FormCard onSubmit={handleSubmit} noValidate>
        <FieldGroup>
          <Avatar src={newWalletIcon} alt="New wallet icon" />
          <Input
            id="wallet-address"
            name="wallet-address"
            placeholder={btcPlaceholder}
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            disabled={isLoading}
            aria-invalid={Boolean(localError)}
            ref={inputRef}
          />
        </FieldGroup>

        {(localError || apiErrorMessage) && (
          <ErrorStack>
            {localError ? <ErrorBanner message={localError} /> : null}
            {apiErrorMessage ? (
              <ErrorBanner
                message={apiErrorMessage}
                onRetry={
                  canRetry
                    ? () => {
                        void createWallet({ address: trimmedAddress });
                      }
                    : undefined
                }
              />
            ) : null}
          </ErrorStack>
        )}

        <Actions>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCollapse}
            disabled={isLoading}
            style={{ border: 'none', color: '#8c8fff' }}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={isLoading}>
            {isLoading ? 'Saving...' : <>Save new wallet</>}
          </Button>
        </Actions>
      </FormCard>
    </Container>
  );
};

export default AddWalletForm;
