import StepText from '../../../utill/component/enroll-info/step-text';
import Stepper from '../../../utill/component/enroll-info/stepper';
import TendencyButton from '../../../utill/component/tendency-button';
import {SelectButtonsContainer} from './select-who';
import {useAppSelector} from '../../../redux';
import {BackgroundGray, PretendardSemiBoldText} from '../../../utill/layout/layout';
import {heightPercentage, widthPercentage} from '../../../utill/layout/responsive-size';
import {useTendencyHandler} from '../../../utill/hooks/useTendencyHandler';
import RouteButton from '../../../utill/component/route-button';
import {styled} from 'styled-components/native';
import {colors} from '../../../utill/colors';
import {SVGFall, SVGSpring, SVGSummer, SVGWinter} from '../../../utill/svg/svg';

export default function SelectSeason({navigation}: any) {
	const {regionTendency} = useAppSelector(state => state.regionRecommendSlice);
	const {handleButtonClick, regionTendencyList} = useTendencyHandler();
	const handleSelect = (item: number) => {
		handleButtonClick({index: 4, region: true, item: item});
	};
	const seasonList = [
		{title: '봄', svg: <SVGSpring width={widthPercentage(50)} height={widthPercentage(50)} />},
		{title: '여름', svg: <SVGSummer width={widthPercentage(50)} height={widthPercentage(50)} />},
		{title: '가을', svg: <SVGFall width={widthPercentage(50)} height={widthPercentage(50)} />},
		{title: '겨울', svg: <SVGWinter width={widthPercentage(50)} height={widthPercentage(50)} />},
	];
	return (
		<BackgroundGray>
			<Stepper total={7} now={2}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='2.여행 스타일을 알아볼게요.'
				mainText='어떤 계절에 떠나시나요?'
				subText='* 중복 선택 가능'></StepText>
			<SelectMoveContainer>
				{regionTendencyList[4].list.map((item, idx) => (
					<SelectButton
						color={regionTendency[4][idx] == 1 ? colors.Primary : colors.Gray1}
						select={regionTendency[4][idx] == 1}
						key={idx}
						imageUrl={regionTendencyList[4]?.photo[idx]}
						onPress={() => {
							handleSelect(idx);
						}}>
						{seasonList[idx].svg}
						<PretendardSemiBoldText size={16} lineHeight={19} color={colors.Gray4}>
							{item}
						</PretendardSemiBoldText>
					</SelectButton>
				))}
			</SelectMoveContainer>
			<RouteButton navigation={navigation} nextTitle='RegionSelectConcept'></RouteButton>
		</BackgroundGray>
	);
}
const SelectMoveContainer = styled.View`
	flex: 1;
	flex-direction: row;
	align-items: flex-start;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-around;
	margin-top: ${widthPercentage(60)}px;
	gap: ${heightPercentage(10)}px;
`;
const SelectButton = styled.TouchableOpacity<{color: string; select: boolean}>`
	background-color: ${props => props.color};
	border-radius: 16px;
	width: ${widthPercentage(157)}px;
	height: ${widthPercentage(157)}px;
	align-items: center;
	justify-content: center;
	padding-bottom: ${heightPercentage(5)}px;
	gap: ${heightPercentage(13)}px;

	border-width: ${props => (props.select ? '1px' : '1px')};
	border-color: ${props => (props.select ? colors.Primary : colors.Gray1)};
	background-color: ${props => (props.select ? 'rgba(195,245,80,0.3)' : colors.Gray1)};
`;
