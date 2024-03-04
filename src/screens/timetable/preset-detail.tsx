import styled from 'styled-components/native';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {Platform, ScrollView, Text} from 'react-native';
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
import {travelSliceActions} from '../../redux/travel-info/travel.slice';

export default function PresetDetail({navigation, route}: any) {
	const {presetTendencyList, presetDatas, day, nDay} = useAppSelector(state => state.travelSlice);
	const [select, setSelect] = useState(0);
	const dispatch = useAppDispatch();
	let markerCount = 0;
	const checkNext = () => {
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '잠깐!',
				modalSubTitle: '선택 후에는 다시 돌아올수없습니다.\n선택시 자동 저장됩니다.',
				modalLeft: true,
				modalFunction: goNext,
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
		]);
	};
	const goNext = () => {
		// console.log(presetDatas[select]);
		removeCache();
		let copy = [...presetDatas[select]];
		if (presetDatas[select].length != nDay + 1) {
			const check = nDay + 1 - presetDatas[select].length;

			for (let i = 0; i < check; i++) {
				copy.push([]);
			}
		}
		dispatch(travelSliceActions.enrollTimetable(copy));
		// navigation.popToTop();
		navigation.navigate('Timetable');
	};
	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
	const mapRef = useRef<MapView>(null);
	const change = (idx: number) => {
		if (mapRef.current) {
			mapRef.current.animateToRegion(
				{
					latitude: centerLatitude,
					longitude: centerLongitude,
					latitudeDelta: deltaLatitude + deltaLatitude / 2,
					longitudeDelta: deltaLongitude + deltaLongitude / 5,
				},
				1000,
			); // 1000ms 동안 목표 지점으로 애니메이션 이동
		}
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
		value.map(
			vvalue =>
				index == select &&
				positions.push({
					latitude: vvalue.lat,
					longitude: vvalue.lng,
				}),
		),
			markers.push(
				value.map((vvalue, iindex) => {
					markerCount += 1;
					return (
						<Marker
							key={`marker_${index}_${iindex}`}
							style={{zIndex: 4}}
							coordinate={{latitude: vvalue.lat, longitude: vvalue.lng}}
							centerOffset={Platform.OS == 'android' ? {x: 0, y: 0} : {x: 0, y: -20}}
							anchor={{x: 0.5, y: 0.5}}
							title={vvalue.name}>
							{index == select ? (
								<MarkerContainer key={iindex}>
									<PretendardSemiBoldText size={13} lineHeight={19} color={colors.backgroundWhite}>
										{iindex + 1}
									</PretendardSemiBoldText>
								</MarkerContainer>
							) : (
								<Circle color={colors.Gray5} key={iindex} />
							)}
							{/* <SvgPlace color={mapColor[index]} width={50} height={50} /> */}
						</Marker>
					);
				}),
			);

		polylines.push(
			<Polyline
				key={`polyline_${index}`}
				coordinates={polylineCoordinates}
				strokeColor={index == select ? colors.PointYellow : colors.Gray5}
				strokeWidth={2} // You can change the width of the line here
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
	return (
		<>
			<BackgroundGray>
				<TopFixContainer>
					<FlexWrap gap={widthPercentage(3)}>
						{presetTendencyList[route.params.index].tendencyNameList.map((item, idx) => (
							<TagContainer height={28} backgroundColor={colors.backgroundWhite}>
								<PretendardSemiBoldText size={14} lineHeight={16} color={colors.Gray4}>
									{item}
								</PretendardSemiBoldText>
								<PretendardSemiBoldText size={14} lineHeight={16} color={colors.PointYellow}>
									{presetTendencyList[route.params.index].tendencyPointList[idx]}점
								</PretendardSemiBoldText>
							</TagContainer>
						))}
					</FlexWrap>
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
								<DayContainer
									key={idx}
									select={select == idx}
									onPress={() => {
										change(idx);
									}}>
									<PretendardSemiBoldText
										size={14}
										lineHeight={18.9}
										color={select == idx ? colors.Gray5 : colors.Gray3}>
										DAY{idx + 1}
									</PretendardSemiBoldText>
								</DayContainer>
							))}
						</FlexWrap>
					</ScrollView>
				</TopFixContainer>
				<ScrollView showsVerticalScrollIndicator={false}>
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
									<HStack gap={widthPercentage(10)} key={idx}>
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
														idx == 0 ? 'start' : idx == item.length - 1 ? 'end' : 'center'
													}
												/>
											)}
										</DashLineContainer>
										<PretendardSemiBoldText
											size={16}
											lineHeight={19}
											color={value.category == 5 ? colors.PointYellow : colors.Gray5}>
											{value.name}
										</PretendardSemiBoldText>
										<PretendardSemiBoldText size={12} lineHeight={15} color={colors.Gray5}>
											{Math.floor(value.takenTime / 60)}시간
											{value.takenTime % 60 != 0 && (value.takenTime % 60) + '분'}
										</PretendardSemiBoldText>
									</HStack>
								))}
							</InsideGray>
						</WhiteContainer>
					))}
				</ScrollView>
				<MarginContainer />
			</BackgroundGray>
			<ButtonContainer>
				<CustomButton label='이 일정으로 할래요!' onPress={checkNext}></CustomButton>
			</ButtonContainer>
		</>
	);
}

const TopFixContainer = styled.View`
	width: ${widthPercentage(327)}px;
`;
const DayContainer = styled.TouchableOpacity<{select: boolean}>`
	width: ${widthPercentage(59)}px;
	height: ${heightPercentage(27)}px;
	align-items: center;
	justify-content: center;
	border-radius: 99px;
	border-width: ${props => (props.select ? '0px' : '1px')};
	border-color: ${colors.Gray3};
	background-color: ${props => (props.select ? colors.Primary : colors.backgroundGray)};
`;
const MarkerContainer = styled.View`
	width: ${widthPercentage(24)}px;
	height: ${widthPercentage(24)}px;
	border-radius: 6px;
	align-items: center;
	justify-content: center;
	background-color: ${colors.PointYellow};
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
