import StepText from '../../utill/component/enroll-info/step-text';
import Stepper from '../../utill/component/enroll-info/stepper';
import {BackgroundGray} from '../../utill/layout/layout';
import TendencyButton from '../../utill/component/tendency-button';
import CustomButton from '../../utill/component/custom-button';
import {useAppSelector} from '../../redux';
import {SelectButtonsContainer} from './region-recommend/select-who';
import {heightPercentage} from '../../utill/layout/responsive-size';
import {useTendencyHandler} from '../../utill/hooks/useTendencyHandler';

export default function RecommendSelectConcept({navigation}: any) {
	const {tendency} = useAppSelector(state => state.travelSlice);
	const goNext = () => {
		navigation.navigate('RecommendSelectPlay');
	};

	const {handleButtonClick, tendencyList} = useTendencyHandler();
	const handleSelect = (item: number) => {
		handleButtonClick({index: 1, region: false, item: item});
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
				{tendencyList[1]?.list.map((item, idx) => (
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
