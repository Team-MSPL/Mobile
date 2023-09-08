import {useCallback, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../redux';
import CustomButton from '../../../utill/component/custom-button';
import {Text, Box, ScrollView, VStack, Divider} from 'native-base';
import {RadioButtonProps, RadioGroup} from 'react-native-radio-buttons-group';
import {regionRecommendSliceActions} from '../../../redux/travel-info/region-recommend.slice';
import {Alert} from 'react-native';
import {updateFunctionToken, userSliceActions} from '../../../redux/user/user.slice';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {useFocusEffect} from '@react-navigation/native';
export default function SelectPopularity({navigation}: any) {
	const dispatch = useAppDispatch();

	const {functionToken, socialloginProvider, signUpReward} = useAppSelector(state => state.userSlice);
	const [selectedId, setSelectedId] = useState<string | undefined>();
	const goPayment = async () => {
		Alert.alert('결제창');
	};
	const goNext = async () => {
		let data = Number(selectedId) * 20;
		dispatch(updateFunctionToken({functionToken: functionToken - 1}));
		dispatch(regionRecommendSliceActions.enrollPopularity([data, data]));
		navigation.popToTop();
		navigation.navigate('RegionViewResult');
	};
	const radioButtons: RadioButtonProps[] = useMemo(
		() => [
			{
				id: '1',
				label: '완전 유명하지않은',
				value: 'option1',
				labelStyle: {color: 'black', fontSize: 18},
			},
			{
				id: '2',
				label: '조금 유명하지않은',
				value: 'option2',
				labelStyle: {color: 'black', fontSize: 18},
			},
			{
				id: '3',
				label: '적당한',
				value: 'option2',
				labelStyle: {color: 'black', fontSize: 18},
			},
			{
				id: '4',
				label: ' 조금 유명한',
				value: 'option2',
				labelStyle: {color: 'black', fontSize: 18},
			},
			{
				id: '5',
				label: ' 많이 유명한',
				value: 'option2',
				labelStyle: {color: 'black', fontSize: 18},
			},
		],
		[],
	);
	const goNewLogin = () => {
		navigation.navigate('LoginScreen');
	};
	const checkSignUpReward = () => {
		dispatch(userSliceActions.setSignUpReward(false));
	};
	useFocusEffect(
		useCallback(() => {
			if (signUpReward) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '회원가입 축하드립니다',
						modalSubTitle: `회원가입 기념 토큰을 드렸습니다. ${functionToken}개 입니다.`,
						modalFunction: checkSignUpReward,
					}),
				);
			}
		}, [signUpReward]),
	);
	const checkToken = () => {
		if (socialloginProvider == 'anonymous') {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '익명 로그인으로는 이용 불가합니다',
					modalSubTitle: '로그인 하러 가시겠습니까?',
					modalFunction: goNewLogin,
					modalLeft: true,
				}),
			);
		} else {
			functionToken >= 1
				? dispatch(
						modalSliceActions.setOpenModal({
							modalTitle: '토큰이 하나 소모됩니다. 실행하시겠습니까?',
							modalSubTitle: '사용자가 많을시 최대 1분까지 소요됩니다.',
							modalFunction: goNext,
							modalLeft: true,
						}),
				  )
				: dispatch(
						modalSliceActions.setOpenModal({
							modalTitle: '토큰이 부족합니다. 결제창으로 가시겠습니까?',
							modalFunction: goPayment,
							modalLeft: true,
						}),
				  );
		}
	};

	return (
		<ScrollView bgColor='#EFFBFB' p='2'>
			<VStack space='5'>
				<Text fontSize='2xl' bold color='black'>
					인기도
				</Text>
				<Divider my='1' />
				<Text fontSize='lg'>가고자 하는 여행지 느낌 선택해보삼</Text>
				<RadioGroup
					radioButtons={radioButtons}
					onPress={setSelectedId}
					selectedId={selectedId}
					containerStyle={{alignItems: 'flex-start'}}
				/>

				<CustomButton
					label='다음 단계'
					isDisabled={selectedId ? false : true}
					onPress={checkToken}></CustomButton>
			</VStack>
		</ScrollView>
	);
}
