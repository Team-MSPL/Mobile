import {JSX, JSXElementConstructor, ReactElement, useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {
	getDrivingDuration,
	getMyTravelList,
	getOneTravelCourse,
	saveTravel,
	travelSliceActions,
	updateTravelCourse,
} from '../../redux/travel-info/travel.slice';
import shortId from 'shortid';
import {Alert, TouchableOpacity} from 'react-native';
import {Text, Box, ScrollView, VStack, Divider, Slider, Center, HStack, Spacer} from 'native-base';

import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';
export default function MyTravelList({navigation}: any) {
	const {myTravelList} = useAppSelector(state => state.travelSlice);
	const {userId} = useAppSelector(state => state.userSlice);
	const dispatch = useAppDispatch();
	const [select, setSelect] = useState(0);
	const [deleteList, setDeleteList] = useState<string[]>([]);
	const [addList, setAddList] = useState<number[]>([]);
	const [x, setX] = useState(-1);
	const [viewDayIndex, setViewDayIndex] = useState(0);
	let wayPoint = {start: '', goal: '', wayPoint: ''};

	const goMapInfo = () => {
		navigation.navigate('MapInfo');
	};
	const goMyTravelDetail = async (e: string) => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			await dispatch(getOneTravelCourse({travelId: e}));
			navigation.navigate('DetailInfo');
		} catch (err) {
			Alert.alert('코스 가져오는 중 에러가 발생했습니다.');
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const goMakeTravel = () => {
		navigation.navigate('Home');
		navigation.navigate('SelectCity');
	};
	const getTravelLisy = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			await dispatch(getMyTravelList());
		} catch (err) {
			Alert.alert('내 여행 리스트를 받아오던 중 에러가 발생했습니다.');
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	useEffect(() => {
		navigation.setOptions({headerTitle: () => <Text>내 여행</Text>});
	}, []);
	useFocusEffect(
		useCallback(() => {
			getTravelLisy();
		}, []),
	);

	return (
		<ScrollView bgColor='#EFFBFB'>
			{myTravelList.length == 0 ? (
				<TouchableOpacity onPress={goMakeTravel}>
					<Text>내 여행이 없네유 만들러 고고?</Text>
				</TouchableOpacity>
			) : (
				myTravelList.map((item, idx) => (
					<TouchableOpacity
						key={idx}
						style={{marginVertical: 10, borderWidth: 1}}
						onPress={() => {
							goMyTravelDetail(item._id);
						}}>
						<Text>
							{moment(item.day[0]).format('YY-MM-DD') +
								'~' +
								moment(item.day[item.nDay - 1]).format('YY-MM-DD')}
						</Text>
						<Text>{item.region}</Text>
					</TouchableOpacity>
				))
			)}
		</ScrollView>
	);
}
