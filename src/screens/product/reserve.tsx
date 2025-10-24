import {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {styled} from 'styled-components/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useAppDispatch, useAppSelector} from '../../redux';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {handleBookingField, travelSliceActions} from '../../redux/travel-info/travel.slice';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {colors} from '../../utill/colors';
import {HStack, PretendardSemiBoldText, PretendardVariableText, VStack} from '../../utill/layout/layout';
import {MarginContainer} from '../timetable/preset-detail';
import {useRoute} from '@react-navigation/native';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {SvgCalendar, SvgCalendarIcon, SVGCalendarRecommend, SVGClock, SVGPeople} from '../../utill/svg/svg';
import DropDownPicker from 'react-native-dropdown-picker';
import {View} from 'react-native';
import {TextWall} from './reserve-detail';
import {Keyboard} from 'react-native';
import {logEvent} from '../../../firebaseAnalytice';
export default function Reserve({navigation}: any) {
	const dispatch = useAppDispatch();
	const {passport} = useAppSelector(state => state.travelSlice);
	const {userId} = useAppSelector(state => state.userSlice);
	const [form, setForm] = useState({cus_type: 'cus_01'});
	const [sendForm, setSendForm] = useState({cus_type: 'send'});
	const route = useRoute();
	const {data} = route.params;

	const handleChange = (key, value) => {
		console.log(data);
		setForm({...form, [key]: value});
	};
	const handleSendChange = (key, value) => {
		console.log(data);
		setSendForm({...sendForm, [key]: value});
	};
	const [contactData, setContactData] = useState({cus_type: 'contact'});
	const handleChange1 = (key, value) => {
		console.log(data);
		setContactData({...contactData, [key]: value});
	};

	const [customData, setCustomData] = useState([]);
	const handleCustomChange = (key, value, index) => {
		setCustomData(prev => {
			// 이전 상태를 복사
			const updated = [...prev];

			// 해당 index에 객체가 없으면 초기화
			if (!updated[index]) {
				updated[index] = {};
			}

			// 키-값 업데이트
			updated[index] = {
				...updated[index],
				[key]: value,
			};

			return updated;
		});
	};
	const inputFields = [
		{key: 'native_first_name', label: '영문 이름', placeholder: 'gildong'},
		{key: 'native_last_name', label: '영문 성', placeholder: 'hong'},

		// {key: 'country', label: '국가', placeholder: '대한민국'},

		{key: 'buyer_Email', label: '이메일', placeholder: 'asdasd@asd.com'},
		{key: 'buyer_tel_number', label: '전화번호', placeholder: '01012345678', keyboardType: 'number-pad', max: 11},
	];
	const [customType, setCustomType] = useState(null);
	const handleField = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			console.log(data);
			const a = await dispatch(handleBookingField(data)).unwrap();
			console.log(a?.traffics);
			setCustomType(a);
			if (a?.result_msg != 'OK' || a?.traffics?.length != 0) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '해당 패키지가 판매를 중단하였습니다',
						modalSingleUse: true,
						modalTopText: '확인',
					}),
				);
				navigation.goBack();
			}
			console.log(a?.custom?.cus_type);
		} catch (e) {
			console.log(e);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	useEffect(() => {
		handleField();
	}, []);
	const [open, setOpen] = useState({status: false, idx: 0, name: ''});
	const [value, setValue] = useState(null);
	const [haveApp, setHaveapp] = useState(false);
	const [items, setItems] = useState([
		{label: 'Apple', value: 'apple'},
		{label: 'Banana', value: 'banana'},
		{label: 'Pear', value: 'pear'},
	]);
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

				{customType?.custom?.cus_type?.use?.includes('cus_01') && (
					<HStack deco={'margin-top:30px;'} gap={5}>
						<TextWall />
						<PretendardSemiBoldText size={20} lineHeight={27} color={colors.Black}>
							구매자 정보
						</PretendardSemiBoldText>
					</HStack>
				)}

				{customType?.custom?.cus_type?.use?.includes('contact') &&
					Object.entries(customType?.custom)
						?.filter(([key, value]) => !key.includes('cus_type'))
						.map(
							([item, value], idx) =>
								value?.use?.includes('cus_01') && (
									<VStack deco='margin-vertical:10px;gap:10px;' key={idx}>
										<PretendardSemiBoldText size={16} lineHeight={21} color={colors.Black}>
											{fieldMap?.[item]?.ko}
										</PretendardSemiBoldText>
										{value?.type == 'list' ? (
											<DropDownPicker
												open={open?.status && open?.name == item}
												value={form?.[item]}
												items={value?.list_option
													?.filter(filItem => filItem?.supported ?? true)
													?.map(item => ({
														value: item?.code ?? item?.app_type,
														label: item?.name ?? item?.info ?? item?.app_name,
													}))}
												setOpen={e => {
													console.log(value?.list_option);
													Keyboard.dismiss();
													setOpen({
														status: !open.status,
														idx: 0,
														name: item,
													});
												}}
												dropDownDirection={'TOP'}
												listMode={'SCROLLVIEW'}
												setValue={callback => {
													const nextValue = callback(value);
													console.log(value);
													handleChange1(item, nextValue);
												}}
												setItems={setItems}
												placeholder={'선택'}
											/>
										) : value?.type == 'bool' ? (
											<DropDownPicker
												open={haveApp}
												value={form?.[item]}
												items={[
													{label: '있음', value: true},
													{label: '없음', value: false},
												]}
												setOpen={e => {
													Keyboard.dismiss();
													setHaveapp(!haveApp);
												}}
												dropDownDirection={'TOP'}
												listMode={'SCROLLVIEW'}
												setValue={callback => {
													const nextValue = callback(value);
													console.log(value);
													handleChange(item, nextValue);
												}}
												setItems={setItems}
												placeholder={'선택'}
											/>
										) : (
											<InputBox
												placeholder={fieldMap?.[item]?.exam}
												keyboardType={item?.keyboardType || 'default'}
												value={form?.[item]}
												maxLength={item?.max || undefined}
												onChangeText={text => handleChange(item, text)}
												// onChangeText={text => handleChange(item.key, text)}
											></InputBox>
										)}
									</VStack>
								),
						)}

				{inputFields.map((item, idx) => (
					<VStack deco='margin-vertical:10px;gap:10px;' key={idx}>
						<PretendardSemiBoldText size={16} lineHeight={21} color={colors.Black}>
							{item.label}
						</PretendardSemiBoldText>
						<InputBox
							placeholder={item?.placeholder}
							keyboardType={item?.keyboardType || 'default'}
							value={form[item.key]}
							maxLength={item?.max || undefined}
							onChangeText={text => handleChange(item.key, text)}></InputBox>
					</VStack>
				))}
				{customType?.custom?.cus_type?.use?.includes('cus_01') &&
					Object.entries(customType?.custom)
						?.filter(([key, value]) => !key.includes('cus_type'))
						.map(
							([item, value], idx) =>
								value?.use?.includes('cus_01') && (
									<VStack deco='margin-vertical:10px;gap:10px;' key={idx}>
										<PretendardSemiBoldText size={16} lineHeight={21} color={colors.Black}>
											{fieldMap?.[item]?.ko}
										</PretendardSemiBoldText>
										{value?.type == 'list' ? (
											<DropDownPicker
												open={open?.status && open?.name == item}
												value={form?.[item]}
												items={value?.list_option?.map(item => ({
													value: item?.code ?? item?.id,
													label: item?.name,
												}))}
												setOpen={e => {
													Keyboard.dismiss();
													setOpen({
														status: !open.status,
														idx: 0,
														name: item,
													});
												}}
												dropDownDirection={'TOP'}
												listMode={'SCROLLVIEW'}
												setValue={callback => {
													const nextValue = callback(value);
													console.log(value);
													handleChange(item, nextValue);
												}}
												setItems={setItems}
												placeholder={'선택'}
											/>
										) : (
											<InputBox
												placeholder={fieldMap?.[item]?.exam}
												keyboardType={item?.keyboardType || 'default'}
												value={form?.[item]}
												maxLength={item?.max || undefined}
												onChangeText={text => handleChange(item, text)}
												// onChangeText={text => handleChange(item.key, text)}
											></InputBox>
										)}
									</VStack>
								),
						)}
				{customType?.custom?.cus_type?.use?.includes('send') &&
					Object.entries(customType?.custom)
						?.filter(([key, value]) => !key.includes('cus_type'))
						.map(
							([item, value], idx) =>
								value?.use?.includes('send') && (
									<VStack deco='margin-vertical:10px;gap:10px;' key={idx}>
										<PretendardSemiBoldText size={16} lineHeight={21} color={colors.Black}>
											{fieldMap?.[item]?.ko}
										</PretendardSemiBoldText>
										{value?.type == 'list' ? (
											<DropDownPicker
												open={open?.status && open?.name == item}
												value={sendForm?.[item]}
												items={value?.list_option?.map(item => ({
													value: item?.code ?? item?.id,
													label: item?.name,
												}))}
												setOpen={e => {
													Keyboard.dismiss();
													setOpen({
														status: !open.status,
														idx: 0,
														name: item,
													});
												}}
												dropDownDirection={'TOP'}
												listMode={'SCROLLVIEW'}
												setValue={callback => {
													const nextValue = callback(value);
													console.log(value);
													handleSendChange(item, nextValue);
												}}
												setItems={setItems}
												placeholder={'선택'}
											/>
										) : (
											<InputBox
												placeholder={fieldMap?.[item]?.exam}
												keyboardType={item?.keyboardType || 'default'}
												value={sendForm?.[item]}
												maxLength={item?.max || undefined}
												onChangeText={text => handleSendChange(item, text)}
												// onChangeText={text => handleChange(item.key, text)}
											></InputBox>
										)}
									</VStack>
								),
						)}
				{customType?.custom?.cus_type?.use?.includes('cus_02') && (
					<HStack deco={'margin-top:30px;'} gap={5}>
						<TextWall />
						<PretendardSemiBoldText size={20} lineHeight={27} color={colors.Black}>
							이용자 정보
						</PretendardSemiBoldText>
					</HStack>
				)}
				{customType?.custom?.cus_type?.use?.includes('cus_02') &&
					Array(data?.skus[0]?.qty)
						?.fill('')
						.map((datItem, dataIndex) => (
							<CustomerBox>
								<PretendardSemiBoldText size={20} lineHeight={27} color={colors.Black}>
									여행자 {dataIndex + 1}
								</PretendardSemiBoldText>
								{Object.entries(customType?.custom)
									?.filter(([key, value]) => !key.includes('cus_type'))
									.map(
										([item, value], idx) =>
											value?.use?.includes('cus_02') && (
												<VStack deco='margin-vertical:10px;gap:10px;' key={idx}>
													<PretendardSemiBoldText
														size={16}
														lineHeight={21}
														color={colors.Black}>
														{fieldMap?.[item]?.ko}
													</PretendardSemiBoldText>
													{value?.type == 'list' ? (
														<DropDownPicker
															open={
																open?.status &&
																open?.idx == dataIndex &&
																open?.name == item
															}
															value={customData[dataIndex]?.[item]}
															items={value?.list_option?.map(item => ({
																value: item?.code ?? item?.id,
																label: item?.name,
															}))}
															setOpen={e => {
																Keyboard.dismiss();
																setOpen({
																	status: !open.status,
																	idx: dataIndex,
																	name: item,
																});
															}}
															dropDownDirection={'TOP'}
															listMode={'SCROLLVIEW'}
															setValue={callback => {
																const nextValue = callback(value);
																console.log(value);
																handleCustomChange(item, nextValue, dataIndex);
															}}
															setItems={setItems}
															placeholder={'선택'}
														/>
													) : (
														<InputBox
															placeholder={fieldMap?.[item]?.exam}
															keyboardType={item?.keyboardType || 'default'}
															value={customData[dataIndex]?.[item]}
															maxLength={item?.max || undefined}
															onChangeText={text =>
																handleCustomChange(item, text, dataIndex)
															}
															// onChangeText={text => handleChange(item.key, text)}
														></InputBox>
													)}
												</VStack>
											),
									)}
							</CustomerBox>
						))}
				{customType?.custom?.cus_type?.use?.includes('contact') && (
					<HStack deco={'margin-top:30px;'} gap={5}>
						<TextWall />
						<PretendardSemiBoldText size={20} lineHeight={27} color={colors.Black}>
							여행 중 연락수단
						</PretendardSemiBoldText>
					</HStack>
				)}
				{customType?.custom?.cus_type?.use?.includes('contact') &&
					Object.entries(customType?.custom)
						?.filter(([key, value]) => !key.includes('cus_type'))
						?.filter(([key, value]) =>
							contactData?.['have_app'] ? true : !['contact_app_account', 'contact_app'].includes(key),
						)
						.map(
							([item, value], idx) =>
								value?.use?.includes('contact') && (
									<VStack deco='margin-vertical:10px;gap:10px;' key={idx}>
										<PretendardSemiBoldText size={16} lineHeight={21} color={colors.Black}>
											{fieldMap?.[item]?.ko}
										</PretendardSemiBoldText>
										{value?.type == 'list' ? (
											<DropDownPicker
												open={open?.status && open?.name == item}
												value={contactData?.[item]}
												items={value?.list_option
													?.filter(filItem => filItem?.supported ?? true)
													?.map(item => ({
														value: item?.code ?? item?.app_type,
														label: item?.name ?? item?.info ?? item?.app_name,
													}))}
												setOpen={e => {
													console.log(value?.list_option);
													Keyboard.dismiss();
													setOpen({
														status: !open.status,
														idx: 0,
														name: item,
													});
												}}
												dropDownDirection={'TOP'}
												listMode={'SCROLLVIEW'}
												setValue={callback => {
													const nextValue = callback(value);
													console.log(value);
													handleChange1(item, nextValue);
												}}
												setItems={setItems}
												placeholder={'선택'}
											/>
										) : value?.type == 'bool' ? (
											<DropDownPicker
												open={haveApp}
												value={contactData?.[item]}
												items={[
													{label: '있음', value: true},
													{label: '없음', value: false},
												]}
												setOpen={e => {
													Keyboard.dismiss();
													setHaveapp(!haveApp);
												}}
												dropDownDirection={'TOP'}
												listMode={'SCROLLVIEW'}
												setValue={callback => {
													const nextValue = callback(value);
													console.log(value);
													handleChange1(item, nextValue);
												}}
												setItems={setItems}
												placeholder={'선택'}
											/>
										) : (
											<InputBox
												placeholder={fieldMap?.[item]?.exam}
												keyboardType={item?.keyboardType || 'default'}
												value={contactData?.[item]}
												maxLength={item?.max || undefined}
												onChangeText={text => handleChange1(item, text)}
												// onChangeText={text => handleChange(item.key, text)}
											></InputBox>
										)}
									</VStack>
								),
						)}
				{customType?.custom?.cus_type?.use?.includes('traffics') && (
					<HStack deco={'margin-top:30px;'} gap={5}>
						<TextWall />
						<PretendardSemiBoldText size={20} lineHeight={27} color={colors.Black}>
							픽업 정보
						</PretendardSemiBoldText>
					</HStack>
				)}
				{customType?.guide_lang?.is_require && customType?.guide_lang?.is_visible && (
					<View
						style={{
							flex: 1,
							zIndex: 20,
							marginVertical: 10,
						}}>
						<PretendardSemiBoldText
							size={16}
							lineHeight={21}
							color={colors.Black}
							deco={'margin-bottom:10px;'}>
							가이드 언어
						</PretendardSemiBoldText>
						<DropDownPicker
							open={open.status && open.name == 'lang'}
							value={value}
							items={customType?.guide_lang?.list_option?.map(item => ({
								value: item?.code,
								label: item?.name,
							}))}
							setOpen={() => {
								setOpen({status: !open.status, idx: 0, name: 'lang'});
							}}
							setValue={setValue}
							setItems={setItems}
							placeholder={'안내 언어'}
						/>
					</View>
				)}
				<PretendardSemiBoldText size={14} lineHeight={18} color={colors.PointYellow}>
					입력하신 이메일과 전화번호는 주문 내역 및 바우처 전달을 위해 사용됩니다.
				</PretendardSemiBoldText>

				<MarginContainer />
			</KeyboardAwareScrollView>
			<SaveButton
				disabled={false}
				isActive={false}
				onPress={async () => {
					await logEvent(`goPayment`, {pkgName: data?.name});
					console.log({
						value: data?.total_price,
						guide_lang: value,
						name: data?.name,
						productinfo: {
							...form,
							userId: userId,
							...data,
							buyer_first_name: form?.native_first_name,
							buyer_last_name: form?.native_last_name,
							buyer_Email: form?.buyer_Email,
							buyer_tel_number: form?.buyer_tel_number?.substr(1),
							guide_lang: value,
							custom: [
								customType?.custom?.cus_type?.use?.includes('cus_01') ? form : null,
								...(customType?.custom?.cus_type?.use?.includes('cus_02')
									? customData?.map(item => ({...item, cus_type: 'cus_02'}))
									: []),
								customType?.custom?.cus_type?.use?.includes('contact') ? contactData : null,
							].filter(item => item != null && item?.length != 0),
						},
					});
					navigation.navigate('PaymentStack', {
						info: {
							value: data?.total_price,
							guide_lang: value,
							name: data?.name,
							productinfo: {
								...form,
								userId: userId,
								...data,
								buyer_first_name: form?.native_first_name,
								buyer_last_name: form?.native_last_name,
								buyer_Email: form?.buyer_Email,
								buyer_tel_number: form?.buyer_tel_number?.substr(1),
								guide_lang: value,
								custom: [
									customType?.custom?.cus_type?.use?.includes('cus_01') ? form : null,
									...(customType?.custom?.cus_type?.use?.includes('cus_02')
										? customData?.map(item => ({...item, cus_type: 'cus_02'}))
										: []),
									customType?.custom?.cus_type?.use?.includes('contact') ? contactData : null,
									customType?.custom?.cus_type?.use?.includes('send') ? sendForm : null,
								].filter(item => item != null && item?.length != 0),
							},
						},
					});
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
	width: 100%;
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
const CustomerBox = styled.View`
	border-width: 1px;
	border-color: ${colors.Gray1};
	border-radius: 12px;
	padding: 4px;
	margin-top: 40px;
`;
const fieldMap = {
	cus_type: {ko: '고객 유형', exam: '일반 / VIP'},
	english_last_name: {ko: '여권상 영어 성', exam: 'Kim'},
	english_first_name: {ko: '여권상 영어 이름', exam: 'Minji'},
	gender: {ko: '성별', exam: '남 / 여'},
	nationality: {ko: '국적', exam: '대한민국'},
	mtp_no: {ko: 'MTP 번호', exam: '1234567890'},
	id_no: {ko: '주민 번호', exam: '900101-1234567'},
	passport_no: {ko: '여권 번호', exam: 'M12345678'},
	passport_expdate: {ko: '여권 만료일', exam: '2030-12-31'},
	birth: {ko: '생년월일', exam: '1990-01-01'},
	native_last_name: {ko: '성', exam: '김'},
	native_first_name: {ko: '이름', exam: '민지'},
	tel_country_code: {ko: '전화 국가번호', exam: '+82'},
	tel_number: {ko: '전화번호', exam: '01012345678'},
	country_cities: {ko: '국가 및 도시', exam: '대한민국, 서울'},
	zipcode: {ko: '우편번호', exam: '06236'},
	address: {ko: '주소', exam: '서울특별시 강남구 테헤란로 123'},
	hotel_name: {ko: '호텔 이름', exam: '롯데호텔 서울'},
	hotel_tel_number: {ko: '호텔 전화번호', exam: '0212345678'},
	booking_order_no: {ko: '예약 번호', exam: 'BK20251020001'},
	check_in_date: {ko: '체크인 날짜', exam: '2025-10-25'},
	check_out_date: {ko: '체크아웃 날짜', exam: '2025-10-30'},
	contact_app: {ko: '연락 앱', exam: '카카오톡 / 위챗'},
	contact_app_account: {ko: '연락 앱 계정', exam: 'minji_kim'},
	have_app: {ko: '연락 앱 설치 여부', exam: '예 / 아니오'},
	height: {ko: '키', exam: '165'},
	height_unit: {ko: '키 단위', exam: 'cm'},
	weight: {ko: '몸무게', exam: '55'},
	weight_unit: {ko: '몸무게 단위', exam: 'kg'},
	shoe: {ko: '신발 사이즈', exam: '240'},
	shoe_unit: {ko: '신발 단위', exam: 'mm'},
	shoe_type: {ko: '신발 종류', exam: '운동화 / 구두'},
	glass_degree: {ko: '안경 도수', exam: '-2.50 / +1.75'},
	meal: {ko: '식사 선호', exam: '일반식 / 채식'},
	allergy_food: {ko: '알레르기 음식', exam: '견과류 / 해산물'},
};
