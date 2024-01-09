import {Fragment, JSX, JSXElementConstructor, ReactElement, useEffect, useRef, useState} from 'react';
import {BackHandler, Alert, View, Image, TouchableOpacity, Platform} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {getTravelAi, travelSliceActions} from '../../redux/travel-info/travel.slice';
import {colors} from '../../utill/colors';
import CustomButton from '../../utill/component/custom-button';
import {MainContainer, VStack, Center, MainText, SubText} from '../../utill/layout/layout';
import {DayElementContainer, MarkerText} from './map-info';
import {ButtonContainer, MarginContainder} from '../enroll-info/select-multi';
import {SvgPlace} from '../../utill/svg/svg';

import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Preset({navigation}: any) {
	const {nDay, presetDatas, tendency, presetTendencyList, day, transit, travelName} = useAppSelector(
		state => state.travelSlice,
	);
	const dispatch = useAppDispatch();
	const IconElement = styled(Icon)`
		width: 5%;
		align-self: flex-start;
		margin: 4px 0px 0px 0px;
	`;
	const [select, setSelect] = useState(0);
	const [viewTendency, setViewTendency] = useState(false);
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
	let positions: {latitude: number; longitude: number}[] = [];
	useEffect(() => {
		navigation.setOptions({
			headerLeft: () => (
				<TouchableOpacity
					onPress={() => {
						dispatch(
							modalSliceActions.setOpenModal({
								modalTitle: '홈으로 이동시 지역추천이 종료됩니다.',
								modalSubTitle: '그래도 나가시겠습니까?\n변경 사항이 있다면 저장하기 버튼을 눌러주세요.',
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
	let markerCount = 0;
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
				value.map((vvalue, iindex) => {
					markerCount += 1;
					return (
						<Marker
							key={`marker_${index}_${iindex}`}
							coordinate={{latitude: vvalue.lat, longitude: vvalue.lng}}
							centerOffset={Platform.OS == 'android' ? {x: 0, y: 0} : {x: 0, y: -20}}
							anchor={{x: 0.5, y: 0.9}}
							title={vvalue.name}>
							<MarkerText>{markerCount}</MarkerText>
							<SvgPlace color={mapColor[index]} width={50} height={50} />
						</Marker>
					);
				}),
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
	const saveCache = async () => {
		const cacheValues: [string, string][] = [
			['preset', JSON.stringify(presetDatas)],
			['presetTendency', JSON.stringify(presetTendencyList)],
			['day', JSON.stringify(day)],
			['nDay', nDay.toString()],
			['transit', transit.toString()],
			['tendency', JSON.stringify(tendency)],
			['travelName', travelName.toString()],
		];
		AsyncStorage.multiSet(cacheValues);
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
	useEffect(() => {
		const backAction = () => {
			if (navigation.isFocused()) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '취소시 지역추천이 종료됩니다.',
						modalSubTitle: '그래도 나가시겠습니까?',
						modalFunction: () => {
							removeCache();
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
	let count = 0;
	useEffect(() => {
		saveCache();
	}, []);
	return (
		<>
			<MainContainer>
				<PresetMainText>아래의 여행 코스 중 하나를 골라주세요!</PresetMainText>
				<PresetSubText>마커를 눌러 상세한 관광정보를 확인할 수 있어요.</PresetSubText>
				<MapView
					ref={mapRef}
					style={{width: '100%', height: 300}}
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
				{presetTendencyList[select].tendencyNameList.length != 1 && (
					<TendencyTouchable onPress={() => setViewTendency(!viewTendency)}>
						<TendencyContainer>
							{presetTendencyList[select].tendencyNameList.map((item, idx) => {
								return (
									(viewTendency ? true : idx < 2) && (
										<TendencyText>
											#{item}
											<TendencyPointText>
												{' ' + presetTendencyList[select].tendencyRanking[idx]}
											</TendencyPointText>
											등
										</TendencyText>
									)
								);
							})}
						</TendencyContainer>
						<IconElement name={viewTendency ? 'up' : 'down'} size={16} color='black' />
					</TendencyTouchable>
				)}

				<PresetContainer>
					{presetDatas.map(
						(item, idx) =>
							item != null && (
								<PresetButton key={idx} onPress={() => change(idx)} select={idx === select}>
									<PresetText select={idx === select}>코스 {idx + 1}</PresetText>
								</PresetButton>
							),
					)}
				</PresetContainer>
				{presetDatas[select].map((vava, inin) => (
					<Fragment key={inin}>
						<DayText color={mapColor[inin]}>{inin + 1}일차 코스</DayText>
						{vava.map((qwe, asd) => {
							count += 1;
							return (
								<InfoContainer key={asd}>
									<ElementText>
										{qwe.name} {count}
									</ElementText>
								</InfoContainer>
							);
						})}
					</Fragment>
				))}
				<MarginContainder></MarginContainder>
			</MainContainer>
			<ButtonContainer>
				<CustomButton label='코스 선택' width={40} onPress={checkNext}></CustomButton>
			</ButtonContainer>
		</>
	);
}

const mapColor = ['#F08676', '#E7A88D', '#ECC369', '#86D0C2', '#7AA1DC', '#D58DE7'];
const PresetContainer = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	width: 100%;
	border-bottom-width: 1px;
	padding: 10px 0px;
	border-bottom-color: ${colors.regionNormal};
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
const DayText = styled.Text<{color: string}>`
	font-size: 20px;
	font-weight: bold;
	color: ${props => props.color};
`;
const TendencyText = styled.Text`
	font-size: 16px;
	font-weight: 500;
	color: black;
	width: 45%;
`;
const TendencyPointText = styled.Text`
	font-size: 18px;
	font-weight: 500;
	color: ${colors.selectButton};
`;

const TendencyTouchable = styled.TouchableOpacity`
	width: 100%;
	align-items: center;
	justify-content: center;
	flex-direction: row;
`;
const TendencyContainer = styled.View`
	width: 95%;
	align-items: center;
	justify-content: flex-end;
	flex-direction: row;
	flex-wrap: wrap;
`;
