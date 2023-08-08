import {useState} from 'react';
import {Text, Box, ScrollView, VStack, Divider, Slider, Center, HStack, Spacer} from 'native-base';
import {useAppDispatch, useAppSelector} from '../../redux';
import {TouchableOpacity, Image} from 'react-native';
import {googleKeywordApi} from '../../redux/travel-info/travel.slice';
import {GOOGLE_API_KEY} from '@env';
export default function CourseDetail({navigation}: any) {
	const {courseDetail} = useAppSelector(state => state.travelSlice);
	const dispatch = useAppDispatch();
	const viewDetail = (e: any) => {
		dispatch(googleKeywordApi(e));
		navigation.navigate('CourseDetail');
	};
	if (courseDetail?.name)
		return (
			<ScrollView>
				<Text>{courseDetail.name ?? '정보가 없습니다'}</Text>
				<Text>{courseDetail.editorial_summary?.overview ?? '정보가 없습니다'}</Text>
				<Text>{courseDetail.rating ?? '정보가 없습니다'}</Text>
				{courseDetail.reviews && courseDetail.reviews.map((item, idx) => <Text key={idx}>{item.text}</Text>)}
				{courseDetail.photos &&
					courseDetail.photos.map((value, index) => (
						<Image
							key={index}
							source={{
								uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${value.photo_reference}&key=${GOOGLE_API_KEY}`,
							}}
							style={{width: 200, height: 200}}
							alt='Place Image'
						/>
					))}
			</ScrollView>
		);
	return (
		<Box>
			<Text>qwe</Text>
		</Box>
	);
}
