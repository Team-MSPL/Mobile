import {Box, Center, Image} from 'native-base';
import React from 'react';
import {WithLocalSvg} from 'react-native-svg';
export default function Loading() {
	return (
		<Center position='absolute' display='flex' bgColor='rgba(0, 0, 0, 0.4)' w='100%' h='100%'>
			<Image
				marginTop={8}
				source={require('../../public/images/danim_logo.png')}
				width={24}
				height={24}
				alt='icon'
			/>
		</Center>
	);
}
