import styled from 'styled-components/native';
import {colors} from '../colors';
import {PretendardVariable} from '../layout/layout';
import {fontPercentage, heightPercentage} from '../layout/responsive-size';

export default function PrimaryButton({width, height, label, onPress}: PrimarybuttonType) {
	return (
		<PrimaryButtonContainer width={width} height={height} onPress={onPress}>
			<InsideText>{label}</InsideText>
		</PrimaryButtonContainer>
	);
}

const PrimaryButtonContainer = styled.TouchableOpacity<{width: number; height: number}>`
	width: ${props => props.width}px;
	height: ${props => props.height}px;
	background-color: ${colors.Primary};
	align-items: center;
	justify-content: center;
	border-radius: 8px;
`;
const InsideText = styled(PretendardVariable)`
	font-size: ${fontPercentage(14)}px;
	color: ${colors.Black};
	line-height: ${heightPercentage(21)}px;
`;

interface PrimarybuttonType {
	width: number;
	height: number;
	label: string;
	onPress: () => void;
}
