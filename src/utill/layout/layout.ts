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
	alignItems?: string;
	deco?: string;
}>`
	width: ${props => props.width ?? null}px;
	display: inline-block;
	flex-direction: row;
	align-items: ${props => props.alignItems ?? 'center'};
	justify-content: ${props => props.justifyContent ?? null};
	gap: ${props => props.gap ?? 0}px;
	margin: ${props => props.marginVertical ?? 0}px ${props => props.marginHorizon ?? 0}px;
	${props => props.deco};
`;
export const VStack = styled.View<{
	width?: number;
	gap?: number;
	alignItems?: string;
	flex?: number;
	justifyContent?: string;
	deco?: string;
}>`
	width: ${props => props.width ?? null}px;
	display: inline-block;
	flex-direction: column;
	justify-content: ${props => props.alignItems ?? 'center'};
	align-items: ${props => props.alignItems ?? null};
	gap: ${props => props.gap ?? 0}px;
	${props => (props.flex != undefined ? `flex:${props.flex};` : '')}
	${props => props.deco}
`;
export const FlexWrap = styled.Pressable<{gap?: number; marginBottom?: number; margintop?: number; width?: number}>`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	margin-top: ${props => props.marginBottom ?? 15}px;
	margin-bottom: ${props => props.marginBottom ?? 15}px;
	gap: ${props => props.gap ?? 0}px;
	width: ${props => props.width ?? null}px;
`;

export const Divider = styled.View<{width?: number; color?: string; height: number}>`
	width: ${props => props.width + 'px' ?? '100%'};
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
export const Center = styled.View<{backgroundColor?: string}>`
	flex: 1;
	width: 100%;
	align-items: center;
	justify-content: center;
	${props => props.backgroundColor != undefined && `background-color:${props.backgroundColor}`}
`;
export const HeaderContianer = styled(HStack)`
	justify-content: space-between;
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

export const BackgroundGray = styled.View<{paddingHorizental?: number; gap?: number; marginTop?: number}>`
	flex: 1;
	background-color: ${colors.backgroundGray};
	padding: ${props => props.marginTop ?? 0}px ${props => props.paddingHorizental ?? widthPercentage(24)}px
		${heightPercentage(10)}px ${props => props.paddingHorizental ?? widthPercentage(24)}px;
	gap: ${props => props.gap ?? 0}px;
`;
export const BackgroundGrayScrollView = styled.ScrollView<{
	paddingHorizental?: number;
	gap?: number;
	marginTop?: number;
}>`
	flex: 1;
	background-color: ${colors.backgroundGray};
	padding: ${props => props.marginTop ?? 0}px ${props => props.paddingHorizental ?? widthPercentage(24)}px
		${heightPercentage(10)}px ${props => props.paddingHorizental ?? widthPercentage(24)}px;
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
	maxWidth?: number;
	marginBottom?: number;
	decoration?: string;
	deco?: string;
}>`
	font-family: PretendardVariable;
	color: ${props => props.color};
	font-size: ${props => fontPercentage(props.size)}px;
	line-height: ${props => fontPercentage(props.lineHeight)}px;
	font-weight: 500;
	width: ${props => props.width + 'px' ?? 'auto'};
	text-align: ${props => props.textAlign ?? 'auto'};
	margin-top: ${props => props.marginTop ?? 0}px;
	max-width: ${props => props.maxWidth + 'px' ?? 'auto'};
	margin-bottom: ${props => props.marginBottom ?? 0}px;
	text-decoration: ${props => props.decoration ?? null};
	${props => props.deco}
`;
export const PretendardBoldText = styled.Text<{
	color: string;
	size: number;
	textAlign?: string;
	lineHeight: number;
	marginBottom?: number;
	deco?: string;
}>`
	font-family: Pretendard-Bold;
	color: ${props => props.color ?? colors.Black};
	font-size: ${props => fontPercentage(props.size)}px;
	line-height: ${props => fontPercentage(props.lineHeight)}px;
	font-weight: 700;
	margin-bottom: ${props => props.marginBottom ?? 0}px;
	text-align: ${props => props.textAlign ?? 'auto'};
	${props => props?.deco}
`;
export const PretendardSemiBoldText = styled.Text<{
	color: string;
	size: number;
	lineHeight: number;
	width?: number;
	textDecoration?: string;
	marginBottom?: number;
	maxWidth?: number;
	textAlign?: string;
	marginTop?: number;
	deco?: string;
}>`
	font-family: Pretendard-SemiBold;
	color: ${props => props.color ?? colors.Black};
	font-size: ${props => fontPercentage(props.size)}px;
	line-height: ${props => fontPercentage(props.lineHeight)}px;
	width: ${props => props.width + 'px' ?? 'auto'};
	font-weight: 600;
	text-decoration: ${props => props.textDecoration ?? null};
	text-align: ${props => props.textAlign ?? 'auto'};
	margin-bottom: ${props => props.marginBottom ?? 0}px;
	margin-top: ${props => props.marginTop ?? 0}px;
	max-width: ${props => props.maxWidth + 'px' ?? 'auto'};
	${props => props.deco}
`;

export const TagContainer = styled.View<{backgroundColor: string; width?: number; padding?: number; height?: number}>`
	border-radius: 4px;
	background-color: ${props => props.backgroundColor};
	justify-content: space-around;
	padding: 0px ${props => props.padding ?? widthPercentage(3)}px;
	flex-direction: row;
	align-items: center;
	height: ${props => props.height ?? heightPercentage(24)}px;
	gap: ${widthPercentage(1.3)}px;
	width: ${props => props.width + 'px' ?? null};
`;

export const ImageBox = styled.Image<{width: number; height: number; deco?: string}>`
	width: ${props => props.width}px;
	height: ${props => props.height}px;
	object-fit: fill;
	${props => props?.deco}
`;
