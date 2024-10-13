import {useLayoutEffect, useRef, useState} from 'react';
import shortId from 'shortid';
import {Linking, TouchableOpacity, Platform, Image} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';

import MapView, {Polyline, Marker, Circle} from 'react-native-maps';
import {recommendApi, RecommendList, TimetableType, travelSliceActions} from '../../redux/travel-info/travel.slice';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {HStack, PretendardSemiBoldText, PretendardVariableText, VStack} from '../../utill/layout/layout';
import CustomButton from '../../utill/component/custom-button';
import {ButtonContainer, MarginContainder} from '../enroll-info/select-multi';
import {DistanceType, useDistance} from '../../utill/hooks/useDistance';
import PrimaryButton from '../../utill/component/primary-button';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {MarkerContainer} from './preset-detail';
export default function Recommend({navigation, route}: any) {
	const {timetable} = useAppSelector(state => state.travelSlice);
	const {isLoading} = useAppSelector(state => state.loadingSlice);
	const dispatch = useAppDispatch();
	const [select, setSelect] = useState(-1);
	const [recommendItem, setRecommendItem] = useState<TimetableType[]>([...timetable[route.params.x]]);
	const [recommendList, setRcommendList] = useState<RecommendList[]>();
	const departure = useRef<DistanceType>({lat: 0, lng: 0});
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
						centerOffset={{x: 0, y: 0}}
						anchor={{x: 0.5, y: 0.5}}>
						<MarkerContainer
							backgroundColor={route.params.index == index ? colors.PointYellow : colors.Gray5}
							key={index}>
							<PretendardSemiBoldText size={13} lineHeight={19} color={colors.backgroundWhite}>
								{index + 1}
							</PretendardSemiBoldText>
						</MarkerContainer>
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
			strokeColor={colors.Gray5}
			strokeWidth={Platform.isPad ? 5 : 2} // You can change the width of the line here
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
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '선택하신 장소를 추가하시겠어요?',
				modalFunction: addRecommend,
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
	//국내 카카오용
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
	//TODO트립어드바이저용
	// const getRecommendList = async () => {
	// 	try {
	// 		dispatch(LoadingSliceActions.onLoading());
	// 		let result = await dispatch(
	// 			recommendTripadvisor({
	// 				category: route.params.apiCategory,
	// 				lat: route.params.lat,
	// 				lng: route.params.lng,
	// 				radius: route.params.radius,
	// 				name: route.params.status.name,
	// 			}),
	// 		).unwrap();
	// 		departure.current.lat = route.params.lat;
	// 		departure.current.lng = route.params.lng;
	// 		if (result.data.length == 0) {
	// 			result = await dispatch(
	// 				recommendTripadvisor({
	// 					category: route.params.apiCategory,
	// 					lat: route.params.backupLat,
	// 					lng: route.params.backupLng,
	// 					radius: 20000,
	// 					name: route.params.status.name,
	// 				}),
	// 			).unwrap();
	// 			departure.current.lat = route.params.lat;
	// 			departure.current.lng = route.params.lng;
	// 			result.data.length == 0 &&
	// 				dispatch(modalSliceActions.setOpenModal({modalTitle: '추천 아이템이 없습니다!'}));
	// 		}
	// 		setRcommendList(result.data);
	// 	} catch (err) {
	// 		console.log(err);
	// 		dispatch(
	// 			modalSliceActions.setOpenModal({
	// 				modalTitle: '추천 아이템이 없습니다!',
	// 			}),
	// 		);
	// 		navigation.goBack();
	// 	} finally {
	// 		dispatch(LoadingSliceActions.offLoading());
	// 	}
	// };
	const returnImageIndex = (e: string) => {
		let numberIndex = 0;
		switch (e.trim()) {
			case '한식':
				numberIndex = 0;
				break;
			case '분식':
				numberIndex = 1;
				break;
			case '양식':
				numberIndex = 2;
				break;
			case '일식':
				numberIndex = 3;
				break;
			case '중식':
				numberIndex = 4;
				break;
			default:
				numberIndex = 5;
				break;
		}
		return numberIndex;
	};
	const returnAccomdationImageIndex = (e: string) => {
		let numberIndex = 0;
		switch (e.trim()) {
			case '호텔':
				numberIndex = 0;
				break;
			case '여관' || '모텔' || '펜션':
				numberIndex = 1;
				break;
			default:
				numberIndex = 2;
				break;
		}
		return numberIndex;
	};
	const accommodationImageList = [
		require('../../../public/images/hotel.png'),
		require('../../../public/images/motel.png'),
		require('../../../public/images/defalutAccomodation.png'),
	];
	const foodImageList = [
		require('../../../public/images/koreaFood.png'),
		require('../../../public/images/snackFood.png'),
		require('../../../public/images/westernFood.png'),
		require('../../../public/images/japanFood.png'),
		require('../../../public/images/chinaFood.png'),
		require('../../../public/images/defalutFood.png'),
	];
	useLayoutEffect(() => {
		getRecommendList();
	}, []);

	const mapRef = useRef<MapView>(null);
	if (!recommendList || isLoading) {
		return <RecommendContainer></RecommendContainer>;
	}
	return (
		<RecommendContainer>
			<MapView
				ref={mapRef}
				style={{width: '100%', height: heightPercentage(350)}}
				region={{
					latitude: route.params.status.lat,
					longitude: route.params.status.lng,
					latitudeDelta: 0.04,
					longitudeDelta: 0.04,
				}}>
				{markers}
				{polylines}
				{/* TODO 트립어드바이저 반경만 보여주는거*/}
				{/* <Circle
					center={{
						latitude: route.params.status.lat,
						longitude: route.params.status.lng,
					}}
					style={{alignItems: 'center', justifyContent: 'center'}}
					fillColor='rgba(38, 152, 251, 0.3);'
					radius={1500}></Circle> */}
			</MapView>
			<TextContainer>
				<PretendardSemiBoldText size={12} color={colors.PointYellow} lineHeight={18}>
					*카카오맵 기준으로 인기있는 장소들을 추천드려요!
				</PretendardSemiBoldText>
			</TextContainer>
			<RecommendScrollView>
				{recommendList.length != 0 ? (
					recommendList.map((item, idx) => (
						<ListHStack color={idx == select ? colors.Blue4 : colors.backgroundWhite} key={idx}>
							<ImageContainer>
								{route.params.name == '식당 추천' ? (
									<Image
										source={foodImageList[returnImageIndex(item.category_name.split('>')[1])]}
										style={{width: widthPercentage(45), height: widthPercentage(45)}}></Image>
								) : route.params.name == '숙소 추천' ? (
									<Image
										source={
											accommodationImageList[
												returnAccomdationImageIndex(item.category_name.split('>')[2])
											]
										}
										style={{width: widthPercentage(45), height: widthPercentage(45)}}></Image>
								) : (
									<Image
										source={require('../../../public/images/coffee.png')}
										style={{width: widthPercentage(45), height: widthPercentage(45)}}></Image>
								)}
							</ImageContainer>
							<ListVStack
								onPress={() => {
									changeRecommend(idx);
								}}>
								<RecommendView>
									<PretendardSemiBoldText size={14} lineHeight={18.9} color={colors.Gray5}>
										{/* {item.name}  TODO트립어드바이져*/}
										{item.place_name}
									</PretendardSemiBoldText>
								</RecommendView>
								<PretendardVariableText size={11} lineHeight={16.5} color={colors.PointYellow}>
									{'* ' +
										route.params.status.name +
										' 기준 ' +
										Math.floor(
											useDistance({
												departure: {lat: item.y, lng: item.x},
												arrival: {lat: route.params.lat, lng: route.params.lng},
											}) * 1000,
										) +
										// Math.floor(Number(item.distance) * 1000) TODO 트립어드바이저
										'm'}
								</PretendardVariableText>
								<PretendardVariableText size={11} lineHeight={16.5} color={colors.Gray3}>
									{item.category_name.split('>')[route.params.name == '식당 추천' ? 1 : 2]}
								</PretendardVariableText>
							</ListVStack>
							<PrimaryButton
								label='자세히보기'
								textSize={12}
								lineHeight={18}
								width={widthPercentage(75)}
								height={heightPercentage(30)}
								backgroundColor={colors.Primary}
								textColor={colors.Gray5}
								onPress={() => {
									Linking.openURL(item.place_url);
								}}></PrimaryButton>
						</ListHStack>
					))
				) : (
					<RecommendInfoTouchableOpacity></RecommendInfoTouchableOpacity>
				)}

				<MarginContainder />
			</RecommendScrollView>
			<ButtonContainer>
				<CustomButton label='추가하기' isDisabled={select == -1} onPress={checkMessage}></CustomButton>
			</ButtonContainer>
		</RecommendContainer>
	);
}
const TextContainer = styled.View`
	width: 100%;
	height: ${heightPercentage(25)}px;
	align-items: center;
	justify-content: center;
`;
const ImageContainer = styled.View`
	width: ${widthPercentage(71)}px;
	height: ${widthPercentage(71)}px;
	align-items: center;
	justify-content: center;
`;
const RecommendContainer = styled.View`
	flex: 1;
	background-color: ${colors.main};
`;
const RecommendView = styled.View`
	margin: ${widthPercentage(5)}px 0px 0px 0px;
	padding: 1%;
`;
const RecommendInfoTouchableOpacity = styled.TouchableOpacity`
	margin: ${widthPercentage(5)}px 0px 0px 0px;
	padding: 1%;
	width: 20%;
`;
const RecommendScrollView = styled.ScrollView`
	padding: ${widthPercentage(10)}px;
`;
const ListHStack = styled(HStack)<{color: string}>`
	justify-content: space-around;
	background-color: ${props => props.color};
	border-bottom-width: 1px;
	border-color: ${colors.Gray2};
`;
const ListVStack = styled(VStack).attrs({as: TouchableOpacity})`
	width: 65%;
	padding: ${widthPercentage(3)}px;
`;
