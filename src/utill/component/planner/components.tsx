import {styled} from 'styled-components/native';
import {colors} from '../../colors';
import {heightPercentage, widthPercentage} from '../../layout/responsive-size';

export const LeftBar = styled.View<{color: string}>`
	width: ${widthPercentage(5)}px;
	height: ${widthPercentage(34)}px;
	background-color: ${props => props.color};
	border-radius: 12px;
`;
export const RegistButton = styled.TouchableOpacity<{color: string}>`
	width: ${widthPercentage(136)}px;
	height: ${widthPercentage(34)}px;
	background-color: ${props => props.color};
	border-radius: 8px;
	align-items: center;
	justify-content: center;
`;
