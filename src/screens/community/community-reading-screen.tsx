import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import {FlatList, ThreeDotsIcon} from 'native-base';
import {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, Dimensions, NativeModules, Platform, RefreshControl, Text, TouchableOpacity, View} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import ImageView from 'react-native-image-viewing';
import Swiper from 'react-native-swiper';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FeathernIcon from 'react-native-vector-icons/Feather';
import styled from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {
	clickLike,
	commentType,
	deleteComment,
	deletePost,
	getOnePost,
	reportCommentType,
	reportPost,
	reportPostType,
	saveComment,
	saveCommentType,
	unclickLike,
} from '../../redux/community/community.slice';
import {colors} from '../../utill/colors';
import {MainContainer} from '../../utill/layout/layout';

const {StatusBarManager} = NativeModules;

export default function CommunityReadingScreen({navigation, route}: any) {
	// 뒤로 가기
	const goBack = () => {
		navigation.goBack();
	};

	// 글 작성 화면으로 가기
	const goCommunityWritingScreen = () => {
		navigation.navigate('CommunityWritingScreen', {
			title: postData.postTitle,
			content: postData.postContent,
			images: postData.postImage,
			postId: postData._id,
			isNewPost: false,
		});
	};

	const [commentContent, setCommentContent] = useState<string>('');
	const [postImage, setPostImage] = useState<string[]>([]);
	const [imageSize, setImageSize] = useState(Dimensions.get('window').width / 4 - 16);
	const [isImageMoreModalVisible, setMoreModalVisible] = useState<boolean>(false);
	const [isCommentButtonDisabled, setCommentButtonDisabled] = useState<boolean>(true);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isLiked, setIsLiked] = useState<boolean>(false);
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
	const {userId, userName, userProfileImage, socialloginProvider} = useAppSelector(state => state.userSlice);
	const [commentData, setCommentData] = useState<commentType>({
		commentContent: '',
		commentedAt: '',
		commentWriter: '',
		commentWriterUserId: '',
		commentWriterProfile: '',
		_id: '',
	});

	const dispatch = useAppDispatch(); // redux에 있는 함수를 쓸 수 있게 해줌.
	const {postData} = useAppSelector(state => state.communitySlice); // slice에 있는 변수를 가져옴.

	const communityReadingOptionActionSheet = useRef<ActionSheet>(null);
	const reportPostActionSheet = useRef<ActionSheet>(null);
	const commentOptionActionSheet = useRef<ActionSheet>(null);
	const actionSheetType = useRef<string>('게시글');

	// 게시글 메뉴 액션 시트 보이기
	const showCommunityReadingOptionActionSheet = () => {
		communityReadingOptionActionSheet.current?.show();
	};

	// 게시글 신고 액션 시트 보이기
	const showReportActionSheet = () => {
		reportPostActionSheet.current?.show();
	};

	// 게시글 신고 액션 시트 보이기
	const showCommentOptionActionSheet = () => {
		commentOptionActionSheet.current?.show();
	};

	// 게시글 지우기 확인창
	const postDeleteCheckAlert = () => {
		Alert.alert(
			'게시글을 삭제하시겠습니까?',
			'',
			[
				{
					text: '취소',
					onPress: () => console.log('취소 버튼 누름'),
				},
				{
					text: '삭제',
					onPress: () => {
						handleDeletePost();
					},
					style: 'destructive',
				},
			],
			{
				cancelable: false,
			},
		);
	};

	// * 게시글 신고 기능
	const handlePostReport = async (reason: string) => {
		try {
			// db의 comment에 들어갈 정보들
			const reportData: reportPostType = {
				postId: postData._id,
				reportReason: reason,
				reportedAt: moment(Date()).format('yy/MM/DD HH:mm:ss'),
				reportWriter: userName,
			};
			await dispatch(reportPost(reportData));
			Alert.alert('신고가 접수되었습니다.');
			console.log(`"${reason}"`, '신고가 성공적으로 접수되었습니다.');
		} catch (error) {
			console.log('신고 접수 중에 오류가 발생했습니다:', error);
		}
	};

	// 댓글 신고 기능
	const handleCommentReport = async (reason: string, commentId: string) => {
		try {
			// db의 comment에 들어갈 정보들
			const reportData: reportCommentType = {
				postId: postData._id,
				commentId: commentId,
				reportReason: reason,
				reportedAt: moment(Date()).format('yy/MM/DD HH:mm:ss'),
				reportWriter: userName,
			};
			await dispatch(reportPost(reportData));
			Alert.alert('신고가 접수되었습니다.');
			console.log(`"${reason}"`, '사유로 댓글 신고가 성공적으로 접수되었습니다.');
		} catch (error) {
			console.log('댓글 신고 접수 중에 오류가 발생했습니다:', error);
		}
	};

	// ---------------- useEffect 모음(시작) -------------------

	// * 화면 갱신
	useFocusEffect(
		useCallback(() => {
			fetchPostData();
			console.log('CommunityReadingScreen 갱신됨');
		}, []),
	);

	// 댓글 등록 버튼 활성 및 비활성화
	useEffect(() => {
		setCommentButtonDisabled(commentContent.trim() === '');
	}, [commentContent]);

	useEffect(() => {
		// 화면 크기 변경 시 사진 크기 조정
		const handleResize = () => {
			const newSize = Dimensions.get('window').width / 4 - 16;
			setImageSize(newSize);
		};

		const resizeSubscription = Dimensions.addEventListener('change', handleResize);

		// 컴포넌트가 언마운트될 때 이벤트 리스너 구독 제거
		return () => {
			resizeSubscription.remove();
		};
	}, []);

	// 앱 바 우측 더보기
	useEffect(() => {
		navigation.setOptions({
			headerRight: () =>
				socialloginProvider != 'anonymous' && (
					<View>
						<TouchableOpacity
							onPress={() => {
								actionSheetType.current = '게시글';
								showCommunityReadingOptionActionSheet();
							}}>
							<ThreeDotsIcon></ThreeDotsIcon>
						</TouchableOpacity>
					</View>
				),
		});
	}, []);

	useEffect(() => {
		Platform.OS == 'ios'
			? StatusBarManager.getHeight((statusBarFrameData: {height: number}) => {
					setStatusBarHeight(statusBarFrameData.height);
			  })
			: null;
	}, []);

	const [statusBarHeight, setStatusBarHeight] = useState(0);

	// const mounted = useRef<boolean>(false);
	// useEffect(() => {
	// 	if (!mounted.current) {
	// 		mounted.current = true;
	// 	} else {
	// 		showCommentOptionActionSheet();
	// 	}
	// }, [commentData]);

	// ---------------- useEffect 모음(끝) -------------------

	// * 게시글 정보 가져오기
	const fetchPostData = async () => {
		try {
			await dispatch(getOnePost({postId: route.params.postId}));
			if (postData.liker.includes(userId)) {
				console.log('게시글 정보 가져오기에서의 좋아요 변화');
				setIsLiked(true);
			}
			setIsLoading(false);
			console.log(postData.postTitle, '게시글 가져오기 성공');
		} catch (error) {
			setIsLoading(false);
			console.log('DB로부터 데이터를 가져오는 중에 오류가 발생했습니다:', error);
		}
	};

	// * 댓글 등록 (새로운 댓글 및 댓글 수정)
	// TODO 댓글 수정 기능 추가해야함.
	const handleCommentSubmit = async () => {
		try {
			// db의 comment에 들어갈 정보들
			const newCommentData: saveCommentType = {
				postId: postData._id,
				comment: {
					commentContent: commentContent,
					commentedAt: moment(Date()).format('yy/MM/DD HH:mm:ss'),
					commentWriter: userName,
					commentWriterUserId: userId,
					commentWriterProfile: userProfileImage,
				},
			};
			await dispatch(saveComment(newCommentData));
			console.log(commentContent, '댓글이 성공적으로 등록되었습니다.');
			// 댓글 등록 후 입력창 초기화
			setCommentContent('');
			Alert.alert('댓글이 등록되었습니다.');
			await fetchPostData();
		} catch (error) {
			console.log('댓글 등록 중에 오류가 발생했습니다:', error);
		}
	};

	// * 댓글 삭제
	// TODO 본인의 댓글만 삭제할 수 있도록 하기
	const handleDeleteComment = async (commentId: string) => {
		try {
			await dispatch(deleteComment({postId: postData._id, commentId: commentId}));
			Alert.alert('댓글이 삭제되었습니다.');
			console.log('댓글을 성공적으로 삭제했습니다.');
			await fetchPostData();
		} catch (error) {
			console.log('댓글을 삭제하는 도중 에러가 발생했습니다.', error);
		}
	};

	// * 좋아요 버튼을 눌렀을 때
	const handleLikePress = async () => {
		try {
			if (isLiked) {
				await dispatch(unclickLike({postId: route.params.postId}));
				console.log('좋아요 취소를 하였습니다.');
			} else {
				await dispatch(clickLike({postId: route.params.postId}));
				console.log('좋아요를 했습니다.');
			}
			await fetchPostData();
			setIsLiked(!isLiked);
		} catch (error) {
			console.log('좋아요에 오류가 발생했습니다:', error);
		}
	};

	// * 게시글 삭제
	const handleDeletePost = async () => {
		try {
			await dispatch(deletePost({postId: route.params.postId}));
			console.log(postData.postTitle, '게시글 삭제를 완료했습니다');
			goBack();
		} catch (e) {
			console.log('삭제에 실패했습니다', e);
		}
	};

	// * 가져온 댓글 UI
	const renderCommentItem = (data: {item: commentType}) => {
		return (
			<CommentItemContainer>
				<CommentWriterInfoNMenuContainer>
					<CommentWriterInfoContainer>
						<CommentWriterImage source={{uri: data.item.commentWriterProfile}} />
						<CommentWriterText>{data.item.commentWriter}</CommentWriterText>
					</CommentWriterInfoContainer>
					{/* 더보기 버튼 */}
					{socialloginProvider != 'anonymous' && (
						<CommentMenu
							onPress={() => {
								setCommentData(data.item);
								actionSheetType.current = '댓글';
								console.log('더보기 버튼', commentData.commentContent);
								console.log('userId', userId);
								console.log('댓글 작성자 Id', commentData.commentWriterUserId);
								showCommentOptionActionSheet();
							}}>
							<CommentMenuIcon name='more-horizontal' />
						</CommentMenu>
					)}
				</CommentWriterInfoNMenuContainer>
				<CommentContent>{data.item.commentContent}</CommentContent>
				<CommentInfoText>{data.item.commentedAt.slice(0, 10)}</CommentInfoText>
			</CommentItemContainer>
		);
	};

	// // 사진 자세히 보기
	// const handleDetailImagePress = () => {
	// 	setIsDetailImageModalVisible(true);
	// };

	// 사진 더보기 버튼 눌렀을 때
	const handleMoreButtonPress = () => {
		setMoreModalVisible(true);
	};

	const handleMoreModalClose = () => {
		setMoreModalVisible(false);
	};

	// 새로 고침
	const handleRefresh = () => {
		setIsRefreshing(true); // 새로고침 시작
		fetchPostData().then(() => setIsRefreshing(false)); // 새로고침 완료 후 상태 변경
	};

	function doNothing(): any {
		// 아무것도 하지 않음
	}

	const communityReadingMenuOptionList: {options: string[]; onPress: (() => void)[]} = {
		options: ['수정', '삭제', '신고', '취소'],
		onPress: [goCommunityWritingScreen, postDeleteCheckAlert, showReportActionSheet, doNothing],
	};

	const reportOptionList: {
		options: string[];
		reportPost: (() => Promise<void>)[];
		reportComment: (() => Promise<void>)[];
	} = {
		options: [
			'무분별한 도배',
			'정당/정치인 비하 및 선거운동',
			'욕설/비하',
			'상업적 광고 및 판매',
			'음란물/불건전한 만남 및 대화',
			'유출/사칭/사기',
			'취소',
		],
		reportPost: [
			() => handlePostReport('무분별한 도배'),
			() => handlePostReport('정당/정치인 비하 및 선거운동'),
			() => handlePostReport('욕설/비하'),
			() => handlePostReport('상업적 광고 및 판매'),
			() => handlePostReport('음란물/불건전한 만남 및 대화'),
			() => handlePostReport('유출/사칭/사기'),
			doNothing,
		],
		reportComment: [
			() => handleCommentReport('무분별한 도배', commentData._id),
			() => handleCommentReport('정당/정치인 비하 및 선거운동', commentData._id),
			() => handleCommentReport('욕설/비하', commentData._id),
			() => handleCommentReport('상업적 광고 및 판매', commentData._id),
			() => handleCommentReport('음란물/불건전한 만남 및 대화', commentData._id),
			() => handleCommentReport('유출/사칭/사기', commentData._id),
			doNothing,
		],
	};

	const commentOptionList: {options: string[]; onPress: (() => Promise<void>)[]} = {
		options: ['삭제', '신고', '취소'],
		onPress: [() => handleDeleteComment(commentData._id), () => showReportActionSheet(), doNothing],
	};

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
		<CommunityReadingContainer>
			<CommmunityReadingSafeAreaContainer>
				<ActionSheet
					ref={communityReadingOptionActionSheet}
					title={'글 메뉴'}
					options={
						userId === postData.postWriterUserId
							? communityReadingMenuOptionList.options
							: communityReadingMenuOptionList.options.filter(item => item === '신고' || item === '취소')
					}
					cancelButtonIndex={userId == postData.postWriterUserId ? 3 : 1}
					onPress={(index: number) => {
						userId === postData.postWriterUserId
							? communityReadingMenuOptionList.onPress[index]()
							: communityReadingMenuOptionList.onPress.slice(2, 4)[index]();
					}}
				/>
				<ActionSheet
					ref={reportPostActionSheet}
					title={'신고 사유 선택'}
					options={reportOptionList.options}
					cancelButtonIndex={6}
					onPress={(index: number) => {
						if (actionSheetType.current == '게시글') {
							reportOptionList.reportPost[index]();
						} else if (actionSheetType.current == '댓글') {
							reportOptionList.reportComment[index]();
						}
					}}
				/>
				<ActionSheet
					ref={commentOptionActionSheet}
					title={'댓글 메뉴'}
					options={
						userId === commentData.commentWriterUserId
							? commentOptionList.options
							: commentOptionList.options.filter(item => item === '신고' || item === '취소')
					}
					cancelButtonIndex={userId === commentData.commentWriterUserId ? 2 : 1}
					onPress={(index: number) => {
						userId == commentData.commentWriterUserId
							? commentOptionList.onPress[index]()
							: commentOptionList.onPress.slice(1, 3)[index]();
					}}
				/>
				<PostContentCommentContainer>
					<FlatList
						refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
						ListHeaderComponent={
							<MainContainer>
								<PostInfoContainer>
									<PostWriterInfoContainer>
										<PostWriterProfileImage
											source={require('../../../public/images/danim_logo2.png')}
											resizeMode='contain'
										/>
										<PostWriterText>{postData.postWriter}</PostWriterText>
									</PostWriterInfoContainer>
									<PostTitleText>{postData.postTitle}</PostTitleText>
									<PostDetailInfoContainer>
										<PostDetailInfoText>{postData.postedAt.slice(0, 10)}</PostDetailInfoText>
									</PostDetailInfoContainer>
								</PostInfoContainer>
								<Divider></Divider>
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
								<Divider></Divider>
								{socialloginProvider != 'anonymous' && (
									<PostLikeCommentNumContainer>
										<LikeButton onPress={handleLikePress}>
											<HeartIcon
												name={isLiked ? 'heart' : 'hearto'}
												selected={isLiked}></HeartIcon>
											<LikeCommentText>{isLiked ? '좋아요 취소' : '좋아요'}</LikeCommentText>
										</LikeButton>
										<CommentIcon name='message-circle' />
										<LikeCommentText>{postData.comment.length}</LikeCommentText>
									</PostLikeCommentNumContainer>
								)}
								<LikeCommentText>{postData.liker.length}명이 좋아합니다</LikeCommentText>
							</MainContainer>
						}
						data={postData.comment}
						renderItem={renderCommentItem}
						ItemSeparatorComponent={CommentDivider}
						initialNumToRender={10}
					/>
				</PostContentCommentContainer>
				<CommentInputContainer
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					keyboardVerticalOffset={statusBarHeight + 52}>
					{socialloginProvider == 'anonymous' ? (
						<View>
							<Text>로그인 후 이용 가능합니다.</Text>
						</View>
					) : (
						<CommentTextInputContainer>
							<CommentTextInput
								value={commentContent}
								multiline={true}
								onChangeText={text => setCommentContent(text)}
								placeholder='댓글을 입력하세요...'
							/>
							<CommentSubmitButton disabled={isCommentButtonDisabled} onPress={handleCommentSubmit}>
								<CommentSubmitButtonIcon name='send' isDisabled={isCommentButtonDisabled} />
							</CommentSubmitButton>
						</CommentTextInputContainer>
					)}
				</CommentInputContainer>
			</CommmunityReadingSafeAreaContainer>
		</CommunityReadingContainer>
	);
}

