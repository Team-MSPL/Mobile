import {HStack, KeyboardAvoidingView, ThreeDotsIcon} from 'native-base';
import {useCallback, useEffect, useRef, useState} from 'react';

import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import {
	ActivityIndicator,
	Alert,
	Dimensions,
	FlatList,
	Image,
	NativeModules,
	Platform,
	RefreshControl,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import ImageView from 'react-native-image-viewing';
import Icon from 'react-native-vector-icons/AntDesign';
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
	const {userId, userName, userProfileImage} = useAppSelector(state => state.userSlice);
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
			headerRight: () => {
				return (
					<View>
						<TouchableOpacity
							onPress={() => {
								actionSheetType.current = '게시글';
								showCommunityReadingOptionActionSheet();
							}}>
							<ThreeDotsIcon></ThreeDotsIcon>
						</TouchableOpacity>
					</View>
				);
			},
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
			<View style={styles.commentItemContainer}>
				<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
					<View style={{flex: 8}}>
						<HStack space={1} alignItems='center'>
							<Image
								source={{uri: data.item.commentWriterProfile}}
								style={styles.commentProfileImage}></Image>
							<Text style={{fontWeight: 'bold'}}>{data.item.commentWriter}</Text>
						</HStack>
					</View>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-around',
							alignItems: 'center',
							flex: 2,
						}}>
						{/* 더보기 버튼 */}
						<TouchableOpacity
							onPress={() => {
								setCommentData(data.item);
								actionSheetType.current = '댓글';
								console.log('더보기 버튼', commentData.commentContent);
								console.log('userId', userId);
								console.log('댓글 작성자 Id', commentData.commentWriterUserId);
								showCommentOptionActionSheet();
							}}>
							<ThreeDotsIcon></ThreeDotsIcon>
						</TouchableOpacity>
					</View>
				</View>
				<Text>{data.item.commentContent}</Text>
				<Text style={{fontSize: 8}}>{data.item.commentedAt}</Text>
			</View>
		);
	};

	const renderPostImageItem = ({item}: {item: string}) => (
		<View style={[styles.imageContainer, {width: imageSize, height: imageSize}]}>
			{item ? <Image source={{uri: item}} style={styles.image} /> : <Text>이미지를 불러오는 중...</Text>}
		</View>
	);

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
		<SafeAreaView style={styles.container}>
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

			<View style={styles.postNCommentContainer}>
				{isLoading ? (
					<ActivityIndicator size='large' color='#0000ff' />
				) : (
					<FlatList
						refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
						ListHeaderComponent={
							<View>
								<Text>제목: {postData.postTitle}</Text>
								<Text>본문</Text>
								<Text style={styles.postContentText}>{postData.postContent}</Text>
								{/* <Text>사진 목록</Text>
								<View style={styles.imageContainer}>
									{postData.postImage.slice(0, 8).map((uri, index) => (
										<Image key={index} source={{uri}} style={styles.image} />
									))}
									{postData.postImage.length > 8 && (
										<TouchableOpacity style={styles.moreButton} onPress={handleMoreButtonPress}>
											<Text style={styles.moreButtonText}>더보기</Text>
										</TouchableOpacity>
									)}
								</View>
								<Modal isVisible={isImageMoreModalVisible}>
									<Text style={{textAlign: 'center', fontSize: 20}}>전체 사진 보기</Text>
									<ScrollView contentContainerStyle={styles.imageModalContainer}>
										{postData.postImage.map((uri, index) => (
											<Image key={index} source={{uri}} style={styles.modalImage} />
										))}
									</ScrollView>
								</Modal> */}
								<Text>사진 목록</Text>
								<View style={styles.container}>
									{postData.postImage.map((uri, index) => {
										return (
											<View key={index} style={{alignItems: 'center'}}>
												<TouchableOpacity
													onPress={() => {
														onSelect(index);
														console.log('파이팅', currentImageIndex);
													}}>
													<Image source={{uri: uri}} style={{width: 100, height: 100}} />
												</TouchableOpacity>
											</View>
										);
									})}

									<ImageView
										images={postData.postImage.map(uri => ({uri}))}
										imageIndex={initialImageIndex || 0}
										visible={isImageModalVisible}
										onImageIndexChange={setCurrentImageIndex}
										onRequestClose={() => {
											setIsImageModalVisible(false);
										}}
										HeaderComponent={() => (
											<SafeAreaView style={{alignItems: 'center'}}>
												<Text style={{color: 'white'}}>{`${currentImageIndex + 1}/${
													postData.postImage.length
												}`}</Text>
											</SafeAreaView>
										)}
									/>
								</View>
								<View style={styles.likeContainer}>
									<TouchableOpacity style={styles.likeButton} onPress={handleLikePress}>
										<Icon name={isLiked ? 'heart' : 'hearto'} size={20} color='red' />
										<Text style={styles.likeButtonText}>{isLiked ? '좋아요 취소' : '좋아요'}</Text>
									</TouchableOpacity>
									<Text style={styles.likesCount}>{postData.liker.length}명이 좋아합니다</Text>
								</View>
								<Text>댓글</Text>
							</View>
						}
						data={postData.comment}
						renderItem={renderCommentItem}
						initialNumToRender={10}
						ListEmptyComponent={<Text>등록된 댓글이 없습니다.</Text>}
					/>
				)}
			</View>
			<KeyboardAvoidingView
				style={styles.commentInputFieldContainer}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={statusBarHeight + 52}>
				<TextInput
					style={[styles.commentTextInputField]}
					value={commentContent}
					onChangeText={text => setCommentContent(text)}
					placeholder='댓글을 입력하세요...'
				/>
				<TouchableOpacity
					style={[styles.submitButton, isCommentButtonDisabled && styles.disabledButton]}
					disabled={isCommentButtonDisabled}
					onPress={handleCommentSubmit}>
					<Text style={styles.submitButtonText}>등록</Text>
				</TouchableOpacity>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	postNCommentContainer: {
		flex: 9,
		backgroundColor: 'white',
	},
	postContentText: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 16,
	},
	commentItemContainer: {
		width: Dimensions.get('window').width * 0.95,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		padding: 8,
		margin: 8,
		alignSelf: 'center',
		flexDirection: 'column',
		backgroundColor: 'rgba(200, 200, 200, 0.2)',
	},
	commentProfileImage: {
		width: 36,
		height: 36,
		marginBottom: 8,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#5DC3DB',
		resizeMode: 'cover',
	},
	commentInputFieldContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-evenly',
		alignSelf: 'center',
		backgroundColor: 'white',
		paddingVertical: 8,
	},
	commentTextInputField: {
		flex: 9,
		margin: 8,
		padding: 8,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		height: 40,
		alignContent: 'center',
	},
	submitButton: {
		flex: 1,
		backgroundColor: 'blue',
		padding: 8,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 8,
		margin: 4,
	},
	submitButtonText: {
		color: 'white',
		textAlign: 'center',
		fontWeight: 'bold',
	},
	disabledButton: {
		opacity: 0.5,
	},
	imageContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
		marginBottom: 16,
	},
	image: {
		width: 100,
		height: 100,
		margin: 8,
	},
	moreButton: {
		width: 100,
		height: 100,
		margin: 8,
		backgroundColor: '#ccc',
		justifyContent: 'center',
		alignItems: 'center',
	},
	moreButtonText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 18,
	},
	imageModalContainer: {
		flexWrap: 'wrap',
		flexDirection: 'row',
		justifyContent: 'center',
		padding: 16,
	},
	modalImage: {
		width: 100,
		height: 100,
		margin: 8,
	},
	likeContainer: {
		justifyContent: 'center',
		alignItems: 'flex-start',
		marginBottom: 48,
	},
	likeButton: {
		flexDirection: 'row',
		alignItems: 'center',
		borderColor: 'red',
		padding: 10,
		borderRadius: 5,
	},
	likeButtonText: {
		color: 'black',
		fontWeight: 'bold',
		marginLeft: 5,
	},
	likesCount: {
		marginTop: 10,
	},
});
