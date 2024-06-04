import styled from 'styled-components/native';
import {colors} from '../colors';
import {fontPercentage, heightPercentage, widthPercentage} from '../layout/responsive-size';

export default function TendencyButton({onPress, label, bgColor, divide, marginBottom}: CustomButtonProps) {
	return (
		<ButtonContainer select={bgColor} onPress={onPress} divide={divide ?? false} marginBottom={marginBottom}>
			<ButtonText select={bgColor}>{label}</ButtonText>
		</ButtonContainer>
	);
}

type CustomButtonProps = {
	onPress: () => void;
	label: string | number;
	bgColor: boolean;
	divide?: boolean;
	marginBottom?: number;
};
const ButtonContainer = styled.TouchableOpacity<{select: boolean; divide: boolean; marginBottom?: number}>`
	width: ${props => (props.divide ? 'null' : widthPercentage(327) + 'px')};
	align-items: center;
	height: ${heightPercentage(60)}px;
	padding: ${props => (props.divide ? heightPercentage(10) + 'px ' + widthPercentage(33) + 'px' : '0px')};
	justify-content: center;
	border-radius: 17px;
	border-width: ${props => (props.select ? '1px' : '1px')};
	border-color: ${props => (props.select ? colors.Primary : colors.Gray1)};
	background-color: ${props => (props.select ? 'rgba(195,245,80,0.3)' : colors.Gray1)};
	margin-bottom: ${props => props.marginBottom ?? heightPercentage(10)}px;
`;
const ButtonText = styled.Text<{select: boolean}>`
	color: ${props => (props.select ? colors.Gray5 : colors.Gray4)};
	font-size: ${fontPercentage(16)}px;
	font-weight: 600;
	line-height: ${fontPercentage(19.09)}px;
`;
