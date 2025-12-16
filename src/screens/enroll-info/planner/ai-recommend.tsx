import {useRoute} from '@react-navigation/native';
import {useEffect, useLayoutEffect, useState} from 'react';
import {Modal, Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import shortid from 'shortid';
import {styled} from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {LoadingSliceActions} from '../../../redux/loading/loading.slice';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {
	detailTripadvisor,
	getRecommendPlace,
	recommendTripadvisor,
	travelSliceActions,
} from '../../../redux/travel-info/travel.slice';
import {colors} from '../../../utill/colors';
import {cityViewList} from '../../../utill/component/enroll-info/city-list';
import PrimaryButton from '../../../utill/component/primary-button';
import {useTendencyHandler} from '../../../utill/hooks/useTendencyHandler';
import {
	BackgroundGray,
	BackgroundGrayScrollView,
	FlexWrap,
	HStack,
	PretendardSemiBoldText,
	PretendardVariableText,
	VStack,
} from '../../../utill/layout/layout';
import {heightPercentage, widthPercentage} from '../../../utill/layout/responsive-size';
import {SvgCancel, SVGMinus, SVGPlus} from '../../../utill/svg/svg';
import {metropolitanCheckList} from '../../home/main';
import {BottomContainer} from '../search-place';
import {RegionItems} from '../select-city';
import {ElementContainer, SVGContainer} from '../select-multi';
import {DeleteBox} from './add-search-recommend';
import {ModalBackground, ModalBottomSheet} from './regist-transit';

export default function AiRecommned({navigation}: any) {
	const route = useRoute();
	const {info, title} = route.params;
	const dispatch = useAppDispatch();
	const {tendency, season, timetable, regionInfo, region, country, cityIndex, Place} = useAppSelector(
		state => state.travelSlice,
	);
	const [placeState, setPlaceState] = useState<{
		name: string | undefined;
		lat: number | undefined;
		lng: number | undefined;
		photo: string;
		category: number;
		takenTime: number;
		formatted_address: string | undefined;
		region: string;
	} | null>();
	const [timeValue, setTimeValue] = useState(0);
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

	const handleCategoryIndex = (e: string) => {
		let title = 0;
		switch (e) {
			case 'travle':
				title = 0;
				break;
			case 'accommodation':
				title = 4;
				break;
			case 'cafe':
				title = 1;
				break;
		}
		return title;
	};
	const handleAdd = () => {
		let copy = [...timetable];
		let copy2 = [...timetable[route.params?.info?.day]];
		copy2.push({
			...placeState,
			category: handleCategoryIndex(route?.params?.title),
			x: route.params?.info?.day,
			y:
				isNaN(copy2[route.params?.info?.index - 1]?.y + copy2[route.params?.info?.index - 1]?.takenTime / 30) ||
				copy2[route.params?.info?.index - 1]?.y == 36
					? route.params?.info?.startTime
					: copy2[route.params?.info?.index - 1]?.y + copy2[route.params?.info?.index - 1]?.takenTime / 30,
			id: shortid.generate(),
			takenTime: (timeValue + 1) * 60,
			lat: Number(placeState?.lat),
			lng: Number(placeState?.lng),
		});
		copy2 = copy2.sort((a, b) => a.y - b.y);
		copy[route.params?.info?.day] = copy2;
		dispatch(travelSliceActions.changeTimetable(copy));
		navigation.pop(3);
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
			setRcommendList(a?.recommendedPlaces.sort((a, b) => b?.popular - a?.popular));
			console.log(a);
		} catch (e) {
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const handleTitle = (e: string) => {
		let title = '';
		switch (e) {
			case 'travle':
				title = '여행지';
				break;
			case 'accommodation':
				title = '숙소';
				break;
			case 'cafe':
				title = '식당/카페';
				break;
		}
		return title;
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
		let copy = [...recommendList];
		switch (e) {
			case '추천순':
				copy = copy.sort((a, b) => b?.popular - a?.popular);
				break;
			case '거리순':
				copy = copy.sort((a, b) => a?.distance - b?.distance);
				break;
			case '성향점수순':
				copy = copy.sort((a, b) => b?.score - a?.score);
				break;
		}
		setRcommendList(copy);
		setSortStatus(e);
	};
	useLayoutEffect(() => {
		if (title == 'travle') {
			getTravelRecommendList();
		} else {
			getRecommendList();
		}
	}, []);
	const [modalActive, setModalActive] = useState(false);
	const sortTitleList = ['추천순', '거리순', '성향점수순'];
	if (recommendList.length == 0) return <></>;
	return (
		<>
			<BackgroundGray>
				<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black} deco={'text-align:center'}>
					{userName}님의 성향을 고려한{' '}
					{region[0] == '전체' ? cityViewList[country][cityIndex].title : region[0]} 추천 {handleTitle(title)}
				</PretendardSemiBoldText>
				{title == 'travle' && (
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
				)}
				<ListScrollView>
					<FlexWrap gap={10}>
						{recommendList.map((item, index) => (
							<RecommendItemBox
								onPress={async () => {
									console.log(item);
									let tripData = null;
									if (title != 'travle')
										tripData = await dispatch(detailTripadvisor({id: item?.location_id})).unwrap();
									const datas = {
										...Place,
										name: item?.name,
										lat: tripData?.latitude ?? item?.lat,
										lng: tripData?.longitude ?? item?.lng,
										formatted_address: '',
										photo: '',
										region:
											region[0] == '전체' ? cityViewList[country][cityIndex].title : region[0],
									};
									setPlaceState(datas);
									setModalActive(true);
									dispatch(travelSliceActions.enrollPlace(datas));
								}}>
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
										{title == 'travle' && (
											<PretendardSemiBoldText
												size={13}
												lineHeight={21}
												color={colors.backgroundWhite}>
												<PretendardSemiBoldText
													size={16}
													lineHeight={21}
													color={colors.Primary}>
													{item?.score}
												</PretendardSemiBoldText>
												/100
											</PretendardSemiBoldText>
										)}
										<PretendardVariableText
											size={14}
											lineHeight={19}
											color={colors.backgroundWhite}>
											~{Math.floor(item?.distance * 10)}km
										</PretendardVariableText>
									</HStack>
								</LinearGradient>
							</RecommendItemBox>
						))}
					</FlexWrap>
				</ListScrollView>
			</BackgroundGray>

			<Modal
				animationType={'fade'}
				transparent={true}
				visible={modalActive}
				onRequestClose={() => {
					// setShow(false);
				}}>
				<ModalBackground
					onPress={() => {
						// setPlaceState(null);
						setModalActive(false);
					}}>
					<ModalBottomSheet flex={route.params?.title == 'accommodation' ? 0.4 : 0.4}>
						<BottomContainer height={heightPercentage(230)} gap={20}>
							<ElementContainer width='327' color={colors.backgroundGray} height={widthPercentage(75)}>
								<VStack width={widthPercentage(191)}>
									<PretendardSemiBoldText size={16} color={colors.Gray5} lineHeight={21.6}>
										{placeState?.name}
									</PretendardSemiBoldText>
									<PretendardVariableText
										size={12}
										lineHeight={18}
										color={colors.Gray2}
										numberOfLines={1}>
										{placeState?.formatted_address}
									</PretendardVariableText>
								</VStack>
								<MoreButton
									onPress={() => {
										let metropolitanStatus = metropolitanCheckList.includes(placeState?.region);
										const data = {
											name: placeState?.name,
											lat: placeState?.lat,
											lng: placeState?.lng,
											region: placeState?.region,
											metropolitan: metropolitanStatus,
											mainFlag: true,
											photo: '',
										};
										setModalActive(false);
										navigation.navigate('CourseDetail', {value: data, trigger: 'airecommend'});
									}}>
									<PretendardVariableText
										size={14}
										lineHeight={18}
										color={colors.Black}
										numberOfLines={1}>
										상세 정보
									</PretendardVariableText>
								</MoreButton>
								<DeleteBox
									onPress={() => {
										setPlaceState(null);
										setModalActive(false);
									}}>
									<SvgCancel width={widthPercentage(12)} height={widthPercentage(12)} color='black' />
								</DeleteBox>
							</ElementContainer>
							{title != 'accommodation' && (
								<HStack justifyContent='space-around'>
									<PretendardSemiBoldText size={16} color={colors.Gray5} lineHeight={24}>
										머무를 시간
									</PretendardSemiBoldText>
									<HStack justifyContent='space-around' width={widthPercentage(182)}>
										<SVGContainer
											disabled={timeValue < 1}
											onPress={() => {
												setTimeValue(timeValue - 1);
											}}
											color={timeValue < 1 ? colors.backgroundWhite : colors.Gray1}>
											{timeValue >= 1 && (
												<SVGMinus
													width={widthPercentage(23)}
													height={widthPercentage(23)}
													color={colors.Gray2}
												/>
											)}
										</SVGContainer>

										<PretendardSemiBoldText size={16} color={colors.PointYellow} lineHeight={21.6}>
											{timeValue + 1}시간
										</PretendardSemiBoldText>
										<SVGContainer
											disabled={timeValue > 1}
											onPress={() => {
												setTimeValue(timeValue + 1);
											}}
											color={timeValue > 1 ? colors.backgroundWhite : colors.Gray5}>
											{timeValue <= 1 && (
												<SVGPlus
													width={widthPercentage(25)}
													height={widthPercentage(25)}
													color={colors.Primary}
												/>
											)}
										</SVGContainer>
									</HStack>
								</HStack>
							)}
							<PrimaryButton
								label={handleTitle(title) + ' 추가'}
								width={widthPercentage(327)}
								height={heightPercentage(60)}
								onPress={() => {
									handleAdd();
								}}
								backgroundColor={colors.Gray5}
								textColor={colors.backgroundWhite}></PrimaryButton>
						</BottomContainer>
					</ModalBottomSheet>
				</ModalBackground>
			</Modal>
		</>
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
const MoreButton = styled.TouchableOpacity`
	width: ${widthPercentage(76)}px;
	height: ${heightPercentage(37)}px;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	background-color: ${colors.Primary};
`;
