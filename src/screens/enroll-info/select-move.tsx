import styled from 'styled-components/native';
import StepText from '../../utill/component/enroll-info/step-text';
import Stepper from '../../utill/component/enroll-info/stepper';
import {BackgroundGray} from '../../utill/layout/layout';
import TendencyButton from '../../utill/component/tendency-button';
import CustomButton from '../../utill/component/custom-button';
import {heightPercentage} from '../../utill/layout/responsive-size';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';

export default function RecommendSelectMove({navigation}: any) {
	const {transit} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const goNext = () => {
		navigation.navigate('RecommendSelectCost');
	};

	const moveList = [
		{name: '자동차 렌트카', function: () => dispatch(travelSliceActions.enrollTransit(0))},
		{name: '대중교통', function: () => dispatch(travelSliceActions.enrollTransit(1))},
	];
	return (
		<BackgroundGray>
			<Stepper total={11} now={5}></Stepper>
			<StepText
				styleText='1.여행 스타일을 알아볼게요.'
				mainText='어떻게 이동하시나요?'
				subText='* 기본값: 자동차(렌트카)'></StepText>
			<ButtonsContainer>
				{moveList.map((item, idx) => (
					<TendencyButton
						bgColor={transit == idx}
						label={item.name}
						key={idx}
						onPress={item.function}></TendencyButton>
				))}
			</ButtonsContainer>
			<CustomButton
				marginTop={heightPercentage(48)}
				marginBottom={12}
				onPress={goNext}
				label='다음'></CustomButton>
		</BackgroundGray>
	);
}
const ButtonsContainer = styled.View`
	flex: 1;
	justify-content: flex-end;
`;
