import { env } from '../../env.mjs';
import axios from 'axios';

const BASE_ENDPOINT = env.NEXT_PUBLIC_BASE_SERVER_API_ENDPOINT;

export const axiosV1 = axios.create({
  // Browser requests go through this app's origin so auth cookies belong to
  // the frontend host and can be read by the Next proxy. Server rendered
  // pages can call the backend directly.
  baseURL: typeof window === 'undefined' ? `${BASE_ENDPOINT}/v1` : '/api/v1',
  withCredentials: true,
});
