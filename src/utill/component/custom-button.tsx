import styled from 'styled-components/native';
import {colors} from '../colors';
import {heightPercentage, widthPercentage} from '../layout/responsive-size';
import {PretendardSemiBoldText} from '../layout/layout';

export default function CustomButton({
	marginTop,
	marginBottom,
	label,
	onPress,
	isDisabled,
	width,
	divide,
	textColor,
	bgColor,
	deco,
}: CustomButtonProps) {
	return (
		<ButtonContainer
			marginTop={marginTop ?? 0}
			marginBottom={marginBottom ?? 0}
			disabled={isDisabled ?? false}
			isDisabledOpacity={isDisabled ?? false}
			bgColor={bgColor ?? undefined}
			onPress={onPress}
			width={width}
			divide={divide}
			deco={deco ?? ''}>
			<PretendardSemiBoldText size={18} lineHeight={23.48} color={textColor ?? colors.Primary}>
				{label}
			</PretendardSemiBoldText>
		</ButtonContainer>
	);
}

type CustomButtonProps = {
	marginBottom?: number;
	marginTop?: number;
	label: string;
	onPress: () => void;
	isDisabled?: boolean;
	width?: number;
	divide?: boolean;
	textColor?: string;
	bgColor?: string;
	deco?: string;
};

const ButtonContainer = styled.TouchableOpacity<{
	marginBottom: number;
	marginTop: number;
	width?: number;
	isDisabledOpacity: boolean;
	divide?: boolean;
	bgColor?: string;
	deco?: string;
}>`
	opacity: ${props => (props.isDisabledOpacity ? '0.5' : '1')};
	width: ${props => (props.divide ?? false ? widthPercentage(160) : props.width ?? widthPercentage(327))}px;
	align-self: center;
	align-items: center;
	height: ${heightPercentage(60)}px;
	justify-content: center;
	border-radius: 8px;
	background-color: ${props => props.bgColor ?? colors.Gray5};
	margin-top: ${props => heightPercentage(props.marginTop)}px;
	margin-bottom: ${props => heightPercentage(props.marginBottom)}px;
	${props => props.deco}
`;
