import moment from 'moment';
import {JSX, JSXElementConstructor, ReactElement, useEffect, useRef, useState} from 'react';
import {BackHandler, Alert, View, Image, TouchableOpacity} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {getTravelAi, travelSliceActions} from '../../redux/travel-info/travel.slice';
import {colors} from '../../utill/colors';
import CustomButton from '../../utill/component/custom-button';
import SelectButton from '../../utill/component/select-button';
import {MainContainer, VStack, Center, MainText, SubText} from '../../utill/layout/layout';
import {cityViewList} from '../enroll-info/select-city';
import {DayElementContainer} from './map-info';

export default function Preset({navigation}: any) {
	const {nDay, presetDatas} = useAppSelector(state => state.travelSlice);
	const {isLoading} = useAppSelector(state => state.loadingSlice);
	const dispatch = useAppDispatch();
	const [select, setSelect] = useState(0);
	const goNext = () => {
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
	let positions: {latitude: number; longitude: number}[] = [];
	useEffect(() => {
		navigation.setOptions({
			headerLeft: () => (
				<TouchableOpacity
					onPress={() => {
						dispatch(
							modalSliceActions.setOpenModal({
								modalTitle: '홈으로 이동시 데이터는 날라갑니다.',
								modalSubTitle: '그래도 나가시겠습니까?',
								modalFunction: () => {
									navigation.popToTop();
								},
								modalLeft: true,
							}),
						);
					}}
					style={{justifyContent: 'center'}}>
					<Image
						source={require('../../../public/images/danim_logo_row.png')}
						style={{height: 30, aspectRatio: 2.054}}
					/>
				</TouchableOpacity>
			),
		});
	}, []);
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

	const mapRef = useRef<MapView>(null);

	const markers: ReactElement<any, string | JSXElementConstructor<any>> | JSX.Element[][] | null | undefined = [];
	const polylines:
		| string
		| number
		| boolean
		| JSX.Element[]
		| ReactElement<any, string | JSXElementConstructor<any>>
		| null
		| undefined = [];
	presetDatas[select].forEach((value, index) => {
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
				value.map((vvalue, iindex) => (
					<Marker
						key={`marker_${index}_${iindex}`}
						coordinate={{latitude: vvalue.lat, longitude: vvalue.lng}}
						title={vvalue.name}
					/>
				)),
			);

		polylines.push(
			<Polyline
				key={`polyline_${index}`}
				coordinates={polylineCoordinates}
				strokeColor={mapColor[index]}
				strokeWidth={5} // You can change the width of the line here
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
	const zoomLevel = Math.log2(360 / maxDelta) + 1;
	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
	useEffect(() => {
		const backAction = () => {
			if (navigation.isFocused()) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '뒤로 이동시 데이터는 날라갑니다.',
						modalSubTitle: '그래도 나가시겠습니까?',
						modalFunction: () => {
							navigation.popToTop();
						},
						modalLeft: true,
					}),
				);
				return true;
			}
		};

		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

		return () => backHandler.remove();
	}, []);
	return (
		<MainContainer>
			<PresetMainText>아래의 여행 코스 중 하나를 골라주세요!</PresetMainText>
			<PresetSubText>마커를 눌러 상세한 관광정보를 확인할 수 있어요.</PresetSubText>

			<MapView
				ref={mapRef}
				style={{width: '100%', height: 300}}
				//provider={PROVIDER_GOOGLE}
				showsMyLocationButton={true}
				region={{
					latitude: centerLatitude,
					longitude: centerLongitude,
					latitudeDelta: deltaLatitude + deltaLatitude / 2,
					longitudeDelta: deltaLongitude + deltaLongitude / 5,
				}}>
				{markers}
				{polylines}
			</MapView>
			<PresetContainer>
				{presetDatas.map(
					(item, idx) =>
						item != null && (
							<PresetButton key={idx} onPress={() => change(idx)} select={idx === select}>
								<PresetText select={idx === select}>코스 {idx + 1}</PresetText>
							</PresetButton>
						),
					// <SelectButton
					// 	key={idx}
					// 	label={idx + 1 + '번 후보'}
					// 	bgColor={idx === select}
					// 	onPress={() => change(idx)}></SelectButton>
				)}
			</PresetContainer>
			{presetDatas[select].map((vava, inin) =>
				vava.map((qwe, asd) => (
					<InfoContainer key={asd}>
						<ElementText>{qwe.name}</ElementText>
					</InfoContainer>
				)),
			)}

			<CustomButton label='코스 선택' width={40} onPress={goNext}></CustomButton>
		</MainContainer>
	);
}

const mapColor = ['red', 'orange', 'yellow', 'green', 'blue'];
const PresetContainer = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	width: 100%;
`;
export const PresetButton = styled.TouchableOpacity<{select: boolean}>`
	background-color: ${props => (props.select ? colors.selectButton : colors.normalButton)};
	border-radius: 20px;
	padding: 10px;
	margin: 10px 5px 0px 5px;
`;
const PresetText = styled.Text<{select: boolean}>`
	font-size: 17px;
	font-weight: bold;
	color: ${props => (props.select ? 'white' : colors.selectButton)};
`;
const PresetMainText = styled(MainText)`
	font-size: 20px;
`;
const PresetSubText = styled(MainText)`
	font-size: 15px;
	margin: 0px 0px 10px 0px;
`;
const ElementText = styled.Text`
	font-size: 15px;
	font-weight: bold;
	color: black;
`;
const InfoContainer = styled(DayElementContainer)`
	padding: 10px;
	margin: 10px 0px 10px 0px;
	align-items: center;
`;
