import { APIClient } from '@wharfkit/antelope';

import { WAX_RPC } from '@/constants.ts';

const waxClient = new APIClient({
  url: WAX_RPC,
});

export { waxClient };