// 전체화면(safearea바깥 영역 포함)
const CommunityReadingContainer = styled.View`
	flex: 1;
	background-color: white;
`;

// safearea 영역
const CommmunityReadingSafeAreaContainer = styled.SafeAreaView`
	flex: 1;
	padding: 0px;
`;
const PostContentCommentContainer = styled.View`
	flex: 9;
	align-itemsx: center;
	justify-content: center;
`;
const PostInfoContainer = styled.View`
	padding: 12px;
`;
const PostWriterInfoContainer = styled.View`
	flex-direction: row;
	align-items: center;
`;
const PostWriterProfileImage = styled.Image`
	width: 20px;
	height: 20px;
	border-radius: 10px;
	border: ${colors.border};
	margin-right: 12px;
`;
const PostWriterText = styled.Text`
	font-size: 12px;
	font-weight: bold;
`;
const PostTitleText = styled.Text`
	font-size: 16px;
	font-weight: bold;
	margin-vertical: 8px;
`;
const PostDetailInfoContainer = styled.View`
	flex-direction: row;
	align-items: center;
`;
const PostDetailInfoText = styled.Text`
	font-size: 12px;
	margin-right: 8px;
`;
const Divider = styled.View`
	border-bottom-color: #ccc;
	border-bottom-width: 1px;
`;

