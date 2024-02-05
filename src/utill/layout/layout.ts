import {Dimensions} from 'react-native';
import styled from 'styled-components/native';
import {colors} from '../colors';

export const devicesWidth = Dimensions.get('window').width;
export const devicesHeight = Dimensions.get('window').height;
export const HStack = styled.View`
	display: inline-block;
	flex-direction: row;
	align-items: center;
`;
export const VStack = styled.View`
	display: inline-block;
	flex-direction: column;
	justify-content: center;
`;
export const FlexWrap = styled.View`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	margin-bottom: 15px;
`;

export const Divider = styled.View<{color?: string; height: number}>`
	width: 100%;
	height: ${props => props.height ?? 2}px;
	background-color: ${props => props.color ?? 'black'};
	margin: 10px 0px 10px 0px;
`;

export const MainContainer = styled.ScrollView`
	background-color: ${colors.main};
	width: 100%;
`;
export const MainText = styled.Text`
	font-size: 22px;
	font-weight: bold;
	color: black;
`;
export const SubText = styled.Text`
	font-size: 17px;
	font-weight: bold;
	color: black;
`;
export const Center = styled.View`
	width: 100%;
	align-items: center;
	justify-content: center;
`;
export const HeaderContianer = styled(HStack)`
	justify-content: space-between;
`;
export const HeaderText = styled.Text`
	font-size: 20px;
	font-weight: bold;
	color: ${colors.selectButton};
	margin: 0px 5px;
`;
export const InputWrap = styled.View`
	flex-direction: row;
	align-self: center;
	justify-content: center;
	display: flex;
	width: 100%;
	margin: 0px 0px 20px 0px;
	border-width: 1px;
	border-radius: 8px;
	height: 50px;
`;
export const ClearTouchableOpacity = styled.TouchableOpacity`
	width: 20%;
	align-items: center;
	justify-content: center;
`;

export const BackgroundGray = styled.View`
	flex: 1;
	background-color: ${colors.backgroundGray};
`;
