import styled from 'styled-components/native';
import {colors} from '../colors';
import {PretendardBoldText} from '../layout/layout';

export default function SelectButton({label, onPress, isDisabled, bgColor}: CustomButtonProps) {
	return (
		<ButtonContainer onPress={onPress}>
			<PretendardBoldText size={16} lineHeight={21.6} color={colors.backgroundWhite}>
				{label}
			</PretendardBoldText>
		</ButtonContainer>
	);
}

type CustomButtonProps = {
	label: string | number;
	onPress: () => void;
	isDisabled?: boolean;
	bgColor?: boolean;
};

const ButtonContainer = styled.TouchableOpacity`
	align-items: center;
	height: 45px;
	padding: 0px 10px 0px 10px;
	justify-content: center;
	background-color: ${colors.Primary};
	border-radius: 25px;
	margin: 5px 10px 5px 10px;
`;
