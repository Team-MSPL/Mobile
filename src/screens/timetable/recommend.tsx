import {useLayoutEffect, useRef, useState} from 'react';
import shortId from 'shortid';
import {Alert, Linking, TouchableOpacity, ScrollView, Platform} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';

import MapView, {Polyline, Marker} from 'react-native-maps';
import {recommendApi, RecommendList, TimetableType, travelSliceActions} from '../../redux/travel-info/travel.slice';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {HStack, MainText, VStack, devicesWidth} from '../../utill/layout/layout';
import CustomButton from '../../utill/component/custom-button';
import {ButtonContainer, MarginContainder} from '../enroll-info/select-multi';
import {SVGHelp, SvgPlace} from '../../utill/svg/svg';
import {DistanceType, useDistance} from '../../utill/hooks/useDistance';
import {MarkerText} from './map-info';
export default function Recommend({navigation, route}: any) {
	const {timetable} = useAppSelector(state => state.travelSlice);
	const {isLoading} = useAppSelector(state => state.loadingSlice);
	const dispatch = useAppDispatch();
	const newY = useRef(0);
	const [select, setSelect] = useState(-1);
	const [recommendItem, setRecommendItem] = useState<TimetableType[]>([...timetable[route.params.x]]);
	const [recommendList, setRcommendList] = useState<RecommendList[]>();
	const departure = useRef<DistanceType>({lat: 0, lng: 0});
	const whereIndex = useRef(0);
	const polylineCoordinates = recommendItem
		.map((item, value) => {
			if (item.name != '점심 추천' && item.name != '저녁 추천' && item.name != '숙소 추천') {
				return {latitude: item.lat, longitude: item.lng};
			}
			return null;
		})
		.filter(items => items !== null);

	let count = 0;
	const markers = recommendItem
		.map((value, index) => {
			if (value.name != '점심 추천' && value.name != '저녁 추천' && value.name !== '숙소 추천') {
				count += 1;
				return (
					<Marker
						key={`marker_${index}`}
						coordinate={{latitude: value.lat, longitude: value.lng}}
						title={value.name}
						centerOffset={Platform.OS == 'android' ? {x: 0, y: 0} : {x: 0, y: -20}}
						anchor={{x: 0.5, y: 0.9}}>
						<MarkerText>{count}</MarkerText>
						<SvgPlace color={route.params.index == index ? 'yellow' : 'red'} width={50} height={50} />
					</Marker>
				);
			}
			return null;
		})
		.filter(marker => marker !== null);

	const polylines = recommendItem.map((val, ind) => (
		<Polyline
			key={`polyline_${ind}`}
			coordinates={polylineCoordinates}
			strokeColor={'red'}
			strokeWidth={5} // You can change the width of the line here
		/>
	));

	const changeRecommend = (idx: number) => {
		let copy = [...recommendItem];
		const updateItem = {
			name: recommendList[idx].place_name,
			lat: Number(recommendList[idx].y),
			lng: Number(recommendList[idx].x),
			category: route.params.category,
			x: route.params.x,
			y: route.params.y[0],
			id: shortId.generate(),
			takenTime: route.params.y.length * 30,
		};
		if (route.params.name === '숙소 추천' || route.params.name === '식당 추천') {
			copy[route.params.index] = updateItem;
		} else {
			if (select === -1) {
				copy.splice(route.params.index, 0, updateItem);
			} else {
				copy[route.params.index] = updateItem;
			}
		}
		// select == -1 && route.params.category != 1
		// 	? copy.splice(route.params.index, 0, updateItem)
		// 	: (copy[route.params.index] = updateItem);
		setRecommendItem(copy);
		setSelect(idx);
		mapRef.current?.animateCamera(
			{
				center: {
					latitude: updateItem.lat,
					longitude: updateItem.lng,
				},
			},
			{duration: 1000},
		);
	};
	const checkMessage = () => {
		//	console.log(departure);
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '바로 추가됩니다!',
				modalFunction: addRecommend,
				modalLeft: true,
			}),
		);
	};
	const addRecommend = () => {
		let copy = [...timetable];
		copy[route.params.x] = recommendItem;
		if (route.params.name === '숙소 추천') {
			if (route.params.index != 0) {
				let updateitem = {
					...recommendItem.at(-1),
					x: copy[route.params.x + 1][0].x,
					y: copy[route.params.x + 1][0].y,
					takenTime: copy[route.params.x + 1][0].takenTime,
				};
				let itemCopy: TimetableType[] = [...copy[route.params.x + 1]];
				itemCopy[0] = updateitem;
				copy[route.params.x + 1] = itemCopy;
			} else {
				let updateitem = {
					...recommendItem[0],
					x: copy[route.params.x - 1].at(-1).x,
					y: copy[route.params.x - 1].at(-1).y,
					takenTime: copy[route.params.x - 1].at(-1).takenTime,
				};
				let itemCopy = [...copy[route.params.x - 1]];
				itemCopy.splice(itemCopy.length - 1, 1, updateitem);
				copy[route.params.x - 1] = itemCopy;
			}
		}
		dispatch(travelSliceActions.changeTimetable(copy));
		navigation.navigate('Timetable');
	};
	const getRecommendList = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			let result = await dispatch(
				recommendApi({
					category: route.params.apiCategory,
					lat: route.params.lat,
					lng: route.params.lng,
					radius: route.params.radius,
				}),
			).unwrap();
			departure.current.lat = route.params.lat;
			departure.current.lng = route.params.lng;
			if (result.length == 0) {
				result = await dispatch(
					recommendApi({
						category: route.params.apiCategory,
						lat: route.params.backupLat,
						lng: route.params.backupLng,
						radius: 20000,
					}),
				).unwrap();
				departure.current.lat = route.params.lat;
				departure.current.lng = route.params.lng;
				result.length == 0 && dispatch(modalSliceActions.setOpenModal({modalTitle: '추천 아이템이 없습니다!'}));
			}
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

	useLayoutEffect(() => {
		getRecommendList();
		console.log(route.params.status);
	}, []);

	const mapRef = useRef<MapView>(null);
	if (!recommendList || isLoading) {
		return <RecommendContainer></RecommendContainer>;
	}
	return (
		<RecommendContainer>
			<MapView
				ref={mapRef}
				style={{width: '100%', height: 300}}
				region={{
					latitude: route.params.status.lat,
					longitude: route.params.status.lng,
					latitudeDelta: 0.04,
					longitudeDelta: 0.04,
				}}>
				{markers}
				{polylines}
			</MapView>
			<KakaoMapInfoView>
				<SVGHelp color={colors.selectButton} width={15} height={15} />
				<KakaoMapInfoText>앞, 뒤 관광지를 바탕으로한 카카오맵 추천 순서입니다.</KakaoMapInfoText>
			</KakaoMapInfoView>
			<RecommendScrollView>
				{recommendList.length != 0 ? (
					recommendList.map((item, idx) => (
						<ListHStack color={idx == select ? colors.selectButton : 'white'} key={idx}>
							<ListVStack
								onPress={() => {
									changeRecommend(idx);
								}}>
								<RecommendView>
									<RecommendElementText color={idx == select ? 'white' : 'black'}>
										{item.place_name}
									</RecommendElementText>
								</RecommendView>
								<DistanceText color={idx == select ? 'black' : colors.selectButton}>
									{'* ' +
										route.params.status.name +
										' 기준 ' +
										Math.floor(
											useDistance({
												departure: {lat: item.y, lng: item.x},
												arrival: {lat: route.params.lat, lng: route.params.lng},
											}) * 1000,
										) +
										'm'}
								</DistanceText>
								<CategoryText color={idx == select ? 'white' : 'black'}>
									{item.category_name.slice(6, item.category_name.length)}
								</CategoryText>
							</ListVStack>
							<RecommendInfoTouchableOpacity
								onPress={() => {
									Linking.openURL(item.place_url);
								}}>
								<RecommendElementText color={idx == select ? 'white' : 'black'}>
									정보보기
								</RecommendElementText>
							</RecommendInfoTouchableOpacity>
						</ListHStack>
					))
				) : (
					<RecommendInfoTouchableOpacity></RecommendInfoTouchableOpacity>
				)}

				<MarginContainder />
			</RecommendScrollView>
			<ButtonContainer>
				<CustomButton label='선택완료' isDisabled={select == -1} onPress={checkMessage}></CustomButton>
			</ButtonContainer>
		</RecommendContainer>
	);
}
const DistanceText = styled.Text<{color: string}>`
	font-size: ${devicesWidth * 0.03}px;
	color: ${props => props.color};
`;
const RecommendContainer = styled.View`
	flex: 1;
	background-color: ${colors.main};
`;
const RecommendView = styled.View`
	margin: 5px 0px 0px 0px;
	padding: 1%;
`;
const RecommendInfoTouchableOpacity = styled.TouchableOpacity`
	margin: 5px 0px 0px 0px;
	padding: 1%;
	width: 20%;
`;
const RecommendElementText = styled.Text<{color: string}>`
	font-size: 17px;
	font-weight: bold;
	color: ${props => props.color};
`;
const RecommendScrollView = styled.ScrollView`
	padding: 10px;
`;
const ListHStack = styled(HStack)<{color: string}>`
	justify-content: space-between;
	flex-wrap: wrap;
	background-color: ${props => props.color};
	border-bottom-width: 1px;
	border-color: black;
`;
const ListVStack = styled(VStack).attrs({as: TouchableOpacity})`
	width: 80%;
	padding: 3px;
`;
const CategoryText = styled(RecommendElementText)`
	font-size: 14px;
	font-weight: 500;
`;
const KakaoMapInfoView = styled.View`
	flex-direction: row;
	width: 100%;
	padding: 10px;
	align-items: center;
	justify-content: center;
`;
const KakaoMapInfoText = styled.Text`
	font-size: 13px;
	font-weight: bold;
	color: ${colors.selectButton};
	margin: 0px 0px 0px 5px;
`;
