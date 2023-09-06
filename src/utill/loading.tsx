import {Center} from 'native-base';
import React from 'react';
import LoadingLottie from './loading-lottie';
export default function Loading() {
	return (
		<Center position='absolute' display='flex' bgColor='rgba(0, 0, 0, 0.4)' w='100%' h='100%'>
			<LoadingLottie />
		</Center>
	);
}
