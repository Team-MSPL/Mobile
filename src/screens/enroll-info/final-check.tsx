import {Alert, BackHandler, Image} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {getTravelAi, travelSliceActions} from '../../redux/travel-info/travel.slice';
import CustomButton from '../../utill/component/custom-button';
import {Text, Box, ScrollView, VStack, HStack} from 'native-base';
import {tendencyList} from './select-tendency';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {cityViewList} from './select-city';
import {updateFunctionToken, userSliceActions} from '../../redux/user/user.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {useCallback, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';

export default function FinalCheck({navigation}: any) {
	const {day, region, accommodations, nDay, cityIndex, essentialPlaces, tendency, timeLimitArray, transit, distance} =
		useAppSelector(state => state.travelSlice);
	const {functionToken, socialloginProvider, signUpReward} = useAppSelector(state => state.userSlice);
	const {isLoading} = useAppSelector(state => state.loadingSlice);
	const dispatch = useAppDispatch();
	const goPayment = async () => {
		Alert.alert('결제창');
	};

	const goNewLogin = () => {
		dispatch(userSliceActions.setAnonymousKeep(true));
		navigation.navigate('LoginScreen');
	};
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
	useEffect(() => {
		console.log('하위용', accommodations);
		const backAction = () => {
			if (navigation.isFocused() && isLoading) {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: 'ai가 돌아가고 있습니다 조금만 기다려주세요',
						modalFunction: () => {},
					}),
				);
				return true;
			}
		};
		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
		return () => backHandler.remove();
	}, [isLoading]);
	const goNext = async () => {
		//navigation.reset({routes: [{name: 'Preset'}]});
		try {
			dispatch(LoadingSliceActions.onLoading());
			let a = region.map(item => cityViewList[cityIndex].title + ' ' + item);
			if (cityViewList[cityIndex].id >= 8 && region[0] == '전체') {
				a = cityViewList[cityIndex].sub.map(
					(value, idx) => cityViewList[cityIndex].title + ' ' + value.subTitle,
				);
				a.shift();
			}
			const result = await dispatch(
				getTravelAi({
					regionList: a,
					accomodationList: accommodations,
					selectList: tendency,
					essentialPlaceList: essentialPlaces,
					timeLimitArray: timeLimitArray,
					nDay: nDay + 1,
					transit: transit,
					distanceSensitivity: distance,
				}),
			).unwrap();
			console.log('하하하', result);
			dispatch(travelSliceActions.selectRegion(a));
			if (result) {
				navigation.popToTop();
				navigation.navigate('Preset');
				!result.data.enoughPlace &&
					dispatch(
						modalSliceActions.setOpenModal({
							modalTitle: '관광지 갯수가 조금 부족해서 완벽하지는 않아유',
						}),
					);

				dispatch(updateFunctionToken({functionToken: functionToken - 1}));
			} else {
				dispatch(
					modalSliceActions.setOpenModal({
						modalTitle: '추천을 받는 중 에러가 발생했습니다.',
					}),
				);
			}
		} catch (error) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '추천을 받는 중 에러가 발생했습니다.',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};

	const goReset = () => {
		navigation.navigate('SelectCity');
		dispatch(travelSliceActions.reset());
	};
	return (
		<ScrollView bgColor='#EFFBFB' p='2'>
			{/* 스테퍼 넣기 */}

			<Text>{cityViewList[cityIndex].title + region}</Text>
			<Text>출발: {day[0].format('YY-MM-DD')}</Text>
			<Text>종료: {day[nDay].format('YY-MM-DD')}</Text>
			{accommodations.map((item, idx) => {
				return (
					idx != 0 &&
					idx != accommodations.length - 1 && (
						<HStack key={idx}>
							{item.photo && (
								<Image
									source={{
										uri: item.photo,
									}}
									style={{width: 50, height: 50}}
									alt='Place Image'
								/>
							)}
							<Text>{item.name ? idx + ' 일밤 ' + item.name : idx + '일밤 안정함 ㅋ'}</Text>
						</HStack>
					)
				);
			})}

			{[...Array(nDay + 1)].map((item, indx) => {
				const filteredPlaces = essentialPlaces.filter(place => place.day === indx + 1);

				return (
					<Box key={indx} my='3'>
						{filteredPlaces.map(data => (
							<HStack key={data.id}>
								<Image
									source={{
										uri: data.photo,
									}}
									style={{width: 50, height: 50}}
									alt='Place Image'
								/>
								<Text fontSize='lg' bold>
									{data.day}일차 {data.name}
								</Text>
							</HStack>
						))}
					</Box>
				);
			})}
			{tendency.map((item, inx) => {
				return (
					inx !== tendency.length - 1 &&
					item.map((q, a) => {
						return q ? <Text key={a}>{tendencyList[inx]?.list[a]}</Text> : null;
					})
				);
			})}
			<CustomButton label='다시 만들래' onPress={goReset}></CustomButton>
			<CustomButton label='다음 단계' onPress={checkToken}></CustomButton>
		</ScrollView>
	);
}
