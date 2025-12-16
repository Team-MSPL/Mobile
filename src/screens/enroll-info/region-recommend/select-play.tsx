import StepText from '../../../utill/component/enroll-info/step-text';
import Stepper from '../../../utill/component/enroll-info/stepper';
import TendencyButton from '../../../utill/component/tendency-button';
import {SelectButtonsContainer} from './select-who';
import {useAppSelector} from '../../../redux';
import {BackgroundGray} from '../../../utill/layout/layout';
import {heightPercentage} from '../../../utill/layout/responsive-size';
import {useTendencyHandler} from '../../../utill/hooks/useTendencyHandler';
import RouteButton from '../../../utill/component/route-button';

export default function SelectPlay({navigation}: any) {
	const {regionTendency} = useAppSelector(state => state.regionRecommendSlice);
	const {handleButtonClick, regionTendencyList} = useTendencyHandler();
	const handleSelect = (item: number) => {
		handleButtonClick({index: 2, region: true, item: item});
	};
	return (
		<BackgroundGray>
			<Stepper total={7} now={4}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='2.여행 스타일을 알아볼게요.'
				mainText='무엇을 하고 싶으신가요?'
				subText='* 중복 선택 가능'></StepText>
			<SelectButtonsContainer>
				{regionTendencyList[2].list.map((item, idx) => (
					<TendencyButton
						bgColor={regionTendency[2][idx] == 1}
						label={item}
						key={idx}
						divide={true}
						imageUrl={regionTendencyList[2]?.photo[idx]}
						onPress={() => {
							handleSelect(idx);
						}}></TendencyButton>
				))}
			</SelectButtonsContainer>
			<RouteButton navigation={navigation} nextTitle='RegionSelectTour'></RouteButton>
		</BackgroundGray>
	);
}
