import { Route, Routes } from 'react-router-dom';

import WalletsPage from '../features/wallets/WalletsPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<WalletsPage />} />
      <Route path="/wallet/:walletId" element={<WalletsPage />} />
    </Routes>
  );
};

export default App;
