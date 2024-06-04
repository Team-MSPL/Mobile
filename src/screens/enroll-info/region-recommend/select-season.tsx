import StepText from '../../../utill/component/enroll-info/step-text';
import Stepper from '../../../utill/component/enroll-info/stepper';
import TendencyButton from '../../../utill/component/tendency-button';
import {SelectButtonsContainer} from './select-who';
import CustomButton from '../../../utill/component/custom-button';
import {useAppSelector} from '../../../redux';
import {BackgroundGray} from '../../../utill/layout/layout';
import {heightPercentage} from '../../../utill/layout/responsive-size';
import {useTendencyHandler} from '../../../utill/hooks/useTendencyHandler';

export default function SelectSeason({navigation}: any) {
	const {regionTendency} = useAppSelector(state => state.regionRecommendSlice);
	const goNext = () => {
		navigation.navigate('RegionSelectConcept');
	};
	const {handleButtonClick, regionTendencyList} = useTendencyHandler();
	const handleSelect = (item: number) => {
		handleButtonClick({index: 4, region: true, item: item});
	};
	return (
		<BackgroundGray>
			<Stepper total={7} now={2}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='1.여행 스타일을 알아볼게요.'
				mainText='어떤 계절에 떠나시나요?'
				subText='* 중복 선택 가능'></StepText>
			<SelectButtonsContainer>
				{regionTendencyList[4].list.map((item, idx) => (
					<TendencyButton
						bgColor={regionTendency[4][idx] == 1}
						label={item}
						key={idx}
						onPress={() => {
							handleSelect(idx);
						}}></TendencyButton>
				))}
			</SelectButtonsContainer>
			<CustomButton marginBottom={12} onPress={goNext} label='다음'></CustomButton>
		</BackgroundGray>
	);
}
