import {useEffect, useRef, useState} from 'react';
import shortId from 'shortid';
import {GooglePlacesAutocomplete, GooglePlacesAutocompleteRef} from 'react-native-google-places-autocomplete';
import {Modal, TouchableOpacity} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {GOOGLE_API_KEY} from '@env';
import {
	TimetableType,
	detailTripadvisor,
	recommendApi,
	recommendPlace,
	recommendTripadvisor,
	travelSliceActions,
} from '../../redux/travel-info/travel.slice';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {
	VStack,
	HStack,
	PretendardSemiBoldText,
	PretendardVariableText,
	BackgroundGray,
	PretendardBoldText,
} from '../../utill/layout/layout';
import {SelectContainer} from '../enroll-info/select-day';

import {BottomContainer, SearchClearContainer} from '../enroll-info/search-place';
import {fontPercentage, heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {ButtonContainer, DeleteContainer} from '../enroll-info/select-multi';
import PrimaryButton from '../../utill/component/primary-button';
import UseDatePicker from '../../utill/hooks/useDatePicker';
import {TimePickerContainer} from './map-info';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {cityViewList} from '../../utill/component/enroll-info/city-list';
import {useTendencyHandler} from '../../utill/hooks/useTendencyHandler';
import RouteButton from '../../utill/component/route-button';
import {SvgCancel, SVGSearch} from '../../utill/svg/svg';
import {ModalBackground, ModalBottomSheet} from '../enroll-info/planner/regist-transit';
export default function TimetableAddPlace({navigation, route}: any) {
	const {day, timetable, region, transit, distance, bandwidth, tendency, season, country, cityIndex} = useAppSelector(
		state => state.travelSlice,
	);
	const dispatch = useAppDispatch();
	const [getInfo, setGetInfo] = useState({lat: 0, lng: 0, name: '', formatted_address: ''});
	const [recommendList, setRecommendList] = useState([]);
	const newY = useRef(0);
	const [qw, seA] = useState(0);
	const tripadvisorList = useRef({});
	const goConfirm = (timeData: {hour: string; ampm: string; minute: string}) => {
		if (timeView.value == 'left') {
			viewRef.current.y =
				(parseInt(timeData.hour) + (timeData.ampm == '오후' ? 12 : 0) - 6) * 2 + parseInt(timeData.minute) / 30;
			switch (viewRef.current.y) {
				case 34:
					viewRef.current.endHours = parseInt(timeData.hour) + (timeData.ampm == '오후' ? 12 : 0);
					viewRef.current.endMinute = 30;
					break;
				case 35:
					viewRef.current.y = viewRef.current.y - 1;
					viewRef.current.endHours = parseInt(timeData.hour) + (timeData.ampm == '오후' ? 12 : 0);
					viewRef.current.endMinute = 30;
					dispatch(
						modalSliceActions.setOpenModal({
							modalTitle: '23시 30분 이후는 선택이 불가능합니다.',
							modalSubTitle: '23시로 자동조정됩니다.',
							modalSingleUse: true,
						}),
					);
					setTimeView({status: false, value: 'left'});
					break;
				default:
					viewRef.current.endHours = parseInt(timeData.hour) + (timeData.ampm == '오후' ? 12 : 0) + 1;
					viewRef.current.endMinute = parseInt(timeData.minute);
			}
		} else {
			viewRef.current.endHours = parseInt(timeData.hour) + (timeData.ampm == '오후' ? 12 : 0);
			viewRef.current.endMinute = parseInt(timeData.minute);
			if (viewRef.current.endHours == 0) {
				if (viewRef.current.endMinute == 0) {
					viewRef.current.endMinute = 30;
					dispatch(
						modalSliceActions.setOpenModal({
							modalTitle: '0시 30분 이후부터 선택이 가능합니다.',
							modalSubTitle: '0시 30분으로 자동조정됩니다.',
							modalSingleUse: true,
						}),
					);

					setTimeView({status: false, value: 'right'});
				}
				viewRef.current.y = -12;
			} else if (viewRef.current.y >= (viewRef.current.endHours - 6) * 2 + viewRef.current.endMinute / 30) {
				viewRef.current.y = (viewRef.current.endHours - 6) * 2 + viewRef.current.endMinute / 30 - 2;
			}
		}
		seA(qw + 1);
		return true;
	};
	const viewRef = useRef({
		...timetable[0]?.[0],
		endHours: Math.floor((((timetable[0]?.[0]?.y ?? 0) + timetable[0]?.[0]?.takenTime / 30) * 30 + 360) / 60),
		endMinute: (((timetable[0]?.[0]?.y ?? 0) + timetable[0]?.[0]?.takenTime / 30) * 30 + 360) % 60,
		index: 0,
		idx: 0,
	});
	const [timeView, setTimeView] = useState({status: false, value: ''});
	const addAccommodation = () => {
		let checkTimetalbe = [...timetable[route.params.x]];
		const updateItem = {
			...checkTimetalbe[checkTimetalbe.length - 1],
			lat: getInfo.lat,
			lng: getInfo.lng,
			name: getInfo.name,
		};
		let copy = [...timetable];
		copy[route.params.x] = checkTimetalbe;
		if (checkTimetalbe[checkTimetalbe.length - 1].name == '숙소 추천') {
			checkTimetalbe.splice(checkTimetalbe.length - 1, 1, updateItem);
			let updateitems = {
				...updateItem,
				x: copy[route.params.x + 1][0].x,
				y: copy[route.params.x + 1][0].y,
				takenTime: copy[route.params.x + 1][0].takenTime,
			};
			let itemCopy: TimetableType[] = [...copy[route.params.x + 1]];
			itemCopy[0] = updateitems;
			copy[route.params.x + 1] = itemCopy;
		} else {
			checkTimetalbe.push(updateItem);
		}
		dispatch(travelSliceActions.changeTimetable(copy));
		navigation.goBack();
	};
	const addTimetable = () => {
		const newCurrentY = viewRef.current.y;
		const newEnd = (viewRef.current.endHours - 6) * 2 + viewRef.current.endMinute / 30;
		let changeFlag = null;
		let checkTimetalbe = [...timetable[route.params.x]];
		// for (let i = 0; i < checkTimetalbe.length; i++) {
		// 	if (
		// 		(newCurrentY <= checkTimetalbe[i]?.y && newEnd > checkTimetalbe[i]?.y) ||
		// 		(newCurrentY <= checkTimetalbe[i]?.y + checkTimetalbe[i].takenTime / 30 - 1 &&
		// 			newEnd > checkTimetalbe[i]?.y + checkTimetalbe[i].takenTime / 30 - 1)
		// 	) {
		// 		changeFlag = checkTimetalbe[i];
		// 		break;
		// 	}
		// }
		if (changeFlag) {
			dispatch(modalSliceActions.setOpenModal({modalTitle: `${changeFlag.name}과 겹치는 시간입니다!`}));
		} else {
			const updateItem = {
				...getInfo,
				category: 5,
				concept: [0],
				partner: [0],
				play: [0],
				popular: 0,
				season: [0],
				tour: [0],
				x: route.params.x,
				y: newCurrentY,
				id: shortId.generate(),
				takenTime: (newEnd - newCurrentY) * 30,
			};
			newY.current = timetable[route.params.x].findIndex(item => item?.y > newCurrentY);
			let copy = [...timetable];
			let xArrayCopy = [...copy[route.params.x]];
			xArrayCopy.splice(newY.current == -1 ? timetable[route.params.x]?.length : newY.current, 0, updateItem);
			copy[route.params.x] = xArrayCopy;
			dispatch(travelSliceActions.changeTimetable(copy));
			navigation.goBack();
		}
	};
	const moveRegion = async e => {
		let copy = {...e, region: ''};
		navigation.navigate('CourseDetail', {value: copy});
	};
	const {countryList} = useTendencyHandler();
	const handleNearTravleSearch = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());

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
			// if (a[0].includes('서울')) {
			// 	a = ['서울 전체'];
			// }

			let lat =
				timetable[route.params.x]?.reduce((item, current) => item + current?.lat, 0) /
				timetable[route.params.x].length;
			let lng =
				timetable[route.params.x]?.reduce((item, current) => item + current?.lng, 0) /
				timetable[route.params.x].length;
			const data = {
				regionList: a,
				selectList: [...tendency, season],
				transit,
				distanceSensitivity: distance,
				bandwidth,
				lat,
				lng,
				password: '(주)나그네들_g5hb87r8765rt68i7ur78',
			};
			const result = await dispatch(recommendPlace(data)).unwrap();
			setRecommendList(result.recommendedPlaces.slice(0, 4));
		} catch {
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
		// try {
		// 	dispatch(LoadingSliceActions.onLoading());
		// 	let result = await dispatch(
		// 		region[0].startsWith('해외')
		// 			? recommendTripadvisor({
		// 					category: 'attractions',
		// 					lat: timetable[route.params.x].filter(item => item.category == 0)[0].lat,
		// 					lng: timetable[route.params.x].filter(item => item.category == 0)[0].lng,
		// 					radius: 100000,
		// 					name: timetable[route.params.x].filter(item => item.category == 0)[0].name,
		// 			  })
		// 			: recommendApi({
		// 					category: 'AT4',
		// 					lat: lat,
		// 					lng: lng,
		// 					radius: 10000,
		// 			  }),
		// 	).unwrap();
		// 	//AT4 attractions
		// 	result = region[0].startsWith('해외') ? result.data : result;
		// 	// departure.current.lat = route.params.lat;
		// 	// departure.current.lng = route.params.lng;
		// 	if (result.length == 0) {
		// 		result = await dispatch(
		// 			region[0].startsWith('해외')
		// 				? recommendTripadvisor({
		// 						category: 'attractions',
		// 						lat: timetable[route.params.x].filter(item => item.category == 0)[0].lat,
		// 						lng: timetable[route.params.x].filter(item => item.category == 0)[0].lng,
		// 						radius: 20000,
		// 						name: timetable[route.params.x].filter(item => item.category == 0)[0].name,
		// 				  })
		// 				: recommendApi({
		// 						category: 'AT4',
		// 						lat: lat,
		// 						lng: lng,
		// 						radius: 20000,
		// 				  }),
		// 		).unwrap();
		// 		// departure.current.lat = route.params.lat;
		// 		// departure.current.lng = route.params.lng;
		// 		result = region[0].startsWith('해외') ? result.data : result;
		// 		result.length == 0 &&
		// 			(dispatch(
		// 				modalSliceActions.setOpenModal({
		// 					modalSingleUse: true,
		// 					modalTitle: '동선 상에 추천할 수 있는 장소가 없습니다 ㅠㅠ',
		// 				}),
		// 			),
		// 			navigation.goBack());
		// 	}
		// 	setRecommendList(result);
		// } catch (err) {
		// 	console.log(err);
		// 	dispatch(
		// 		modalSliceActions.setOpenModal({
		// 			modalTitle: '추천 아이템이 없습니다!',
		// 		}),
		// 	);
		// 	navigation.goBack();
		// } finally {
		// 	dispatch(LoadingSliceActions.offLoading());
		// }
	};
	useEffect(() => {
		// newY.current = timetable[route.params.x].findIndex(item => item?.y > route.params.y[0]);
		// if (newY.current == -1) {
		// 	if (timetable[route.params.x].length == 0) {
		// 		newY.current = -1;
		// 	} else {
		// 		newY.current = timetable[route.params.x].length;
		// 	}
		// }
		handleNearTravleSearch();
	}, []);

	const autocompleteRef = useRef<GooglePlacesAutocompleteRef | null>();
	const clearInput = () => {
		autocompleteRef.current?.setAddressText('');
	};
	const clearButton = () => (
		<SearchClearContainer>
			<TouchableOpacity onPress={clearInput}>
				<PretendardBoldText size={17} lineHeight={21} color={colors.PointYellow}>
					취소
				</PretendardBoldText>
			</TouchableOpacity>
		</SearchClearContainer>
	);
	return (
		<BackgroundGray paddingHorizental={0}>
			<GooglePlacesAutocomplete
				placeholder='장소를 검색해보세요!'
				disableScroll={false}
				query={{
					key: GOOGLE_API_KEY,
					language: 'ko',
				}}
				renderLeftButton={() => {
					return (
						<SVGSearch width={widthPercentage(20)} height={widthPercentage(20)} color={colors.Primary} />
					);
				}}
				ref={autocompleteRef}
				textInputProps={{placeholderTextColor: colors.Gray2, allowFontScaling: false}}
				styles={{
					container: {alignItems: 'center'},
					textInputContainer: {
						width: widthPercentage(327),
						height: widthPercentage(52),
						borderRadius: 99,
						backgroundColor: colors.backgroundWhite,
						alignItems: 'center',
						borderWidth: 1,
						borderColor: colors.Primary,
						paddingLeft: 20,
					},
					listView: {width: widthPercentage(327), maxHeight: heightPercentage(100)},
					textInput: {
						flex: 0.9,
						fontSize: fontPercentage(18),
						color: 'black',

						backgroundColor: 'transparent',
					},
					description: {color: 'black'},
				}}
				fetchDetails={true}
				onPress={async (data, details) => {
					setGetInfo({
						lat: details?.geometry.location.lat ?? 0,
						lng: details?.geometry.location.lng ?? 0,
						name: details?.name ?? '검색불가',
						formatted_address: details?.formatted_address.replace('대한민국 ', '') ?? '',
					});
				}}
				onFail={error => console.log(error)}
				onNotFound={() => console.log('no results')}>
				<InsideScrollView showsVerticalScrollIndicator={false}>
					{recommendList.length != 0 && (
						<PretendardSemiBoldText
							marginBottom={4}
							marginTop={4}
							size={18}
							lineHeight={25}
							color={colors.PointYellow}>
							이런 여행지는 어때요?
						</PretendardSemiBoldText>
					)}

					{recommendList.map((recommendItem, recommendIdx) => (
						<ElementContainer
							key={recommendIdx}
							color={colors.backgroundGray}
							onPress={() => moveRegion(recommendItem)}>
							<VStack width={widthPercentage(243)}>
								<PretendardSemiBoldText
									size={16}
									color={colors.Gray5}
									lineHeight={21.6}
									numberOfLines={1}>
									{recommendItem?.name}
								</PretendardSemiBoldText>
								{/* <PretendardVariableText size={12} lineHeight={18} color={colors.Gray2}>
									{region[0].startsWith('해외')
										? recommendItem.address_obj.address_string
										: recommendItem?.address_name}
								</PretendardVariableText> */}
							</VStack>
							<DeleteContainer
								onPress={async () => {
									setGetInfo({
										lat: recommendItem.lat,
										lng: recommendItem.lng,
										name: recommendItem.name,
										formatted_address: '',
									});
									// if (region[0].startsWith('해외')) {
									// 	if (tripadvisorList?.current[recommendIdx] == undefined) {
									// 		tripadvisorList.current[recommendIdx] = await dispatch(
									// 			detailTripadvisor({id: recommendList[recommendIdx].location_id}),
									// 		).unwrap();
									// 	}
									// 	setGetInfo({
									// 		lat: tripadvisorList.current[recommendIdx].latitude,
									// 		lng: tripadvisorList.current[recommendIdx].longitude,
									// 		name: tripadvisorList.current[recommendIdx].name,
									// 		formatted_address: recommendItem?.address_name,
									// 	});
									// } else {
									// 	setGetInfo({
									// 		lat: recommendItem.y,
									// 		lng: recommendItem.x,
									// 		name: recommendItem.place_name,
									// 		formatted_address: recommendItem?.address_name,
									// 	});
									// }
								}}>
								<PretendardSemiBoldText size={12} lineHeight={18} color={colors.Gray5}>
									선택
								</PretendardSemiBoldText>
							</DeleteContainer>
						</ElementContainer>
					))}
				</InsideScrollView>
			</GooglePlacesAutocomplete>
			<Modal
				animationType={'fade'}
				transparent={true}
				visible={getInfo.name != ''}
				onRequestClose={() => {
					setGetInfo({lat: 0, lng: 0, name: '', formatted_address: ''});
					clearInput();
				}}>
				<ModalBackground
					onPress={() => {
						setGetInfo({lat: 0, lng: 0, name: '', formatted_address: ''});
						clearInput();
					}}>
					<ModalBottomSheet flex={route.params.status == 'travle' ? 0.4 : 0.35}>
						<BottomContainer
							height={route.params.status == 'travle' ? heightPercentage(230) : heightPercentage(180)}>
							<ElementContainer color={colors.backgroundGray}>
								<VStack width={widthPercentage(243)}>
									<PretendardSemiBoldText size={16} color={colors.Gray5} lineHeight={21.6}>
										{getInfo.name}
									</PretendardSemiBoldText>
									<PretendardVariableText
										size={12}
										lineHeight={18}
										color={colors.Gray2}
										numberOfLines={1}>
										{getInfo.formatted_address}
									</PretendardVariableText>
								</VStack>
								<DeleteBox
									onPress={() => {
										setGetInfo({lat: 0, lng: 0, name: '', formatted_address: ''});
										clearInput();
									}}>
									<SvgCancel
										color={colors.Gray4}
										width={widthPercentage(14)}
										height={widthPercentage(14)}
									/>
								</DeleteBox>
							</ElementContainer>
							{route.params.status == 'travle' && (
								<>
									<HStack justifyContent='space-between'>
										<SelectContainer
											backgroundColor={colors.backgroundGray}
											onPress={() => {
												setTimeView({status: !timeView.status, value: 'left'});
											}}>
											<HStack justifyContent='space-between'>
												<PretendardSemiBoldText
													size={12}
													lineHeight={14.32}
													color={colors.Gray5}>
													{Math.floor(((viewRef.current.y ?? 0) * 30 + 360) / 60) < 12
														? 'AM'
														: 'PM'}
												</PretendardSemiBoldText>
												<PretendardSemiBoldText
													size={12}
													lineHeight={14.32}
													color={colors.Gray5}>
													{Math.floor(((viewRef.current.y ?? 0) * 30 + 360) / 60)}
												</PretendardSemiBoldText>
												<PretendardSemiBoldText
													size={12}
													lineHeight={14.32}
													color={colors.Gray5}>
													:
												</PretendardSemiBoldText>
												<PretendardSemiBoldText
													size={12}
													lineHeight={14.32}
													color={colors.Gray5}>
													{String(((viewRef.current.y ?? 0) * 30 + 360) % 60).padStart(
														2,
														'0',
													)}
												</PretendardSemiBoldText>
											</HStack>
										</SelectContainer>
										<PretendardSemiBoldText size={12} lineHeight={14.32} color={colors.Gray5}>
											~
										</PretendardSemiBoldText>
										<SelectContainer
											backgroundColor={colors.backgroundGray}
											onPress={() => {
												setTimeView({status: !timeView.status, value: 'right'});
											}}>
											<HStack justifyContent='space-between'>
												<PretendardSemiBoldText
													size={12}
													lineHeight={14.32}
													color={colors.Gray5}>
													{viewRef.current.endHours < 12 ? 'AM' : 'PM'}
												</PretendardSemiBoldText>
												<PretendardSemiBoldText
													size={12}
													lineHeight={14.32}
													color={colors.Gray5}>
													{viewRef.current.endHours}
												</PretendardSemiBoldText>
												<PretendardSemiBoldText
													size={12}
													lineHeight={14.32}
													color={colors.Gray5}>
													:
												</PretendardSemiBoldText>
												<PretendardSemiBoldText
													size={12}
													lineHeight={14.32}
													color={colors.Gray5}>
													{String(viewRef.current.endMinute).padStart(2, '0')}
												</PretendardSemiBoldText>
											</HStack>
										</SelectContainer>
									</HStack>
									<TimePickerContainer
										alignSelf={timeView.value == 'right' ? 'flex-end' : 'flex-start'}>
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
															(((viewRef.current.y ?? 0) +
																viewRef.current.takenTime / 30) *
																30 +
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
											setVisible={() => {}}></UseDatePicker>
									</TimePickerContainer>
								</>
							)}
							{route.params.status == 'travle' ? (
								<PrimaryButton
									label={route.params.status == 'travle' ? '여행지 추가' : '숙소 추가'}
									width={widthPercentage(327)}
									height={heightPercentage(60)}
									onPress={route.params.status == 'travle' ? addTimetable : addAccommodation}
									backgroundColor={colors.Primary}
									textColor={colors.Gray5}></PrimaryButton>
							) : (
								<RouteButton
									navigation={navigation}
									nextText={'등록하기'}
									leftText='예약하기'
									type={'planner'}
									btnFunction={() => {
										setGetInfo({lat: 0, lng: 0, name: '', formatted_address: ''});
										clearInput();
										navigation.navigate('AccommodationDay', {info: getInfo, index: route.params.x});
									}}
									LeftBtnFunction={() => {
										// step == 0 ? navigation.goBack() : setStep(step - 1);
									}}></RouteButton>
							)}
						</BottomContainer>
					</ModalBottomSheet>
				</ModalBackground>
			</Modal>
			{/* <ButtonContainer>
				<PrimaryButton
					disabled={!getInfo.name}
					label={route.params.status == 'travle' ? '여행지 추가' : '숙소 추가'}
					alignSelf='center'
					width={widthPercentage(327)}
					height={heightPercentage(60)}
					onPress={() => {}}
					backgroundColor={colors.Gray1}
					textColor={colors.Gray4}></PrimaryButton>
			</ButtonContainer> */}
			{/* {getInfo.name ? (
				<BottomContainer
					height={route.params.status == 'travle' ? heightPercentage(342) : heightPercentage(150)}
					gap={heightPercentage(0)}>
					<ElementContainer color={colors.backgroundGray}>
						<VStack width={widthPercentage(243)}>
							<PretendardSemiBoldText size={16} color={colors.Gray5} lineHeight={21.6}>
								{getInfo.name}
							</PretendardSemiBoldText>
							<PretendardVariableText size={12} lineHeight={18} color={colors.Gray2} numberOfLines={1}>
								{getInfo.formatted_address}
							</PretendardVariableText>
						</VStack>
						<DeleteBox
							onPress={() => {
								setGetInfo({lat: 0, lng: 0, name: '', formatted_address: ''});
								clearInput();
							}}>
							<SvgCancel color={colors.Gray4} width={widthPercentage(14)} height={widthPercentage(14)} />
						</DeleteBox>
					</ElementContainer>
					{route.params.status == 'travle' && (
						<>
							<HStack justifyContent='space-between'>
								<SelectContainer
									backgroundColor={colors.backgroundGray}
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
									backgroundColor={colors.backgroundGray}
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
									setVisible={() => {}}></UseDatePicker>
							</TimePickerContainer>
						</>
					)}
					{route.params.status == 'travle' ? (
						<PrimaryButton
							label={route.params.status == 'travle' ? '여행지 추가' : '숙소 추가'}
							width={widthPercentage(327)}
							height={heightPercentage(60)}
							onPress={route.params.status == 'travle' ? addTimetable : addAccommodation}
							backgroundColor={colors.Primary}
							textColor={colors.Gray5}></PrimaryButton>
					) : (
						<RouteButton
							navigation={navigation}
							nextText={'등록하기'}
							leftText='예약하기'
							type={'planner'}
							btnFunction={() => {
								navigation.navigate('AccommodationDay', {info: getInfo, index: route.params.x});
							}}
							LeftBtnFunction={() => {
								// step == 0 ? navigation.goBack() : setStep(step - 1);
							}}></RouteButton>
					)}
				</BottomContainer>
			) : (
				<ButtonContainer>
					<PrimaryButton
						disabled={!getInfo.name}
						label={route.params.status == 'travle' ? '여행지 추가' : '숙소 추가'}
						alignSelf='center'
						width={widthPercentage(327)}
						height={heightPercentage(60)}
						onPress={() => {}}
						backgroundColor={colors.Gray1}
						textColor={colors.Gray4}></PrimaryButton>
				</ButtonContainer>
			)} */}
		</BackgroundGray>
	);
}
const ElementContainer = styled.Pressable<{color: string}>`
	border-radius: 8px;
	background-color: ${props => props.color};
	align-items: center;
	justify-content: space-between;
	padding: ${widthPercentage(5)}px ${widthPercentage(8)}px;
	gap: ${widthPercentage(4)}px;
	flex-direction: row;
	width: ${widthPercentage(326)}px;
	height: ${heightPercentage(64)}px;
`;
const InsideScrollView = styled.ScrollView``;
const DeleteBox = styled.TouchableOpacity`
	width: ${widthPercentage(76)}px;
	height: ${widthPercentage(28)}px;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
`;
