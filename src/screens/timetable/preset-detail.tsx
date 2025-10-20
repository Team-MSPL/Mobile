import styled from 'styled-components/native';
import {fontPercentage, heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView, TouchableOpacity} from 'react-native';
import {BackgroundGray, FlexWrap, HStack, PretendardSemiBoldText, TagContainer} from '../../utill/layout/layout';
import {useAppDispatch, useAppSelector} from '../../redux';
import {colors} from '../../utill/colors';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {JSXElementConstructor, ReactElement, useRef, useState} from 'react';
import {WhiteContainer} from '../enroll-info/final-check';
import moment from 'moment';
import {Circle, DashLine, DashLineContainer, Triangle} from './preset';
import {ButtonContainer} from '../enroll-info/select-multi';
import CustomButton from '../../utill/component/custom-button';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {deleteAI, recommendProduct, travelSliceActions} from '../../redux/travel-info/travel.slice';
import {SVGRightAdd} from '../../utill/svg/svg';
import {Image} from 'react-native';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';

export default function PresetDetail({navigation, route}: any) {
	const {presetTendencyList, presetDatas, day, nDay, aiID, region, tendency, season, country} = useAppSelector(
		state => state.travelSlice,
	);
	const [select, setSelect] = useState(0);
	const dispatch = useAppDispatch();
	const checkNext = () => {
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '식당과 숙소까지 한 번에 추천해드릴까요?',
				modalSubTitle: '별점이 높은 장소를 우선적으로 추천해드려요',
				modalLeft: true,
				modalTopText: '네, 한 번에 추천해주세요',
				modalBottomText: '아니요, 제가 나중에 직접 고를래요',
				modalFunction: () => handleRecommend(true),
				modalBottomFunctionUse: true,
				modalBottomFunction: () => handleRecommend(false),
			}),
		);
	};
	const handleRecommend = (e: boolean) => {
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '잠깐!',
				modalSubTitle: '일정을 확정하면 본 결과를 다시 확인하실 수 없습니다.\n확정하시면 자동으로 저장됩니다.',
				modalLeft: true,
				modalFunction: () => goNext(e),
			}),
		);
	};
	const removeCache = async () => {
		await AsyncStorage.multiRemove([
			'preset',
			'presetTendency',
			'day',
			'nDay',
			'transit',
			'tendency',
			'travelName',
			'region',
			'aiId',
		]);
	};
	const countryList = [
		{ko: '한국', en: 'Korea'},
		{ko: '일본', en: 'Japan'},
		{ko: '중국', en: 'China'},
		{ko: '베트남', en: 'Vietnam'},
		{ko: '태국', en: 'Thailand'},
		{ko: '필리핀', en: 'Philippines'},
		{ko: '싱가포르', en: 'Singapore'},
	];
	const handleProduct = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const data = {
				pathList: [
					presetDatas[route.params.index].map(item => {
						return item
							.filter(filterItem => !filterItem.name?.includes('추천'))
							.map(value => {
								return {name: value?.name};
							});
					}),
				],
				selectList: [...tendency, season],
				country:
					region.some(r => r.includes('홍콩')) || region.some(r => r.includes('마카오'))
						? '홍콩과 마카오'
						: region[0].includes('해외')
						? countryList.find((check, iidx) => check.en == region[0]?.split('/')[1])?.ko
						: countryList[country].ko, //TODO 홍콩 마카오 처리
				cityList: region,
			};
			const a = await dispatch(recommendProduct(data)).unwrap();
			navigation.navigate('PresetProduct');
			// console.log(a[0]);
		} catch (e) {
			console.log(e);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const goNext = (e: boolean) => {
		try {
			removeCache();
			dispatch(deleteAI({aiId: aiID}));
			let copy = [...presetDatas[route.params.index]];
			if (presetDatas[route.params.index].length != nDay + 1) {
				const check = nDay + 1 - presetDatas[route.params.index].length;
				for (let i = 0; i < check; i++) {
					copy.push([]);
				}
			}
			dispatch(travelSliceActions.setAutoRecommendFlag(e));
			dispatch(travelSliceActions.enrollTimetable(copy));
			handleProduct();
			// navigation.navigate('Timetable');
		} catch (err) {
			console.log(err, '에러');
		}
	};
	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
	const mapRef = useRef<MapView>(null);
	const scrollRef = useRef();
	const changeTouch = (idx: number) => {
		//setSelect(idx);
		let totalScroll = 0;
		for (let i = 0; i < idx; i++) {
			totalScroll += presetDatas[route.params.index][i].length;
		}
		scrollRef.current.scrollTo({
			y:
				totalScroll * heightPercentage(46) +
				idx * fontPercentage(17) +
				idx * fontPercentage(17) +
				idx * heightPercentage(52),

			animate: true,
		});
	};
	const change = (idx: number) => {
		setSelect(idx);
	};
	let positions: {latitude: number; longitude: number}[] = [];
	const markers: ReactElement<any, string | JSXElementConstructor<any>> | JSX.Element[][] | null | undefined = [];
	const polylines:
		| string
		| number
		| boolean
		| JSX.Element[]
		| ReactElement<any, string | JSXElementConstructor<any>>
		| null
		| undefined = [];
	presetDatas[route.params.index].forEach((value, index) => {
		if (index == select) {
			const polylineCoordinates = value
				.map(vvalue => {
					if (vvalue.name != '점심 추천' && vvalue.name != '저녁 추천' && vvalue.name != '숙소 추천') {
						return {
							latitude: vvalue.lat,
							longitude: vvalue.lng,
						};
					} else {
						return null;
					}
				})
				.filter(vvvalue => vvvalue != null);
			polylines.push(
				<Polyline
					key={`polyline_${index}`}
					coordinates={polylineCoordinates}
					strokeColor={index == select ? colors.PointYellow : colors.Gray5}
					strokeWidth={Platform.isPad ? 5 : 2} // You can change the width of the line here
				/>,
			);
		}
		value.map(vvalue =>
			positions.push({
				latitude: vvalue.lat,
				longitude: vvalue.lng,
			}),
		);
		if (select == index) {
			let markerCount = 0;
			markers.push(
				value
					.map((vvalue, iindex) => {
						markerCount += vvalue.name?.includes('추천') ? 0 : 1;
						if (vvalue.name != '점심 추천' && vvalue.name != '저녁 추천' && vvalue.name != '숙소 추천') {
							return (
								<Marker
									key={`marker_${index}_${iindex}`}
									style={{zIndex: 4}}
									coordinate={{latitude: vvalue.lat, longitude: vvalue.lng}}
									centerOffset={{x: 0, y: 0}}
									anchor={{x: 0.5, y: 0.5}}
									title={vvalue.name}>
									{index == select ? (
										vvalue.category == 4 ? (
											<Image
												source={require('../../../public/images/hotel.png')}
												style={{
													width: widthPercentage(30),
													height: widthPercentage(30),
													zIndex: 200,
												}}></Image>
										) : vvalue.category == 1 ? (
											<Image
												source={require('../../../public/images/defalutFood.png')}
												style={{
													width: widthPercentage(30),
													height: widthPercentage(30),
													zIndex: 200,
												}}></Image>
										) : (
											<MarkerContainer key={iindex} mapMarker={true}>
												<PretendardSemiBoldText
													size={13}
													lineHeight={19}
													color={colors.backgroundWhite}>
													{markerCount}
												</PretendardSemiBoldText>
											</MarkerContainer>
										)
									) : (
										<Circle color={colors.Gray5} key={iindex} />
									)}
								</Marker>
							);
						} else {
							return null;
						}
					})
					.filter(vvvalue => vvvalue != null),
			);
		}
	});
	const minLatitude = Math.min(...positions.map(marker => marker.latitude));
	const maxLatitude = Math.max(...positions.map(marker => marker.latitude));
	const minLongitude = Math.min(...positions.map(marker => marker.longitude));
	const maxLongitude = Math.max(...positions.map(marker => marker.longitude));

	// 경계 상자의 중심 좌표 계산
	const centerLatitude = (maxLatitude + minLatitude) / 2;
	const centerLongitude = (maxLongitude + minLongitude) / 2;

	// 경계 상자의 너비와 높이 계산
	const deltaLatitude = maxLatitude - minLatitude;
	const deltaLongitude = maxLongitude - minLongitude;

	// 너비와 높이 중 큰 값을 기준으로 줌 레벨 계산
	const maxDelta = Math.max(deltaLatitude, deltaLongitude);
	let totalHeight = 0;
	const presetScrollHeight = presetDatas[route.params.index].map((item, idx) => {
		totalHeight += item.length * 48 + idx * 17 + idx * widthPercentage(10);
		return totalHeight;
	});
	const scrollhandle = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const scrollY = e.nativeEvent.contentOffset.y;
		// 스크롤뷰의 높이를 가져옵니다.
		const scrollViewHeight = e.nativeEvent.layoutMeasurement.height;
		const scrollIndex = presetScrollHeight.findIndex(item => item > scrollY + scrollViewHeight / 2);
		if (scrollY + scrollViewHeight + (scrollY + scrollViewHeight) * 0.1 > e.nativeEvent.contentSize.height) {
			change(presetScrollHeight.length - 1);
		} else if (scrollIndex != -1 && scrollIndex < presetScrollHeight.length) {
			change(presetScrollHeight.findIndex(item => item > scrollY + scrollViewHeight / 2));
		}
	};
	const moveRegion = async (index: number, e: number) => {
		let copy = {
			...presetDatas[route.params.index][index][e],
			region: region[presetDatas[route.params.index][index][e].regionIndex],
		};
		navigation.navigate('CourseDetail', {value: copy});
	};
	const [tendencyView, setTendencyView] = useState(true);
	const calculateTendency = (e: any) => {
		let copy = [];
		let copy2 = [];
		e?.tendencyNameList?.forEach((item, idx) => {
			if (!['봄', '여름', '가을', '겨울'].includes(item)) {
				copy.push(item);
				copy2.push(e.tendencyRanking[idx]);
			}
		});
		let min = 100;
		let minIndex = -1;
		let nextMin = 100;
		let nextMinIndex = -1;
		console.log(copy, copy2);
		copy2.forEach((item, idx) => {
			if (item <= min) {
				nextMin = min;
				nextMinIndex = minIndex;
				min = item;
				minIndex = idx;
			} else if (item <= nextMin) {
				nextMin = item;
				nextMinIndex = idx;
			}
		});
		let result =
			(e?.tendencyNameList[minIndex] ?? '') +
			(e?.tendencyNameList[nextMinIndex] ? ', ' + e?.tendencyNameList[nextMinIndex] : '');
		return result;
	};
	return (
		<>
			<BackgroundGray paddingHorizental={0}>
				<TopFixContainer>
					<HStack marginHorizon={widthPercentage(24)}>
						{presetTendencyList[route.params.index]?.tendencyNameList.length >= 2 && (
							<HStack marginVertical={10}>
								<PretendardSemiBoldText size={16} lineHeight={20.6} color={colors.Black}>
									<PretendardSemiBoldText size={16} lineHeight={20.6} color={colors.PointYellow}>
										[{calculateTendency(presetTendencyList[route.params.index])}]
									</PretendardSemiBoldText>{' '}
									성향이 높은 코스에요!
								</PretendardSemiBoldText>
							</HStack>
						)}
						{/* {presetTendencyList[route.params.index].tendencyNameList.length > 4 && (
							<TouchableOpacity
								style={{height: 'auto', justifyContent: 'flex-end', marginLeft: 4}}
								onPress={() => {
									setTendencyView(!tendencyView);
								}}>
								<SVGRightAdd
									width={widthPercentage(20)}
									height={widthPercentage(20)}
									color='black'
									transform={tendencyView ? 90 : 270}
								/>
							</TouchableOpacity>
						)} */}
					</HStack>
					<MapView
						style={{
							width: widthPercentage(375),
							height: heightPercentage(268),
							marginBottom: heightPercentage(13),
						}}
						showsMyLocationButton={true}
						ref={mapRef}
						region={{
							latitude: centerLatitude,
							longitude: centerLongitude,
							latitudeDelta: deltaLatitude + deltaLatitude / 2,
							longitudeDelta: deltaLongitude + deltaLongitude / 5,
						}}>
						{markers}
						{polylines}
					</MapView>
					<ScrollView horizontal style={{paddingHorizontal: widthPercentage(24)}}>
						<FlexWrap gap={10}>
							{presetDatas[route.params.index].map((item, idx) => (
								<DayTouchablOpacity
									key={idx}
									select={select == idx}
									onPress={() => {
										changeTouch(idx);
									}}>
									<PretendardSemiBoldText
										size={14}
										lineHeight={18.9}
										color={select == idx ? colors.Gray5 : colors.Gray400}>
										DAY {idx + 1}
									</PretendardSemiBoldText>
								</DayTouchablOpacity>
							))}
						</FlexWrap>
					</ScrollView>
				</TopFixContainer>
				<ScrollView
					showsVerticalScrollIndicator={false}
					ref={scrollRef}
					style={{paddingHorizontal: widthPercentage(24)}}
					onScroll={e => {
						scrollhandle(e);
					}}>
					{presetDatas[route.params.index].map((item, index) => (
						<WhiteContainer
							key={index}
							deco={`border-width:1px;border-color:${colors.Gray200};padding:${widthPercentage(
								20,
							)}px ${widthPercentage(20)}px;`}>
							<PretendardSemiBoldText size={14} lineHeight={17} color={colors.Gray5}>
								{moment(day[index]).format('YY-MM-DD') + ' '}({weekdays[moment(day[index]).days()]})
							</PretendardSemiBoldText>
							<InsideGray>
								<PretendardSemiBoldText size={14} lineHeight={17} color={colors.Gray2}>
									여행지
								</PretendardSemiBoldText>
								{item.map((value, idx) => (
									<TouchableOpacity
										onPress={() => {
											if (
												value.name != '점심 추천' &&
												value.name != '저녁 추천' &&
												value.name != '숙소 추천'
											) {
												moveRegion(index, idx);
											} else
												[
													dispatch(
														modalSliceActions.setOpenModal({
															modalTitle: '여행 일정을 확정하시면\n추천이 가능해요!',
															modalSingleUse: true,
														}),
													),
												];
										}}
										key={idx}>
										<HStack gap={widthPercentage(10)}>
											<DashLineContainer>
												{value.category == 4 ? (
													<Triangle style={{borderTopColor: colors.PointYellow}} />
												) : (
													<Circle
														color={
															value.category == 5
																? colors.PointYellow
																: colors.PointYellow
														}
													/>
												)}
												{item.length != 1 && (
													<DashLine
														color={colors.PointYellow}
														dash={false}
														status={
															idx == 0
																? 'start'
																: idx == item.length - 1
																? 'end'
																: 'center'
														}
													/>
												)}
											</DashLineContainer>
											<PretendardSemiBoldText
												size={15}
												lineHeight={19}
												color={value.category == 5 ? colors.PointYellow : colors.Gray5}>
												{value.name + ' '}
												{value.name != '숙소 추천' && (
													<PretendardSemiBoldText
														size={12}
														lineHeight={15}
														color={colors.Gray5}>
														{Math.floor(value.takenTime / 60) != 0 &&
															Math.floor(value.takenTime / 60) + '시간'}
														{value.takenTime % 60 != 0 && (value.takenTime % 60) + '분'}
													</PretendardSemiBoldText>
												)}
											</PretendardSemiBoldText>
										</HStack>
									</TouchableOpacity>
								))}
							</InsideGray>
						</WhiteContainer>
					))}
				</ScrollView>
				<MarginContainer />
			</BackgroundGray>
			<ButtonContainer>
				<CustomButton
					bgColor={colors.Gray5}
					textColor={colors.backgroundWhite}
					label='이 여행 일정으로 정했어요!'
					onPress={checkNext}></CustomButton>
			</ButtonContainer>
		</>
	);
}

