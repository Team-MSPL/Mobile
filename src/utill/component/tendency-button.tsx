import styled from 'styled-components/native';
import {colors} from '../colors';
import {fontPercentage, heightPercentage, widthPercentage} from '../layout/responsive-size';

export default function TendencyButton({onPress, label, bgColor, divide}: CustomButtonProps) {
	return (
		<ButtonContainer select={bgColor} onPress={onPress} divide={divide ?? false}>
			<ButtonText select={bgColor}>{label}</ButtonText>
		</ButtonContainer>
	);
}

type CustomButtonProps = {
	onPress: () => void;
	label: string | number;
	bgColor: boolean;
	divide?: boolean;
};
const ButtonContainer = styled.TouchableOpacity<{select: boolean; divide: boolean}>`
	width: ${props => (props.divide ? 'null' : widthPercentage(343) + 'px')};
	align-items: center;
	height: ${heightPercentage(67)}px;
	padding: ${props => (props.divide ? heightPercentage(10) + 'px ' + widthPercentage(48) + 'px' : '0px')};
	justify-content: center;
	border-radius: 17px;
	background-color: ${props => (props.select ? colors.Primary : colors.Gray1)};
	margin-bottom: ${heightPercentage(10)}px;
	margin-left: ${widthPercentage(16)}px;
`;
const ButtonText = styled.Text<{select: boolean}>`
	color: ${props => (props.select ? colors.Gray5 : colors.Gray4)};
	font-size: ${fontPercentage(16)}px;
	font-weight: 600;
	line-height: ${fontPercentage(19.09)}px;
`;
