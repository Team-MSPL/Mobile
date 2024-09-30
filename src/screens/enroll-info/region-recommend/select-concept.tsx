import StepText from '../../../utill/component/enroll-info/step-text';
import Stepper from '../../../utill/component/enroll-info/stepper';
import TendencyButton from '../../../utill/component/tendency-button';
import {SelectButtonsContainer} from './select-who';
import {useAppSelector} from '../../../redux';
import {BackgroundGray} from '../../../utill/layout/layout';
import {heightPercentage} from '../../../utill/layout/responsive-size';
import {useTendencyHandler} from '../../../utill/hooks/useTendencyHandler';
import RouteButton from '../../../utill/component/route-button';

export default function SelectConcept({navigation}: any) {
	const {regionTendency} = useAppSelector(state => state.regionRecommendSlice);
	const {handleButtonClick, regionTendencyList} = useTendencyHandler();
	const handleSelect = (item: number) => {
		handleButtonClick({index: 1, region: true, item: item});
	};
	return (
		<BackgroundGray>
			<Stepper total={7} now={3}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='1.여행 스타일을 알아볼게요.'
				mainText='여행 테마는 무엇인가요?'
				subText='* 중복 선택 가능'></StepText>
			<SelectButtonsContainer>
				{regionTendencyList[1].list.map((item, idx) => (
					<TendencyButton
						bgColor={regionTendency[1][idx] == 1}
						label={item}
						key={idx}
						imageUrl={regionTendencyList[1]?.photo[idx]}
						onPress={() => {
							handleSelect(idx);
						}}></TendencyButton>
				))}
			</SelectButtonsContainer>
			<RouteButton navigation={navigation} nextTitle='RegionSelectPlay'></RouteButton>
		</BackgroundGray>
	);
}
