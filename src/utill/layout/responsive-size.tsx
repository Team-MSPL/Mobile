import {
	responsiveScreenWidth,
	responsiveScreenHeight,
	responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

const FIGMA_WINDOW_WIDTH = 375;
const FIGMA_WINDOW_HEIGHT = 812;

export function widthPercentage(width: number) {
	const percentage = (width / FIGMA_WINDOW_WIDTH) * 100;
	return responsiveScreenWidth(percentage);
}

export function heightPercentage(height: number) {
	const percentage = (height / FIGMA_WINDOW_HEIGHT) * 100;
	return responsiveScreenHeight(percentage);
}
export function fontPercentage(size: number) {
	const percentage = size * 0.135; // TODO 변경하기
	return responsiveScreenFontSize(percentage);
}
