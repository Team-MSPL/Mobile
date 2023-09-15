import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {colors} from '../colors';

export default function CustomButton({label, onPress, isDisabled}: CustomButtonProps) {
	return (
		<CustomButtonContainer>
			<ButtonContainer onPress={onPress}>
				<ButtonText>{label}</ButtonText>
			</ButtonContainer>
		</CustomButtonContainer>
	);
}

type CustomButtonProps = {
	label: string;
	onPress: () => void;
	isDisabled?: boolean;
};

const CustomButtonContainer = styled.View`
	width: 100%;
	justify-content: center;
	align-items: center;
	margin: 10px 0px 20px 0px;
`;
const ButtonContainer = styled.TouchableOpacity`
	background-color: ${colors.selectButton};
	border-radius: 30px;
	width: 60%;
	height: 50px;
	justify-content: center;
	align-items: center;
	margin: 0px 10px 0px 10px;
`;
const ButtonText = styled.Text`
	color: white;
	font-size: 18px;
	font-weight: bold;
`;