const TopFixContainer = styled.View`
	width: ${widthPercentage(375)}px;
`;
export const DayTouchablOpacity = styled.TouchableOpacity<{select: boolean}>`
	width: ${widthPercentage(73)}px;
	height: ${heightPercentage(35)}px;
	align-items: center;
	justify-content: center;
	border-radius: 99px;
	border-width: ${props => (props.select ? '1px' : '0px')};
	border-color: ${colors.Primary};
	background-color: ${props => (props.select ? colors.PrimarySecondary : colors.backgroundWhite)};
`;
export const MarkerContainer = styled.View<{backgroundColor?: string; mapMarker?: boolean}>`
	width: ${widthPercentage(Platform.isPad ? 20 : 24)}px;
	height: ${widthPercentage(Platform.isPad ? 20 : 24)}px;
	border-radius: 6px;
	align-items: center;
	justify-content: center;
	background-color: ${props => props.backgroundColor ?? colors.PointYellow};
	z-index: 3;
	${props =>
		props.mapMarker && 'border-bottom-width: 2px; border-left-width: 2px;border-color: rgba(64, 64, 64, 0.4);'}
`;
const InsideGray = styled.View`
	width: ${widthPercentage(287)}px;
	border-radius: 8px;
	background-color: ${colors.backgroundGray};
	padding: ${heightPercentage(13)}px ${widthPercentage(15)}px;
`;
export const MarginContainer = styled.View`
	height: ${heightPercentage(65)}px;
`;
