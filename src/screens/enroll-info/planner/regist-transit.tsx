import {useEffect, useState} from 'react';
import {Modal, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {styled} from 'styled-components/native';
import {colors} from '../../../utill/colors';
import CustomButton from '../../../utill/component/custom-button';
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
	const [select, setSelect] = useState('outbound');
	const [show, setShow] = useState(false);
	const [transportInfo, setTransportInfo] = useState({
		outbound: {
			departureAirport: '', //출밢녀
			departureTime: '', //출발시간
			arrivalAirport: '', //도착편
			arrivalTime: '', //도착시간
			airline: '', //항공사혹은 기차번호
			reservationNumber: '', //에약번호
		},
		inbound: {
			departureAirport: '',
			departureTime: '',
			arrivalAirport: '',
			arrivalTime: '',
			airline: '',
			reservationNumber: '',
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
					value={
						select == 'outbound'
							? transportInfo.outbound.departureAirport
							: transportInfo.inbound.departureAirport
					}
					onChangeText={e => handleFlightChange(select, 'departureAirport', e)}
					placeholder={route.params.title == 'train' ? '출발역' : '출발 공항'}
					placeholderTextColor={colors.Gray400}></InputBox>
				<HStack justifyContent='center' gap={widthPercentage(30)}>
					<TouchableHstack gap={10} onPress={() => setShow(true)}>
						<SvgCalendarIcon width={widthPercentage(15)} height={widthPercentage(15)} />
						<PretendardSemiBoldText size={15} lineHeight={19} color={colors.PointYellow}>
							2020.02.04(화)
						</PretendardSemiBoldText>
					</TouchableHstack>
					<TouchableHstack gap={10}>
						<SVGClock width={widthPercentage(15)} height={widthPercentage(15)} />
						<PretendardSemiBoldText size={15} lineHeight={19} color={colors.PointYellow}>
							오전 9:00
						</PretendardSemiBoldText>
					</TouchableHstack>
				</HStack>
			</VStack>
			<VStack gap={15} deco={`margin-bottom:${widthPercentage(20)}px;`}>
				<PretendardSemiBoldText size={16} lineHeight={20} color={colors.Gray4}>
					도착
				</PretendardSemiBoldText>
				<InputBox
					value={
						select == 'outbound'
							? transportInfo.outbound.arrivalAirport
							: transportInfo.inbound.arrivalAirport
					}
					onChangeText={e => handleFlightChange(select, 'arrivalAirport', e)}
					placeholder={route.params.title == 'train' ? '도착역' : '도착 공항'}></InputBox>
				<HStack justifyContent='center' gap={widthPercentage(30)}>
					<TouchableHstack gap={10}>
						<SvgCalendarIcon width={widthPercentage(15)} height={widthPercentage(15)} />
						<PretendardSemiBoldText size={15} lineHeight={19} color={colors.PointYellow}>
							2020.02.04(화)
						</PretendardSemiBoldText>
					</TouchableHstack>
					<TouchableHstack gap={10}>
						<SVGClock width={widthPercentage(15)} height={widthPercentage(15)} />
						<PretendardSemiBoldText size={15} lineHeight={19} color={colors.PointYellow}>
							오전 9:00
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
					placeholderTextColor={colors.Gray400}></InputBox>
				<InputBox
					placeholder={route.params.title == 'train' ? '호차 번호' : '예약 번호'}
					placeholderTextColor={colors.Gray400}></InputBox>
			</VStack>
			<CustomButton
				marginTop={20}
				marginBottom={20}
				label={'등록하기'}
				onPress={() => {}}
				bgColor={colors.Gray5}
				textColor={colors.Gray200}></CustomButton>
			<Modal
				animationType={'fade'}
				transparent={true}
				visible={show}
				onRequestClose={() => {
					setShow(false);
				}}>
				<ModalBackground onPress={() => setShow(false)}>
					<ModalBottomSheet>
						<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
							오전 9:00
						</PretendardSemiBoldText>
						<TimePickerModal
							visible={show}
							onClose={() => setShow(false)}
							onConfirm={({ampm, hour, minute}) => {
								console.log(`${ampm} ${hour}:${minute}`);
							}}
						/>
						<RouteButton
							navigation={navigation}
							type={'planner'}
							leftText={'완료'}
							nextText={'다음으로'}></RouteButton>
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
const ModalBackground = styled.Pressable`
	flex: 1;
	background-color: rgba(0, 0, 0, 0.4);
	align-item: center;
	justify-content: flex-end;
`;
const ModalBottomSheet = styled.Pressable`
	flex: 0.6;
	background-color: ${colors.backgroundWhite};
	border-top-right-radius: 30px;
	border-top-left-radius: 30px;
	align-items: center;
	justify-content: center;
`;
