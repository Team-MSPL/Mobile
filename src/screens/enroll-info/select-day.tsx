import {useRef, useState, useLayoutEffect, Fragment, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {PlaceType, travelSliceActions} from '../../redux/travel-info/travel.slice';
import CalendarPicker from 'react-native-calendar-picker';
import CustomButton from '../../utill/component/custom-button';
import moment from 'moment';
import StepText from '../../utill/component/enroll-info/step-text';
import {
	HStack,
	BackgroundGray,
	PretendardVariable,
	PretendardSemiBoldText,
	BackgroundGrayScrollView,
} from '../../utill/layout/layout';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {Modal, Platform, Pressable, ScrollView} from 'react-native';

import UseDatePicker from '../../utill/hooks/useDatePicker';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import Stepper from '../../utill/component/enroll-info/stepper';
import {fontPercentage, heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {ButtonContainer, MarginContainder} from './select-multi';
import {logEvent} from '../../../firebaseAnalytice';
import RouteButton from '../../utill/component/route-button';
import TimePickerModal from '../../utill/component/planner/date-picker';
import {ModalBackground, ModalBottomSheet} from './planner/regist-transit';
import {SVGRightAdd} from '../../utill/svg/svg';
export default function SelectDay({navigation}: any) {
	const [dateFlag, setDateFlag] = useState(0);
	const [visible, setVisible] = useState(false);
	const {
		Place,
		timeLimitArray,
		minuteLimitArray,
		accommodations,
		selectStartDate,
		selectEndDate,
		freeTicket,
		selectedDateFlag,
		regionRecommendFlag,
		makeMode,
		nDay,
	} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const {socialloginProvider} = useAppSelector(state => state.userSlice);

	const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
	const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

	const onPressTime = (e: number) => {
		if (visible) {
			setVisible(false);
		} else {
			setDateFlag(e);
			setVisible(true);
		}
	};
	useLayoutEffect(() => {
		hanldleDay();
	}, [selectStartDate, selectEndDate]);
	const hanldleDay = () => {
		let data: PlaceType[] = [];
		const checkDays = calculateDateDifference();
		if (Object.keys(accommodations).length) {
			let copy = [...accommodations];
			if (checkDays + 2 < Object.keys(accommodations).length) {
				copy.splice(checkDays + 2, Object.keys(accommodations).length - checkDays);
				data = copy;
			} else if (checkDays + 2 > Object.keys(accommodations).length) {
				for (let i = 0; i < checkDays + 2 - Object.keys(accommodations).length; i++) {
					copy.push({
						name: '',
						lat: 0,
						lng: 0,
						category: 4,
						takenTime: 30,
						photo: '',
					});
				}
				data = copy;
			}
		} else {
			data = [...Array(checkDays + 2)].map(item => {
				return Place;
			});
		}

		let season = Array(4).fill(0);
		let index = Math.floor((selectStartDate.month() + 1) / 3) - 1;
		index < 0 ? (season[3] = 1) : (season[index] = 1);
		let dateArray = [];
		let count = 0;
		let copySelectedStartDate = moment({...selectStartDate});
		while (checkDays > 4 ? copySelectedStartDate.isSameOrBefore(selectEndDate) : count < 5) {
			dateArray.push(copySelectedStartDate.clone());
			copySelectedStartDate.add(1, 'day');
			count += 1;
		}
		dispatch(
			travelSliceActions.enrollDayInfo({
				day: dateArray,
				nDay: checkDays,
				accommodations: data.length == 0 ? accommodations : data,
				season: season,
			}),
		);
	};

	const goNext = () => {
		if (timeLimitArray[0] < 6) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '시작 시간을 06시 이전으로 설정하실 수 없습니다.',
					modalSingleUse: true,
					modalTextSize: 17,
				}),
			);
		} else if (timeLimitArray[0] > 19) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '시작 시간을 20시 이후로는 설정하실 수 없습니다.',
					modalSingleUse: true,
					modalTextSize: 17,
				}),
			);
		} else if (timeLimitArray[1] < 12) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '종료 시간을 오전으로 설정하실 수 없습니다.',
					modalSingleUse: true,
					modalTextSize: 17,
				}),
			);
		} else if (timeLimitArray[0] >= timeLimitArray[1]) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '종료 시간을 시작 시간 이후로는 설정하실 수 없습니다.',
					modalSingleUse: true,
					modalTextSize: 17,
				}),
			);
		} else {
			navigation.navigate('SelectDeparture');
		}
	};
	const handleClose = () => {
		setVisible(false);
	};
	const goConfirm = (timeData: {hour: number; ampm: string; minute: string}) => {
		let timeCopy = [...timeLimitArray];
		let ampmCheck = timeData.ampm == '오후' ? 12 : 0;
		timeCopy[dateFlag] = parseInt(timeData.hour) + ampmCheck;
		let minuteCopy = [...minuteLimitArray];
		minuteCopy[dateFlag] = parseInt(timeData.minute);
		dispatch(travelSliceActions.setTimeAndMinute({time: timeCopy, minute: minuteCopy}));
		return true;
	};
	const handleConfirm = (timeData: {hour: number; ampm: string; minute: string}) => {
		goConfirm(timeData);
		handleClose();
	};
	const handleTimeNext = async (timeData: {hour: number; ampm: string; minute: string}) => {
		goConfirm(timeData);
		setDateFlag(1);
	};
	const [selectDateFlag, setSelectDateFlag] = useState(false);
	const onDateChange = (date: any, type: string) => {
		!selectDateFlag && setSelectDateFlag(true);
		if (type == 'END_DATE') {
			dispatch(travelSliceActions.enrollSelectEndDate(date));
		} else {
			selectEndDate && selectEndDate.diff(date) <= 0 && dispatch(travelSliceActions.enrollSelectEndDate(date));
			dispatch(travelSliceActions.enrollSelectStartDate(date));
		}
	};

	const calculateDateDifference = () => {
		if (selectStartDate && selectEndDate) {
			const diffInMilliseconds = selectEndDate.diff(selectStartDate);
			const duration = moment.duration(diffInMilliseconds);
			const days = duration.asDays();
			return Math.ceil(Math.abs(days)); // 절대값으로 반환 (음수 값 제거)
		}
		return 0;
	};
	const DaySelectInfoList = [
		{step: '시작일', title: '여행 시작', day: selectStartDate},
		{step: '종료일', title: '여행 종료', day: selectEndDate == null ? selectStartDate : selectEndDate},
	];
	const handleGoogleAnalytics = async () => {
		socialloginProvider == 'anonymous'
			? await logEvent('anonymous_course_step3', {})
			: await logEvent('course_step3', {});
	};
	useEffect(() => {
		handleGoogleAnalytics();
	}, []);
	return (
		<>
			<BackgroundGrayScrollView>
				<Stepper total={regionRecommendFlag ? 4 : 13} now={regionRecommendFlag ? 2 : 4}></Stepper>
				<StepText
					marginTop={heightPercentage(10)}
					marginBottom={heightPercentage(10)}
					styleText='1.여행 계획을 알려주세요.'
					mainText='언제 떠나시나요?'
					subText='여행을 떠날 출발일과 도착일을 선택해주세요.'></StepText>

				<CalendarContainer>
					<CalendarPicker
						width={widthPercentage(Platform.isPad ? 300 : 327)}
						weekdays={weekdays}
						months={months}
						minDate={new Date()}
						startFromMonday={false}
						onDateChange={onDateChange}
						showDayStragglers={false}
						monthYearHeaderWrapperStyle={{
							marginHorizontal: widthPercentage(30),
							alignItems: 'center',
							justifyContent: 'center',
						}}
						headerWrapperStyle={{justifyContent: 'center', alignItems: 'center'}}
						nextComponent={<SVGRightAdd color={colors.Gray5} />}
						previousComponent={<SVGRightAdd color={colors.Gray400} transform={180} />}
						allowRangeSelection={true}
						selectedRangeStartStyle={{backgroundColor: colors.Primary}}
						selectedRangeStyle={{backgroundColor: colors.PointGreen3}}
						selectedRangeEndStyle={{backgroundColor: colors.Primary}}
						selectedDayColor={colors.Primary}
						selectedStartDate={selectedDateFlag || freeTicket ? selectStartDate.toDate() : undefined}
						selectedEndDate={
							(selectedDateFlag || freeTicket) && selectEndDate != null
								? selectEndDate.toDate()
								: undefined
						}
						allowBackwardRangeSelect={true}
						selectYearTitle='년도 선택'
					/>
				</CalendarContainer>
				<TimeContainer zIndexs={Platform.OS == 'ios' ? true : false}>
					{DaySelectInfoList.map((item, idx) => (
						<TimeItemContainer key={idx} zIndexs={Platform.OS == 'ios' ? true : false}>
							<PretendardSemiBoldText size={16} lineHeight={20.32} color={colors.Gray4}>
								{item.step}
							</PretendardSemiBoldText>
							<TimeBox
								onPress={() => {
									onPressTime(idx);
								}}>
								<HStack gap={widthPercentage(11)}>
									<PretendardSemiBoldText size={18} lineHeight={22.32} color={'#717D58'}>
										{item.day.format('YY.MM.DD')} ({weekdays[item.day.day()]})
									</PretendardSemiBoldText>
									<PretendardSemiBoldText size={18} lineHeight={22.32} color={'#E1F2BE'}>
										|
									</PretendardSemiBoldText>
									<HStack gap={widthPercentage(17)}>
										<PretendardSemiBoldText size={18} lineHeight={22.32} color={'#717D58'}>
											{timeLimitArray[idx] < 12 ? '오전' : '오후'}
										</PretendardSemiBoldText>
										<PretendardSemiBoldText size={18} lineHeight={22.32} color={'#717D58'}>
											{String(timeLimitArray[idx]).padStart(2, '0')}
										</PretendardSemiBoldText>
										<PretendardSemiBoldText size={18} lineHeight={22.32} color={'#717D58'}>
											:
										</PretendardSemiBoldText>
										<PretendardSemiBoldText size={18} lineHeight={22.32} color={'#717D58'}>
											{String(minuteLimitArray[idx]).padStart(2, '0')}
										</PretendardSemiBoldText>
									</HStack>
								</HStack>
							</TimeBox>
						</TimeItemContainer>
					))}
				</TimeContainer>
				<MarginContainder></MarginContainder>
				<Modal
					animationType={'fade'}
					transparent={true}
					visible={visible}
					onRequestClose={() => {
						setVisible(false);
					}}>
					<ModalBackground onPress={() => setVisible(false)}>
						<ModalBottomSheet flex={0.7}>
							<TimePickerModal
								visible={visible}
								onClose={() => setVisible(false)}
								onConfirm={({ampm, hour, minute}) => {
									console.log(`${ampm} ${hour}:${minute}`);
								}}
								minuteDivide={true}
								hour={timeLimitArray[dateFlag]}
								minute={minuteLimitArray[dateFlag] / 30}
								// leftText={'완료'}
								// leftFunction={() => {
								// 	setShow({status: true, step: 0});
								// }}
								rightText={'다음으로'}
								leftFunction={e => {
									let timeData = {
										hour: Number(e?.hour) % 12 == 0 ? Number(e?.hour) / 12 - 1 : Number(e?.hour),
										minute: e?.minute,
										ampm: e?.ampm,
									};
									handleConfirm(timeData);
								}}
								leftText={'완료'}
								rightFunction={e => {
									let timeData = {
										hour: Number(e?.hour) % 12 == 0 ? Number(e?.hour) / 12 - 1 : Number(e?.hour),
										minute: e?.minute,
										ampm: e.ampm,
									};
									handleTimeNext(timeData);
								}}
							/>
						</ModalBottomSheet>
					</ModalBackground>
				</Modal>
			</BackgroundGrayScrollView>
			<ButtonContainer>
				<RouteButton navigation={navigation} nextTitle='SelectDeparture' goNext={goNext}></RouteButton>
			</ButtonContainer>
		</>
	);
}
const CalendarContainer = styled.View`
	justify-content: center;
`;
const TimeBox = styled.Pressable`
	width: ${widthPercentage(327)}px;
	height: ${widthPercentage(81)}px;
	background-color: ${colors.PrimarySecondary};
	border-radius: 8px;
	align-items: center;
	justify-content: center;
	margin-bottom: ${widthPercentage(5)}px;
`;
const SelectAbsolute = styled.View`
	z-index: 3;
	position: absolute;
	bottom: -${heightPercentage(122)}px;
`;
export const SelectContainer = styled.Pressable<{backgroundColor?: string}>`
	width: ${widthPercentage(157)}px;
	height: ${heightPercentage(40)}px;
	background-color: ${props => props.backgroundColor ?? colors.backgroundWhite};
	border-radius: 12px;
	padding: 0px ${widthPercentage(16)}px;
	justify-content: center;
	margin-bottom: ${heightPercentage(6)}px;
`;
export const TimeContainer = styled.View<{zIndexs?: boolean}>`
	margin-top: ${heightPercentage(20)}px;
	${props => props.zIndexs && 'z-index:4'};
`;
export const TimeItemContainer = styled.View<{zIndexs?: boolean}>`
	width: 50%;
	gap: ${heightPercentage(10)}px;
	${props => props.zIndexs && 'z-index:4'};
`;
export const DayPressable = styled.Pressable`
	align-items: center;
	justify-content: center;
	height: 40px;
	margin: 5px 2px 0px 0px;
	flex-direction: row;
	border-bottom-width: 1px;
	border-bottom-color: ${colors.regionNormal};
`;
export const TimeStepText = styled(PretendardVariable)`
	color: ${colors.PointYellow};
	font-size: ${fontPercentage(12)}px;
	margin-left: ${widthPercentage(10)}px;
`;

const MarginBottom = styled.View`
	width: ${widthPercentage(375)}px;
	height: ${heightPercentage(60)}px;
`;
