import StepText from '../../utill/component/enroll-info/step-text';
import Stepper from '../../utill/component/enroll-info/stepper';
import {BackgroundGray, PretendardSemiBoldText} from '../../utill/layout/layout';
import TendencyButton from '../../utill/component/tendency-button';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import {SelectButtonsContainer} from './region-recommend/select-who';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import RouteButton from '../../utill/component/route-button';
import {styled} from 'styled-components/native';
import {colors} from '../../utill/colors';
import {Image} from 'react-native';

export default function RecommendSelectBusy({navigation}: any) {
	const {bandwidth} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const moveList = [
		{
			name: '알찬 일정',
			function: () => dispatch(travelSliceActions.enrollBandwidth(false)),
			photo: require('../../../public/tendency/busy.png'),
		},
		{
			name: '여유있는 일정',
			function: () => dispatch(travelSliceActions.enrollBandwidth(true)),
			photo: require('../../../public/tendency/non-busy.png'),
		},
	];
	return (
		<BackgroundGray>
			<Stepper total={13} now={9}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='2.여행 스타일을 알아볼게요.'
				mainText='어떤 여행을 원하시나요?'
				subText='* 기본값: 여유있는 일정'></StepText>
			<SelectMoveContainer>
				{moveList.map((item, idx) => (
					<SelectButton
						color={bandwidth == Boolean(idx) ? 'rgba(195,245,80,0.3)' : colors.Gray1}
						key={idx}
						onPress={item.function}>
						<Image
							style={{width: widthPercentage(40), height: widthPercentage(40)}}
							resizeMode='contain'
							source={item.photo}></Image>
						<PretendardSemiBoldText size={16} lineHeight={19} color={colors.Gray4}>
							{item.name}
						</PretendardSemiBoldText>
					</SelectButton>
					// <TendencyButton
					// 	bgColor={bandwidth == Boolean(idx)}
					// 	label={item.name}
					// 	imageUrl={item.photo}
					// 	key={idx}
					// 	onPress={item.function}></TendencyButton>
				))}
			</SelectMoveContainer>
			<RouteButton navigation={navigation} nextTitle='RecommendSelectConcept'></RouteButton>
		</BackgroundGray>
	);
}
const SelectMoveContainer = styled.View`
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: space-around;
`;
const SelectButton = styled.TouchableOpacity<{color: string}>`
	background-color: ${props => props.color};
	border-radius: 16px;
	width: ${widthPercentage(157)}px;
	height: ${widthPercentage(157)}px;
	align-items: center;
	justify-content: center;
	padding-bottom: ${heightPercentage(5)}px;
	gap: ${heightPercentage(10)}px;
`;
