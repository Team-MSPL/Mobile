import StepText from '../../utill/component/enroll-info/step-text';
import Stepper from '../../utill/component/enroll-info/stepper';
import {BackgroundGray} from '../../utill/layout/layout';
import TendencyButton from '../../utill/component/tendency-button';
import CustomButton from '../../utill/component/custom-button';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import {tendencyList} from './select-tendency';
import {SelectButtonsContainer} from './region-recommend/select-who';
import {heightPercentage} from '../../utill/layout/responsive-size';

export default function RecommendSelectConcept({navigation}: any) {
	const {tendency} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const goNext = () => {
		navigation.navigate('RecommendSelectPlay');
	};
	const handleSelect = (item: number) => {
		let copy = [...tendency];
		let copy2 = [...tendency[1]];
		copy2[item] = copy2[item] == 1 ? 0 : 1;
		copy[1] = copy2;
		dispatch(travelSliceActions.enrollTendency(copy));
	};
	return (
		<BackgroundGray>
			<Stepper total={11} now={7}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='1.여행 스타일을 알아볼게요.'
				mainText='테마는 무엇인가요?'
				subText='* 중복 선택 가능'></StepText>
			<SelectButtonsContainer>
				{tendencyList[1].list.map((item, idx) => (
					<TendencyButton
						bgColor={tendency[1][idx] == 1}
						label={item}
						key={idx}
						divide={true}
						onPress={() => {
							handleSelect(idx);
						}}></TendencyButton>
				))}
			</SelectButtonsContainer>
			<CustomButton marginBottom={12} onPress={goNext} label='다음'></CustomButton>
		</BackgroundGray>
	);
}
