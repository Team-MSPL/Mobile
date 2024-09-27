import styled from 'styled-components/native';
import StepText from '../../utill/component/enroll-info/step-text';
import Stepper from '../../utill/component/enroll-info/stepper';
import {BackgroundGray} from '../../utill/layout/layout';
import TendencyButton from '../../utill/component/tendency-button';
import CustomButton from '../../utill/component/custom-button';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {useAppSelector} from '../../redux';
import {useTendencyHandler} from '../../utill/hooks/useTendencyHandler';

export default function RecommendSelectTour({navigation}: any) {
	const {tendency} = useAppSelector(state => state.travelSlice);
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
				styleText='2.여행 스타일을 알아볼게요.'
				mainText='어디를 가고 싶으신가요?'
				subText='* 중복 선택 가능'
				warningText={
					tendency[0][tendency[0].length - 1] == 1 && tendency[3][5] == 1
						? '반려동물과 실내 여행지는 함께 선택할 수 없어요'
						: ''
				}></StepText>
			<ButtonsContainer>
				{tendencyList[3]?.list.map((item, idx) => (
					<TendencyButton
						marginBottom={0}
						bgColor={tendency[3][idx] == 1}
						label={item}
						divide={true}
						key={idx}
						imageUrl={tendencyList[3]?.photo[idx]}
						onPress={() => {
							handleSelect(idx);
						}}></TendencyButton>
				))}
			</ButtonsContainer>
			<CustomButton
				isDisabled={tendency[0][tendency[0].length - 1] == 1 && tendency[3][5] == 1}
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
	align-content: flex-end;
	gap: ${widthPercentage(10)}px;
`;
