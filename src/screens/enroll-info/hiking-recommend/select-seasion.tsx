import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../../redux';
import CustomButton from '../../../utill/component/custom-button';
import StepText from '../../../utill/component/enroll-info/step-text';
import Stepper from '../../../utill/component/enroll-info/stepper';
import TendencyButton from '../../../utill/component/tendency-button';
import {BackgroundGray} from '../../../utill/layout/layout';
import {heightPercentage, widthPercentage} from '../../../utill/layout/responsive-size';
import {hikingRecommendSliceActions, hikingSelectList} from '../../../redux/travel-info/hiking.slice';

export default function HikingSelectSeason({navigation}: any) {
	const {selectList} = useAppSelector(state => state.hikingSlice);
	const dispatch = useAppDispatch();

	const goNext = () => {
		navigation.navigate('HikingSelectDifficulty');
	};
	const handleSelect = (item: number) => {
		let copy = [...selectList];
		let copy2 = [...copy[1]];
		copy2[item] == 0 ? (copy2[item] = 1) : (copy2[item] = 0);
		copy[1] = copy2;
		dispatch(hikingRecommendSliceActions.enrollHikingTendency(copy));
	};
	return (
		<BackgroundGray>
			<Stepper total={3} now={2}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='1.탐방 스타일을 알아볼게요.'
				mainText='어떤 계절에 떠나시나요?'
				subText='* 중복 선택 가능'></StepText>
			<ButtonsContainer>
				{hikingSelectList[1].map((item, idx) => (
					<TendencyButton
						bgColor={selectList[1][idx] == 1}
						label={item}
						key={idx}
						divide={false}
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
	gap: ${widthPercentage(4)}px;
`;
