import React from 'react';
import LottieView from 'lottie-react-native';
export default function LoadingLottie() {
	return (
		<LottieView
			style={{width: '70%', height: '70%'}}
			source={require(`../../public/images/loading.json`)}
			autoPlay
			loop={true}
		/>
	);
}
