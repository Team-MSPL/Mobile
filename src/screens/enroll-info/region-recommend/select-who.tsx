import styled from 'styled-components/native';
import StepText from '../../../utill/component/enroll-info/step-text';
import Stepper from '../../../utill/component/enroll-info/stepper';
import TendencyButton from '../../../utill/component/tendency-button';
import {useAppSelector} from '../../../redux';
import {BackgroundGray} from '../../../utill/layout/layout';
import {heightPercentage, widthPercentage} from '../../../utill/layout/responsive-size';
import {useTendencyHandler} from '../../../utill/hooks/useTendencyHandler';
import RouteButton from '../../../utill/component/route-button';

export default function SelectWho({navigation}: any) {
	const {regionTendency} = useAppSelector(state => state.regionRecommendSlice);
	const {handleButtonClick, regionTendencyList} = useTendencyHandler();
	const handleSelect = (item: number) => {
		handleButtonClick({index: 0, region: true, item: item});
	};
	return (
		<BackgroundGray>
			<Stepper total={7} now={1}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='2.여행 스타일을 알아볼게요.'
				mainText='누구와 떠나시나요?'
				subText='* 중복 선택 가능'></StepText>
			<SelectButtonsContainer>
				{regionTendencyList[0].list.map((item, idx) => (
					<TendencyButton
						bgColor={regionTendency[0][idx] == 1}
						label={item}
						key={idx}
						divide={true}
						imageUrl={regionTendencyList[0]?.photo[idx]}
						onPress={() => {
							handleSelect(idx);
						}}></TendencyButton>
				))}
			</SelectButtonsContainer>
			<RouteButton navigation={navigation} nextTitle='RegionSelectSeason'></RouteButton>
		</BackgroundGray>
	);
}
export const SelectButtonsContainer = styled.View`
	flex: 1;
	justify-content: center;
	flex-direction: row;
	flex-wrap: wrap;
	align-items: center;
	margin-top: ${heightPercentage(134)}px;
	gap: ${widthPercentage(8)}px;
`;
