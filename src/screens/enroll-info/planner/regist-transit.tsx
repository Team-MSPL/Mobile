import {async} from '@firebase/util';
import moment from 'moment';
import {useEffect, useRef, useState} from 'react';
import {Modal, Platform, TouchableOpacity} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import LinearGradient from 'react-native-linear-gradient';
import shortid from 'shortid';
import {styled} from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {getPlaceInfo, googleKeywordApi, travelSliceActions} from '../../../redux/travel-info/travel.slice';
import {colors} from '../../../utill/colors';
import CustomButton from '../../../utill/component/custom-button';
import {cityViewList} from '../../../utill/component/enroll-info/city-list';
import TimePickerModal from '../../../utill/component/planner/date-picker';
import RouteButton from '../../../utill/component/route-button';
import TendencyButton from '../../../utill/component/tendency-button';
import {BackgroundGrayScrollView, HStack, PretendardSemiBoldText, VStack} from '../../../utill/layout/layout';
import {fontPercentage, widthPercentage} from '../../../utill/layout/responsive-size';
import {SvgCalendar, SvgCalendarIcon, SVGClock} from '../../../utill/svg/svg';

export default function RegistTransit({navigation, route}: any) {
	useEffect(() => {
		console.log(route);
		navigation.setOptions({
			headerRight: () => <></>,
			headerTitle: route.params.title == 'train' ? '승차권 등록하기' : '항공권 등록하기',
		});
	}, [route]);

	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
	const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
	const {nDay, day, timetable, transitInfo, region, cityIndex, country} = useAppSelector(state => state.travelSlice);

	const [select, setSelect] = useState(route?.params.type);
	const [show, setShow] = useState({status: false, step: 0});
	const indexRef = useRef(0);
	const dispatch = useAppDispatch();
	const [transportInfo, setTransportInfo] = useState({
		outbound:
			transitInfo?.outbound?.departureAirport != '' || transitInfo?.outbound?.arrivalAirport != ''
				? {...transitInfo?.outbound}
				: {
						departureAirport: '', //출밢녀
						departureTime: new Date(day[0]).setHours(9), //출발날짜
						departurHour: 6, //출발시각
						arrivalHour: 8, //도착시각
						arrivalAirport: '', //도착편
						arrivalTime: new Date(day[0]).setHours(10), //도착시간
						airline: '', //항공사혹은 기차번호
						reservationNumber: '', //에약번호
						type: route.params.title, //airport,train
				  },
		inbound:
			transitInfo?.inbound?.departureAirport != '' || transitInfo?.inbound?.arrivalAirport != ''
				? {...transitInfo?.inbound}
				: {
						departureAirport: '',
						departureTime: new Date(day[0]).setHours(9),
						departurHour: 6, //출발시각
						arrivalHour: 8, //도착시각
						arrivalAirport: '',
						arrivalTime: new Date(day[0]).setHours(10),
						airline: '',
						reservationNumber: '',
						type: route.params.title, //airport,train
				  },
	});
	const handleFlightChange = (direction, field, value) => {
		setTransportInfo(prev => ({
			...prev,
			[direction]: {
				...prev[direction],
				[field]: value,
			},
		}));
	};
	const handleCheck = () => {
		const outboundArrival = transportInfo['outbound']?.arrivalAirport;
		const outboundDeparture = transportInfo['outbound']?.departureAirport;
		const outbound = (outboundArrival && !outboundDeparture) || (!outboundArrival && outboundDeparture);

		const inboundArrival = transportInfo['inbound']?.arrivalAirport;
		const inboundDeparture = transportInfo['inbound']?.departureAirport;
		const inbound = (inboundArrival && !inboundDeparture) || (!inboundArrival && inboundDeparture);
		if (outbound || inbound) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '도착지 또는 출발지 중 하나만 입력되어 있습니다.',
					modalSingleUse: true,
				}),
			);
		} else {
			handleRegist();
		}
	};
	const handleRegist = async () => {
		try {
			let outboundInfo = {};
			let inboundInfo = {};
			if (
				transportInfo['outbound'].arrivalAirport != '' &&
				timetable[0].find(item => item.category == 6)?.name != transportInfo['outbound'].arrivalAirport
			) {
				let outboundData = await dispatch(
					googleKeywordApi({
						name: transportInfo['outbound'].arrivalAirport,
						lat: cityViewList[country][cityIndex].sub[0]?.lat,
						lng: cityViewList[country][cityIndex].sub[0]?.lng,
						region: region[0] == '전체' ? cityViewList[country][cityIndex].title : region[0],
					}),
				).unwrap();
				outboundInfo = {
					lat: outboundData?.geometry?.location?.lat ?? cityViewList[country][cityIndex].sub[0]?.lat,
					lng: outboundData?.geometry?.location?.lng ?? cityViewList[country][cityIndex].sub[0]?.lng,
					name: outboundData?.name,
				};
			}
			if (
				transportInfo['inbound'].departureAirport != '' &&
				timetable.at(-1).find(item => item.category == 7)?.name != transportInfo['inbound'].departureAirport
			) {
				let inboundData = await dispatch(
					googleKeywordApi({
						name: transportInfo['inbound'].departureAirport,
						lat: cityViewList[country][cityIndex].sub[0]?.lat,
						lng: cityViewList[country][cityIndex].sub[0]?.lng,
						region: region[0] == '전체' ? cityViewList[country][cityIndex].title : region[0],
					}),
				).unwrap();
				inboundInfo = {
					lat: inboundData?.geometry?.location?.lat ?? cityViewList[country][cityIndex].sub[0]?.lat,
					lng: inboundData?.geometry?.location?.lng ?? cityViewList[country][cityIndex].sub[0]?.lng,
					name: inboundData?.name,
				};
			}

			const data = timetable?.map((item, idx) =>
				item.map((value, index) =>
					value.category == 6 || value.category == 7
						? {
								...value,
								...(value.category == 6 ? outboundInfo : inboundInfo),
								takenTime: moment(
									transitInfo[value.category == 6 ? 'outbound' : 'inbound'].arrivalTime,
								).diff(
									transitInfo[value.category == 6 ? 'outbound' : 'inbound'].departureTime,
									'minutes',
								),
								y:
									(new Date(
										transportInfo[value.category == 6 ? 'outbound' : 'inbound'].departureTime,
									).getHours() *
										60 -
										360) /
										30 +
									new Date(
										transportInfo[value.category == 6 ? 'outbound' : 'inbound'].departureTime,
									).getMinutes() /
										30,
						  }
						: value,
				),
			);
			if (data[0].findIndex(item => item.category == 6) == -1) {
				data[0].push({
					category: 6,
					id: shortid(),
					takenTime: moment(transitInfo['outbound'].arrivalTime).diff(
						transitInfo['outbound'].departureTime,
						'minutes',
					),
					x: 0,
					y:
						(new Date(transportInfo['outbound'].departureTime).getHours() * 60 - 360) / 30 +
						new Date(transportInfo['outbound'].departureTime).getMinutes() / 30,
					lat: outboundInfo?.lat,
					lng: outboundInfo?.lng,
					name: outboundInfo?.name,
				});
			}
			if (data.at(-1)?.findIndex(item => item.category == 7) == -1) {
				data.at(-1)?.push({
					category: 7,
					id: shortid(),
					takenTime: moment(transitInfo['inbound'].arrivalTime).diff(
						transitInfo['inbound'].departureTime,
						'minutes',
					),
					x: 0,
					y:
						(new Date(transportInfo['inbound'].departureTime).getHours() * 60 - 360) / 30 +
						new Date(transportInfo['inbound'].departureTime).getMinutes() / 30,
					lat: inboundInfo?.lat,
					lng: inboundInfo?.lng,
					name: inboundInfo?.name,
				});
			}
			dispatch(travelSliceActions.changeTimetable(data));
			dispatch(travelSliceActions.updateFiled({field: 'transitInfo', value: transportInfo}));
			navigation.pop(navigation.getState().routes.at(-2).name == 'Planner' ? 1 : 2);
		} catch (e) {
			console.log(e);
		}
	};
	// const handleDayRegist=()=>{

	// }
	return (
		<BackgroundGrayScrollView backgroundColor={colors.backgroundWhite}>
			<HStack gap={widthPercentage(30)} justifyContent='center' marginVertical={widthPercentage(30)}>
				{['outbound', 'inbound'].map((item, index) => (
					<TransitTouchable onPress={() => setSelect(item)}>
						<PretendardSemiBoldText
							size={20}
							lineHeight={24}
							color={select == item ? colors.Black : '#6B7280'}>
							{item == 'outbound' ? '가는 편' : '오는 편'}
						</PretendardSemiBoldText>
						<LinearGradient
							start={{x: 0, y: 0}}
							end={{x: 1, y: 0}}
							colors={['#5350FF', 'rgba(83, 80, 255, 0.5)']}
							locations={[0, 1]} // ✅ 위치 지정 (0 ~ 1 사이의 값)
							style={{
								width: '100%',
								height: widthPercentage(8),
								borderRadius: 12,
								opacity: select == item ? 1 : 0,
							}}></LinearGradient>
					</TransitTouchable>
				))}
			</HStack>
			<VStack gap={15} deco={`margin-bottom:${widthPercentage(20)}px;`}>
				<PretendardSemiBoldText size={16} lineHeight={20} color={colors.Gray4}>
					출발
				</PretendardSemiBoldText>
				<InputBox
					value={transportInfo[select].departureAirport}
					onChangeText={e => handleFlightChange(select, 'departureAirport', e)}
					placeholder={route.params.title == 'train' ? '출발역' : '출발 공항'}
					placeholderTextColor={colors.Gray400}></InputBox>
				<HStack justifyContent='center' gap={widthPercentage(30)}>
					<TouchableHstack
						gap={10}
						onPress={() => {
							indexRef.current = 0;
							setShow({status: true, step: 0});
						}}>
						<SvgCalendarIcon width={widthPercentage(15)} height={widthPercentage(15)} />
						<PretendardSemiBoldText size={15} lineHeight={19} color={colors.PointYellow}>
							{moment(new Date(transportInfo[select].departureTime)).format('YYYY.MM.DD')}
						</PretendardSemiBoldText>
					</TouchableHstack>
					<TouchableHstack
						gap={10}
						onPress={() => {
							indexRef.current = 0;
							setShow({status: true, step: 1});
						}}>
						<SVGClock width={widthPercentage(15)} height={widthPercentage(15)} />
						<PretendardSemiBoldText size={15} lineHeight={19} color={colors.PointYellow}>
							{moment(new Date(transportInfo[select].departureTime)).format('HH-mm')}
						</PretendardSemiBoldText>
					</TouchableHstack>
				</HStack>
			</VStack>
			<VStack gap={15} deco={`margin-bottom:${widthPercentage(20)}px;`}>
				<PretendardSemiBoldText size={16} lineHeight={20} color={colors.Gray4}>
					도착
				</PretendardSemiBoldText>
				<InputBox
					value={transportInfo[select].arrivalAirport}
					onChangeText={e => handleFlightChange(select, 'arrivalAirport', e)}
					placeholder={route.params.title == 'train' ? '도착역' : '도착 공항'}></InputBox>
				<HStack justifyContent='center' gap={widthPercentage(30)}>
					<TouchableHstack
						gap={10}
						onPress={() => {
							indexRef.current = 1;
							setShow({status: true, step: 0});
						}}>
						<SvgCalendarIcon width={widthPercentage(15)} height={widthPercentage(15)} />
						<PretendardSemiBoldText size={15} lineHeight={19} color={colors.PointYellow}>
							{moment(new Date(transportInfo[select].arrivalTime)).format('YYYY.MM.DD')}
						</PretendardSemiBoldText>
					</TouchableHstack>
					<TouchableHstack
						gap={10}
						onPress={() => {
							indexRef.current = 1;
							setShow({status: true, step: 1});
						}}>
						<SVGClock width={widthPercentage(15)} height={widthPercentage(15)} />
						<PretendardSemiBoldText size={15} lineHeight={19} color={colors.PointYellow}>
							{moment(new Date(transportInfo[select].arrivalTime)).format('HH-mm')}
						</PretendardSemiBoldText>
					</TouchableHstack>
				</HStack>
			</VStack>
			<VStack gap={15}>
				<PretendardSemiBoldText size={16} lineHeight={20} color={colors.Gray4}>
					{route.params.title == 'train' ? '열차정보(옵션)' : '항공권(옵션)'}
				</PretendardSemiBoldText>
				<InputBox
					placeholder={route.params.title == 'train' ? '기차 번호' : '항공사'}
					placeholderTextColor={colors.Gray400}
					value={transportInfo[select].airline}
					onChangeText={e => handleFlightChange(select, 'airline', e)}></InputBox>
				<InputBox
					placeholder={route.params.title == 'train' ? '호차 번호' : '예약 번호'}
					placeholderTextColor={colors.Gray400}
					value={transportInfo[select].reservationNumber}
					onChangeText={e => handleFlightChange(select, 'reservationNumber', e)}></InputBox>
			</VStack>
			<CustomButton
				marginTop={20}
				marginBottom={20}
				label={'등록하기'}
				onPress={() => {
					handleCheck();
				}}
				bgColor={colors.Gray5}
				textColor={colors.Gray200}></CustomButton>
			<Modal
				animationType={'fade'}
				transparent={true}
				visible={show.status}
				onRequestClose={() => {
					setShow({status: false, step: 0});
				}}>
				<ModalBackground onPress={() => setShow({status: false, step: 0})}>
					<ModalBottomSheet flex={0.7}>
						{show.step == 0 ? (
							<CalendarPicker
								width={widthPercentage(Platform.isPad ? 300 : 375)}
								weekdays={weekdays}
								months={months}
								minDate={new Date(day[0])}
								maxDate={new Date(day[nDay])}
								// disabledDates={date => {
								// 	return !allowedDates.includes(date.format('YYYY-MM-DD'));
								// }}
								startFromMonday={false}
								onDateChange={e => {
									handleFlightChange(
										select,
										indexRef.current == 0 ? 'departureTime' : 'arrivalTime',
										e,
									);
									setShow({status: true, step: 1});
								}}
								customDatesStyles={[
									{
										date: new Date(
											select == 'outbound'
												? indexRef.current == 0
													? transportInfo.outbound.departureTime
													: transportInfo.outbound.arrivalTime
												: indexRef.current == 0
												? transportInfo.inbound.departureTime
												: transportInfo.inbound.arrivalTime,
										),
										// Random colors
										style: {
											backgroundColor: colors.Primary,
										},
										textStyle: {color: 'black'}, // sets the font color
										containerStyle: [], // extra styling for day container
										allowDisabled: true, // allow custom style to apply to disabled dates
									},
								]}
								showDayStragglers={false}
								selectedDayColor={colors.Primary}
								todayBackgroundColor={'#ffffff'}
								// selectedStartDate={selectedDateFlag || freeTicket ? selectStartDate.toDate() : undefined}
								// selectedEndDate={
								// 	(selectedDateFlag || freeTicket) && selectEndDate != null
								// 		? selectEndDate.toDate()
								// 		: undefined
								// }
								previousTitle='이전'
								nextTitle='다음'
								previousTitleStyle={{color: 'black'}}
								nextTitleStyle={{color: 'black'}}
								allowBackwardRangeSelect={true}
								selectYearTitle='년도 선택'
							/>
						) : (
							<TimePickerModal
								visible={show}
								onClose={() => setShow({status: false, step: 0})}
								onConfirm={({ampm, hour, minute}) => {
									console.log(`${ampm} ${hour}:${minute}`);
								}}
								hour={new Date(
									transportInfo[select][indexRef.current == 0 ? 'departureTime' : 'arrivalTime'],
								).getHours()}
								minute={new Date(
									transportInfo[select][indexRef.current == 0 ? 'departureTime' : 'arrivalTime'],
								).getMinutes()}
								leftText={'이전으로'}
								leftFunction={() => {
									setShow({status: true, step: 0});
								}}
								rightText={'완료'}
								rightFunction={e => {
									console.log((e?.ampm == '오전' ? 0 : 12) + Number(e?.hour), e?.minute);
									const newDate = new Date(
										transportInfo[select][indexRef.current == 0 ? 'departureTime' : 'arrivalTime'],
									).setHours(
										(e?.ampm == '오전' ? 0 : 12) +
											(Number(e?.hour) % 12 == 0 ? Number(e?.hour) / 12 - 1 : Number(e?.hour)),
										e?.minute,
									);
									handleFlightChange(
										select,
										indexRef.current == 0 ? 'departureTime' : 'arrivalTime',
										newDate,
									);
									setShow({status: false, step: 0});
								}}
							/>
						)}
						{show.step == 0 && (
							<RouteButton
								navigation={navigation}
								type={'planner'}
								leftText={'완료'}
								LeftBtnFunction={() => {
									setShow({status: false, step: 0});
								}}
								btnFunction={() => {
									setShow({status: true, step: 1});
								}}
								nextText={'다음으로'}></RouteButton>
						)}
					</ModalBottomSheet>
				</ModalBackground>
			</Modal>
		</BackgroundGrayScrollView>
	);
}
const TransitTouchable = styled(VStack).attrs({as: TouchableOpacity})``;
const InputBox = styled.TextInput`
	width: ${widthPercentage(327)}px;
	height: ${widthPercentage(52)}px;
	border-radius: 8px;
	border-width: 2px;
	border-color: ${colors.Gray200};
	font-size: ${fontPercentage(16)}px;
	padding: 0px ${widthPercentage(20)}px;
	color: ${colors.Black};
`;
const TouchableHstack = styled(HStack).attrs({as: TouchableOpacity})``;
export const ModalBackground = styled.Pressable`
	flex: 1;
	background-color: rgba(0, 0, 0, 0.4);
	align-item: center;
	justify-content: flex-end;
`;
export const ModalBottomSheet = styled.Pressable<{flex?: number}>`
	flex: ${props => props.flex ?? '0.6'};
	background-color: ${colors.backgroundWhite};
	border-top-right-radius: 30px;
	border-top-left-radius: 30px;
	align-items: center;
	justify-content: center;
`;
