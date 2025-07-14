import {styled} from 'styled-components/native';
import {colors} from '../../../utill/colors';
import TendencyButton from '../../../utill/component/tendency-button';
import {BackgroundGray, PretendardSemiBoldText} from '../../../utill/layout/layout';
import {heightPercentage, widthPercentage} from '../../../utill/layout/responsive-size';
import {
	SvgAirplain,
	SvgAirPort,
	SvgAirPortIcon,
	SvgAirPortIngIcon,
	SvgTrain,
	SvgTrainIcon,
} from '../../../utill/svg/svg';
import {SelectButtonsContainer} from '../region-recommend/select-who';

export default function ChoiceTransit({navigation}: any) {
	const moveList = [
		{
			name: '항공',
			function: () => navigation.navigate('RegistTransit', {title: 'airport'}),
			photo: (
				<SvgAirplain
					transform={90}
					color={colors.Gray400}
					width={widthPercentage(48)}
					height={widthPercentage(48)}
				/>
			),
		},
		{
			name: '기차',
			function: () => navigation.navigate('RegistTransit', {title: 'train'}),
			photo: <SvgTrainIcon color={colors.Gray400} />,
		},
	];
	return (
		<BackgroundGray backgroundColor={colors.backgroundWhite}>
			<PretendardSemiBoldText
				size={26}
				lineHeight={30}
				color={colors.Black}
				deco={`margin-top:${widthPercentage(42)}px;text-align:center;`}>
				어떻게 이동하시나요?
			</PretendardSemiBoldText>
			<SelectMoveContainer>
				{moveList.map((item, idx) => (
					<SelectButton color={colors.Gray1} key={idx} onPress={item.function}>
						{item.photo}
						<PretendardSemiBoldText size={16} lineHeight={19} color={colors.Gray4}>
							{item.name}
						</PretendardSemiBoldText>
					</SelectButton>
				))}
			</SelectMoveContainer>
		</BackgroundGray>
	);
}

const SelectMoveContainer = styled.View`
	flex: 1;
	flex-direction: row;
	align-items: flex-start;
	justify-content: space-around;
	margin-top: ${widthPercentage(79)}px;
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
