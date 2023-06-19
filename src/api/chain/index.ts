import * as waxjs from '@waxio/waxjs/dist';

import { WAX_RPC } from '@/constants.ts';

const wax = new waxjs.WaxJS({ rpcEndpoint: WAX_RPC, tryAutoLogin: false });

export default wax;
