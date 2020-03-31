import fetchData from '../fetch';
import orderAPIs from './order';
import { Method } from 'axios';

type OrderAPIType = typeof orderAPIs;

type OrderAPI = OrderAPIType[keyof OrderAPIType];

const fetchOrderData = async (api: OrderAPI, data?: any) =>
  await fetchData(api.url, api.method as Method, data);

export default fetchOrderData;
