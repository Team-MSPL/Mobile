import styled from 'styled-components/native';
import StepText from '../../../utill/component/enroll-info/step-text';
import Stepper from '../../../utill/component/enroll-info/stepper';
import TendencyButton from '../../../utill/component/tendency-button';
import CustomButton from '../../../utill/component/custom-button';
import {heightPercentage, widthPercentage} from '../../../utill/layout/responsive-size';
import {useAppSelector} from '../../../redux';
import {BackgroundGray} from '../../../utill/layout/layout';
import {useTendencyHandler} from '../../../utill/hooks/useTendencyHandler';

export default function SelectTour({navigation}: any) {
	const {regionTendency} = useAppSelector(state => state.regionRecommendSlice);
	const goNext = () => {
		navigation.navigate('RegionSelectPopularity');
	};
	const {handleButtonClick, regionTendencyList} = useTendencyHandler();
	const handleSelect = (item: number) => {
		handleButtonClick({index: 3, region: true, item: item});
	};
	return (
		<BackgroundGray>
			<Stepper total={7} now={5}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='1.여행 스타일을 알아볼게요.'
				mainText='어디를 가고 싶으신가요?'
				subText='* 중복 선택 가능'></StepText>
			<ButtonsContainer>
				{regionTendencyList[3].list.map((item, idx) => (
					<TendencyButton
						marginBottom={0}
						bgColor={regionTendency[3][idx] == 1}
						label={item}
						key={idx}
						divide={true}
						imageUrl={regionTendencyList[3]?.photo[idx]}
						onPress={() => {
							handleSelect(idx);
						}}></TendencyButton>
				))}
			</ButtonsContainer>
			<CustomButton marginBottom={12} onPress={goNext} label='다음'></CustomButton>
		</BackgroundGray>
	);
}
const ButtonsContainer = styled.View`
	flex: 1;
	justify-content: center;
	flex-direction: row;
	flex-wrap: wrap;
	align-items: center;
	margin-top: ${heightPercentage(155)}px;
	gap: ${widthPercentage(10)}px;
`;
