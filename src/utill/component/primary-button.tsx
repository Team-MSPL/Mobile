import styled from 'styled-components/native';
import {colors} from '../colors';
import {PretendardVariable} from '../layout/layout';
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
}: PrimarybuttonType) {
	return (
		<PrimaryButtonContainer
			alignSelf={alignSelf ?? 'null'}
			width={width}
			height={height}
			onPress={onPress}
			backgroundColor={backgroundColor}
			disabled={disabled ?? false}>
			<InsideText textColor={textColor}>{label}</InsideText>
		</PrimaryButtonContainer>
	);
}

const PrimaryButtonContainer = styled.TouchableOpacity<{
	width: number;
	height: number;
	backgroundColor: string;
	alignSelf: string;
}>`
	width: ${props => props.width}px;
	height: ${props => props.height}px;
	background-color: ${props => props.backgroundColor};
	align-items: center;
	justify-content: center;
	border-radius: 8px;
	align-self: ${props => props.alignSelf};
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
}
