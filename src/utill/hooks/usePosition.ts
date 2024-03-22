import {NativeScrollEvent, NativeSyntheticEvent} from 'react-native';

export const usePosition = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
	const scrollY = e.nativeEvent.contentOffset.y;

	// 스크롤뷰의 컨텐츠 높이를 가져옵니다.
	const contentHeight = e.nativeEvent.contentSize.height;

	// 스크롤뷰의 높이를 가져옵니다.
	const scrollViewHeight = e.nativeEvent.layoutMeasurement.height;
	// 스크롤이 거의 끝에 다다랐는지 확인합니다.
	console.log(scrollY, contentHeight, scrollViewHeight);
	if (scrollY + scrollViewHeight >= contentHeight - 20) {
		// 스크롤이 거의 끝에 다다랐을 때 원하는 작업을 수행합니다.
		return false;
	} else {
		return true;
	}
};
