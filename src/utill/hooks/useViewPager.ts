import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState} from 'react';

export const useViewPager = ({title}: {title: string}) => {
	const [viewPagerState, setViewPagerState] = useState(false);
	const getMainViewPager = async () => {
		let data = await AsyncStorage.getItem(`${title}`);
		setViewPagerState(data == 'true' ? false : true);
	};
	const deleteMainViewPager = async () => {
		setViewPagerState(false);
		AsyncStorage.setItem(`${title}`, 'true');
	};
	return {getMainViewPager, deleteMainViewPager, viewPagerState};
};
