import moment from 'moment';
import {JSXElementConstructor, ReactElement, useCallback, useEffect, useRef, useState} from 'react';
import {Linking, Modal, NativeScrollEvent, NativeSyntheticEvent, Platform, Pressable, View} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {colors} from '../../utill/colors';
import {
	FlexWrap,
	HStack,
	MainContainer,
	PretendardSemiBoldText,
	PretendardVariableText,
	VStack,
} from '../../utill/layout/layout';
import {Circle, DashLine, DashLineContainer} from './preset';
import {DayTouchablOpacity, MarkerContainer} from './preset-detail';
import {WhiteContainer} from '../enroll-info/final-check';
import {fontPercentage, heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import PrimaryButton from '../../utill/component/primary-button';
import InfoView from '../../utill/component/timetable/info-view';
import UseDatePicker from '../../utill/hooks/useDatePicker';
import {SelectContainer} from '../enroll-info/select-day';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import {usePosition} from '../../utill/hooks/usePosition';
import {SVGContainer} from '../enroll-info/select-multi';
import {SVGPlus, SVGRightAdd} from '../../utill/svg/svg';
import {useViewPager} from '../../utill/hooks/useViewPager';
import ViewPager from '../../utill/view-pager';
import {
	NestableScrollContainer,
	NestableDraggableFlatList,
	ScaleDecorator,
	RenderItemParams,
} from 'react-native-draggable-flatlist';
import AbsoluteTopBarComponent from '../../utill/component/timetable/absolute-top-bar-component';
import {useDistance} from '../../utill/hooks/useDistance';

export default function MapInfo({navigation, modify, setModify, goSave}: any) {
	const {timetable, day, transit, shareViewWithStartFlag, region} = useAppSelector(state => state.travelSlice);
	const {socialloginProvider} = useAppSelector(state => state.userSlice);
	const dispatch = useAppDispatch();
	const [select, setSelect] = useState(0);
	const a = useRef(false);
	const viewRef = useRef({
		...timetable[0][0],
		endHours: Math.floor((((timetable[0][0].y ?? 0) + timetable[0][0].takenTime / 30) * 30 + 360) / 60),
		endMinute: (((timetable[0][0].y ?? 0) + timetable[0][0].takenTime / 30) * 30 + 360) % 60,
		index: 0,
		idx: 0,
	});
	const scrollRef = useRef();
	const changeTouch = (idx: number) => {
		//setSelect(idx);
		let totalScroll = 0;
		for (let i = 0; i < idx; i++) {
			totalScroll += timetable[i].length;
		}
		scrollRef.current.scrollTo({
			y:
				totalScroll * heightPercentage(76) +
				totalScroll * widthPercentage(3) +
				idx * fontPercentage(16.71) +
				idx * heightPercentage(36),
			animate: true,
		});
	};
	const change = (idx: number) => {
		setSelect(idx);
	};
	const [visible, setVisible] = useState(true);
	const moveRegion = async (e: number, index: number) => {
		navigation.navigate('CourseDetail', {value: timetable[index][e]});
	};
	const excludeNames = ['점심 추천', '저녁 추천', '숙소 추천'];
	const goNavigation = async (e: number) => {
		try {
			let navigationIndex = e - 1;
			let transitCondition = transit == 1 ? 'public' : 'car';
			if (excludeNames.includes(timetable[select][e - 1].name)) navigationIndex -= 1;
			const url = `nmap://route/${transitCondition}?slat=${timetable[select][navigationIndex].lat}&slng=${timetable[select][navigationIndex].lng}&sname=${timetable[select][navigationIndex].name}&dlat=${timetable[select][e].lat}&dlng=${timetable[select][e].lng}&dname=${timetable[select][e].name}&appname=다님`;
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
		} catch (e) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '길찾기를 진행할 관광지가 없습니다.',
					modalSubTitle: '추천 관광지를 받은 후 다시 시도해주세요',
					modalSingleUse: true,
				}),
			);
		}
	};
	const markers: ReactElement<any, string | JSXElementConstructor<any>> | JSX.Element[][] | null | undefined = [];
	const polylines:
		| string
		| number
		| boolean
		| JSX.Element[]
		| ReactElement<any, string | JSXElementConstructor<any>>
		| null
		| undefined = [];
	let positions: {latitude: number; longitude: number}[] = [];
	const mapRef = useRef<MapView>(null);
	timetable.forEach((value, index) => {
		const polylineCoordinates = value
			.map((item, value) => {
				if (item.name != '점심 추천' && item.name != '저녁 추천' && item.name != '숙소 추천') {
					return {latitude: item.lat, longitude: item.lng};
				}
				return null;
			})
			.filter(items => items !== null);
		value.map(vvalue =>
			positions.push({
				latitude: vvalue.lat,
				longitude: vvalue.lng,
			}),
		);
		let count = 0;
		markers.push(
			value.map((item, idx) => {
				count += 1;
				if (item.name != '점심 추천' && item.name != '저녁 추천' && item.name != '숙소 추천') {
					return (
						<Marker
							key={`marker_${idx}`}
							coordinate={{latitude: item.lat, longitude: item.lng}}
							title={item.name}
							centerOffset={{x: 0, y: 0}}
							anchor={{x: 0.5, y: 0.5}}
							style={{zIndex: 4}}>
							{index == select ? (
								<MarkerContainer key={idx}>
									<PretendardSemiBoldText size={13} lineHeight={19} color={colors.backgroundWhite}>
										{count}
									</PretendardSemiBoldText>
								</MarkerContainer>
							) : (
								<Circle color={colors.Gray5} key={idx} />
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
	const zoomLevel = Math.log2(360 / maxDelta) + 1;
	const categoryTitle = ['관광지', '식당', '', '카페', '숙소', '필수여행지'];
	// const noMove = timetable[select].filter(item => !item.name.includes('추천'));
	useEffect(() => {
		for (let i = 0; i < timetable.length; i++) {
			if (timetable[i].length != 0) {
				a.current = true;
				setVisible(false);
				setSelect(i);
				break;
			}
		}
	}, []);
	const goRemove = () => {
		console.log('하이영', viewRef.current);
		const a = timetable.map(item => item.filter(value => value.id != viewRef.current.id));
		dispatch(travelSliceActions.changeTimetable(a));
	};
	const [qw, seA] = useState(0);
	const goConfirm = (timeData: {hour: string; ampm: string; minute: string}) => {
		if (timeView.value == 'left') {
			viewRef.current.y =
				(parseInt(timeData.hour) + (timeData.ampm == '오후' ? 12 : 0) - 6) * 2 + parseInt(timeData.minute) / 30;
		} else {
			viewRef.current.endHours = parseInt(timeData.hour) + (timeData.ampm == '오후' ? 12 : 0);
			viewRef.current.endMinute = parseInt(timeData.minute);
		}
		seA(qw + 1);
		return true;
	};

	const [saveView, setSaveView] = useState(true);
	const changeViewState = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const state = usePosition(e);
		state != saveView && setSaveView(state);
	};
	const openModal = (index, idx) => {
		console.log(index, idx);
		viewRef.current = {
			...timetable[index][idx],
			endHours: Math.floor(
				(((timetable[index][idx].y ?? 0) + timetable[index][idx].takenTime / 30) * 30 + 360) / 60,
			),
			endMinute: (((timetable[index][idx].y ?? 0) + timetable[index][idx].takenTime / 30) * 30 + 360) % 60,
			index: index,
			idx: idx,
		};
		timeView.status && setTimeView({status: false, value: ''});
		setVisible(true);
	};
	const [timeView, setTimeView] = useState({status: false, value: ''});
	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

	const goModify = () => {
		setVisible(false);
		const newY = viewRef.current.y;
		const newEnd = (viewRef.current.endHours - 6) * 2 + viewRef.current.endMinute / 30;
		if (newEnd >= 49) {
			dispatch(modalSliceActions.setOpenModal({modalTitle: '시간을 다시 설정해주세요.'}));
		} else {
			let copy = [...timetable[changeDay]];
			let changeCopy = [...timetable];
			let changeFlag = null;
			for (let i = 0; i < copy.length; i++) {
				if (
					((newY <= copy[i]?.y && newEnd > copy[i]?.y) ||
						(newY <= copy[i]?.y + copy[i].takenTime / 30 - 1 &&
							newEnd > copy[i]?.y + copy[i].takenTime / 30 - 1)) &&
					copy[i].id != viewRef.current.id
				) {
					changeFlag = copy[i];
					break;
				}
			}
			let changeInputIndex = copy.findIndex(item => item.y >= newY);
			changeInputIndex = changeInputIndex == -1 ? copy.length : changeInputIndex;
			if (changeFlag) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: `${changeFlag.name}과 겹치는 시간입니다!`,
					}),
				);
			} else {
				let copyValue = {
					...changeCopy[viewRef.current.index][viewRef.current.idx],
					y: newY,
					x: viewRef.current.index,
					takenTime: (newEnd - newY) * 30,
				};
				let deleteCopy = [...timetable[viewRef.current.index]];
				deleteCopy.splice(viewRef.current.idx, 1);
				changeCopy[viewRef.current.index] = deleteCopy;
				let addCopy = [...changeCopy[changeDay]];
				addCopy.splice(changeInputIndex, 0, copyValue);
				changeCopy[changeDay] = addCopy;
				dispatch(travelSliceActions.changeTimetable(changeCopy));
			}
		}
	};
	let totalHeight = 0;
	const presetScrollHeight = timetable.map((item, idx) => {
		totalHeight +=
			item.length * heightPercentage(76) +
			item.length * widthPercentage(3) +
			idx * fontPercentage(16.71) +
			idx * heightPercentage(36);
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
	const CancelModify = () => {
		setModify(false);
	};
	const checkAccommodation = () => {
		if (select == timetable.length - 1) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '마지막 날입니다',
					modalSubTitle: '마지막 날은 숙소를 추가할 수 없습니다.',
				}),
			);
		} else if (
			timetable[select][timetable[select].length - 1].category == 4 &&
			timetable[select][timetable[select].length - 1].name != '숙소 추천'
		) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '숙소가 있습니다.',
					modalSubTitle: '숙소를 제거한 후 시도해주세요',
				}),
			);
		} else {
			navigation.navigate('TimetableAddPlace', {
				x: select,
				y: [],
				status: 'accommodation',
			});
		}
	};
	const {getMainViewPager, deleteMainViewPager, viewPagerState} = useViewPager({
		title: modify ? 'modifyViewPager' : 'timetableViewPager',
	});

	const restaurantRecommend = useCallback((e: {value: any; index: number; idx: number}) => {
		CancelModify();
		let lat = 0;
		let lng = 0;
		let radius = 2000;
		let status = timetable[e.idx][e.index - 1];
		let goCheck = true;
		if (timetable[e.idx].length == 1) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '추천이 불가합니다.',
					modalSubTitle: '앞,뒤 관광지를 바탕으로 추천을 해드려요\n관광지를 추가한 후 시도해주세요',
				}),
			);
		} else {
			if (e.index == timetable[e.idx].length - 1) {
				if (timetable[e.idx][timetable[e.idx].length - 2].name.includes('추천')) {
					goCheck = false;
				} else {
					lat = timetable[e.idx][timetable[e.idx].length - 2].lat;
					lng = timetable[e.idx][timetable[e.idx].length - 2].lng;
					status = timetable[e.idx][timetable[e.idx].length - 2];
				}
			} else if (e.index == 0) {
				if (timetable[e.idx][1].name.includes('추천')) {
					goCheck = false;
				} else {
					lat = timetable[e.idx][1].lat;
					lng = timetable[e.idx][1].lng;
					status = timetable[e.idx][1];
				}
			} else {
				const departure = {lat: timetable[e.idx][e.index - 1].lat, lng: timetable[e.idx][e.index - 1].lng};
				const arrival = {lat: timetable[e.idx][e.index + 1].lat, lng: timetable[e.idx][e.index + 1].lng};
				const distance = Math.ceil(useDistance({departure: departure, arrival: arrival}));
				lat = (timetable[e.idx][e.index - 1].lat + timetable[e.idx][e.index + 1].lat) / 2;
				lng = (timetable[e.idx][e.index - 1].lng + timetable[e.idx][e.index + 1].lng) / 2;
				radius = distance >= 20 ? 20000 : distance == 0 ? 2000 : distance * 1000;
				if (
					timetable[e.idx][e.index - 1].name.includes('추천') &&
					timetable[e.idx][e.index + 1].name.includes('추천')
				) {
					goCheck = false;
				} else if (timetable[e.idx][e.index - 1].name.includes('추천')) {
					status = timetable[e.idx][e.index + 1];
				} else if (timetable[e.idx][e.index + 1].name.includes('추천')) {
					status = timetable[e.idx][e.index - 1];
				}
			}
			if (goCheck) {
				const startNumber = e.value.y; // 시작 숫자
				const count = e.value.takenTime / 30; // 원하는 갯수

				const sequentialArray = Array.from({length: count}, (_, index) => startNumber + index);

				navigation.navigate('Recommend', {
					name: '식당 추천',
					x: e.value.x,
					index: e.index,
					y: sequentialArray,
					category: e.value.category,
					lat: lat,
					lng: lng,
					//TODO 해외랑 국내 차이 두기
					apiCategory: region[0].startsWith('해외') ? 'restaurants' : 'FD6',
					// apiCategory: 'restaurants',
					radius: radius,
					backupLat: timetable[e.idx][e.index - 1]?.lat ?? 0,
					backupLng: timetable[e.idx][e.index - 1]?.lng ?? 0,
					status: status,
				});
			} else {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '추천이 불가합니다.',
						modalSubTitle: '앞,뒤 관광지를 바탕으로 추천을 해드려요\n관광지를 추가한 후 시도해주세요',
					}),
				);
			}
		}
	}, []);
	const accommodationRecommend = useCallback((e: {value: any; index: number; idx: number}) => {
		CancelModify();
		if (timetable[e.idx].length < 2) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '추천이 불가합니다.',
					modalSubTitle: '앞,뒤 관광지를 바탕으로 추천을 해드려요\n관광지를 추가한 후 시도해주세요',
				}),
			);
		} else {
			let lat = 0;
			let lng = 0;
			let goCheck = true;
			if (e.index == 0) {
				if (timetable[e.idx][e.index + 1].name.includes('추천')) {
					goCheck = false;
				} else {
					lat = timetable[e.idx][e.index + 1].lat;
					lng = timetable[e.idx][e.index + 1].lng;
				}
			} else {
				if (timetable[e.idx][e.index - 1].name.includes('추천')) {
					goCheck = false;
				} else {
					lat = timetable[e.idx][e.index - 1].lat;
					lng = timetable[e.idx][e.index - 1].lng;
				}
			}
			if (goCheck) {
				const startNumber = e.value.y; // 시작 숫자
				const count = e.value.takenTime / 30; // 원하는 갯수
				const sequentialArray = Array.from({length: count}, (_, index) => startNumber + index);
				navigation.navigate('Recommend', {
					name: '숙소 추천',
					x: e.value?.x ?? e.idx,
					index: e.index,
					y: sequentialArray,
					category: e.value.category,
					lat: lat,
					lng: lng,
					//TODO 해외랑 국내 차이 두기
					//apiCategory: 'AD5',
					apiCategory: region[0].startsWith('해외') ? 'hotels' : 'AD5',
					radius: 2000,
					backupLat: e.index != 0 ? timetable[e.idx][e.index - 1].lat : timetable[e.idx][e.index + 1].lat,
					backupLng: e.index != 0 ? timetable[e.idx][e.index - 1].lng : timetable[e.idx][e.index + 1].lng,
					status: e.index != 0 ? timetable[e.idx][e.index - 1] : timetable[e.idx][e.index + 1],
				});
			} else {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '추천이 불가합니다.',
						modalSubTitle: '앞,뒤 관광지를 바탕으로 추천을 해드려요\n관광지를 추가한 후 시도해주세요',
					}),
				);
			}
		}
	}, []);
	const goSearchPlace = (data: {index: number; idx: number; category: string}) => {
		navigation.navigate('SearchRecommend', {index: data.index, idx: data.idx, category: data.category});
	};
	const renderItem = ({item, drag, isActive, getIndex}: RenderItemParams<Item>) => {
		let idx = getIndex() ?? 0;
		return (
			<ScaleDecorator>
				{!excludeNames.includes(item.name) ? (
					<HStack gap={widthPercentage(10)}>
						<InsideGrayContainer
							onLongPress={() => {
								changeLocationRef.current.before = idx;
								drag();
							}}
							onPress={() => {
								// moveRegion(idx);
							}}>
							<HStack justifyContent='space-between'>
								<VStack>
									<PretendardVariableText size={12} lineHeight={18} color={colors.Gray2}>
										{categoryTitle[item.category]} {Math.floor(((item.y ?? 0) * 30 + 360) / 60)}:
										{String(((item.y ?? 0) * 30 + 360) % 60).padStart(2, '0')} ~{' '}
										{Math.floor((((item.y ?? 0) + item.takenTime / 30) * 30 + 360) / 60) < 25 &&
											Math.floor((((item.y ?? 0) + item.takenTime / 30) * 30 + 360) / 60) +
												':' +
												String(
													(((item.y ?? 0) + item.takenTime / 30) * 30 + 360) % 60,
												).padStart(2, '0')}
									</PretendardVariableText>
									<PretendardSemiBoldText
										maxWidth={widthPercentage(200)}
										size={14}
										lineHeight={18.9}
										color={colors.Gray5}>
										{item.name}
									</PretendardSemiBoldText>
								</VStack>
								<Pressable
									onPress={() => {
										openModal(item.x, idx);
									}}>
									<PretendardSemiBoldText size={14} lineHeight={18.9} color={colors.PointYellow}>
										편집
									</PretendardSemiBoldText>
								</Pressable>
							</HStack>
						</InsideGrayContainer>
					</HStack>
				) : (
					<HStack>
						<InfoView
							navigation={navigation}
							test={item}
							index={idx}
							idx={item.x}
							modify={false}
							CancelModify={CancelModify}
						/>
					</HStack>
				)}
			</ScaleDecorator>
		);
	};
	const changeLocation = (data: any) => {
		let copy = [...timetable];
		timetable[data[0].x].map((item, index) => {
			data[index] = {...data[index], y: item.y, takenTime: item.takenTime};
		});
		copy[data[0].x] = data;
		dispatch(travelSliceActions.changeTimetable(copy));
	};
	const [changeDay, setChangeDay] = useState(0);
	const changeLocationRef = useRef({before: 0, after: 1});
	useEffect(() => {
		shareViewWithStartFlag && getMainViewPager();
	}, [shareViewWithStartFlag, modify]);
	if (positions.length == 0) {
		return <MainAllContainer></MainAllContainer>;
	}
	const [viewMap, setViewMap] = useState(true);
	const [topbar, setTopBar] = useState(true);
	return (
		<MainAllContainer>
			{topbar && <AbsoluteTopBarComponent modify={modify} viewMap={viewMap}></AbsoluteTopBarComponent>}
			<VStack flex={1}>
				{!modify &&
					viewMap &&
					timetable.map(
						(item, idx) =>
							select == idx && (
								<MapView
									key={idx}
									ref={mapRef}
									showsMyLocationButton={true}
									style={{width: '100%', flex: 0.42}}
									showsUserLocation={true}
									onTouchStart={() => {
										setTopBar(false);
									}}
									onTouchEnd={() => {
										setTopBar(true);
									}}
									region={{
										latitude: centerLatitude,
										longitude: centerLongitude,
										latitudeDelta: deltaLatitude + deltaLatitude + 0.02,
										longitudeDelta: deltaLongitude + deltaLongitude + 0.02,
									}}>
									{markers}
									{polylines}
								</MapView>
							),
					)}
				{!modify && (
					<ViewMapTouchable
						onPress={() => {
							setViewMap(!viewMap);
						}}>
						<SVGRightAdd
							width={widthPercentage(20)}
							height={widthPercentage(20)}
							color='black'
							transform={!viewMap ? 90 : 270}
						/>
					</ViewMapTouchable>
				)}
				<BackgroundGray modify={modify} viewMap={viewMap}>
					<DayContainer horizontal={true} showsHorizontalScrollIndicator={false}>
						<FlexWrap gap={10} marginBottom={modify || !viewMap ? 15 : 0}>
							{timetable.map(
								(item, idx) =>
									item.length != 0 && (
										<DayTouchablOpacity
											key={idx}
											select={idx === select}
											onPress={() => {
												changeTouch(idx);
											}}>
											<PretendardSemiBoldText
												size={14}
												lineHeight={19}
												color={select == idx ? colors.Gray5 : colors.Gray3}>
												{'DAY' + (idx + 1)}
											</PretendardSemiBoldText>
										</DayTouchablOpacity>
									),
							)}
						</FlexWrap>
					</DayContainer>
					<HStack justifyContent='space-between'>
						<WhiteContainer width={widthPercentage(160)}>
							<HStack justifyContent='space-between' width={widthPercentage(140)}>
								<PretendardSemiBoldText size={14} lineHeight={16.71} color={colors.PointYellow}>
									여행지
								</PretendardSemiBoldText>
								<SVGContainer
									color={colors.PointYellow}
									onPress={() => {
										navigation.navigate('TimetableAddPlace', {x: select, y: [], status: 'travle'});
									}}>
									<SVGPlus
										width={widthPercentage(16)}
										height={widthPercentage(16)}
										color={colors.Primary}
									/>
								</SVGContainer>
							</HStack>
						</WhiteContainer>
						<WhiteContainer width={widthPercentage(160)}>
							<HStack justifyContent='space-between' width={widthPercentage(140)}>
								<PretendardSemiBoldText size={14} lineHeight={16.71} color={colors.PointYellow}>
									숙소
								</PretendardSemiBoldText>
								<SVGContainer color={colors.PointYellow} onPress={checkAccommodation}>
									<SVGPlus
										width={widthPercentage(16)}
										height={widthPercentage(16)}
										color={colors.Primary}
									/>
								</SVGContainer>
							</HStack>
						</WhiteContainer>
					</HStack>
					{modify ? (
						<DayScrollView
							ref={scrollRef}
							onMomentumScrollEnd={e => {
								changeViewState(e), scrollhandle(e);
							}}>
							{timetable.map(
								(value, index) =>
									value.length != 0 && (
										<WhiteContainer width={widthPercentage(327)} key={index} alignItems='center'>
											<PretendardSemiBoldText
												style={{alignSelf: 'flex-start'}}
												marginBottom={heightPercentage(10)}
												size={14}
												lineHeight={16.71}
												color={colors.Gray5}>
												{moment(day[index]).format('YY.MM.DD')} (
												{weekdays[moment(day[index]).day()]})
											</PretendardSemiBoldText>

											<NestableDraggableFlatList
												onPlaceholderIndexChange={qwe =>
													(changeLocationRef.current.after = qwe)
												}
												containerStyle={{
													height:
														heightPercentage(76) * value.length +
														widthPercentage(3) * value.length,
												}}
												data={value}
												onDragEnd={({data}) => changeLocation(data)}
												keyExtractor={item => item.id}
												renderItem={renderItem}
											/>
										</WhiteContainer>
									),
							)}
						</DayScrollView>
					) : (
						<DayScrollViews
							ref={scrollRef}
							onScroll={e => {
								scrollhandle(e);
							}}
							onMomentumScrollEnd={e => {
								changeViewState(e);
							}}
							viewMap={viewMap}>
							{timetable.map(
								(value, index) =>
									value.length != 0 && (
										<WhiteContainer width={widthPercentage(327)} key={index}>
											<PretendardSemiBoldText
												marginBottom={heightPercentage(10)}
												size={14}
												lineHeight={16.71}
												color={colors.Gray5}>
												{moment(day[index]).format('YY.MM.DD')} (
												{weekdays[moment(day[index]).day()]})
											</PretendardSemiBoldText>
											{value.map((item, idx) =>
												!excludeNames.includes(item.name) ? (
													<HStack gap={widthPercentage(10)} key={idx}>
														<DashLineContainer justifyContent='start'>
															<MarkerContainer>
																<PretendardSemiBoldText
																	size={13}
																	lineHeight={19}
																	color={colors.backgroundWhite}>
																	{idx + 1}
																</PretendardSemiBoldText>
															</MarkerContainer>
															<DashLine
																status={
																	idx == value.length - 1 ? 'end' : 'center'
																}></DashLine>
														</DashLineContainer>
														<InsideGrayContainer
															onLongPress={() => {
																dispatch(
																	modalSliceActions.setOpenModal({
																		modalTitle:
																			'편집 모드에서 여행 일정을 편집하시겠어요?',
																		modalFunction: () => {
																			setModify(true);
																		},
																	}),
																);
															}}
															onPress={() => {
																moveRegion(idx, index);
															}}>
															<HStack justifyContent='space-between'>
																<VStack>
																	<PretendardVariableText
																		size={12}
																		lineHeight={18}
																		color={colors.Gray2}>
																		{categoryTitle[item.category]}{' '}
																		{Math.floor(((item.y ?? 0) * 30 + 360) / 60)}:
																		{String(
																			((item.y ?? 0) * 30 + 360) % 60,
																		).padStart(2, '0')}{' '}
																		~{' '}
																		{Math.floor(
																			(((item.y ?? 0) + item.takenTime / 30) *
																				30 +
																				360) /
																				60,
																		) < 25 &&
																			Math.floor(
																				(((item.y ?? 0) + item.takenTime / 30) *
																					30 +
																					360) /
																					60,
																			) +
																				':' +
																				String(
																					(((item.y ?? 0) +
																						item.takenTime / 30) *
																						30 +
																						360) %
																						60,
																				).padStart(2, '0')}
																	</PretendardVariableText>
																	<PretendardSemiBoldText
																		maxWidth={widthPercentage(200)}
																		size={14}
																		lineHeight={18.9}
																		numberOfLines={2}
																		color={colors.Gray5}>
																		{item.name}
																	</PretendardSemiBoldText>
																</VStack>
																{idx != 0 &&
																	(item.category == 1 || item.category == 4 ? (
																		<VStack gap={5}>
																			<PrimaryButton
																				onPress={() => {
																					goNavigation(idx);
																				}}
																				label='길찾기'
																				textSize={12}
																				lineHeight={18}
																				width={widthPercentage(62)}
																				height={heightPercentage(22)}
																				backgroundColor={colors.Primary}
																				textColor={
																					colors.Gray5
																				}></PrimaryButton>
																			<PrimaryButton
																				onPress={() => {
																					dispatch(
																						modalSliceActions.setOpenModal({
																							modalTitle: `변경하실 ${
																								item.category == 1
																									? '식당을'
																									: '숙소를'
																							} 추천해드릴까요?`,
																							modalTopText:
																								'네, 추천해주세요',
																							modalBottomText:
																								'아니요, 직접 추가할게요',
																							modalFunction: () => {
																								item.category == 1
																									? restaurantRecommend(
																											{
																												value: item,
																												index: idx,
																												idx: index,
																											},
																									  )
																									: accommodationRecommend(
																											{
																												value: item,
																												index: idx,
																												idx: index,
																											},
																									  );
																							},
																							modalBottomFunctionUse:
																								true,
																							modalBottomFunction: () => {
																								goSearchPlace({
																									index: index,
																									idx: idx,
																									category:
																										item.category ==
																										1
																											? '식당'
																											: '숙소',
																								});
																							},
																						}),
																					);
																					// item.category == 1
																					// 	? restaurantRecommend({
																					// 			value: item,
																					// 			index: idx,
																					// 			idx: index,
																					// 	  })
																					// 	: accommodationRecommend({
																					// 			value: item,
																					// 			index: idx,
																					// 			idx: index,
																					// 	  });
																				}}
																				label={
																					item.category == 1
																						? '식당변경'
																						: '숙소변경'
																				}
																				textSize={12}
																				lineHeight={18}
																				width={widthPercentage(62)}
																				height={heightPercentage(22)}
																				backgroundColor={colors.Primary}
																				textColor={
																					colors.Gray5
																				}></PrimaryButton>
																		</VStack>
																	) : (
																		<PrimaryButton
																			onPress={() => {
																				goNavigation(idx);
																			}}
																			label='길찾기'
																			textSize={12}
																			lineHeight={18}
																			width={widthPercentage(62)}
																			height={heightPercentage(22)}
																			backgroundColor={colors.Primary}
																			textColor={colors.Gray5}></PrimaryButton>
																	))}
															</HStack>
														</InsideGrayContainer>
													</HStack>
												) : (
													<HStack key={idx}>
														<DashLineContainer justifyContent='start'>
															<MarkerContainer
																backgroundColor={
																	item.category == 4 ? colors.PointGreen1 : undefined
																}>
																<PretendardSemiBoldText
																	size={13}
																	lineHeight={19}
																	color={colors.backgroundWhite}>
																	{idx + 1}
																</PretendardSemiBoldText>
															</MarkerContainer>
															<DashLine
																status={
																	idx == value.length - 1 ? 'end' : 'center'
																}></DashLine>
														</DashLineContainer>
														<InsideGrayContainer backgroundColor={colors.backgroundWhite}>
															<InfoView
																navigation={navigation}
																test={item}
																index={idx}
																idx={index}
																modify={false}
																CancelModify={CancelModify}
															/>
														</InsideGrayContainer>
													</HStack>
												),
											)}
										</WhiteContainer>
									),
							)}
						</DayScrollViews>
					)}
				</BackgroundGray>
				{saveView && (
					<AbsoluteButton onPress={goSave}>
						<PretendardSemiBoldText size={18} lineHeight={21.48} color={colors.Primary}>
							저장
						</PretendardSemiBoldText>
					</AbsoluteButton>
				)}
				<Modal
					visible={visible}
					animationType={'fade'}
					transparent={true}
					statusBarTranslucent={true}
					onRequestClose={() => setVisible(false)}>
					<ModalContainer onPress={() => setVisible(false)}>
						<InfoModalContainer>
							<HStack gap={widthPercentage(10)}>
								<PretendardSemiBoldText size={17.78} lineHeight={24} color={colors.Gray5}>
									{viewRef.current.name}
								</PretendardSemiBoldText>
								<PretendardVariableText size={13.33} lineHeight={20} color={colors.Gray2}>
									{categoryTitle[viewRef.current.category]}
								</PretendardVariableText>
							</HStack>
							<FlexWrap gap={10} margintop={15}>
								{timetable.map(
									(item, idx) =>
										item.length != 0 && (
											<ChangeDayContainer
												key={idx}
												select={idx === changeDay}
												onPress={() => {
													setChangeDay(idx);
												}}>
												<PretendardSemiBoldText
													size={14}
													lineHeight={19}
													color={changeDay == idx ? colors.Gray5 : colors.Gray3}>
													{moment(day[idx]).format('MM월DD일')}
												</PretendardSemiBoldText>
											</ChangeDayContainer>
										),
								)}
							</FlexWrap>
							<HStack justifyContent='space-between' marginVertical={5}>
								<SelectContainer
									onPress={() => {
										setTimeView({status: !timeView.status, value: 'left'});
									}}>
									<HStack justifyContent='space-between'>
										<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray5}>
											{Math.floor(((viewRef.current.y ?? 0) * 30 + 360) / 60) < 12 ? 'AM' : 'PM'}
										</PretendardSemiBoldText>
										<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray5}>
											{Math.floor(((viewRef.current.y ?? 0) * 30 + 360) / 60)}
										</PretendardSemiBoldText>
										<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray5}>
											:
										</PretendardSemiBoldText>
										<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray5}>
											{String(((viewRef.current.y ?? 0) * 30 + 360) % 60).padStart(2, '0')}
										</PretendardSemiBoldText>
									</HStack>
								</SelectContainer>
								<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray5}>
									~
								</PretendardSemiBoldText>
								<SelectContainer
									onPress={() => {
										setTimeView({status: !timeView.status, value: 'right'});
									}}>
									<HStack justifyContent='space-between'>
										<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray5}>
											{viewRef.current.endHours < 12 ? 'AM' : 'PM'}
										</PretendardSemiBoldText>
										<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray5}>
											{viewRef.current.endHours}
										</PretendardSemiBoldText>
										<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray5}>
											:
										</PretendardSemiBoldText>
										<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray5}>
											{String(viewRef.current.endMinute).padStart(2, '0')}
										</PretendardSemiBoldText>
									</HStack>
								</SelectContainer>
							</HStack>
							<TimePickerContainer alignSelf={timeView.value == 'right' ? 'flex-end' : 'flex-start'}>
								<UseDatePicker
									goConfirm={goConfirm}
									minuteData={
										timeView.value == 'right'
											? viewRef.current.endMinute / 30
											: Math.floor(((viewRef.current.y ?? 0) * 30 + 360) % 60) / 30
									}
									ampmData={
										timeView.value == 'right'
											? Math.floor(
													(((viewRef.current.y ?? 0) + viewRef.current.takenTime / 30) * 30 +
														360) /
														60,
											  ) < 12
												? 0
												: 1
											: Math.floor(((viewRef.current.y ?? 0) * 30 + 360) / 60) < 12
											? 0
											: 1
									}
									hourData={
										timeView.value == 'right'
											? viewRef.current.endHours < 12
												? viewRef.current.endHours
												: viewRef.current.endHours - 12
											: Math.floor(((viewRef.current.y ?? 0) * 30 + 360) / 60) < 12
											? Math.floor(((viewRef.current.y ?? 0) * 30 + 360) / 60)
											: Math.floor(((viewRef.current.y ?? 0) * 30 + 360) / 60) - 12
									}
									visible={timeView.status}
									setVisible={setVisible}></UseDatePicker>
							</TimePickerContainer>
							<HStack justifyContent='space-between'>
								<ButtonsContainer
									backgroundColor={colors.Gray1}
									onPress={() => {
										setVisible(false);
										dispatch(
											modalSliceActions.setOpenModal({
												modalTitle: `'${viewRef.current.name}' 일정을 삭제할까요?`,
												modalSubTitle: '추천받은 일정을 삭제하면 되돌릴 수 없어요.',
												modalFunction: goRemove,
												modalBottomText: '취소',
												modalTopText: '삭제할래요',
											}),
										);
									}}>
									<PretendardVariableText size={16} lineHeight={19} color={colors.PointGreen1}>
										삭제
									</PretendardVariableText>
								</ButtonsContainer>
								<ButtonsContainer backgroundColor='#D5FF734D' onPress={goModify}>
									<PretendardVariableText size={16} lineHeight={19} color={colors.Gray5}>
										저장
									</PretendardVariableText>
								</ButtonsContainer>
							</HStack>
						</InfoModalContainer>
					</ModalContainer>
				</Modal>
			</VStack>
			<Modal
				animationType={'fade'}
				transparent={true}
				visible={viewPagerState}
				onRequestClose={deleteMainViewPager}>
				<ViewPager sliceNumber={modify ? 5 : 3} handleFunction={deleteMainViewPager} />
			</Modal>
		</MainAllContainer>
	);
}
const ChangeDayContainer = styled.TouchableOpacity<{select: boolean}>`
	padding: ${heightPercentage(5)}px ${widthPercentage(10)}px;
	align-items: center;
	justify-content: center;
	border-radius: 99px;
	border-width: ${props => (props.select ? '0px' : '1px')};
	border-color: ${colors.Gray3};
	background-color: ${props => (props.select ? colors.Primary : colors.backgroundGray)};
`;
const AbsoluteButton = styled.TouchableOpacity`
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(60)}px;
	border-radius: 8px;
	background-color: ${colors.Gray5};
	align-items: center;
	justify-content: center;
	position: absolute;
	bottom: ${heightPercentage(30)}px;
	align-self: center;
`;
const ButtonsContainer = styled.TouchableOpacity<{backgroundColor: string}>`
	width: ${widthPercentage(160)}px;
	height: ${heightPercentage(50)}px;
	border-radius: 8px;
	background-color: ${props => props.backgroundColor};
	align-items: center;
	justify-content: center;
`;
export const TimePickerContainer = styled.View<{alignSelf: string}>`
	align-self: ${props => props.alignSelf};
	height: ${heightPercentage(140)}px;
`;
export const InfoModalContainer = styled.View`
	flex: 0.5;
	position: absolute;
	bottom: 0px;
	background-color: ${colors.backgroundGray};
	width: ${widthPercentage(375)}px;
	height: ${heightPercentage(409)}px;
	border-top-right-radius: 16px;
	border-top-left-radius: 16px;
	padding: ${heightPercentage(23.22)}px ${widthPercentage(24)}px;
`;
const ModalContainer = styled.Pressable`
	flex: 1;
	background-color: rgba(0, 0, 0, 0.4);
`;
export const DayContainer = styled.ScrollView``;
const MainAllContainer = styled(MainContainer).attrs({as: View})`
	flex: 1;
`;
const DayScrollViews = styled.ScrollView<{viewMap: boolean}>`
	width: ${widthPercentage(375)}px;
	height: ${props => (props.viewMap ? heightPercentage(230) : heightPercentage(500))}px;
`;
const DayScrollView = styled(NestableScrollContainer)`
	width: ${widthPercentage(375)}px;
	height: ${heightPercentage(500)}px;
`;

const BackgroundGray = styled.View<{modify: boolean; viewMap: boolean}>`
	width: ${widthPercentage(375)}px;
	border-top-right-radius: 10px;
	border-top-left-radius: 10px;
	background-color: ${colors.backgroundGray};
	padding: ${heightPercentage(18)}px ${widthPercentage(23)}px;
	flex: ${props => (props.modify || !props.viewMap ? 1 : 0.55)};
`;
const InsideGrayContainer = styled.TouchableOpacity<{backgroundColor?: string}>`
	width: ${widthPercentage(282)}px;
	height: ${heightPercentage(66)}px;
	border-radius: 8px;
	background-color: ${props => props.backgroundColor ?? colors.backgroundGray};
	justify-content: center;
	padding-horizontal: ${widthPercentage(10)}px;
	margin-bottom: ${heightPercentage(10)}px;
`;
const ViewMapTouchable = styled.TouchableOpacity`
	flex: 0.03;
	width: 100%;
	justify-content: center;
	align-items: center;
	padding: ${widthPercentage(3)}px;
`;
