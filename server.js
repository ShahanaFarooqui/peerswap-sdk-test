import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// ---- Dummy data ----

const dummyNodeInfo = {
  node_info: {
    node_id: '03879d1e580e472a76e0c5dc57f644b4f2249658bcc8e117a7ed262fff27a6c4fd',
    protocol_version: 1,
    assets: {
      BTC: {
        asset: 'BTC',
        min_amount: '10000',
        max_amount: '1000000',
        required_confirmations: 3,
        csv_timeout_blocks: 144,
        swap_in_premium_ppm: '1000',
        swap_out_premium_ppm: '1000',
      },
      LBTC: {
        asset: 'LBTC',
        min_amount: '5000',
        max_amount: '500000',
        required_confirmations: 2,
        csv_timeout_blocks: 72,
        swap_in_premium_ppm: '800',
        swap_out_premium_ppm: '800',
      },
    },
    fee_invoice_amount: '1000',
  },
};

const dummySwaps = [
  {
    swap_id: 'swap-001',
    type: 'swap-in',
    created_at: '1700000000',
    opening_tx_id: 'tx-abc001',
    opening_tx_out: 0,
    confirmations: 3,
    required_confirmations: 3,
    status: 'Completed',
  },
  {
    swap_id: 'swap-002',
    type: 'swap-out',
    created_at: '1700001000',
    opening_tx_id: 'tx-abc002',
    opening_tx_out: 1,
    confirmations: 1,
    required_confirmations: 3,
    status: 'Confirming',
  },
  {
    swap_id: 'swap-003',
    type: 'swap-in',
    created_at: '1700002000',
    opening_tx_id: '',
    opening_tx_out: 0,
    confirmations: 0,
    required_confirmations: 3,
    status: 'Await_Opening_Tx',
  },
  {
    swap_id: 'swap-004',
    type: 'swap-out',
    created_at: '1700003000',
    opening_tx_id: 'tx-abc004',
    opening_tx_out: 0,
    confirmations: 3,
    required_confirmations: 3,
    status: 'Canceled',
  },
];

// ---- Routes ----

app.get('/v1/info', (req, res) => {
  res.json(dummyNodeInfo);
});

app.post('/v1/swap-in', (req, res) => {
  const { asset = 'BTC', network = 'mainnet', claim_inv = '', xpub = '' } = req.body ?? {};
  const keyIndex = Math.floor(Math.random() * 1000);
  const swapId = `swap-in-${Date.now()}`;

  dummySwaps.push({
    swap_id: swapId,
    type: 'swap-in',
    created_at: String(Math.floor(Date.now() / 1000)),
    opening_tx_id: '',
    opening_tx_out: 0,
    confirmations: 0,
    required_confirmations: 3,
    status: 'Await_Opening_Tx',
  });

  console.log(`Created swap-in: ${swapId}, total swaps: ${dummySwaps.length}`);
  res.json({ key_index: keyIndex });
});

app.post('/v1/swap-out', (req, res) => {
  const { asset = 'BTC', network = 'mainnet', amount = '0', xpub = '' } = req.body ?? {};
  const keyIndex = Math.floor(Math.random() * 1000);
  const swapId = `swap-out-${Date.now()}`;

  dummySwaps.push({
    swap_id: swapId,
    type: 'swap-out',
    created_at: String(Math.floor(Date.now() / 1000)),
    opening_tx_id: '',
    opening_tx_out: 0,
    confirmations: 0,
    required_confirmations: 3,
    status: 'Await_Fee',
  });

  console.log(`Created swap-out: ${swapId}, total swaps: ${dummySwaps.length}`);
  res.json({ key_index: keyIndex });
});

app.post('/v1/swaps', (req, res) => {
  const { limit = 10, offset = 0 } = req.body ?? {};
  const paginated = dummySwaps.slice(offset, offset + limit);
  res.json({ swaps: paginated });
});

// ---- Start ----

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`PeerSwap dummy server running at http://localhost:${PORT}`);
});
