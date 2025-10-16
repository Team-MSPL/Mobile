import styled from 'styled-components/native';
import {colors} from '../colors';
import {heightPercentage, widthPercentage} from '../layout/responsive-size';
import {HStack, PretendardSemiBoldText} from '../layout/layout';
import {SVGRightAdd} from '../svg/svg';

export default function RouteButton({
	marginTop,
	marginBottom,
	navigation,
	nextTitle,
	goNext,
	isDisabled,
	btnFunction,
	LeftBtnFunction,
	nextText,
	leftText,
	type,
	resize,
}: RouteButtonProps) {
	const handleBack = () => {
		LeftBtnFunction ? LeftBtnFunction() : navigation.goBack();
	};
	const handleNext = () => {
		btnFunction && btnFunction();
		goNext ? goNext() : !!nextTitle && navigation.navigate(nextTitle);
	};
	return (
		<HStack
			justifyContent='space-between'
			style={{position: 'absolute', alignSelf: 'center', bottom: 10, width: widthPercentage(328)}}>
			<ButtonContainer
				marginTop={marginTop ?? 0}
				marginBottom={marginBottom ?? 0}
				onPress={handleBack}
				type={type ?? 'planner'}
				before={true}
				resize={resize ?? false}>
				{/* <SVGRightAdd
					style={{position: 'absolute', left: widthPercentage(16)}}
					color={colors.Primary}
					transform={180}
				/> */}
				<PretendardSemiBoldText size={18} lineHeight={23.48} color={colors.Gray400}>
					{leftText ?? '이전으로'}
				</PretendardSemiBoldText>
			</ButtonContainer>
			<ButtonContainer
				disabled={isDisabled}
				isActive={isDisabled}
				marginTop={marginTop ?? 0}
				marginBottom={marginBottom ?? 0}
				onPress={handleNext}
				type={type ?? 'default'}
				resize={resize ?? false}
				before={false}>
				<PretendardSemiBoldText
					size={18}
					lineHeight={23.48}
					color={type == 'planner' ? colors.backgroundWhite : colors.Gray5}>
					{nextText ?? '다음으로'}
				</PretendardSemiBoldText>
				{/* <SVGRightAdd style={{position: 'absolute', right: widthPercentage(16)}} color={colors.Primary} /> */}
			</ButtonContainer>
		</HStack>
	);
}

type RouteButtonProps = {
	marginBottom?: number;
	marginTop?: number;
	navigation: any;
	nextTitle?: string;
	goNext?: () => void;
	isDisabled?: boolean;
	btnFunction?: () => void;
	LeftBtnFunction?: () => void;
	nextText?: string;
	leftText?: string;
	type?: string;
	resize?: boolean;
};

const ButtonContainer = styled.TouchableOpacity<{
	marginBottom: number;
	marginTop: number;
	type: string;
	before: boolean;
	resize?: boolean;
	isActive?: boolean;
}>`
	width: ${props => widthPercentage(props.resize ? (props.before ? 188 : 132) : 160)}px;
	align-self: center;
	align-items: center;
	height: ${heightPercentage(60)}px;
	padding: 0px ${widthPercentage(0)}px;
	border-radius: 8px;
	background-color: ${props =>
		props.type == 'planner'
			? props?.isActive
				? 'rgba(0,0,0,0.2)'
				: props.before
				? colors.Gray200
				: colors.Gray5
			: colors.Primary};
	margin-top: ${props => heightPercentage(props.marginTop)}px;
	margin-bottom: ${props => heightPercentage(props.marginBottom)}px;
	flex-direction: row;
	justify-content: center;
`;
