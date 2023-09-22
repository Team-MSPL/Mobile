import {useEffect, useLayoutEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {travelSliceActions} from '../../../redux/travel-info/travel.slice';
import CustomButton from '../../../utill/component/custom-button';
import {Text, ScrollView} from 'native-base';
import {Platform, TouchableOpacity, PermissionsAndroid, Alert, BackHandler} from 'react-native';
import {cityViewList} from '../select-city';
import {LoadingSliceActions} from '../../../redux/loading/loading.slice';
import {regionSearch} from '../../../redux/travel-info/region-recommend.slice';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {MainContainer, HStack, VStack} from '../../../utill/layout/layout';
import StepText from '../../../utill/component/enroll-info/step-text';
import styled from 'styled-components/native';
import {colors} from '../../../utill/colors';
export default function ViewResult({navigation}: any) {
	const dispatch = useAppDispatch();
	const {selectStartDate} = useAppSelector(state => state.travelSlice);
	const {isLoading} = useAppSelector(state => state.loadingSlice);
	const {tendency, distance, popularity, lat, lng} = useAppSelector(state => state.regionRecommendSlice);
	const [recommendList, setRecommendList] = useState<
		{name: string; photo: string; takenDay: number; tendency: string[]}[]
	>([]);
	const goEnrollInfo = (e: string) => {
		let region: string[] = [];
		if (e.includes(' ')) {
			region = e.split(' ');
		} else {
			region = [e, '전체'];
		}
		const cityIndex = cityViewList.find(city => city.title == region[0])?.id;
		const data = {cityIndex: cityIndex, region: [region[1]]};

		let season = Array(4).fill(0);
		let index = Math.floor((selectStartDate.month() + 1) / 3) - 1;
		index < 0 ? (season[3] = 1) : (season[index] = 1);
		dispatch(travelSliceActions.setTravelStart({makeMode: 'recommend', season: season}));
		dispatch(travelSliceActions.setRecommendRegion(data));
		navigation.navigate('EnrollTravelTitle');
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
			const result = await dispatch(regionSearch(datas)).unwrap();
			setRecommendList(result);
		} catch (err) {
			console.log(err);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	useEffect(() => {
		const backAction = () => {
			if (navigation.isFocused()) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '뒤로 이동시 데이터는 날라갑니다.',
						modalSubTitle: '그래도 나가시겠습니까?',
						modalLeft: true,
						modalFunction: () => {
							navigation.popToTop();
						},
					}),
				);
				return true;
			}
		};

		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

		return () => backHandler.remove();
	}, []);
	useLayoutEffect(() => {
		getRegionRecommend();
	}, []);
	if (isLoading)
		return (
			<ScrollView>
				<Text>스ㅔ</Text>
			</ScrollView>
		);
	return (
		<MainContainer>
			<StepText mainText='지역 추천' subText='당신의 성향을 기반으로, 여행 지역을 찾아왔어요' />
			<RecommendAllContainer>
				{recommendList.map((item, idx) => (
					<RecommendContainer
						key={idx}
						onPress={() => {
							goEnrollInfo(item.name);
						}}>
						<RecommendImage source={{uri: item.photo}}></RecommendImage>
						<RecommendElement>
							<TitleText>{item.name}</TitleText>
							{item.tendency.map((value, index) => (
								<TendencyText>#{value}</TendencyText>
							))}
						</RecommendElement>
					</RecommendContainer>
				))}
			</RecommendAllContainer>
		</MainContainer>
	);
}

const RecommendAllContainer = styled.View`
	width: 100%;
	border-radius: 10px;
	align-items: center;
	justify-content: center;
	margin: 0px 0px 30px 0px;
`;
const RecommendContainer = styled.TouchableOpacity`
	width: 90%;
	border-radius: 10px;
	align-items: center;
	justify-content: center;
	margin: 10px 0px 10px 0px;
`;
const RecommendImage = styled.Image`
	width: 100%;
	height: 200px;
	border-radius: 10px;
`;
const RecommendElement = styled.View`
	width: 100%;
	background-color: ${colors.selectButton};
	flex-direction: row;
	border-bottom-right-radius: 10px;
	border-bottom-left-radius: 10px;
	position: absolute;
	bottom: 0px;
	align-items: center;
	padding: 10px;
`;
const TitleText = styled.Text`
	font-size: 16px;
	font-weight: bold;
	color: white;
`;
const TendencyText = styled(TitleText)`
	margin: 0px 0px 0px 5px;
	font-size: 9px;
`;
