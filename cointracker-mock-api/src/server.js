const app = require('./app');
const databaseService = require('./services/databaseService');
const constants = require('./utils/constants');

async function startServer() {
  try {
    // Initialize database
    await databaseService.initializeDataFiles();

    // Start server
    app.listen(constants.PORT, () => {
      console.log(`Server is running on port ${constants.PORT}`);
      console.log(`API endpoints:`);
      console.log(`  GET  /wallets - List all wallets`);
      console.log(`  GET  /wallets/:walletId - Get wallet transactions`);
      console.log(`  POST /wallets - Create new wallet`);
      console.log(`  GET  /wallets/sync - Sync endpoint`);
      console.log(`  DELETE /wallets/:walletId - Delete wallet`);
      console.log(`  GET  /health - Health check`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
