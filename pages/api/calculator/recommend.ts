import { POST } from '@/src/api/calculator/recommend/route';
import { handle } from '@/src/api/handle';

export const config = { api: { bodyParser: false } };
export default handle({ POST });
