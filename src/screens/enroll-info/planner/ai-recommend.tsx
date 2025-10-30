import {useRoute} from '@react-navigation/native';
import {useEffect, useLayoutEffect, useState} from 'react';
import {Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {styled} from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {LoadingSliceActions} from '../../../redux/loading/loading.slice';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {getRecommendPlace, recommendTripadvisor} from '../../../redux/travel-info/travel.slice';
import {colors} from '../../../utill/colors';
import {cityViewList} from '../../../utill/component/enroll-info/city-list';
import {useTendencyHandler} from '../../../utill/hooks/useTendencyHandler';
import {
	BackgroundGray,
	BackgroundGrayScrollView,
	FlexWrap,
	HStack,
	PretendardSemiBoldText,
	PretendardVariableText,
} from '../../../utill/layout/layout';
import {heightPercentage, widthPercentage} from '../../../utill/layout/responsive-size';
import {RegionItems} from '../select-city';

export default function AiRecommned({navigation}: any) {
	const route = useRoute();
	const {info, title} = route.params;
	const dispatch = useAppDispatch();
	const {tendency, season, timetable, regionInfo, region, country, cityIndex} = useAppSelector(
		state => state.travelSlice,
	);
	const {userName} = useAppSelector(state => state.userSlice);
	const [recommendList, setRcommendList] = useState([]);
	const {countryList} = useTendencyHandler();
	const [sortStatus, setSortStatus] = useState('추천순');
	const handleImage = (e: string) => {
		let title = '';
		switch (e) {
			case 'travle':
				title = require('../../../../public/images/defalutAccomodation.png');
				break;
			case 'accommodation':
				title = require('../../../../public/images/hotel.png');
				break;
			case 'cafe':
				title = require('../../../../public/images/defalutFood.png');
				break;
		}
		return title;
	};
	const handleRegion = () => {
		let a = region.map(item => cityViewList[country][cityIndex].title + ' ' + item);
		if (
			(country == 0 && cityViewList[country][cityIndex].id >= 3 && region[0] == '전체') ||
			(country == 0 && cityViewList[country][cityIndex].id == 1 && region[0] == '전체') ||
			(country != 0 && region[0] == '전체')
		) {
			a = cityViewList[country][cityIndex].sub.map(
				(value, idx) => cityViewList[country][cityIndex].title + ' ' + value.subTitle,
			);
			a.shift();
		}
		// //["해외/Vietnam/나트랑", "해외/Vietnam/다낭"]
		if (country == 0 && cityIndex == 2) {
			a = [region[0] + ' 전체'];
		}
		if (country != 0) {
			a = a.map((item, idx) => {
				return `해외/${countryList[country].en}/${item
					.slice(
						item.indexOf(cityViewList[country][cityIndex].title) +
							cityViewList[country][cityIndex].title.length,
					)
					.trim()}`;
			});
		}
		return [a[0]];
	};
	const getTravelRecommendList = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const data = {
				regionList: handleRegion(),
				selectList: [...tendency, season],
				transit: 1,
				version: 3, // 없으면 2로 취급
				distanceSensitivity: 5,
				popularSensitivity: 5, // 250604추가 - 기본값 5
				bandwidth: true,
				lat: timetable[info?.day][info?.index - 1]?.lat ?? regionInfo?.lat,
				lng: timetable[info?.day][info?.index - 1]?.lng ?? regionInfo?.lng,
				page: 1, // 250430 추가
				page_for_place: 10, // 250430 추가
				password: '(주)나그네들_g5hb87r8765rt68i7ur78',
			};
			const a = await dispatch(getRecommendPlace(data)).unwrap();
			setRcommendList(a?.recommendedPlaces);
			console.log(a);
		} catch (e) {
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const handleCategory = (e: string) => {
		let title = '';
		switch (e) {
			case 'travle':
				title = 'attractions';
				break;
			case 'accommodation':
				title = 'hotels';
				break;
			case 'cafe':
				title = 'restaurants';
				break;
		}
		return title;
	};
	const getRecommendList = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());

			let result = await dispatch(
				recommendTripadvisor({
					category: handleCategory(title),
					lat: timetable[info.day][info.index - 1]?.lat ?? regionInfo.lat,
					lng: timetable[info.day][info.index - 1]?.lng ?? regionInfo.lng,
					radius: 10000,
					name: timetable[info.day][info.index - 1]?.name ?? region[0].split('/').at(-1),
				}),
			).unwrap();
			result = result.data;
			if (result.length == 0) {
				result = await dispatch(
					recommendTripadvisor({
						category: handleCategory(title),
						lat: timetable[info.day][info.index - 1]?.lat ?? regionInfo.lat,
						lng: timetable[info.day][info.index - 1]?.lng ?? regionInfo.lng,
						radius: 20000,
						name: timetable[info.day][info.index - 1]?.name ?? region[0].split('/').at(-1),
					}),
				).unwrap();
				// departure.current.lat = lat;
				// departure.current.lng = lng;
				result = result.data;
				result.length == 0 &&
					(dispatch(
						modalSliceActions.setOpenModal({
							modalSingleUse: true,
							modalTitle: '동선 상에 추천할 수 있는 장소가 없습니다 ㅠㅠ',
						}),
					),
					navigation.goBack());
			}
			console.log(result);
			setRcommendList(result);
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '추천 아이템이 없습니다!',
				}),
			);
			navigation.goBack();
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const handleSort = (e: string) => {
		setSortStatus(e);
	};
	useLayoutEffect(() => {
		if (title == 'travle') {
			getTravelRecommendList();
		} else {
			getRecommendList();
		}
	}, []);
	const sortTitleList = ['추천순', '거리순', '추천점수순'];
	if (recommendList.length == 0) return <></>;
	return (
		<BackgroundGray>
			<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black} deco={'text-align:center'}>
				{userName}님의 성향을 고려한 {region}추천 여행지
			</PretendardSemiBoldText>
			<HStack justifyContent='center' gap={20} marginVertical={20}>
				{sortTitleList.map(item => (
					<RegionItems
						select={sortStatus == item}
						onPress={() => {
							handleSort(item);
						}}>
						<PretendardVariableText
							size={14}
							lineHeight={18.9}
							color={sortStatus == item ? colors.backgroundWhite : colors.Gray5}>
							{item}
						</PretendardVariableText>
					</RegionItems>
				))}
			</HStack>
			<ListScrollView>
				<FlexWrap gap={10}>
					{recommendList.map((item, index) => (
						<RecommendItemBox>
							<RecommendItemImg
								source={item?.photo ? {uri: item?.photo} : handleImage(route.params?.title)}
								resizeMode={'stretch'}
							/>
							<LinearGradient
								start={{x: 0, y: 0.3}}
								end={{x: 0, y: 1}}
								colors={['rgba(255,255,255,0)', 'black']}
								style={{
									zIndex: 101,
									position: 'absolute',
									width: '100%',
									paddingHorizontal: widthPercentage(10),
									height: '100%',
									justifyContent: Platform.isPad ? 'center' : 'flex-end',
									paddingBottom: heightPercentage(10),
									borderRadius: 8,
								}}>
								<PretendardSemiBoldText size={16} lineHeight={21} color={colors.backgroundWhite}>
									{item?.name}
								</PretendardSemiBoldText>
								<HStack justifyContent='space-between'>
									<PretendardSemiBoldText size={13} lineHeight={21} color={colors.backgroundWhite}>
										<PretendardSemiBoldText size={16} lineHeight={21} color={colors.Primary}>
											{item?.score}
										</PretendardSemiBoldText>
										/100
									</PretendardSemiBoldText>
									<PretendardVariableText size={14} lineHeight={19} color={colors.backgroundWhite}>
										~{Math.floor(item?.distance * 10)}km
									</PretendardVariableText>
								</HStack>
							</LinearGradient>
						</RecommendItemBox>
					))}
				</FlexWrap>
			</ListScrollView>
		</BackgroundGray>
	);
}
const ListScrollView = styled.ScrollView``;
const RecommendItemBox = styled.TouchableOpacity`
	width: ${widthPercentage(158)}px;
	height: ${widthPercentage(158)}px;
	border-radius: 8px;
`;

const RecommendItemImg = styled.Image`
	width: ${widthPercentage(158)}px;
	height: ${widthPercentage(158)}px;
	border-radius: 8px;
`;
