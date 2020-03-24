import fetchData from '../fetch';
import userAPIs from './user';
import { Method } from 'axios';

type UserAPIType = typeof userAPIs;

type UserAPI = UserAPIType[keyof UserAPIType];

const fetchUserData = async (api: UserAPI, data?: any) =>
  await fetchData(api.url, api.method as Method, data);

export default fetchUserData;
