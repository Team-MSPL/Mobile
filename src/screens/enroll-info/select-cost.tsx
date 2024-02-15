import styled from 'styled-components/native';
import StepText from '../../utill/component/enroll-info/step-text';
import Stepper from '../../utill/component/enroll-info/stepper';
import {BackgroundGray} from '../../utill/layout/layout';
import TendencyButton from '../../utill/component/tendency-button';
import CustomButton from '../../utill/component/custom-button';
import {heightPercentage} from '../../utill/layout/responsive-size';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';

export default function RecommendSelectCost({navigation}: any) {
	const {bandwidth} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const goNext = () => {
		navigation.navigate('RecommendSelectConcept');
	};

	const moveList = [
		{name: '알찬 일정', function: () => dispatch(travelSliceActions.enrollBandwidth(false))},
		{name: '여유있는 일정', function: () => dispatch(travelSliceActions.enrollBandwidth(true))},
	];
	return (
		<BackgroundGray>
			<Stepper total={11} now={6}></Stepper>
			<StepText
				styleText='1.여행 스타일을 알아볼게요.'
				mainText='어떤 여행을 원하시나요?'
				subText='* 기본값: 알찬 일정'></StepText>
			<ButtonsContainer>
				{moveList.map((item, idx) => (
					<TendencyButton
						bgColor={bandwidth == Boolean(idx)}
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
