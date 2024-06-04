import styled from 'styled-components/native';
import StepText from '../../utill/component/enroll-info/step-text';
import Stepper from '../../utill/component/enroll-info/stepper';
import {BackgroundGray} from '../../utill/layout/layout';
import TendencyButton from '../../utill/component/tendency-button';
import CustomButton from '../../utill/component/custom-button';
import {useAppSelector} from '../../redux';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {useTendencyHandler} from '../../utill/hooks/useTendencyHandler';

export default function RecommendSelectPlay({navigation}: any) {
	const {tendency} = useAppSelector(state => state.travelSlice);
	const goNext = () => {
		navigation.navigate('RecommendSelectTour');
	};

	const {handleButtonClick, tendencyList} = useTendencyHandler();
	const handleSelect = (item: number) => {
		handleButtonClick({index: 2, region: false, item: item});
	};
	return (
		<BackgroundGray>
			<Stepper total={11} now={8}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='2.여행 스타일을 알아볼게요.'
				mainText='무엇을 하고 싶으신가요?'
				subText='* 중복 선택 가능'></StepText>
			<ButtonsContainer>
				{tendencyList[2]?.list.map((item, idx) => (
					<TendencyButton
						marginBottom={0}
						bgColor={tendency[2][idx] == 1}
						label={item}
						key={idx}
						divide={true}
						onPress={() => {
							handleSelect(idx);
						}}></TendencyButton>
				))}
			</ButtonsContainer>
			<CustomButton
				marginBottom={12}
				marginTop={heightPercentage(10)}
				onPress={goNext}
				label='다음'></CustomButton>
		</BackgroundGray>
	);
}
const ButtonsContainer = styled.View`
	flex: 1;
	align-content: flex-end;
	justify-content: center;
	flex-direction: row;
	flex-wrap: wrap;
	gap: ${widthPercentage(10)}px;
`;
