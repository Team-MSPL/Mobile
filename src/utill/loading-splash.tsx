import {Box, Center, Image} from 'native-base';
import React from 'react';
import LottieView from 'lottie-react-native';
export default function LoadingSplash() {
	return (
		<LottieView
			style={{width: '100%', height: '100%'}}
			source={require('../../public/images/splash.json')}
			autoPlay
			loop={false}
		/>
	);
}
