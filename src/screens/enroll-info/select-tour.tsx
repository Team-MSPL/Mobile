import styled from 'styled-components/native';
import StepText from '../../utill/component/enroll-info/step-text';
import Stepper from '../../utill/component/enroll-info/stepper';
import {BackgroundGray} from '../../utill/layout/layout';
import TendencyButton from '../../utill/component/tendency-button';
import CustomButton from '../../utill/component/custom-button';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {useAppDispatch, useAppSelector} from '../../redux';
import {useTendencyHandler} from '../../utill/hooks/useTendencyHandler';

export default function RecommendSelectTour({navigation}: any) {
	const {tendency} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const goNext = () => {
		navigation.navigate('SelectDistance');
	};
	const {handleButtonClick, tendencyList} = useTendencyHandler();
	const handleSelect = (item: number) => {
		handleButtonClick({index: 3, region: false, item: item});
	};
	return (
		<BackgroundGray>
			<Stepper total={11} now={9}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='1.여행 스타일을 알아볼게요.'
				mainText='어디를 가고 싶으신가요?'
				subText='* 중복 선택 가능'></StepText>
			<ButtonsContainer>
				{tendencyList[3]?.list.map((item, idx) => (
					<TendencyButton
						bgColor={tendency[3][idx] == 1}
						label={item}
						divide={true}
						key={idx}
						onPress={() => {
							handleSelect(idx);
						}}></TendencyButton>
				))}
			</ButtonsContainer>
			<CustomButton
				marginTop={heightPercentage(10)}
				marginBottom={12}
				onPress={goNext}
				label='다음'></CustomButton>
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
