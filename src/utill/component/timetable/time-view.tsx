import React, {memo} from 'react';
import {Text, Box, VStack} from 'native-base';
import {useAppDispatch, useAppSelector} from '../../../redux';

const TimeView = () => {
	return (
		<VStack>
			{[...Array(18)].map((time, times) => (
				<Box key={times} w='60px' h='70px' alignItems='center'>
					<Text fontSize='lg'>{times + 6}</Text>
				</Box>
			))}
		</VStack>
	);
};

export default memo(TimeView);
