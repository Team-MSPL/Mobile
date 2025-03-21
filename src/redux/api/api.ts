import {API_ROUTE, API_ROUTE_RELEASE} from '@env';
import axios from 'axios';
import {store} from '..';
import {networkSliceActions} from '../network/networkSlice';

const axiosAuth = axios.create({
	baseURL: API_ROUTE_RELEASE,
	headers: {
		'content-type': 'application/json',
		withCredentials: true,
	},
	timeout: 5000,
});

axiosAuth.interceptors.response.use(
	response => {
		if (!store.getState().networkSlice.serverConn) {
			store.dispatch(networkSliceActions.setServerConn(true));
		}
		return response;
	},
	error => {
		if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
			store.dispatch(networkSliceActions.setServerConn(false));
		} else {
			store.dispatch(networkSliceActions.setServerConn(true));
		}
		throw error;
	},
);
export default axiosAuth;
