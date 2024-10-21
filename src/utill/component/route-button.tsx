import styled from 'styled-components/native';
import {colors} from '../colors';
import {heightPercentage, widthPercentage} from '../layout/responsive-size';
import {HStack, PretendardSemiBoldText} from '../layout/layout';
import {SVGRightAdd} from '../svg/svg';

export default function RouteButton({
	marginTop,
	marginBottom,
	navigation,
	nextTitle,
	goNext,
	isDisabled,
}: RouteButtonProps) {
	const handleBack = () => {
		navigation.goBack();
	};
	const handleNext = () => {
		goNext ? goNext() : navigation.navigate(nextTitle);
	};
	return (
		<HStack
			justifyContent='space-between'
			style={{position: 'absolute', alignSelf: 'center', bottom: 10, width: widthPercentage(328)}}>
			<ButtonContainer marginTop={marginTop ?? 0} marginBottom={marginBottom ?? 0} onPress={handleBack}>
				<SVGRightAdd
					style={{position: 'absolute', left: widthPercentage(28)}}
					color={colors.Primary}
					transform={180}
				/>
				<PretendardSemiBoldText size={18} lineHeight={23.48} color={colors.Primary}>
					이전
				</PretendardSemiBoldText>
			</ButtonContainer>
			<ButtonContainer
				disabled={isDisabled}
				marginTop={marginTop ?? 0}
				marginBottom={marginBottom ?? 0}
				onPress={handleNext}>
				<PretendardSemiBoldText size={18} lineHeight={23.48} color={colors.Primary}>
					다음
				</PretendardSemiBoldText>
				<SVGRightAdd style={{position: 'absolute', right: widthPercentage(28)}} color={colors.Primary} />
			</ButtonContainer>
		</HStack>
	);
}

type RouteButtonProps = {
	marginBottom?: number;
	marginTop?: number;
	navigation: any;
	nextTitle: string;
	goNext?: () => void;
	isDisabled?: boolean;
};

const ButtonContainer = styled.TouchableOpacity<{
	marginBottom: number;
	marginTop: number;
}>`
	width: ${widthPercentage(160)}px;
	align-self: center;
	align-items: center;
	height: ${heightPercentage(60)}px;
	padding: 0px ${widthPercentage(20)}px;
	border-radius: 17px;
	background-color: ${colors.Gray5};
	margin-top: ${props => heightPercentage(props.marginTop)}px;
	margin-bottom: ${props => heightPercentage(props.marginBottom)}px;
	flex-direction: row;
	justify-content: center;
`;
