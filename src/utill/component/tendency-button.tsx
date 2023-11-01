import styled from 'styled-components/native';
import {colors} from '../colors';

export default function TendencyButton({label, bgColor}: CustomButtonProps) {
	return (
		<ButtonContainer>
			<ButtonText select={bgColor}>{label}</ButtonText>
		</ButtonContainer>
	);
}

type CustomButtonProps = {
	label: string | number;
	bgColor: boolean;
};
const ButtonContainer = styled.View`
	margin: 10px 20px 10px 20px;
	align-items: center;
	height: 50px;
	justify-content: center;
`;
const ButtonText = styled.Text<{select: boolean}>`
	color: ${props => (props.select ? colors.selectButton : 'grey')};
	font-size: 18px;
	font-weight: 500;
`;
