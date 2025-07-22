import {styled} from 'styled-components/native';
import {colors} from '../../../utill/colors';
import {BackgroundGray, PretendardSemiBoldText} from '../../../utill/layout/layout';
import {heightPercentage, widthPercentage} from '../../../utill/layout/responsive-size';
import {SvgBagIcon, SvgBuildingIcon, SVGPlus, SvgSpoonIcon} from '../../../utill/svg/svg';

export default function AddCategory({navigation, route}: any) {
	const moveList = [
		{
			name: '여행지',
			function: () => navigation.navigate('AddSearchRecommend', {title: 'travle', info: route.params?.info}),
			photo: <SvgBagIcon color={colors.Gray400} width={widthPercentage(48)} height={widthPercentage(48)} />,
		},
		{
			name: '숙소',
			function: () =>
				navigation.navigate('AddSearchRecommend', {title: 'accommodation', info: route.params?.info}),
			photo: <SvgBuildingIcon color={colors.Gray400} />,
		},
		{
			name: '식당/카페',
			function: () => navigation.navigate('AddSearchRecommend', {title: 'cafe', info: route.params?.info}),
			photo: <SvgSpoonIcon color={colors.Gray400} />,
		},
		{
			name: '직접추가',
			function: () => navigation.navigate('AddInPerson', {title: ''}),
			photo: <SVGPlus color={colors.Gray400} width={widthPercentage(55)} height={widthPercentage(55)} />,
		},
	];
	return (
		<BackgroundGray backgroundColor={colors.backgroundWhite}>
			<PretendardSemiBoldText
				size={24}
				lineHeight={28}
				color={colors.Black}
				deco={`text-align:center;margin-top:${widthPercentage(20)}px;margin-bottom:${widthPercentage(30)}px;`}>
				무엇을 추가할지 골라보세요!
			</PretendardSemiBoldText>
			<SelectMoveContainer>
				{moveList.map((item, idx) => (
					<SelectButton color={colors.backgroundGray} key={idx} onPress={item.function}>
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
	flex-wrap: wrap;
	gap: ${widthPercentage(10)}px;
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
