import StepText from '../../../utill/component/enroll-info/step-text';
import Stepper from '../../../utill/component/enroll-info/stepper';
import TendencyButton from '../../../utill/component/tendency-button';
import {SelectButtonsContainer} from './select-who';
import CustomButton from '../../../utill/component/custom-button';
import {useAppSelector} from '../../../redux';
import {BackgroundGray} from '../../../utill/layout/layout';
import {heightPercentage} from '../../../utill/layout/responsive-size';
import {useTendencyHandler} from '../../../utill/hooks/useTendencyHandler';

export default function SelectPlay({navigation}: any) {
	const {regionTendency} = useAppSelector(state => state.regionRecommendSlice);
	const goNext = () => {
		navigation.navigate('RegionSelectTour');
	};
	const {handleButtonClick, regionTendencyList} = useTendencyHandler();
	const handleSelect = (item: number) => {
		handleButtonClick({index: 2, region: true, item: item});
	};
	return (
		<BackgroundGray>
			<Stepper total={7} now={4}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='1.여행 스타일을 알아볼게요.'
				mainText='무엇을 하고 싶으신가요?'
				subText='* 중복 선택 가능'></StepText>
			<SelectButtonsContainer>
				{regionTendencyList[2].list.map((item, idx) => (
					<TendencyButton
						bgColor={regionTendency[2][idx] == 1}
						label={item}
						key={idx}
						imageUrl={regionTendencyList[2]?.photo[idx]}
						onPress={() => {
							handleSelect(idx);
						}}></TendencyButton>
				))}
			</SelectButtonsContainer>
			<CustomButton marginBottom={12} onPress={goNext} label='다음'></CustomButton>
		</BackgroundGray>
	);
}
