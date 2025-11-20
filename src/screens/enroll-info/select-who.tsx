import styled from 'styled-components/native';
import StepText from '../../utill/component/enroll-info/step-text';
import Stepper from '../../utill/component/enroll-info/stepper';
import {BackgroundGray} from '../../utill/layout/layout';
import TendencyButton from '../../utill/component/tendency-button';
import CustomButton from '../../utill/component/custom-button';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {useAppDispatch, useAppSelector} from '../../redux';
import {useTendencyHandler} from '../../utill/hooks/useTendencyHandler';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {useEffect} from 'react';
import {logEvent} from '../../../firebaseAnalytice';
import RouteButton from '../../utill/component/route-button';
import {getTendency, travelSliceActions} from '../../redux/travel-info/travel.slice';

export default function RecommendSelectWho({navigation}: any) {
	const {tendency, tendencyUse} = useAppSelector(state => state.travelSlice);
	const {socialloginProvider} = useAppSelector(state => state.userSlice);
	const dispatch = useAppDispatch();
	const checkNext = () => {
		if (tendency[0][tendency[0].length - 1] == 1) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '반려동물 출입 관광지를 찾으시나요?',
					modalSubTitle: `반려동물 출입이 허용되지 않은 곳은\n추천되지 않아 관광지가 적을 수 있습니다.`,
					modalFunction: goNext,
					modalTopText: '확인했어요',
					modalBottomText: '수정할래요',
				}),
			);
		} else {
			goNext();
		}
	};
	const goNext = () => {
		navigation.navigate('RecommendSelectMove');
	};
	const {handleButtonClick, tendencyList} = useTendencyHandler();
	const handleSelect = (item: number) => {
		handleButtonClick({index: 0, region: false, item: item});
	};
	const handleGoogleAnalytics = async () => {
		socialloginProvider == 'anonymous'
			? await logEvent('anonymous_course_step4', {})
			: await logEvent('course_step4', {});
	};
	useEffect(() => {
		handleGoogleAnalytics();
	}, []);
	const handleTendencyCheck = (tendency: number[][]) => {
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: `최근에 선택하신 여행 성향들로 ${`\n`}추천을 진행할까요?`,
				modalTopText: '네, 최근 선택대로 추천해주세요',
				modalBottomText: '아니요, 다시 선택할게요',
				modalFunction: () => {
					dispatch(travelSliceActions.enrollRecentTendency(tendency));
					navigation.navigate('FinalCheck');
				},
			}),
		);
	};
	const handleTendency = async () => {
		if (!tendencyUse) {
			const a = await dispatch(getTendency()).unwrap();
			if (a?.data?.recentSelectList?.length != 0) {
				handleTendencyCheck(a?.data?.recentSelectList);
				dispatch(travelSliceActions.updateFiled({field: 'tendencyUse', value: true}));
			}
		}
	};
	useEffect(() => {
		handleTendency();
	}, []);
	return (
		<BackgroundGray>
			<Stepper total={13} now={7}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='2.여행 스타일을 알아볼게요.'
				mainText='누구와 떠나시나요?'
				subText='* 중복 선택 가능'
				warningText={
					tendency[0][tendency[0].length - 1] == 1 ? '반려동물과 실내 관광지는 함께 선택할 수 없어요' : ''
				}></StepText>
			<ButtonsContainer>
				{tendencyList[0]?.list.map((item, idx) => (
					<TendencyButton
						marginBottom={0}
						bgColor={tendency[0][idx] == 1}
						label={item}
						key={idx}
						divide={true}
						imageUrl={tendencyList[0]?.photo[idx]}
						onPress={() => {
							handleSelect(idx);
						}}></TendencyButton>
				))}
			</ButtonsContainer>
			<RouteButton navigation={navigation} nextTitle='RecommendSelectMove' goNext={checkNext}></RouteButton>
		</BackgroundGray>
	);
}
const ButtonsContainer = styled.View`
	flex: 1;
	justify-content: center;
	flex-direction: row;
	flex-wrap: wrap;
	align-items: center;
	margin-top: ${heightPercentage(134)}px;
	gap: ${widthPercentage(8)}px;
`;
