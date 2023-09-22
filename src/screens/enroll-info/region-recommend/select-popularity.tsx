import {useCallback, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../redux';
import CustomButton from '../../../utill/component/custom-button';
import {Text, Box, ScrollView, Divider} from 'native-base';
import {RadioButtonProps, RadioGroup} from 'react-native-radio-buttons-group';
import {regionRecommendSliceActions} from '../../../redux/travel-info/region-recommend.slice';
import {Alert} from 'react-native';
import {updateFunctionToken, userSliceActions} from '../../../redux/user/user.slice';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {useFocusEffect} from '@react-navigation/native';
import {HStack, MainContainer, VStack} from '../../../utill/layout/layout';
import StepText from '../../../utill/component/enroll-info/step-text';
import {SvgCheck} from '../../../utill/svg/svg';
import TendencyButton from '../../../utill/component/tendency-button';
import {colors} from '../../../utill/colors';
import styled from 'styled-components/native';
export default function SelectPopularity({navigation}: any) {
	const dispatch = useAppDispatch();

	const {functionToken, socialloginProvider, signUpReward} = useAppSelector(state => state.userSlice);
	const [selectedId, setSelectedId] = useState(0);
	const goPayment = async () => {
		Alert.alert('결제창');
	};
	const changeSelectId = (e: number) => {
		setSelectedId(e);
	};
	const goNext = async () => {
		let data = radioButtons[selectedId].id * 20;
		//dispatch(updateFunctionToken({functionToken: functionToken - 1}));
		dispatch(regionRecommendSliceActions.enrollPopularity([data, data]));
		navigation.popToTop();
		navigation.navigate('RegionViewResult');
	};
	const radioButtons = [
		{
			id: 1,
			label: '완전 유명하지않은',
			value: 'option1',
			explain: '사람들이 많이 찾지 않는 장소에요',
		},
		{
			id: 2,
			label: '조금 유명하지않은',
			value: 'option2',
			explain: '사람들이 많이 가진 않지만 조금씩 찾아보는 사람이 있어요',
		},
		{
			id: 3,
			label: '적당한',
			value: 'option2',
			explain: '1년에 한번은 사람들이 찾아보는 곳이에요',
		},
		{
			id: 4,
			label: ' 조금 유명한',
			value: 'option2',
			explain: `유명한 관광지가 있는 장소들이에요 \n예: 강원 원주시, 충북 단양군 등 `,
		},
		{
			id: 5,
			label: ' 많이 유명한',
			value: 'option2',
			explain: '사람들이 가장 많이 찾아보는 장소들이에요 \n예:서울, 제주',
		},
	];
	const goNewLogin = () => {
		navigation.navigate('LoginScreen');
	};
	const checkSignUpReward = () => {
		dispatch(userSliceActions.setSignUpReward(false));
	};
	// useFocusEffect(
	// 	useCallback(() => {
	// 		if (signUpReward) {
	// 			dispatch(
	// 				modalSliceActions.setOpenModal({
	// 					modalTitle: '회원가입 축하드립니다',
	// 					modalSubTitle: `회원가입 기념 토큰을 드렸습니다. ${functionToken}개 입니다.`,
	// 					modalFunction: checkSignUpReward,
	// 				}),
	// 			);
	// 		}
	// 	}, [signUpReward]),
	// );
	// const checkToken = () => {
	// 	if (socialloginProvider == 'anonymous') {
	// 		dispatch(
	// 			modalSliceActions.setOpenModal({
	// 				modalTitle: '익명 로그인으로는 이용 불가합니다',
	// 				modalSubTitle: '로그인 하러 가시겠습니까?',
	// 				modalFunction: goNewLogin,
	// 				modalLeft: true,
	// 			}),
	// 		);
	// 	} else {
	// 		functionToken >= 1
	// 			? dispatch(
	// 					modalSliceActions.setOpenModal({
	// 						modalTitle: '토큰이 하나 소모됩니다. 실행하시겠습니까?',
	// 						modalSubTitle: '사용자가 많을시 최대 1분까지 소요됩니다.',
	// 						modalFunction: goNext,
	// 						modalLeft: true,
	// 					}),
	// 			  )
	// 			: dispatch(
	// 					modalSliceActions.setOpenModal({
	// 						modalTitle: '토큰이 부족합니다. 결제창으로 가시겠습니까?',
	// 						modalFunction: goPayment,
	// 						modalLeft: true,
	// 					}),
	// 			  );
	// 	}
	// };

	return (
		<MainContainer>
			<StepText mainText='인기도 선택' subText='가고자 하는 여행지의 느낌을 선택해주세요.' />
			{radioButtons.map((item, index) => (
				<PopularButton key={index} onPress={() => changeSelectId(index)}>
					<HStack key={index}>
						<SvgCheck color={index == selectedId ? colors.selectButton : colors.regionNormal} />
						<PopularButtonText color={index == selectedId ? colors.selectButton : colors.regionNormal}>
							{item.label}
						</PopularButtonText>
					</HStack>
				</PopularButton>
			))}
			<ExplainText>{radioButtons[selectedId].explain}</ExplainText>
			<CustomButton label='추천받기' isDisabled={selectedId ? false : true} onPress={goNext}></CustomButton>
		</MainContainer>
	);
}

const ExplainText = styled.Text`
	font-size: 13px;
	font-weight: bold;
	color: black;
	margin: 1% 0% 5% 0%;
`;
const PopularButton = styled.TouchableOpacity`
	padding: 5%;
	margin: 1% 0% 1% 0%;
`;
const PopularButtonText = styled.Text<{color: string}>`
	font-size: 20px;
	font-weight: bold;
	color: ${props => props.color};
	margin: 0px 0px 0px 20px;
`;
