import {useCallback, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../redux';
import CustomButton from '../../../utill/component/custom-button';
import {RadioButtonProps, RadioGroup} from 'react-native-radio-buttons-group';
import {regionRecommendSliceActions, regionSearch} from '../../../redux/travel-info/region-recommend.slice';
import {Alert} from 'react-native';
import {updateFunctionToken, userSliceActions} from '../../../redux/user/user.slice';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {useFocusEffect} from '@react-navigation/native';
import {HStack, MainContainer, VStack} from '../../../utill/layout/layout';
import StepText from '../../../utill/component/enroll-info/step-text';
import {SvgCheck} from '../../../utill/svg/svg';
import {colors} from '../../../utill/colors';
import styled from 'styled-components/native';
import {useAppsflyer} from '../../../utill/hooks/useAppsflyer';
import {LoadingSliceActions} from '../../../redux/loading/loading.slice';
export default function SelectPopularity({navigation}: any) {
	const dispatch = useAppDispatch();
	const {isLoading} = useAppSelector(state => state.loadingSlice);
	const {tendency, distance, lat, lng} = useAppSelector(state => state.regionRecommendSlice);
	const {functionToken, socialloginProvider, signUpReward} = useAppSelector(state => state.userSlice);
	const [selectedId, setSelectedId] = useState(0);
	const goPayment = async () => {
		Alert.alert('결제창');
	};
	const changeSelectId = (e: number) => {
		setSelectedId(e);
	};
	const {appsflyerLogEvent} = useAppsflyer();
	const goNext = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			appsflyerLogEvent({name: 'travle_recommend_excute', value: {id: 'danim'}});
			let data = radioButtons[selectedId].id * 20;
			let datas = {
				selectList: tendency,
				selectPopular: [data, data],
				recentPosition: {lat: lat, lng: lng},
				distanceSensitivity: distance,
			};
			const result = await dispatch(regionSearch(datas)).unwrap();
			if (result.length != 0) {
				dispatch(updateFunctionToken({functionToken: functionToken - 1}));
				navigation.popToTop();
				navigation.navigate('RegionViewResult');
			} else {
				dispatch(modalSliceActions.setOpenModal({modalSubTitle: '적절한 여행지를 찾지못하였습니다.'}));
			}
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '에러',
					modalSubTitle: '추천을 받는 중 에러가 발생했습니다.',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const radioButtons = [
		{
			id: 5,
			label: '많이 유명한',
			value: 'option2',
			explain: '일반적으로 가장 많이 여행가는 지역들이에요.\n( 서울, 제주 등 10개 지역 )',
		},
		{
			id: 4,
			label: '상당히 유명한',
			value: 'option2',
			explain: `여행을 좋아한다면 자주 들어보았을 지역들이에요.\n( 강원 강릉시, 충북 단양군 등 30개 지역 )`,
		},
		{
			id: 3,
			label: '균형잡힌',
			value: 'option2',
			explain: '유명과 이색, 그 중간 지점에 있는 지역들이에요.\n( 강원 화천시, 경남 진주시 등 32개 지역 )',
		},
		{
			id: 2,
			label: '상당히 이색적인',
			value: 'option2',
			explain: '특색있는 관광지를 가지고 있는 이색 여행 지역들이에요.\n( 경북 청송군, 전남 광양시 등 53개 지역 )',
		},

		{
			id: 1,
			label: '많이 이색적인',
			value: 'option1',
			explain: '발길이 많이 닿지 않은 이색 여행 지역들이에요. \n( 강원 양구군, 경남 함안군 등 37개 지역 )',
		},
	];
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
	if (isLoading) return <MainContainer></MainContainer>;
	return (
		<MainContainer>
			<StepText mainText='인기도 선택' subText='가고자 하는 여행지의 느낌을 선택해주세요.' />
			<Info>* 인기도의 기준은 각 지역별 여행객 수 통계를 참조했어요.</Info>
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
			<CustomButton label='추천받기' onPress={checkToken}></CustomButton>
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
const Info = styled.Text`
	margin: 0px 0px 10px 0px;
`;
