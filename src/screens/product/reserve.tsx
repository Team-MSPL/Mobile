import {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {styled} from 'styled-components/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useAppDispatch, useAppSelector} from '../../redux';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {colors} from '../../utill/colors';
import {HStack, PretendardSemiBoldText, PretendardVariableText, VStack} from '../../utill/layout/layout';
import {MarginContainer} from '../timetable/preset-detail';
import {useRoute} from '@react-navigation/native';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {SvgCalendar, SvgCalendarIcon, SVGCalendarRecommend, SVGClock, SVGPeople} from '../../utill/svg/svg';
export default function Reserve({navigation}: any) {
	const dispatch = useAppDispatch();
	const {passport} = useAppSelector(state => state.travelSlice);
	const [form, setForm] = useState({});
	const route = useRoute();
	const {data} = route.params;

	const handleChange = (key, value) => {
		console.log(data);
		setForm({...form, [key]: value});
	};

	const handleSave = async () => {
		// try {
		// 	dispatch(LoadingSliceActions.onLoading());
		// 	await dispatch(udpatePassport(form));
		// 	dispatch(
		// 		travelSliceActions.updateFiled({
		// 			field: 'passport',
		// 			value: form,
		// 		}),
		// 	);
		// 	dispatch(
		// 		modalSliceActions.setOpenModal({
		// 			modalTitle: '저장되었습니다',
		// 			modalFunction: () => {
		// 				navigation.goBack();
		// 			},
		// 			modalSingleUse: true,
		// 		}),
		// 	);
		// } catch (e) {
		// 	console.log(e);
		// } finally {
		// 	dispatch(LoadingSliceActions.offLoading());
		// }
	};
	const inputFields = [
		{key: 'engLastName', label: '영문 이름', placeholder: 'gildong'},
		{key: 'engFirstName', label: '영문 성', placeholder: 'hong'},

		// {key: 'country', label: '국가', placeholder: '대한민국'},

		{key: 'email', label: '이메일', placeholder: 'asdasd@asd.com'},
		{key: 'tel', label: '전화번호', placeholder: '010-1234-5678'},
	];

	return (
		<>
			<KeyboardAwareScrollView
				style={{
					flex: 1,
					backgroundColor: colors.backgroundWhite,
				}}
				contentContainerStyle={{
					paddingHorizontal: widthPercentage(24),
					paddingBottom: heightPercentage(40),
				}}
				keyboardShouldPersistTaps='handled'
				enableOnAndroid={true}
				extraScrollHeight={Platform.OS === 'ios' ? 20 : 200}
				enableAutomaticScroll={true}
				showsVerticalScrollIndicator={false}>
				<PretendardSemiBoldText
					size={20}
					lineHeight={27}
					color={colors.Black}
					deco={`text-align:center;margin-bottom:10px;`}>
					예약자 정보
				</PretendardSemiBoldText>
				<InfoContainer>
					<ImgBox source={{uri: data?.image}}></ImgBox>
					<PretendardSemiBoldText
						size={18}
						lineHeight={23}
						color={colors.Black}
						deco={'margin-top:10px;margin-bottom:10px;'}>
						{data?.name}
					</PretendardSemiBoldText>
					<HStack justifyContent='space-between'>
						<HStack>
							<SvgCalendar />
							<PretendardSemiBoldText
								size={16}
								lineHeight={21}
								color={colors.Black}
								deco={'margin-top:10px;margin-bottom:10px;'}>
								{data?.s_date}
							</PretendardSemiBoldText>
						</HStack>
						<HStack>
							<SVGPeople />
							<PretendardSemiBoldText
								size={18}
								lineHeight={23}
								color={colors.Black}
								deco={'margin-top:10px;margin-bottom:10px;'}>
								갯수 {data?.skus[0]?.qty}
							</PretendardSemiBoldText>
						</HStack>
					</HStack>
				</InfoContainer>
				{inputFields.map((item, idx) => (
					<VStack deco='margin-vertical:10px;gap:10px;' key={idx}>
						<PretendardSemiBoldText size={16} lineHeight={21} color={colors.Black}>
							{item.label}
						</PretendardSemiBoldText>
						<InputBox
							placeholder={item?.placeholder}
							keyboardType={item?.keyboardType || 'default'}
							value={form[item.key]}
							onChangeText={text => handleChange(item.key, text)}></InputBox>
					</VStack>
				))}
				<PretendardSemiBoldText size={14} lineHeight={18} color={colors.PointYellow}>
					입력하신 이메일과 전화번호는 주문 내역 및 바우처 전달을 위해 사용됩니다.
				</PretendardSemiBoldText>
				<MarginContainer />
			</KeyboardAwareScrollView>
			<SaveButton
				disabled={inputFields.length != Object.entries(form).length}
				isActive={inputFields.length != Object.entries(form).length}
				onPress={() => {
					navigation.navigate('PaymentStack', {info: {value: data?.total_price, name: 'asd'}});
					console.log({...data, ...form});
				}}>
				<PretendardSemiBoldText size={16} lineHeight={21} color={colors.backgroundWhite}>
					{data?.total_price?.toLocaleString('ko')}원 결제하기
				</PretendardSemiBoldText>
			</SaveButton>
		</>
	);
}
const SaveButton = styled.TouchableOpacity<{isActive: boolean}>`
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(52)}px;
	border-radius: 8px;
	background-color: ${props => (props.isActive ? 'rgba(0,0,0,0.3)' : '#2e3240')};
	align-items: center;
	justify-content: center;
	position: absolute;
	bottom: 20px;
	align-self: center;
`;
const InputBox = styled.TextInput`
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(52)}px;
	border-radius: 8px;
	border-width: 1px;
	border-color: ${colors.Gray200};
	padding: ${heightPercentage(15)}px;
	font-size: 16px;
`;
const ImgBox = styled.Image`
	width: ${widthPercentage(279)}px;
	height: ${heightPercentage(108)}px;
	border-radius: 8px;
`;
const InfoContainer = styled.View`
	width: ${widthPercentage(327)}px;
	padding: ${widthPercentage(24)}px;
	border-color: ${colors.Gray2};
	border-radius: 8px;
	background-color: ${colors.backgroundWhite};
`;
