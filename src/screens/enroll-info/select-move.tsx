import StepText from '../../utill/component/enroll-info/step-text';
import Stepper from '../../utill/component/enroll-info/stepper';
import {BackgroundGray, PretendardSemiBoldText, VStack} from '../../utill/layout/layout';
import {useAppDispatch, useAppSelector} from '../../redux';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import RouteButton from '../../utill/component/route-button';

export default function RecommendSelectMove({navigation}: any) {
	const {transit} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();

	const moveList = [
		{
			name: '자동차 렌트카',
			function: () => dispatch(travelSliceActions.enrollTransit(0)),
			image: <MoveImage resizeMode='contain' source={require('../../../public/images/test1.png')}></MoveImage>,
		},
		{
			name: '대중교통',
			function: () => dispatch(travelSliceActions.enrollTransit(1)),
			image: <MoveImage resizeMode='contain' source={require('../../../public/images/test2.png')}></MoveImage>,
		},
	];
	return (
		<BackgroundGray>
			<Stepper total={11} now={5}></Stepper>
			<StepText
				marginTop={heightPercentage(10)}
				styleText='2.여행 스타일을 알아볼게요.'
				mainText='어떻게 이동하시나요?'
				subText='* 기본값: 자동차(렌트카)'></StepText>
			<SelectMoveContainer>
				{moveList.map((item, idx) => (
					<SelectButton
						color={idx == transit ? 'rgba(195,245,80,0.3)' : colors.Gray1}
						key={idx}
						onPress={item.function}>
						{item.image}
						<PretendardSemiBoldText size={16} lineHeight={19} color={colors.Gray4}>
							{item.name}
						</PretendardSemiBoldText>
					</SelectButton>
				))}
			</SelectMoveContainer>
			<RouteButton marginBottom={12} navigation={navigation} nextTitle='RecommendSelectBusy'></RouteButton>
		</BackgroundGray>
	);
}
const MoveImage = styled.Image`
	width: ${widthPercentage(80)}px;
	height: ${heightPercentage(130)}px;
`;
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
