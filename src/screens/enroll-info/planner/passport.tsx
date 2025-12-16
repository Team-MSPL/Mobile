import {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {styled} from 'styled-components/native';
import {colors} from '../../../utill/colors';
import {PretendardSemiBoldText, VStack} from '../../../utill/layout/layout';
import {heightPercentage, widthPercentage} from '../../../utill/layout/responsive-size';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {getPassport, travelSliceActions, udpatePassport} from '../../../redux/travel-info/travel.slice';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {MarginContainer} from '../../timetable/preset-detail';
import {LoadingSliceActions} from '../../../redux/loading/loading.slice';
export default function Passport({navigation}: any) {
	const dispatch = useAppDispatch();
	const {passport} = useAppSelector(state => state.travelSlice);
	const [form, setForm] = useState({...passport});

	const handleChange = (key, value) => {
		setForm({...form, [key]: value});
	};
	const handleSave = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			await dispatch(udpatePassport(form));
			dispatch(
				travelSliceActions.updateFiled({
					field: 'passport',
					value: form,
				}),
			);
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '저장되었습니다',
					modalFunction: () => {
						navigation.goBack();
					},
					modalSingleUse: true,
				}),
			);
		} catch (e) {
			console.log(e);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const inputFields = [
		{key: 'korName', label: '이름', placeholder: '홍길동'},
		{key: 'engFirstName', label: '영문 이름', placeholder: 'gildong'},
		{key: 'engLastName', label: '영문 성', placeholder: 'hong'},

		{key: 'country', label: '국가', placeholder: '대한민국'},

		{key: 'passportNum', label: '여권번호', placeholder: 'M12312312'},
		{key: 'gender', label: '성별', placeholder: '남'},
		{key: 'birthday', label: '생년월일', placeholder: 'YYYY-MM-DD'},
		{key: 'passportIssueDate', label: '여권 발행일', placeholder: 'YYYY-MM-DD'},
		{key: 'passportExpirationDate', label: '여권 만료일', placeholder: 'YYYY-MM-DD'},
		{key: 'passportCountry', label: '여권 발행국', placeholder: '대한민국'},
		// {key: 'passportImage', label: '여권 발행국', placeholder: '대한민국'},
		// {key: '_id', label: '아이디', placeholder: '대한민국'},
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
					직접 입력 후,{`\n`}등록하기 전에 한번 더 확인해 주세요.
				</PretendardSemiBoldText>
				{inputFields.map((item, idx) => (
					<VStack deco='margin-vertical:10px;gap:10px;'>
						<PretendardSemiBoldText size={16} lineHeight={21} color={colors.Gray4}>
							{item.label}
						</PretendardSemiBoldText>
						<InputBox
							placeholder={item?.placeholder}
							style={{color: colors.Black}}
							keyboardType={item?.keyboardType || 'default'}
							value={form[item.key]}
							onChangeText={text => handleChange(item.key, text)}></InputBox>
					</VStack>
				))}
				<MarginContainer />
			</KeyboardAwareScrollView>
			<SaveButton onPress={handleSave}>
				<PretendardSemiBoldText size={16} lineHeight={21} color={colors.backgroundWhite}>
					입력완료
				</PretendardSemiBoldText>
			</SaveButton>
		</>
	);
}
const SaveButton = styled.TouchableOpacity`
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(52)}px;
	border-radius: 8px;
	background-color: #2e3240;
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
