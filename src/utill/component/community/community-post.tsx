import {Dimensions} from 'react-native';
import Swiper from 'react-native-swiper';
import styled from 'styled-components/native';
import {colors} from '../../colors';
import {useAppSelector} from '../../../redux';
import {useState} from 'react';
import ImageView from 'react-native-image-viewing';
import {heightPercentage, widthPercentage} from '../../layout/responsive-size';
import {HStack, PretendardBoldText, PretendardVariableText} from '../../layout/layout';

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
			<PostWriterInfoContainer>
				<PostWriterProfileImage source={{uri: postData.postWriterProfileImage}} resizeMode='contain' />
				<HStack width={widthPercentage(280)} justifyContent='space-between'>
					<PretendardBoldText size={14} lineHeight={21} color={colors.Black}>
						{postData.postWriter}
					</PretendardBoldText>
					{/* <PostDetailInfoText>{postData.postedAt.slice(0, 10)}</PostDetailInfoText> */}
				</HStack>
			</PostWriterInfoContainer>
			<PretendardBoldText size={16} lineHeight={19} color={colors.Black}>
				{postData.postTitle}
			</PretendardBoldText>
			<PretendardVariableText size={14} lineHeight={21} color={colors.Black}>
				{postData.postContent}
			</PretendardVariableText>
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
						<PretendardBoldText size={14} lineHeight={21} color={colors.Black}>{`${currentImageIndex + 1}/${
							postData.postImage.length
						}`}</PretendardBoldText>
					</PostImageView>
				)}
			/>
		</>
	);
}
const PostWriterInfoContainer = styled(HStack)`
	border-bottom-width: 1px;
	border-color: ${colors.Gray1};
	padding-bottom: ${heightPercentage(10)}px;
	margin-bottom: ${heightPercentage(10)}px;
`;
const PostWriterProfileImage = styled.Image`
	width: ${widthPercentage(32)}px;
	height: ${widthPercentage(32)}px;
	border-radius: 99px;
	margin-right: ${widthPercentage(10)}px;
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
