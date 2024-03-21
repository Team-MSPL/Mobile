import styled from 'styled-components/native';
import {colors} from '../colors';
import {PretendardSemiBoldText, PretendardVariable} from '../layout/layout';
import {fontPercentage, heightPercentage} from '../layout/responsive-size';

export default function PrimaryButton({
	width,
	height,
	label,
	backgroundColor,
	textColor,
	onPress,
	disabled,
	alignSelf,
	marginBottom,
	textSize,
	lineHeight,
}: PrimarybuttonType) {
	return (
		<PrimaryButtonContainer
			alignSelf={alignSelf ?? 'null'}
			width={width}
			height={height}
			onPress={onPress}
			backgroundColor={backgroundColor}
			marginBottom={marginBottom ?? 0}
			disabled={disabled ?? false}>
			<PretendardSemiBoldText size={textSize ?? 14} lineHeight={lineHeight ?? 21} color={textColor}>
				{label}
			</PretendardSemiBoldText>
		</PrimaryButtonContainer>
	);
}

const PrimaryButtonContainer = styled.TouchableOpacity<{
	width: number;
	height: number;
	backgroundColor: string;
	alignSelf: string;
	marginBottom?: number;
}>`
	width: ${props => props.width}px;
	height: ${props => props.height}px;
	background-color: ${props => props.backgroundColor};
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	align-self: ${props => props.alignSelf};
	margin-bottom: ${props => props.marginBottom}px;
`;
const InsideText = styled(PretendardVariable)<{
	textColor: string;
}>`
	font-size: ${fontPercentage(14)}px;
	color: ${props => props.textColor};
	line-height: ${heightPercentage(21)}px;
`;

interface PrimarybuttonType {
	width: number;
	height: number;
	label: string;
	backgroundColor: string;
	textColor: string;
	onPress: () => void;
	disabled?: boolean;
	alignSelf?: string;
	marginBottom?: number;
	textSize?: number;
	lineHeight?: number;
}
