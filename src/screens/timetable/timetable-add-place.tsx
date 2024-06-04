import {useEffect, useRef, useState} from 'react';
import shortId from 'shortid';
import {GooglePlacesAutocomplete, GooglePlacesAutocompleteRef} from 'react-native-google-places-autocomplete';
import {Alert, TouchableOpacity, View} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {GOOGLE_API_KEY} from '@env';
import {TimetableType, recommendApi, travelSliceActions} from '../../redux/travel-info/travel.slice';
import moment from 'moment';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {
	VStack,
	HStack,
	PretendardSemiBoldText,
	PretendardVariableText,
	BackgroundGray,
} from '../../utill/layout/layout';
import {DayPressable, SelectContainer} from '../enroll-info/select-day';

import {useDistance} from '../../utill/hooks/useDistance';
import {BottomContainer, SearchClearButton, SearchClearContainer} from '../enroll-info/search-place';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {ButtonContainer, DeleteContainer} from '../enroll-info/select-multi';
import PrimaryButton from '../../utill/component/primary-button';
import UseDatePicker from '../../utill/hooks/useDatePicker';
import {InfoModalContainer, TimePickerContainer} from './map-info';
export default function TimetableAddPlace({navigation, route}: any) {
	const {day, timetable} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const [getInfo, setGetInfo] = useState({lat: 0, lng: 0, name: '', formatted_address: ''});
	const newY = useRef(0);

	const goRecommend = (category: string) => {
		let lat = 0;
		let lng = 0;
		let radius = 2000;
		let goCheck = true;
		let status = timetable[route.params.x][timetable[route.params.x].length - 1];
		switch (newY.current) {
			case timetable[route.params.x].length:
				if (timetable[route.params.x][timetable[route.params.x].length - 1].name.includes('추천')) {
					goCheck = false;
				} else {
					lat = timetable[route.params.x][timetable[route.params.x].length - 1].lat;
					lng = timetable[route.params.x][timetable[route.params.x].length - 1].lng;
					status = timetable[route.params.x][timetable[route.params.x].length - 1];
				}
				break;
			case 0:
				if (timetable[route.params.x][0].name.includes('추천')) {
					goCheck = false;
				} else {
					lat = timetable[route.params.x][0].lat;
					lng = timetable[route.params.x][0].lng;
					status = timetable[route.params.x][0];
				}
				break;
			case -1:
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '참고할 관광지가 없어서 보여줄 수 없습니다!',
						modalSubTitle: '동일한 날짜에 아무것도 없으면 추천을 해줄 수 없습니다.',
					}),
				);
				return 0;
			default:
				let departure = {
					lat: timetable[route.params.x][newY.current - 1].lat,
					lng: timetable[route.params.x][newY.current - 1].lng,
				};
				let arrival = {
					lat: timetable[route.params.x][newY.current].lat,
					lng: timetable[route.params.x][newY.current].lng,
				};
				if (
					timetable[route.params.x][newY.current - 1].name.includes('추천') &&
					timetable[route.params.x][newY.current].name.includes('추천')
				) {
					goCheck = false;
				} else if (timetable[route.params.x][newY.current - 1].name.includes('추천')) {
					departure = {
						lat: timetable[route.params.x][newY.current].lat,
						lng: timetable[route.params.x][newY.current].lng,
					};
					arrival = {
						lat: timetable[route.params.x][newY.current].lat,
						lng: timetable[route.params.x][newY.current].lng,
					};
					status = timetable[route.params.x][newY.current];
				} else {
					departure = {
						lat: timetable[route.params.x][newY.current - 1].lat,
						lng: timetable[route.params.x][newY.current - 1].lng,
					};
					arrival = {
						lat: timetable[route.params.x][newY.current - 1].lat,
						lng: timetable[route.params.x][newY.current - 1].lng,
					};
					status = timetable[route.params.x][newY.current - 1];
				}

				const distance = Math.ceil(useDistance({departure: departure, arrival: arrival})); // 두 지점 간의 거리 (단위: km)
				lat =
					(timetable[route.params.x][newY.current - 1].lat + timetable[route.params.x][newY.current].lat) / 2;
				lng =
					(timetable[route.params.x][newY.current - 1].lng + timetable[route.params.x][newY.current].lng) / 2;
				radius = distance >= 20 ? 20000 : distance == 0 ? 2000 : distance * 1000;
				// status = timetable[route.params.x][newY.current - 1];
				break;
		}
		if (goCheck) {
			const categoryIndex = category == 'AD5' ? 4 : category == 'FD6' ? 1 : 3;
			navigation.navigate('Recommend', {
				name: '',
				x: route.params.x,
				index: newY.current,
				y: route.params.y,
				category: categoryIndex,
				lat: lat,
				lng: lng,
				apiCategory: category,
				radius: radius,
				status: status,
			});
		} else {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '참고할 관광지가 없어서 보여줄 수 없습니다!',
					modalSubTitle: '동일한 날짜에 아무것도 없으면 추천을 해줄 수 없습니다.',
				}),
			);
		}
	};
	const [qw, seA] = useState(0);
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
			console.log(viewRef.current.endHours);
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
		...timetable[0][0],
		endHours: Math.floor((((timetable[0][0].y ?? 0) + timetable[0][0].takenTime / 30) * 30 + 360) / 60),
		endMinute: (((timetable[0][0].y ?? 0) + timetable[0][0].takenTime / 30) * 30 + 360) % 60,
		index: 0,
		idx: 0,
	});
	const [timeView, setTimeView] = useState({status: false, value: ''});
	const goModify = () => {
		const newY = viewRef.current.y;
		const newEnd = (viewRef.current.endHours - 6) * 2 + viewRef.current.endMinute / 30;
		console.log(newY, newEnd);
		if (newEnd >= 49) {
			dispatch(modalSliceActions.setOpenModal({modalTitle: '시간을 다시 설정해주세요.'}));
		} else {
			let copy = [...timetable[viewRef.current.index]];
			let changeCopy = [...timetable];
			let changeFlag = null;
			console.log(copy);
			//부터 가능
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
				let addCopy = [...changeCopy[viewRef.current.index]];
				addCopy.splice(changeInputIndex, 0, copyValue);
				changeCopy[viewRef.current.index] = addCopy;
				dispatch(travelSliceActions.changeTimetable(changeCopy));
				navigation.goBack();
			}
		}
	};
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
		for (let i = 0; i < checkTimetalbe.length; i++) {
			console.log(newEnd, newCurrentY, checkTimetalbe[i]?.y);
			if (
				(newCurrentY <= checkTimetalbe[i]?.y && newEnd > checkTimetalbe[i]?.y) ||
				(newCurrentY <= checkTimetalbe[i]?.y + checkTimetalbe[i].takenTime / 30 - 1 &&
					newEnd > checkTimetalbe[i]?.y + checkTimetalbe[i].takenTime / 30 - 1)
			) {
				changeFlag = checkTimetalbe[i];
				break;
			}
		}
		console.log(changeFlag);
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
			console.log(newCurrentY, newY.current);
			let copy = [...timetable];
			let xArrayCopy = [...copy[route.params.x]];
			xArrayCopy.splice((newY.current = -1 ? timetable[route.params.x].length : newY.current), 0, updateItem);
			copy[route.params.x] = xArrayCopy;
			dispatch(travelSliceActions.changeTimetable(copy));
			navigation.goBack();
		}
	};
	useEffect(() => {
		newY.current = timetable[route.params.x].findIndex(item => item?.y > route.params.y[0]);
		if (newY.current == -1) {
			if (timetable[route.params.x].length == 0) {
				newY.current = -1;
			} else {
				newY.current = timetable[route.params.x].length;
			}
		}
	}, []);
	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
	const DaySelectInfoList = [
		{step: 'Start', title: '시작 시간', time: route.params.y[0]},
		{step: 'End', title: '종료 시간', time: route.params.y[route.params.y.length - 1] + 1},
	];

	const autocompleteRef = useRef<GooglePlacesAutocompleteRef | null>();
	const clearInput = () => {
		autocompleteRef.current?.setAddressText('');
	};
	const clearButton = () => (
		<SearchClearContainer>
			<TouchableOpacity onPress={clearInput}>
				<SearchClearButton>취소</SearchClearButton>
			</TouchableOpacity>
		</SearchClearContainer>
	);
	return (
		<BackgroundGray paddingHorizental={0}>
			{/* <DayContainer>
				<DayText>
					{moment(day[route.params.x]).format('YYYY-MM-DD')},{weekdays[moment(day[route.params.x]).day()]}요일
				</DayText>
			</DayContainer> */}
			<GooglePlacesAutocomplete
				placeholder='장소를 검색해보세요!'
				placeholderTextColor={'grey'}
				query={{
					key: GOOGLE_API_KEY,
					language: 'ko',
					components: 'country:kr',
				}}
				ref={autocompleteRef}
				textInputProps={{placeholderTextColor: 'grey'}}
				styles={{
					container: {alignItems: 'center'},
					textInputContainer: {
						width: widthPercentage(327),
						height: heightPercentage(52),
						borderRadius: 8,
						backgroundColor: colors.backgroundWhite,
						alignItems: 'center',
					},
					listView: {width: widthPercentage(327)},
					textInput: {margin: 1, color: 'black', backgroundColor: colors.backgroundWhite},
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
				onNotFound={() => console.log('no results')}></GooglePlacesAutocomplete>
			{/* <TimeContainer>
				{[...Array(2)].map((item, idx) => (
					<TimeItemContainer key={idx}>
						<TimeStepText>{DaySelectInfoList[idx].step}</TimeStepText>
						<TimeItemText>{DaySelectInfoList[idx].title}</TimeItemText>
						<HStack>
							<DayElementContainer>
								<TimeItemText>
									{DaySelectInfoList[idx].time < 12 ? '오전' : '오후'}
									{Math.floor((DaySelectInfoList[idx].time * 30 + 360) / 60)}:
									{String((DaySelectInfoList[idx].time * 30 + 360) % 60).padStart(2, '0')}
								</TimeItemText>
							</DayElementContainer>
						</HStack>
					</TimeItemContainer>
				))}
			</TimeContainer> */}
			{getInfo.name ? (
				<BottomContainer
					height={route.params.status == 'travle' ? heightPercentage(342) : heightPercentage(150)}
					gap={heightPercentage(0)}>
					<ElementContainer color={colors.backgroundGray}>
						<VStack width={widthPercentage(243)}>
							<PretendardSemiBoldText size={16} color={colors.Gray5} lineHeight={21.6}>
								{getInfo.name}
							</PretendardSemiBoldText>
							<PretendardVariableText size={12} lineHeight={18} color={colors.Gray2}>
								{getInfo.formatted_address}
							</PretendardVariableText>
						</VStack>
						<DeleteContainer
							onPress={() => {
								setGetInfo({lat: 0, lng: 0, name: '', formatted_address: ''});
								clearInput();
							}}>
							<PretendardSemiBoldText size={12} lineHeight={18} color={colors.Gray5}>
								취소
							</PretendardSemiBoldText>
						</DeleteContainer>
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
					{/* {route.params.id == 0 && (
						<HStack justifyContent='space-around'>
							<PretendardSemiBoldText size={16} color={colors.PointYellow} lineHeight={24}>
								머무를 시간
							</PretendardSemiBoldText>
							<HStack justifyContent='space-around' width={widthPercentage(182)}>
								<SVGContainer
									disabled={timeValue < 1}
									onPress={() => {
										setTimeValue(timeValue - 1);
									}}
									color={colors.Gray1}>
									<SVGMinus color={colors.Gray2} />
								</SVGContainer>
								<PretendardSemiBoldText size={16} color={colors.Gray5} lineHeight={21.6}>
									{timeValue + 1}시간
								</PretendardSemiBoldText>
								<SVGContainer
									disabled={timeValue > 1}
									onPress={() => {
										setTimeValue(timeValue + 1);
									}}
									color={colors.Gray1}>
									<SVGPlus color={colors.Gray2} />
								</SVGContainer>
							</HStack>
						</HStack>
					)} */}

					<PrimaryButton
						label={route.params.status == 'travle' ? '여행지 추가' : '숙소 추가'}
						width={widthPercentage(327)}
						height={heightPercentage(60)}
						onPress={route.params.status == 'travle' ? addTimetable : addAccommodation}
						backgroundColor={colors.Primary}
						textColor={colors.Gray5}></PrimaryButton>
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
			)}
			{/* <SearchContainer>
				{getInfo.name ? (
					<AddHStack>
						<AddText>{getInfo.name}</AddText>
						<TouchableOpacity
							onPress={() => {
								setGetInfo({lat: 0, lng: 0, name: ''});
							}}>
							<DeleteIconContainer name={'delete'} size={20} color={'white'} />
						</TouchableOpacity>
					</AddHStack>
				) : (
					<GooglePlacesAutocomplete
						placeholder='장소를 검색해보세요!'
						placeholderTextColor={'grey'}
						query={{
							key: GOOGLE_API_KEY,
							language: 'ko',
							components: 'country:kr',
						}}
						ref={autocompleteRef}
						textInputProps={{placeholderTextColor: 'grey'}}
						styles={{
							textInputContainer: {
								borderWidth: 1,
								borderColor: colors.selectButton,
								borderRadius: 10,
								backgroundColor: colors.main,
							},
							textInput: {margin: 1, color: 'black', backgroundColor: colors.main},
							listView: {height: 300},
							description: {color: 'black'},
						}}
						renderLeftButton={clearButton}
						fetchDetails={true}
						onPress={async (data, details) => {
							setGetInfo({
								lat: details?.geometry.location.lat ?? 0,
								lng: details?.geometry.location.lng ?? 0,
								name: details?.name ?? '검색불가',
							});
						}}
						onFail={error => console.log(error)}
						onNotFound={() => console.log('no results')}></GooglePlacesAutocomplete>
				)}
			</SearchContainer> */}
			{/* <CourseAndReview>
				<RecommendContainer color='#ffccb6' onPress={() => goRecommend('CE7')}>
					<CourseTitleText>카페 추천</CourseTitleText>
					<IconContainer>
						<SvgCoffee width={devicesWidth * 0.09} height={devicesWidth * 0.09} color='white' />
					</IconContainer>
				</RecommendContainer>
				<RecommendContainer
					color='#cbaacb'
					onPress={() => {
						goRecommend('AD5');
					}}>
					<CourseTitleText>숙소 추천</CourseTitleText>

					<IconContainer>
						<SvgHome width={devicesWidth * 0.09} height={devicesWidth * 0.09} color='white' />
					</IconContainer>
				</RecommendContainer>
				<RecommendContainer
					color='#abdee6'
					onPress={() => {
						goRecommend('FD6');
					}}>
					<CourseTitleText>식당 추천</CourseTitleText>
					<IconContainer>
						<DeleteIconContainers name={'restaurant'} size={devicesWidth * 0.09} color={'white'} />
					</IconContainer>
				</RecommendContainer>
			</CourseAndReview> */}
			{/* <CustomButton label='추가하기' isDisabled={!getInfo.name} onPress={addTimetable} /> */}
		</BackgroundGray>
	);
}
const ElementContainer = styled.View<{color: string}>`
	border-radius: 8px;
	background-color: ${props => props.color};
	align-items: center;
	justify-content: space-between;
	padding: ${widthPercentage(5)}px ${widthPercentage(8)}px;
	gap: ${widthPercentage(4)}px;
	flex-direction: row;
	margin-right: ${widthPercentage(5)}px;
	margin-bottom: ${widthPercentage(5)}px;
	width: ${widthPercentage(326)}px;
	height: ${heightPercentage(64)}px;
`;
