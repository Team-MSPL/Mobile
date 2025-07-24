import {useEffect} from 'react';

export default function AiRecommned({navigation, route}: any) {
	useEffect(() => {
		navigation.setOptions({
			headerTitle: handleTitle(route?.params?.title) + ' 추가',
		});
	}, []);
	return <></>;
}
