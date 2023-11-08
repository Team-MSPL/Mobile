import {Dimensions} from 'react-native';
import Swiper from 'react-native-swiper';
import styled from 'styled-components/native';
import {colors} from '../../colors';
import {useAppSelector} from '../../../redux';
import {useState} from 'react';
import ImageView from 'react-native-image-viewing';

export default function CommunityPost() {
	const {postData} = useAppSelector(state => state.communitySlice); // slice에 있는 변수를 가져옴.

	// 변화되는 인덱스
	const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
	// 초기 인덱스
	const [initialImageIndex, setInitialImageIndex] = useState<number | null>(null);
	const [isImageModalVisible, setIsImageModalVisible] = useState<boolean>(false);
	const onSelect = (index: number) => {
		setInitialImageIndex(index);
		setCurrentImageIndex(index);
		setIsImageModalVisible(index === 0 || !!index);
	};
	return (
		<>
			<PostInfoContainer>
				<PostWriterInfoContainer>
					<PostWriterProfileImage
						source={require('../../../../public/images/danim_logo2.png')}
						resizeMode='contain'
					/>
					<PostDetailInfoContainer>
						<PostWriterText>{postData.postWriter}</PostWriterText>
						<PostDetailInfoText>{postData.postedAt.slice(0, 10)}</PostDetailInfoText>
					</PostDetailInfoContainer>
				</PostWriterInfoContainer>
				<PostTitleText>{postData.postTitle}</PostTitleText>
			</PostInfoContainer>
			{postData.postImage.length === 0 ? (
				<></>
			) : (
				<PostImageContainer>
					<PostImageSwiper
						dot={<Dot />}
						activeDot={<ActiveDot />}
						paginationStyle={{
							marginBottom: -24,
						}}
						loop={false}>
						{postData.postImage.map((uri, index) => (
							<PostImageWrapper
								onPress={() => {
									onSelect(index);
								}}
								key={index}>
								<PostImage source={{uri: uri}} />
							</PostImageWrapper>
						))}
					</PostImageSwiper>
				</PostImageContainer>
			)}

			<ImageView
				images={postData.postImage.map(uri => ({uri}))}
				imageIndex={initialImageIndex || 0}
				visible={isImageModalVisible}
				onImageIndexChange={setCurrentImageIndex}
				onRequestClose={() => {
					setIsImageModalVisible(false);
				}}
				HeaderComponent={() => (
					<PostImageView>
						<PostImageIndicatorText>{`${currentImageIndex + 1}/${
							postData.postImage.length
						}`}</PostImageIndicatorText>
					</PostImageView>
				)}
			/>
			<PostContentContainer>
				<PostContentText>{postData.postContent}</PostContentText>
			</PostContentContainer>
		</>
	);
}
// 게시글 글 내용담는 컨테이너
const PostContentContainer = styled.View`
	justify-content: center;
	padding-vertical: 8px;
	margin-bottom: 24px;
`;
const PostContentText = styled.Text`
	font-size: 16px;
	color: black;
`;
const PostInfoContainer = styled.View`
	margin-bottom: 12px;
	background-color: ${colors.main};
`;
const PostWriterInfoContainer = styled.View`
	flex-direction: row;
	align-items: center;
`;
const PostWriterProfileImage = styled.Image`
	width: 36;
	height: 36;
	border-radius: 18px;
	border: ${colors.border};
	margin-right: 12px;
`;
const PostDetailInfoContainer = styled.View`
	flex-direction: column;
	align-items: flex-start;
`;
const PostWriterText = styled.Text`
	font-size: 16px;
	font-weight: bold;
	margin-bottom: 4px;
	color: black;
`;
const PostDetailInfoText = styled.Text`
	font-size: 12px;
	margin-right: 8px;
	color: gray;
`;
const PostTitleText = styled.Text`
	font-size: 24px;
	font-weight: bold;
	margin-vertical: 8px;
	color: black;
`;
const Divider = styled.View`
	border-bottom-color: #ccc;
	border-bottom-width: 1px;
`;

// 사진이랑 dots 담을 영역
const PostImageContainer = styled.View`
	margin-vertical: 12px;
	background-color: ${colors.main};
`;
const PostImageSwiper = styled(Swiper)`
	height: ${Dimensions.get('window').width}px;
`;
const Dot = styled.View`
	background-color: #ccc;
	width: 8px;
	height: 8px;
	border-radius: 4px;
	margin: 4px;
`;
const ActiveDot = styled.View`
	background-color: ${colors.border};
	width: 8px;
	height: 8px;
	border-radius: 4px;
	margin: 4px;
`;
// 사진을 누를 수 있게 하기 위한 componenet
const PostImageWrapper = styled.Pressable`
	width: 100%;
	aspect-ratio: 1;
`;
const PostImage = styled.Image`
	width: 100%;
	aspect-ratio: 1;
`;

// 사진 눌렀을 때 사진 보이는 화면
export const PostImageView = styled.SafeAreaView`
	align-items: center;
`;
export const PostImageIndicatorText = styled.Text`
	font-size: 16px;
	color: white;
`;
