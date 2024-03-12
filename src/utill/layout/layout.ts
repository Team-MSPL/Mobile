import {Dimensions} from 'react-native';
import styled from 'styled-components/native';
import {colors} from '../colors';
import {fontPercentage, heightPercentage, widthPercentage} from './responsive-size';

export const devicesWidth = Dimensions.get('window').width;
export const devicesHeight = Dimensions.get('window').height;
export const HStack = styled.View<{
	justifyContent?: string;
	gap?: number;
	width?: number;
	marginVertical?: number;
	marginHorizon?: number;
}>`
	width: ${props => props.width ?? null}px;
	display: inline-block;
	flex-direction: row;
	align-items: center;
	justify-content: ${props => props.justifyContent ?? null};
	gap: ${props => props.gap ?? 0}px;
	margin: ${props => props.marginVertical ?? 0}px ${props => props.marginHorizon ?? 0}px;
`;
export const VStack = styled.View<{width?: number; gap?: number; alignItems?: string}>`
	width: ${props => props.width ?? null}px;
	display: inline-block;
	flex-direction: column;
	justify-content: center;
	align-items: ${props => props.alignItems ?? null};
	gap: ${props => props.gap ?? 0}px;
`;
export const FlexWrap = styled.View<{gap?: number; marginBottom?: number}>`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	margin-bottom: ${props => props.marginBottom ?? 15}px;
	gap: ${props => props.gap ?? 0}px;
`;

export const Divider = styled.View<{color?: string; height: number}>`
	width: 100%;
	height: ${props => props.height ?? 2}px;
	background-color: ${props => props.color ?? 'black'};
	margin: 10px 0px 10px 0px;
`;

export const MainContainer = styled.ScrollView`
	background-color: ${colors.backgroundGray};
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
	flex: 1;
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

export const BackgroundGray = styled.View<{paddingHorizental?: number; gap?: number}>`
	flex: 1;
	background-color: ${colors.backgroundGray};
	padding: 0px ${props => props.paddingHorizental ?? widthPercentage(24)}px;
	gap: ${props => props.gap ?? 0}px;
`;

export const PretendardVariable = styled.Text`
	font-family: PretendardVariable;
`;
export const PretendardBold = styled.Text`
	font-family: Pretendard-Bold;
`;
export const PretendardSemiBold = styled.Text`
	font-family: Pretendard-SemiBold;
`;

export const PretendardVariableText = styled.Text<{
	color: string;
	size: number;
	lineHeight: number;
	width?: number;
	textAlign?: string;
	marginTop?: number;
}>`
	font-family: PretendardVariable;
	color: ${props => props.color};
	font-size: ${props => fontPercentage(props.size)}px;
	line-height: ${props => fontPercentage(props.lineHeight)}px;
	font-weight: 500;
	width: ${props => props.width + 'px' ?? 'auto'};
	text-align: ${props => props.textAlign ?? 'auto'};
	margin-top: ${props => props.marginTop ?? 0}px;
`;
export const PretendardBoldText = styled.Text<{color: string; size: number; lineHeight: number}>`
	font-family: Pretendard-Bold;
	color: ${props => props.color ?? colors.Black};
	font-size: ${props => fontPercentage(props.size)}px;
	line-height: ${props => fontPercentage(props.lineHeight)}px;
	font-weight: 700;
`;
export const PretendardSemiBoldText = styled.Text<{
	color: string;
	size: number;
	lineHeight: number;
	width?: number;
	textDecoration?: string;
}>`
	font-family: Pretendard-SemiBold;
	color: ${props => props.color ?? colors.Black};
	font-size: ${props => fontPercentage(props.size)}px;
	line-height: ${props => fontPercentage(props.lineHeight)}px;
	width: ${props => props.width + 'px' ?? 'auto'};
	font-weight: 600;
	text-decoration: ${props => props.textDecoration ?? null};
`;

export const TagContainer = styled.View<{backgroundColor: string; width?: number; padding?: number; height?: number}>`
	border-radius: 4px;
	background-color: ${props => props.backgroundColor};
	justify-content: space-around;
	padding: ${props => props.padding ?? widthPercentage(3)}px;
	flex-direction: row;
	align-items: center;
	height: ${props => props.height ?? heightPercentage(24)}px;
	gap: ${widthPercentage(1.3)}px;
	width: ${props => props.width + 'px' ?? null};
`;
