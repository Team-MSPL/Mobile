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
import {deleteAI, travelSliceActions} from '../../redux/travel-info/travel.slice';
import {SVGRightAdd} from '../../utill/svg/svg';

export default function PresetDetail({navigation, route}: any) {
	const {presetTendencyList, presetDatas, day, nDay, aiID, region} = useAppSelector(state => state.travelSlice);
	const [select, setSelect] = useState(0);
	const dispatch = useAppDispatch();
	let markerCount = 0;
	const checkNext = () => {
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '식당과 숙소까지 다님에서\n한 번에 추천해드릴까요?',
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
				modalSubTitle: '일정을 확정하면 본 결과를 다시 확인하실 수 없습니다. 확정하시면 자동으로 저장됩니다.',
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
			navigation.navigate('Timetable');
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
		const polylineCoordinates = value.map(vvalue => ({
			latitude: vvalue.lat,
			longitude: vvalue.lng,
		}));
		value.map(vvalue =>
			positions.push({
				latitude: vvalue.lat,
				longitude: vvalue.lng,
			}),
		),
			markers.push(
				value.map((vvalue, iindex) => {
					markerCount += 1;
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
									<MarkerContainer key={iindex}>
										<PretendardSemiBoldText
											size={13}
											lineHeight={19}
											color={colors.backgroundWhite}>
											{iindex + 1}
										</PretendardSemiBoldText>
									</MarkerContainer>
								) : (
									<Circle color={colors.Gray5} key={iindex} />
								)}
							</Marker>
						);
					} else {
						return null;
					}
				}),
			);

		polylines.push(
			<Polyline
				key={`polyline_${index}`}
				coordinates={polylineCoordinates}
				strokeColor={index == select ? colors.PointYellow : colors.Gray5}
				strokeWidth={Platform.isPad ? 5 : 2} // You can change the width of the line here
			/>,
		);
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
	return (
		<>
			<BackgroundGray>
				<TopFixContainer>
					<HStack>
						<FlexWrap
							width={widthPercentage(300)}
							gap={widthPercentage(3)}
							onPress={() => {
								setTendencyView(!tendencyView);
							}}>
							{presetTendencyList[route.params.index].tendencyNameList
								.slice(
									0,
									tendencyView ? 4 : presetTendencyList[route.params.index].tendencyNameList.length,
								)
								.map((item, idx) => (
									<TagContainer key={idx} height={28} backgroundColor={colors.backgroundWhite}>
										<PretendardSemiBoldText size={14} lineHeight={16} color={colors.Gray4}>
											{item}
										</PretendardSemiBoldText>
										<PretendardSemiBoldText size={14} lineHeight={16} color={colors.PointYellow}>
											{presetTendencyList[route.params.index].tendencyPointList[idx]}점
										</PretendardSemiBoldText>
									</TagContainer>
								))}
						</FlexWrap>
						{presetTendencyList[route.params.index].tendencyNameList.length > 4 && (
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
						)}
					</HStack>
					<MapView
						style={{width: '100%', height: heightPercentage(248), marginBottom: heightPercentage(13)}}
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
					<ScrollView horizontal>
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
										color={select == idx ? colors.Gray5 : colors.Gray3}>
										DAY{idx + 1}
									</PretendardSemiBoldText>
								</DayTouchablOpacity>
							))}
						</FlexWrap>
					</ScrollView>
				</TopFixContainer>
				<ScrollView
					showsVerticalScrollIndicator={false}
					ref={scrollRef}
					onScroll={e => {
						scrollhandle(e);
					}}>
					{presetDatas[route.params.index].map((item, index) => (
						<WhiteContainer key={index}>
							<PretendardSemiBoldText size={14} lineHeight={17} color={colors.Gray5}>
								{moment(day[index]).format('YY.MM.DD') + ' '}({weekdays[moment(day[index]).days()]})
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
													<Triangle />
												) : (
													<Circle
														color={value.category == 5 ? colors.PointYellow : colors.Gray5}
													/>
												)}
												{item.length != 1 && (
													<DashLine
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
				<CustomButton label='이 여행 일정으로 정했어요!' onPress={checkNext}></CustomButton>
			</ButtonContainer>
		</>
	);
}

const TopFixContainer = styled.View`
	width: ${widthPercentage(327)}px;
`;
export const DayTouchablOpacity = styled.TouchableOpacity<{select: boolean}>`
	width: ${widthPercentage(59)}px;
	height: ${heightPercentage(27)}px;
	align-items: center;
	justify-content: center;
	border-radius: 99px;
	border-width: ${props => (props.select ? '0px' : '1px')};
	border-color: ${colors.Gray3};
	background-color: ${props => (props.select ? colors.Primary : colors.backgroundGray)};
`;
export const MarkerContainer = styled.View<{backgroundColor?: string}>`
	width: ${widthPercentage(Platform.isPad ? 20 : 24)}px;
	height: ${widthPercentage(Platform.isPad ? 20 : 24)}px;
	border-radius: 6px;
	align-items: center;
	justify-content: center;
	background-color: ${props => props.backgroundColor ?? colors.PointYellow};
	z-index: 3;
`;
const InsideGray = styled.View`
	width: ${widthPercentage(300)}px;
	border-radius: 8px;
	background-color: ${colors.backgroundGray};
	padding: ${heightPercentage(13)}px ${widthPercentage(15)}px;
`;
export const MarginContainer = styled.View`
	height: ${heightPercentage(65)}px;
`;
