import {Image} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {getTravelAi, travelSliceActions} from '../../redux/travel-info/travel.slice';
import CustomButton from '../../utill/component/custom-button';
import {Text, Box, ScrollView, VStack, HStack} from 'native-base';
import {tendencyList} from './select-tendency';
import {localSearchAI, enoughPlace} from '../../ai/local_search_ai';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {useEffect} from 'react';
import {cityViewList} from './select-city';

export default function FinalCheck({navigation}: any) {
	const {day, region, accommodations, nDay, cityIndex, essentialPlaces, tendency, timeLimitArray, transit, distance} =
		useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const goNext = async () => {
		//navigation.reset({routes: [{name: 'Preset'}]});
		try {
			dispatch(LoadingSliceActions.onLoading());
			let a = region.map(item => cityViewList[cityIndex].title + ' ' + item);
			if (cityViewList[cityIndex].id >= 8 && region[0] == '전체') {
				a = cityViewList[cityIndex].sub.map(
					(value, idx) => cityViewList[cityIndex].title + ' ' + value.subTitle,
				);
				a.shift();
			}
			const result = await dispatch(
				getTravelAi({
					regionList: a,
					accomodationList: accommodations,
					selectList: tendency,
					essentialPlaceList: essentialPlaces,
					timeLimitArray: timeLimitArray,
					nDay: nDay + 1,
					transit: transit,
					distanceSensitivity: distance,
				}),
			);
			console.log('넹?', result.meta);
			if (result) {
				navigation.popToTop();
				navigation.navigate('Preset');
			}
		} catch (error) {
			console.log(error);
		} finally {
			console.log('ㅇㅇㅂㅇㅂㅈㅈㄷ');
			dispatch(LoadingSliceActions.offLoading());
		}
	};

	const goReset = () => {
		navigation.navigate('SelectCity');
		dispatch(travelSliceActions.reset());
	};
	return (
		<ScrollView bgColor='#EFFBFB' p='2'>
			{/* 스테퍼 넣기 */}

			<Text>{cityViewList[cityIndex].title + region}</Text>
			<Text>출발: {day[0].format('YY-MM-DD')}</Text>
			<Text>종료: {day[nDay].format('YY-MM-DD')}</Text>
			{accommodations.map((item, idx) => {
				return (
					idx != 0 &&
					idx != accommodations.length - 1 && (
						<HStack key={idx}>
							{item.imageUrl && (
								<Image
									source={{
										uri: item.imageUrl,
									}}
									style={{width: 50, height: 50}}
									alt='Place Image'
								/>
							)}
							<Text>{item.name ? idx + ' 일밤 ' + item.name : idx + '일밤 안정함 ㅋ'}</Text>
						</HStack>
					)
				);
			})}

			{[...Array(nDay + 1)].map((item, indx) => {
				const filteredPlaces = essentialPlaces.filter(place => place.day === indx + 1);

				return (
					<Box key={indx} my='3'>
						{filteredPlaces.map(data => (
							<HStack key={data.id}>
								<Image
									source={{
										uri: data.imageUrl,
									}}
									style={{width: 50, height: 50}}
									alt='Place Image'
								/>
								<Text fontSize='lg' bold>
									{data.day}일차 {data.name}
								</Text>
							</HStack>
						))}
					</Box>
				);
			})}
			{tendency.map((item, inx) => {
				return (
					inx !== tendency.length - 1 &&
					item.map((q, a) => {
						return q ? <Text key={a}>{tendencyList[inx]?.list[a]}</Text> : null;
					})
				);
			})}
			<CustomButton label='다시 만들래' onPress={goReset}></CustomButton>
			<CustomButton label='다음 단계' onPress={goNext}></CustomButton>
		</ScrollView>
	);
}
