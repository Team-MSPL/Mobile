import styled from 'styled-components/native';
import {colors} from '../colors';
import {heightPercentage, widthPercentage} from '../layout/responsive-size';
import {PretendardSemiBoldText} from '../layout/layout';
import {Image} from 'react-native';

export default function TendencyButton({
	onPress,
	label,
	bgColor,
	divide,
	marginBottom,
	imageUrl,
	imageSvg,
	width,
	disabled,
	textSize,
}: CustomButtonProps) {
	return (
		<ButtonContainer
			select={bgColor}
			onPress={onPress}
			divide={divide ?? false}
			marginBottom={marginBottom}
			disabled={disabled}
			width={width}>
			<PretendardSemiBoldText
				size={textSize ?? 16}
				lineHeight={(textSize ?? 15.09) + 4}
				color={bgColor ? colors.Gray5 : colors.Gray4}>
				{label}
			</PretendardSemiBoldText>
			{imageUrl && (
				<Image
					style={{width: widthPercentage(20), height: widthPercentage(20)}}
					resizeMode='contain'
					source={imageUrl}></Image>
			)}
			{imageSvg && imageSvg}
		</ButtonContainer>
	);
}

type CustomButtonProps = {
	onPress: () => void;
	label: string | number;
	bgColor: boolean;
	divide?: boolean;
	marginBottom?: number;
	imageUrl?: string;
	width?: number;
	imageSvg?: any;
	disabled?: boolean;
	textSize?: number;
};
const ButtonContainer = styled.TouchableOpacity<{
	select: boolean;
	divide: boolean;
	marginBottom?: number;
	width?: number;
}>`
	width: ${props => (props.divide ? props.width ?? widthPercentage(159) + 'px' : widthPercentage(327) + 'px')};
	align-items: center;
	height: ${heightPercentage(60)}px;
	padding: ${props => (props.divide ? heightPercentage(10) + 'px ' + widthPercentage(13) + 'px' : '0px')};
	justify-content: center;
	border-radius: 8px;
	border-width: ${props => (props.select ? '1px' : '1px')};
	border-color: ${props => (props.select ? colors.Primary : colors.Gray1)};
	background-color: ${props => (props.select ? 'rgba(195,245,80,0.3)' : colors.Gray1)};
	margin-bottom: ${props => props.marginBottom ?? heightPercentage(10)}px;
	flex-direction: row;
	gap: ${widthPercentage(5)}px;
`;
