import {useEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {colors} from '../../../utill/colors';
import {cityViewList} from '../../../utill/component/enroll-info/city-list';
import {
	FlexWrap,
	HStack,
	PretendardBoldText,
	PretendardSemiBoldText,
	PretendardVariableText,
	VStack,
} from '../../../utill/layout/layout';
import PlannerBottomSheet from '../../../utill/component/planner/bottom-sheet';
import CustomMapView from '../../../utill/component/timetable/mapView';
import moment from 'moment';
import {styled} from 'styled-components/native';
import {widthPercentage} from '../../../utill/layout/responsive-size';
import {SvgCheck, SvgRight, SVGRightAdd} from '../../../utill/svg/svg';
import {ModalBackground, ModalBottomSheet} from './regist-transit';
import TimePickerModal from '../../../utill/component/planner/date-picker';
import RouteButton from '../../../utill/component/route-button';
import {Modal, Pressable} from 'react-native';
import {travelSliceActions} from '../../../redux/travel-info/travel.slice';
import {View} from 'react-native';

export default function Planner({navigation}: any) {
	const {travelName, region, cityIndex, country, day, nDay, timetable} = useAppSelector(state => state.travelSlice);
	const balanceIndex = 2;
	useEffect(() => {
		navigation.setOptions({
			headerRight: () => <></>,
			headerTitle: () => (
				<VStack>
					<PretendardVariableText
						size={16}
						lineHeight={20}
						color={colors.Black}
						style={{textAlign: 'center'}}>
						{(region[0] == '전체' ? cityViewList[country][cityIndex].title : region[0]) +
							' ' +
							(nDay == 0 ? '당일치기' : nDay + '박' + (nDay + 1) + '일') +
							' ' +
							travelName}
					</PretendardVariableText>
					<PretendardVariableText
						size={12}
						lineHeight={16}
						color={colors.Gray4}
						style={{textAlign: 'center'}}>
						{moment(day[0]).format('YYYY/MM/DD') + ' ~ ' + moment(day[nDay]).format('YYYY/MM/DD')}
					</PretendardVariableText>
				</VStack>
			),
		});
	}, [travelName, region, country, cityIndex, nDay]);
	const select = '';
	const [popUpIsActive, setPopUpIsActive] = useState(false);
	const [step, setStep] = useState(0);
	const [show, setShow] = useState(false);
	const [startTime, setStartTime] = useState({});
	const allApply = useRef({});
	const dispatch = useAppDispatch();
	const handleStartTime = e => {
		let ampm = e.ampm == '오전' ? 0 : 24;
		let hours = (Number(e.hour) - 6) * 2;
		let minute = Number(e.minute) / 30;
		let copy = [...startTime];
		let gap = ampm + hours + minute - copy[step - balanceIndex]?.time;
		copy[step - balanceIndex] = {time: ampm + hours + minute, choose: true};
		if (timetable[step - balanceIndex].length != 0) {
			let timetableCopy = [...timetable];
			let newTimetable = timetableCopy[step - balanceIndex].map(item =>
				item?.y == 36 ? item : {...item, y: item?.y + gap},
			);
			timetableCopy[step - balanceIndex] = newTimetable;
			dispatch(travelSliceActions.changeTimetable(timetableCopy));
		}
		setStartTime(copy);
		setShow(false);
	};
	const handleAllApply = e => {
		allApply.current = true;

		let ampm = e.ampm == '오전' ? 0 : 24;
		let hours = (Number(e.hour) - 6) * 2;
		let minute = Number(e.minute) / 30;
		setStartTime(
			Array.from({length: nDay + 1}, () => {
				return {tiem: ampm + hours + minute, choose: true};
			}),
		);

		setShow(false);
	};
	useEffect(() => {
		step - balanceIndex >= 0 && !startTime[step - balanceIndex]?.choose && setShow(true);
	}, [step, startTime]);
	useEffect(() => {
		setStartTime(
			Array.from({length: nDay + 1}, () => {
				return {time: 6, choose: false};
			}),
		);
	}, [nDay]);
	const colorReturn = (nowIndex: number, step: number) => {
		let color = colors.backgroundWhite;
		if (nowIndex >= step) {
			color = colors.backgroundWhite;
		} else if (nowIndex == 0) {
			color = colors.Blue1;
		} else if (nowIndex == 1) {
			color = colors.Pink1;
		} else {
			color = colors.Green4;
		}

		return color;
	};
	const radiusColorReturn = (nowIndex: number, step: number) => {
		let color = colors.backgroundWhite;
		if (nowIndex <= step) {
			if (nowIndex == 0) {
				color = colors.Blue1;
			} else if (nowIndex == 1) {
				color = colors.Pink1;
			} else {
				color = colors.Green4;
			}
		}
		return color;
	};
	const handleClose = () => {
		setPopUpIsActive(false);
	};
	const stepList = ['교통', '숙소', ...Array(nDay + 1).fill('1')];
	return (
		<View style={{flex: 1, zIndex: 0}}>
			<StepPopUp
				isActive={popUpIsActive}
				onPress={() => {
					setPopUpIsActive(!popUpIsActive);
				}}>
				<FlexWrapScrollView>
					{stepList.map(
						(item, idx) =>
							item.length != 0 && (
								<StepTouchable
									disabled={!popUpIsActive}
									onPress={() => {
										setStep(idx);
									}}>
									<PretendardSemiBoldText
										size={18}
										lineHeight={23}
										color={idx == step ? colors.Black : colors.backgroundWhite}
										deco={'margin-right:15px;'}
										numberOfLines={1}>
										{idx <= 1 ? item : idx - 1 + ' 일차'}
									</PretendardSemiBoldText>
									{idx == 0 && (
										<Pressable
											onPress={() => {
												setPopUpIsActive(!popUpIsActive);
											}}>
											<SVGRightAdd
												transform={popUpIsActive ? -90 : 90}
												color={'rgba(0,0,0,0.3)'}
											/>
										</Pressable>
									)}
								</StepTouchable>
							),
					)}
				</FlexWrapScrollView>
			</StepPopUp>
			<CustomMapView
				select={step - balanceIndex < 0 ? '' : step - balanceIndex}
				onTouchStart={false}
				onTouchEnd={() => {}}
			/>
			<PlannerBottomSheet
				navigation={navigation}
				step={step}
				setStep={setStep}
				setShow={setShow}
				show={show}
				startTime={startTime}
				handleClose={handleClose}
			/>
			<Modal
				animationType={'fade'}
				transparent={true}
				visible={show}
				onRequestClose={() => {
					setShow(false);
				}}>
				<ModalBackground onPress={() => setShow(false)}>
					<ModalBottomSheet>
						<PretendardVariableText size={20} lineHeight={24} color={colors.Title}>
							{step - 1}일 차 일정, 몇시에 시작할까요?
						</PretendardVariableText>
						<TimePickerModal
							visible={show}
							navigation={navigation}
							minuteDivide={true}
							onClose={() => setShow(false)}
							onConfirm={handleStartTime}
							handleAllApply={handleAllApply}
							hour={Math.floor(((startTime[step - balanceIndex]?.time ?? 0) * 30 + 360) / 60)}
							minute={((startTime[step - balanceIndex]?.time ?? 0) * 30 + 360) % 60}
						/>
						{/* <RouteButton
							navigation={navigation}
							type={'planner'}
							leftText={'전체 일정에 적용하기'}
							LeftBtnFunction={() => {
								handleAllApply();
							}}
							nextText={'완료'}></RouteButton> */}
					</ModalBottomSheet>
				</ModalBackground>
			</Modal>
		</View>
	);
}
const StepPopUp = styled.TouchableOpacity<{isActive: boolean}>`
	width: ${props => widthPercentage(100)}px;
	max-height: ${props => widthPercentage(props.isActive ? 200 : 46)}px;
	border-radius: 22px;
	background-color: rgba(255, 255, 255, 0.5);
	position: absolute;
	left: ${widthPercentage(268)}px;
	top: ${widthPercentage(8)}px;

	z-index: 102;
	align-item: center;
	justify-content: center;
	align-self: flex-end;
`;
const Circle = styled.TouchableOpacity<{color: string; borderColor: string}>`
	width: ${widthPercentage(30)}px;
	height: ${widthPercentage(30)}px;
	border-radius: 99px;
	background-color: ${props => (props.color == '#ccc' ? 'white' : props.color)};
	border-color: ${props => props.borderColor};
	border-width: 3px;
	margin-bottom: 8px;
	align-items: center;
	justify-content: center;
`;

const HorizontalBar = styled.View<{a: number; nDay: number}>`
	width: ${props => widthPercentage((30 + props.a * 2) * (props.nDay + 2))}px;
	height: ${widthPercentage(2)}px;
	background-color: ${colors.backgroundWhite};
	position: absolute;
	left: ${props => props.a}px;
	top: ${widthPercentage(37.5)}px;
`;
const ArrowBox = styled.Pressable`
	position: absolute;
	top: 10px;
	left: ${widthPercentage(344)}px;
`;
const FlexWrapScrollView = styled.ScrollView`
	max-height: ${widthPercentage(190)}px;
`;
const StepTouchable = styled(HStack).attrs({as: Pressable})`
	width: ${widthPercentage(100)}px;
	align-items: center;
	padding: 0px 0px 0px ${widthPercentage(25)}px;
	margin-top: 15px;
	margin-bottom: 10px;
`;
