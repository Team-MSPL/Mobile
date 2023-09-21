import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {colors} from '../colors';

export default function SelectButton({label, onPress, isDisabled, bgColor}: CustomButtonProps) {
	return (
		<ButtonContainer onPress={onPress}>
			<ButtonText>{label}</ButtonText>
		</ButtonContainer>
	);
}

type CustomButtonProps = {
	label: string | number;
	onPress: () => void;
	isDisabled?: boolean;
	bgColor?: boolean;
};
const ButtonText = styled.Text`
	color: white;
	font-size: 18px;
	font-weight: bold;
`;

const ButtonContainer = styled.TouchableOpacity`
	align-items: center;
	height: 45px;
	padding: 0px 10px 0px 10px;
	justify-content: center;
	background-color: ${colors.selectButton};
	border-radius: 25px;
	margin: 5px 10px 5px 10px;
`;
