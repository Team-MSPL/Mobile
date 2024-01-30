import moment from 'moment';
import {useEffect, useRef, useState} from 'react';
import {Image, Linking, Platform, TouchableOpacity, View} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {colors} from '../../utill/colors';
import {MainContainer, VStack} from '../../utill/layout/layout';
import {PresetButton} from './preset';
import {SvgApple, SvgPlace} from '../../utill/svg/svg';

export default function MapInfo({navigation, route}: any) {
	const {timetable, day, transit} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const [select, setSelect] = useState(0);
	const a = useRef(false);
	const viewRef = useRef(0);
	const [selectPinIndex, setSecletPinIndex] = useState(-1);
	const change = (idx: number) => {
		setSelect(idx);
	};
	const [visible, setVisible] = useState(true);
	const moveRegion = async (e: number) => {
		navigation.navigate('CourseDetail', {value: timetable[select][e]});
		// setSecletPinIndex(e);
		// mapRef.current?.animateCamera(
		// 	{
		// 		center: {
		// 			latitude: timetable[select][e].lat,
		// 			longitude: timetable[select][e].lng,
		// 		},
		// 	},
		// 	{duration: 1000},
		// );
	};
	const excludeNames = ['점심 추천', '저녁 추천', '숙소 추천'];
	const goNavigation = async (e: number) => {
		let navigationIndex = e + 1;
		let transitCondition = transit == 1 ? 'public' : 'car';
		if (excludeNames.includes(timetable[select][e + 1].name)) navigationIndex += 1;
		const url = `nmap://route/${transitCondition}?slat=${timetable[select][e].lat}&slng=${timetable[select][e].lng}&sname=${timetable[select][e].name}&dlat=${timetable[select][navigationIndex].lat}&dlng=${timetable[select][navigationIndex].lng}&dname=${timetable[select][navigationIndex].name}&appname=다님`;
		const supported = await Linking.canOpenURL(url);
		if (supported) {
			await Linking.openURL(url);
		} else {
			if (Platform.OS === 'android') {
				const GOOGLE_PLAY_STORE_LINK = 'market://details?id=com.nhn.android.nmap';
				await Linking.openURL(GOOGLE_PLAY_STORE_LINK);
			} else {
				const APPLE_APP_STORE_LINK = 'http://itunes.apple.com/app/id311867728?mt=8';
				await Linking.openURL(APPLE_APP_STORE_LINK);
			}
		}
	};
	const mapRef = useRef<MapView>(null);

	const polylineCoordinates = timetable[select]
		.map((item, value) => {
			if (item.name != '점심 추천' && item.name != '저녁 추천' && item.name != '숙소 추천') {
				return {latitude: item.lat, longitude: item.lng};
			}
			return null;
		})
		.filter(items => items !== null);
	let count = 0;
	const markers = timetable[select]
		.map((value, idx) => {
			if (value.name != '점심 추천' && value.name != '저녁 추천' && value.name !== '숙소 추천') {
				count += 1;
				return (
					<Marker
						key={`marker_${idx}`}
						coordinate={{latitude: value.lat, longitude: value.lng}}
						title={value.name}
						centerOffset={Platform.OS == 'android' ? {x: 0, y: 0} : {x: 0, y: -20}}
						anchor={{x: 0.5, y: 0.9}}
						pinColor={idx == selectPinIndex ? 'yellow' : 'red'}
						style={{width: 50, height: 50}}>
						<MarkerText>{count}</MarkerText>
						<SvgPlace color={'#F08676'} width={50} height={50} />
					</Marker>
				);
			}
			return null;
		})
		.filter(marker => marker !== null);
	const polylines = timetable[select].map((val, ind) => (
		<Polyline
			key={`polyline_${ind}`}
			coordinates={polylineCoordinates}
			strokeColor={'red'}
			strokeWidth={5} // You can change the width of the line here
		/>
	));

	const minLatitude = Math.min(...polylineCoordinates.map(marker => marker.latitude));
	const maxLatitude = Math.max(...polylineCoordinates.map(marker => marker.latitude));
	const minLongitude = Math.min(...polylineCoordinates.map(marker => marker.longitude));
	const maxLongitude = Math.max(...polylineCoordinates.map(marker => marker.longitude));

	// 경계 상자의 중심 좌표 계산
	const centerLatitude = (maxLatitude + minLatitude) / 2;
	const centerLongitude = (maxLongitude + minLongitude) / 2;

	// 경계 상자의 너비와 높이 계산
	const deltaLatitude = maxLatitude - minLatitude;
	const deltaLongitude = maxLongitude - minLongitude;

	// 너비와 높이 중 큰 값을 기준으로 줌 레벨 계산
	const maxDelta = Math.max(deltaLatitude, deltaLongitude);
	const zoomLevel = Math.log2(360 / maxDelta) + 1;
	const categoryTitle = ['관광지', '식당', '', '카페', '숙소', '필수여행지'];
	const noMove = timetable[select].filter(item => !item.name.includes('추천'));
	useEffect(() => {
		// if (route.params.mapIndex != -1 && timetable[route.params.mapIndex].length != 0) {
		// 	setSelect(route.params.mapIndex);
		// 	setVisible(false);
		// } else {
		for (let i = 0; i < timetable.length; i++) {
			if (timetable[i].length != 0) {
				a.current = true;
				setVisible(false);
				setSelect(i);
				break;
			}
		}
		//}
		// if (polylineCoordinates.length == 0) {
		// 	dispatch(
		// 		modalSliceActions.setOpenModal({
		// 			modalTitle: '보여질 정보가 없습니다.',
		// 			modalFunction: goBack,
		// 		}),
		// 	);
		// }
		console.log('예에에에에ㅔ', polylineCoordinates.length);
	}, []);
	const goBack = () => {
		navigation.goBack();
	};
	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

	if (polylineCoordinates.length == 0) {
		return <MainAllContainer></MainAllContainer>;
	}
	return (
		<MainAllContainer>
			<VStack>
				{timetable.map(
					(item, idx) =>
						select == idx && (
							<MapView
								key={idx}
								ref={mapRef}
								//provider={PROVIDER_GOOGLE}
								showsMyLocationButton={true}
								style={{width: '100%', height: 300}}
								showsUserLocation={true}
								region={{
									latitude: centerLatitude,
									longitude: centerLongitude,
									latitudeDelta: deltaLatitude + deltaLatitude,
									longitudeDelta: deltaLongitude + deltaLongitude,
								}}>
								{markers}
								{polylines}
							</MapView>
						),
				)}

				<DayContainer horizontal={true} showsHorizontalScrollIndicator={false}>
					{timetable.map(
						(item, idx) =>
							item.length != 0 && (
								<DayButton
									key={idx}
									select={idx === select}
									onPress={() => {
										console.log(deltaLatitude, deltaLongitude), change(idx);
									}}>
									<DayTitle select={idx === select}>{idx + 1 + '일차'}</DayTitle>
									<DaySubTitle select={idx === select}>
										{moment(day[idx]).format('M월 D일')}({weekdays[moment(day[idx]).day()]})
									</DaySubTitle>
								</DayButton>
							),
					)}
				</DayContainer>
				<DayScrollView>
					{timetable[select].map((value, index) => {
						if (!excludeNames.includes(value.name)) {
							return (
								<DaysContainer key={index}>
									<DayElementContainer>
										<PlaceContainer
											onPress={() => {
												moveRegion(index);
											}}>
											<VStack>
												<PlaceText>{categoryTitle[value.category]}</PlaceText>
												<DayTimeText>
													{Math.floor((value.y * 30 + 360) / 60)}:
													{String((value.y * 30 + 360) % 60).padStart(2, '0')}~
													{Math.floor(((value.y + value.takenTime / 30) * 30 + 360) / 60)}:
													{String(
														((value.y + value.takenTime / 30) * 30 + 360) % 60,
													).padStart(2, '0')}
												</DayTimeText>
											</VStack>
											<PlaceText>{value.name}</PlaceText>
										</PlaceContainer>
									</DayElementContainer>
									<DayElementContainer>
										{value.id != noMove[noMove.length - 1].id && (
											<MoveContainer
												onPress={() => {
													goNavigation(index);
												}}>
												<PlaceText>이동</PlaceText>
												<DayTimeText>* 네이버 길찾기로 연결됩니다</DayTimeText>
											</MoveContainer>
										)}
									</DayElementContainer>
								</DaysContainer>
							);
						} else {
							return null; // '저녁 추천'이나 '점심 추천'인 경우 아무 것도 렌더링하지 않음
						}
					})}
				</DayScrollView>
			</VStack>
		</MainAllContainer>
	);
}

