import styled from 'styled-components/native';
import StepText from '../../../utill/component/enroll-info/step-text';
import Stepper from '../../../utill/component/enroll-info/stepper';
import TendencyButton from '../../../utill/component/tendency-button';
import CustomButton from '../../../utill/component/custom-button';
import {useAppSelector} from '../../../redux';
import {BackgroundGray} from '../../../utill/layout/layout';
import {heightPercentage} from '../../../utill/layout/responsive-size';
import {useTendencyHandler} from '../../../utill/hooks/useTendencyHandler';

export default function SelectWho({navigation}: any) {
	const {regionTendency} = useAppSelector(state => state.regionRecommendSlice);
	const goNext = () => {
		navigation.navigate('RegionSelectSeason');
	};
	const {handleButtonClick, regionTendencyList} = useTendencyHandler();
	const handleSelect = (item: number) => {
		handleButtonClick({index: 0, region: true, item: item});
	};
	return (
		<BackgroundGray>
			<Stepper total={7} now={1}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='1.여행 스타일을 알아볼게요.'
				mainText='누구와 떠나시나요?'
				subText='* 중복 선택 가능'></StepText>
			<SelectButtonsContainer>
				{regionTendencyList[0].list.map((item, idx) => (
					<TendencyButton
						bgColor={regionTendency[0][idx] == 1}
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
export const SelectButtonsContainer = styled.View`
	flex: 1;
	justify-content: flex-end;
`;
