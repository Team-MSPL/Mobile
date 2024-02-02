import styled from 'styled-components/native';
import StepText from '../../../utill/component/enroll-info/step-text';
import Stepper from '../../../utill/component/enroll-info/stepper';
import TendencyButton from '../../../utill/component/tendency-button';
import {regionTendencyList} from './select-tendency';
import CustomButton from '../../../utill/component/custom-button';
import {heightPercentage} from '../../../utill/layout/responsive-size';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {regionRecommendSliceActions} from '../../../redux/travel-info/region-recommend.slice';
import {colors} from '../../../utill/colors';
import {BackgroundGray} from '../../../utill/layout/layout';

export default function SelectWho({navigation}: any) {
	const {tendency} = useAppSelector(state => state.regionRecommendSlice);
	const dispatch = useAppDispatch();
	const goNext = () => {
		navigation.navigate('RegionSelectSeason');
	};
	const handleSelect = (item: number) => {
		let copy = [...tendency];
		let copy2 = [...tendency[0]];
		copy2[item] = copy2[item] == 1 ? 0 : 1;
		copy[0] = copy2;
		dispatch(regionRecommendSliceActions.enrollTendency(copy));
	};
	return (
		<BackgroundGray>
			<Stepper total={7} now={1}></Stepper>
			<StepText
				styleText='1.여행 스타일을 알아볼게요.'
				mainText='누구와 떠나시나요?'
				subText='* 중복 선택 가능'></StepText>
			<ButtonsContainer>
				{regionTendencyList[0].list.map((item, idx) => (
					<TendencyButton
						bgColor={tendency[0][idx] == 1}
						label={item}
						key={idx}
						onPress={() => {
							handleSelect(idx);
						}}></TendencyButton>
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
