import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {colors} from '../colors';

export default function CustomButton({label, onPress, isDisabled, width}: CustomButtonProps) {
	return (
		<CustomButtonContainer>
			<ButtonContainer
				disabled={isDisabled ?? false}
				isDisabledOpacity={isDisabled ?? false}
				onPress={onPress}
				width={width ?? 60}>
				<ButtonText>{label}</ButtonText>
			</ButtonContainer>
		</CustomButtonContainer>
	);
}

type CustomButtonProps = {
	label: string;
	onPress: () => void;
	isDisabled?: boolean;
	width?: number;
};

const CustomButtonContainer = styled.View`
	width: 100%;
	justify-content: center;
	align-items: center;
	margin: 10px 0px 20px 0px;
`;
const ButtonContainer = styled.TouchableOpacity<{width: number; isDisabledOpacity: boolean}>`
	background-color: ${colors.selectButton};
	border-radius: 30px;
	width: ${props => props.width}%;
	height: 50px;
	justify-content: center;
	align-items: center;
	margin: 0px 10px 0px 10px;
	opacity: ${props => (props.isDisabledOpacity ? '0.5' : '1')};
`;
const ButtonText = styled.Text`
	color: white;
	font-size: 18px;
	font-weight: 500;
`;
