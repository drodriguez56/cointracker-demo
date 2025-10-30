import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Global } from '@emotion/react';

import { store } from './store';
import { globalStyles } from '../styles/global';

type ProvidersProps = {
  children: ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => (
  <Provider store={store}>
    <BrowserRouter>
      <Global styles={globalStyles} />
      {children}
    </BrowserRouter>
  </Provider>
);
