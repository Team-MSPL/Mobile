import styled from 'styled-components/native';
import {colors} from '../colors';
import {Dimensions} from 'react-native';

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

export const Divider = styled.View`
	width: 100%;
	height: 2px;
	background-color: black;
	margin: 10px 0px 10px 0px;
`;

export const MainContainer = styled.ScrollView`
	background-color: ${colors.main};
	padding: 0px 24px 24px 24px;
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
