import Axios, { Method } from 'axios';
import { message } from 'antd';

const axios = Axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:1551' : '',
  timeout: 5000,
  headers: {
    Accept: '*',
  },
});

const fetchData = async <T = any>(url: string, method: Method = 'GET', requestData: T) => {
  try {
    const data = await axios({
      url,
      method,
      data: requestData,
    }).then((res) => res.data);
    if (data.errMsg) {
      throw new Error(data.errMsg);
    }
    return data;
  } catch (e) {
    console.error(e);
    message.error('提交失败');
    throw e;
  }
};

export default fetchData;