// 사진이랑 dots 담을 영역
const PostImageContainer = styled.View`
	margin-vertical: 12px;
`;
const PostImageSwiper = styled(Swiper)`
	height: ${Dimensions.get('window').width};
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
const PostImageWrapper = styled.TouchableOpacity`
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

// 게시글 글 내용담는 컨테이너
const PostContentContainer = styled.View`
	justify-content: center;
	padding-vertical: 8px;
	margin-bottom: 24px;
`;
const PostContentText = styled.Text`
	font-size: 16px;
`;

// 게시글 좋아요 수 및 댓글 수
const PostLikeCommentNumContainer = styled.View`
	align-items: center;
	flex-direction: row;
	padding-vertical: 8px;
`;
const LikeButton = styled.TouchableOpacity`
	align-items: center;
	flex-direction: row;
`;
const HeartIcon = styled(AntDesignIcon)<{selected: boolean}>`
	color: ${props => (props.selected ? 'red' : 'black')};
	font-size: 24px;
	margin-right: 4px;
`;
const LikeCommentText = styled.Text`
	font-size: 14px;
	margin-right: 12px;
`;
const CommentIcon = styled(FeathernIcon)`
	color: black;
	font-size: 24px;
	margin-right: 4px;
`;

const CommentItemContainer = styled.View`
	width: ${Dimensions.get('window').width * 0.95};
	align-self: center;
	margin: 8px;
	padding: 8px;
`;

