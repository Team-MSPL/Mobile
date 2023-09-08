import {useCallback, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {getMyTravelList, getOneTravelCourse} from '../../redux/travel-info/travel.slice';
import {TouchableOpacity} from 'react-native';
import {Text, Box, ScrollView} from 'native-base';

import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';
import {useBackHandler} from '../../utill/hooks/useBackhandler';
import {modalSliceActions} from '../../redux/modal/modalSlice';
export default function MyTravelList({navigation}: any) {
	const {myTravelList} = useAppSelector(state => state.travelSlice);
	const {socialloginProvider} = useAppSelector(state => state.userSlice);
	const dispatch = useAppDispatch();
	const [view, setView] = useState(0);
	const goMyTravelDetail = async (e: string) => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			await dispatch(getOneTravelCourse({travelId: e}));
			navigation.navigate('DetailInfo');
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '코스를 가져오던 중 에러가 발생했습니다',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const goMakeTravel = () => {
		navigation.navigate('Home');
		navigation.navigate('SelectCity');
	};
	const getTravelList = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			await dispatch(getMyTravelList());
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '내 여행 리스트를 가져오던 중 에러가 발생했습니다.',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	useBackHandler();
	useEffect(() => {
		navigation.setOptions({
			headerTitle: () => <Text>내 여행</Text>,
			headerRight: () =>
				socialloginProvider != 'anonymous' && (
					<TouchableOpacity
						onPress={() => {
							setView(view + 1);
						}}>
						<Text>새로고침</Text>
					</TouchableOpacity>
				),
		});
	}, []);
	useFocusEffect(
		useCallback(() => {
			socialloginProvider != 'anonymous' && getTravelList();
		}, []),
	);

	return (
		<ScrollView bgColor='#EFFBFB'>
			{socialloginProvider == 'anonymous' ? (
				<Box>익명이라 보여줄게 없엉 </Box>
			) : myTravelList.length == 0 ? (
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