const mapColor = ['black', 'blue', 'red', 'orange', 'pink'];
export const DayContainer = styled.ScrollView`
	height: 80px;
`;
const PlaceText = styled.Text`
	font-size: 16px;
	font-weight: bold;
	color: black;
`;
export const DayButton = styled(PresetButton)`
	width: 130px;
	height: 60px;
	border-radius: 15px;
	padding: 10px;
	background-color: ${props => (props.select ? colors.selectButton : colors.normalButton)};
	align-items: center;
	justify-content: center;
`;

export const DayTitle = styled(PlaceText)<{select: boolean}>`
	color: ${props => (props.select ? 'white' : colors.selectButton)};
`;
export const DaySubTitle = styled(DayTitle)`
	font-weight: 500;
	font-size: 12px;
`;
export const DayElementContainer = styled.View`
	border-bottom-width: 1px;
	border-bottom-color: ${colors.regionNormal};
`;
const DaysContainer = styled.View`
	padding: 2%;
`;

const MainAllContainer = styled(MainContainer).attrs({as: View})`
	flex: 1;
`;

const DayScrollView = styled.ScrollView`
	height: 40%;
`;

const MoveContainer = styled.TouchableOpacity`
	width: 100%;
	padding: 5%;
	align-items: center;
	justify-content: space-around;
	flex-direction: row;
`;
const PlaceContainer = styled(MoveContainer)`
	flex-direction: row;
	justify-content: space-between;
`;
const DayTimeText = styled.Text`
	font-size: 14px;
	color: ${colors.selectButton};
`;
export const MarkerText = styled.Text`
	position: absolute;
	font-size: 15px;
	font-weight: bold;
	color: black;
	z-index: 1;
	left: 20px;
	bottom: 10px;
`;
