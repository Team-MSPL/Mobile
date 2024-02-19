import styled from 'styled-components/native';
import {colors} from '../colors';
import {fontPercentage, heightPercentage, widthPercentage} from '../layout/responsive-size';

export default function CustomButton({marginTop, marginBottom, label, onPress, isDisabled, width}: CustomButtonProps) {
	return (
		<ButtonContainer
			marginTop={marginTop ?? 0}
			marginBottom={marginBottom ?? 0}
			disabled={isDisabled ?? false}
			isDisabledOpacity={isDisabled ?? false}
			onPress={onPress}
			width={width ?? 60}>
			<ButtonText>{label}</ButtonText>
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
};

const ButtonContainer = styled.TouchableOpacity<{
	marginBottom: number;
	marginTop: number;
	width: number;
	isDisabledOpacity: boolean;
}>`
	opacity: ${props => (props.isDisabledOpacity ? '0.5' : '1')};
	width: ${widthPercentage(327)}px;
	align-self: center;
	align-items: center;
	height: ${heightPercentage(60)}px;
	justify-content: center;
	border-radius: 17px;
	background-color: ${colors.Gray5};
	margin-top: ${props => props.marginTop}px;
	margin-bottom: ${props => props.marginBottom}px;
`;
const ButtonText = styled.Text`
	font-size: ${fontPercentage(18)}px;
	font-weight: 600;
	color: ${colors.Primary};
`;
