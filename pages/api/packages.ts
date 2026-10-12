import { GET } from '@/src/api/packages/route';
import { handle } from '@/src/api/handle';

export const config = { api: { bodyParser: false } };
export default handle({ GET });
