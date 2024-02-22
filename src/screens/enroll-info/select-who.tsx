import styled from 'styled-components/native';
import StepText from '../../utill/component/enroll-info/step-text';
import Stepper from '../../utill/component/enroll-info/stepper';
import {BackgroundGray} from '../../utill/layout/layout';
import TendencyButton from '../../utill/component/tendency-button';
import CustomButton from '../../utill/component/custom-button';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {useAppSelector} from '../../redux';
import {useTendencyHandler} from '../../utill/hooks/useTendencyHandler';

export default function RecommendSelectWho({navigation}: any) {
	const {tendency} = useAppSelector(state => state.travelSlice);
	const goNext = () => {
		navigation.navigate('RecommendSelectMove');
	};
	const {handleButtonClick, tendencyList} = useTendencyHandler();
	const handleSelect = (item: number) => {
		handleButtonClick({index: 0, region: false, item: item});
	};
	return (
		<BackgroundGray>
			<Stepper total={11} now={4}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='1.여행 스타일을 알아볼게요.'
				mainText='누구와 떠나시나요?'
				subText='* 중복 선택 가능'></StepText>
			<ButtonsContainer>
				{tendencyList[0]?.list.map((item, idx) => (
					<TendencyButton
						bgColor={tendency[0][idx] == 1}
						label={item}
						key={idx}
						divide={true}
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