// 댓글 작성자 프로필 이미지, 이름, 메뉴를 담을 영역
const CommentWriterInfoNMenuContainer = styled.View`
	flex-direction: row;
	align-items: center;
	flex: 1;
	margin-bottom: 12px;
`;
const CommentWriterInfoContainer = styled.View`
	flex-direction: row;
	align-items: center;
	flex: 9;
`;
const CommentWriterImage = styled.Image`
	height: 36px;
	width: 36px;
	border-radius: 18px;
	margin-right: 12px;
`;
const CommentWriterText = styled.Text`
	font-size: 12px;
	font-weight: bold;
`;
const CommentMenu = styled.TouchableOpacity`
	align-items: center;
	justify-content: center;
	flex: 1;
`;
const CommentMenuIcon = styled(FeathernIcon)`
	font-size: 20px;
`;
const CommentContent = styled.Text`
	font-size: 16px;
	margin-bottom: 8px;
`;
const CommentInfoText = styled.Text`
	font-size: 10px;
`;

// 댓글 입력을 위해 전체 화면을 9:1로 나눈 곳 중 1인 영역
const CommentInputContainer = styled.KeyboardAvoidingView`
	flex: 1;
	align-items: center;
	justify-content: center;
	background-color: white;
	padding-horizontal: 8px;
	padding-vertical: 4px;
`;
// 밝은 회색(#f0f0f0)인 영역
const CommentTextInputContainer = styled.View`
	background-color: #f0f0f0;
	border-radius: 16px;
	flex-direction: row;
	align-items: center;
	flex: 0.8;
	width: 100%;
	padding-horizontal: 16px;
	padding-vertical: 8px;
`;
// 실제 글이 입력될 영역
const CommentTextInput = styled.TextInput`
	flex: 9;
	margin-right: 12px;
`;
// 댓글 등록 버튼
const CommentSubmitButton = styled.TouchableOpacity`
	flex: 1;
	align-items: center;
`;
const CommentSubmitButtonIcon = styled(FeathernIcon)<{isDisabled: boolean}>`
	color: ${props => (props.isDisabled ? '#ccc' : colors.border)};
	font-size: 24px;
`;

const CommentDivider = styled.View`
	height: 1;
	background-color: #ccc;
`;
