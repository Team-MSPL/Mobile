import StepText from '../../utill/component/enroll-info/step-text';
import Stepper from '../../utill/component/enroll-info/stepper';
import {BackgroundGray} from '../../utill/layout/layout';
import TendencyButton from '../../utill/component/tendency-button';
import CustomButton from '../../utill/component/custom-button';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import {SelectButtonsContainer} from './region-recommend/select-who';
import {heightPercentage} from '../../utill/layout/responsive-size';

export default function RecommendSelectBusy({navigation}: any) {
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
				marginTop={heightPercentage(10)}
				styleText='2.여행 스타일을 알아볼게요.'
				mainText='어떤 여행을 원하시나요?'
				subText='* 기본값: 알찬 일정'></StepText>
			<SelectButtonsContainer>
				{moveList.map((item, idx) => (
					<TendencyButton
						bgColor={bandwidth == Boolean(idx)}
						label={item.name}
						key={idx}
						onPress={item.function}></TendencyButton>
				))}
			</SelectButtonsContainer>
			<CustomButton marginBottom={12} onPress={goNext} label='다음'></CustomButton>
		</BackgroundGray>
	);
}
