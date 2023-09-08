import {useEffect, useState} from 'react';
import {Text, Box, ScrollView, VStack, Divider, Slider, Center, HStack, Spacer} from 'native-base';
import {useAppDispatch, useAppSelector} from '../../redux';
import {TouchableOpacity, Image, Alert, Pressable, View} from 'react-native';
import {googleKeywordApi, CourseDetailType} from '../../redux/travel-info/travel.slice';
import {GOOGLE_API_KEY} from '@env';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import ImageView from 'react-native-image-viewing';
import styled from 'styled-components/native';
export default function CourseDetail({navigation, route}: any) {
	const [courseDetail, setCourseDetail] = useState<CourseDetailType>();
	const dispatch = useAppDispatch();
	const [visible, setVisible] = useState(false);
	const [imageIndex, setImageIndex] = useState(0);
	const getDetail = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const a = await dispatch(googleKeywordApi(route.params.value)).unwrap();
			setCourseDetail(a);
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '여행 정보를 가져오던 중 에러가 발생했습니다.',
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	useEffect(() => {
		getDetail();
	}, []);
	if (courseDetail?.name)
		return (
			<ScrollView>
				<Text>{courseDetail.name ?? '정보가 없습니다'}</Text>
				<Text>{courseDetail.editorial_summary?.overview ?? '정보가 없습니다'}</Text>
				<Text>{courseDetail.rating ?? '정보가 없습니다'}</Text>
				{courseDetail.reviews && courseDetail.reviews.map((item, idx) => <Text key={idx}>{item.text}</Text>)}
				{courseDetail.photos &&
					courseDetail.photos.map((value, index) => (
						<Pressable
							onPress={() => {
								setImageIndex(index);
								setVisible(true);
							}}
							key={index}>
							<Image
								source={{
									uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${value.photo_reference}&key=${GOOGLE_API_KEY}`,
								}}
								style={{width: 200, height: 200}}
								alt='Place Image'
							/>
						</Pressable>
					))}
				<ImageView
					images={courseDetail.photos.map((value, index) => ({
						uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${value.photo_reference}&key=${GOOGLE_API_KEY}`,
					}))}
					onImageIndexChange={item => console.log(item)}
					imageIndex={imageIndex}
					visible={visible}
					onRequestClose={() => setVisible(false)}
					FooterComponent={index => {
						return (
							<ImageViewFooterComponent>
								<Text color='white'>
									{index.imageIndex + 1}/{courseDetail.photos.length}
								</Text>
							</ImageViewFooterComponent>
						);
					}}
				/>
			</ScrollView>
		);
	return (
		<Box>
			<Text>qwe</Text>
		</Box>
	);
}

const ImageViewFooterComponent = styled.View`
	width: 100%;
	height: 50;
	align-items: center;
`;
