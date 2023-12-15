import {configureStore, combineReducers, Reducer, AnyAction} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {persistReducer} from 'redux-persist';
import travelSliceReducer from './travel-info/travel.slice';
import loginSliceReducer from './user/login.slice';
import loadingSliceReducer from './loading/loading.slice';
import communitySliceReducer from './community/community.slice';
import regionRecommendSliceReducer from './travel-info/region-recommend.slice';
import userSliceReducer from './user/user.slice';
import settingSliceReducer from './setting/settingSlice';
import modalSliceReducer from './modal/modalSlice';
import networkSliceReducer from './network/networkSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import eventSliceReducer from './event/event.slice';

const persistConfig = {
	key: 'root',
	// version: 1,
	storage: AsyncStorage,
};
const appReducer = combineReducers({
	travelSlice: travelSliceReducer,
	loginSlice: loginSliceReducer,
	loadingSlice: loadingSliceReducer,
	communitySlice: communitySliceReducer,
	regionRecommendSlice: regionRecommendSliceReducer,
	userSlice: persistReducer(persistConfig, userSliceReducer),
	settingSlice: settingSliceReducer,
	modalSlice: modalSliceReducer,
	networkSlice: networkSliceReducer,
	eventSlice: eventSliceReducer,
});

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
	//const exceptionKeys = ['hasLaunched', 'hasPermissionGranted'];
	// if (action.type === 'user/logout/fulfilled') {
	// 	// 로그아웃 시 로컬스토리지 초기화
	// 	AsyncStorage.getAllKeys().then((allKeys) => {
	// 		const removeKeys = allKeys.filter((k) => !exceptionKeys.some((ek) => ek === k));
	// 		AsyncStorage.multiRemove(removeKeys);
	// 	});
	// 	const settingState = state.setting;
	// 	state = { setting: settingState } as RootState;
	// }

	return appReducer(state, action);
};

export const store = configureStore({
	reducer: rootReducer,
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: false,
			immutableCheck: false,
		}),
	devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof appReducer>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
