import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {travelSliceActions} from '../../../redux/travel-info/travel.slice';
import CustomButton from '../../../utill/component/custom-button';
import {Text, Box, ScrollView, VStack, Divider, Slider, Center} from 'native-base';
import {Platform, TouchableOpacity, PermissionsAndroid} from 'react-native';
import {cityViewList} from '../select-city';
import {LoadingSliceActions} from '../../../redux/loading/loading.slice';
import {regionSearch} from '../../../ai/region_search';
//import {regionSearch} from '../../../redux/travel-info/region-recommend.slice';
export default function ViewResult({navigation}: any) {
	const dispatch = useAppDispatch();
	const {tendency, distance, popularity, lat, lng} = useAppSelector(state => state.regionRecommendSlice);
	const [recommendList, setRecommendList] = useState<string[]>([]);
	const goEnrollInfo = (e: string) => {
		let region: string[] = [];
		if (e.includes(' ')) {
			region = e.split(' ');
		} else {
			region = [e, '전체'];
		}
		const cityIndex = cityViewList.find(city => city.title == region[0])?.id;
		const data = {cityIndex: cityIndex, region: [region[1]]};
		dispatch(travelSliceActions.setRecommendRegion(data));

		navigation.navigate('SelectDay');
	};
	const getRegionRecommend = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			let datas = {
				selectList: tendency,
				selectPopular: popularity,
				recentPosition: {lat: lat, lng: lng},
				distanceSensitivity: distance,
			};
			const result = await regionSearch(datas);
			setRecommendList(result);
			//dispatch(regionSearch());
		} catch (err) {
			console.log(err);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	useEffect(() => {
		getRegionRecommend();
	}, []);

	return (
		<ScrollView bgColor='#EFFBFB' p='2'>
			<VStack space='5'>
				<Text fontSize='2xl' bold color='black'>
					결과요
				</Text>
				{recommendList.map((item, idx) => (
					<TouchableOpacity
						onPress={() => {
							goEnrollInfo(item);
						}}>
						<Text>{item}</Text>
					</TouchableOpacity>
				))}
				<CustomButton label='다음 단계' onPress={() => {}}></CustomButton>
			</VStack>
		</ScrollView>
	);
}
