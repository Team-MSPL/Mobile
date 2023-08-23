import firestore from '@react-native-firebase/firestore';
import {HStack, KeyboardAvoidingView, ThreeDotsIcon} from 'native-base';
import {useCallback, useEffect, useState} from 'react';

import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import {
	ActivityIndicator,
	Alert,
	AlertButton,
	Button,
	Dimensions,
	FlatList,
	Image,
	Modal,
	NativeModules,
	Platform,
	RefreshControl,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import shortid from 'shortid';
import {useAppDispatch, useAppSelector} from '../../redux';
import {
	clickLike,
	commentType,
	deletePost,
	getOnePost,
	reportPost,
	reportPostType,
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
		console.log('자 넘어가라', postData._id);
	};

	const [postTitle, setPostTitle] = useState<string>('');
	const [commentDataList, setComment] = useState<string[]>([]);
	const [postId, setPostId] = useState<string>(route.params.postId);
	const [postWriterUserId, setPostWriterUserId] = useState<string>('postWriterUserId');
	const [postContent, setPostContent] = useState<string>('');
	const [newCommentContent, setNewComment] = useState<string>('');
	const [postImage, setPostImage] = useState<string[]>([]);
	const [imageSize, setImageSize] = useState(Dimensions.get('window').width / 4 - 16);
	const [isImageMoreModalVisible, setMoreModalVisible] = useState<boolean>(false);
	const [isCommentButtonDisabled, setCommentButtonDisabled] = useState<boolean>(true);

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [isLiked, setIsLiked] = useState<boolean>(false);
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
	const [statusBarHeight, setStatusBarHeight] = useState(0);
	const {userId, userName, userProfileImage} = useAppSelector(state => state.userSlice);

	// 모달 관리
	const [isMenuModalVisible, setIsMenuModalVisible] = useState<boolean>(false);
	const [isCommentMenuModalVisible, setIsCommentMenuModalVisible] = useState<boolean>(false);

	const dispatch = useAppDispatch(); // redux에 있는 함수를 쓸 수 있게 해줌.
	const {postData} = useAppSelector(state => state.communitySlice); // slice에 있는 변수를 가져옴.

	const deviceHeight = Dimensions.get('window').height;
	const communityReadingMenuList = [
		{
			title: '수정',
			onPress: () => {
				console.log('글 수정 페이지로 이동');
				closeModal('menu');
				goCommunityWritingScreen();
			},
		},
		{
			title: '삭제',
			onPress: () => {
				console.log('삭제 페이지로 이동');
				closeModal('menu');
				deleteCheckAlert();
			},
		},
		{
			title: '신고',
			onPress: () => {
				console.log('신고 페이지로 이동');
				closeModal('menu');
				reportAlert();
			},
		},
	];

	const deleteCheckAlert = () => {
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

	const reportAlert = () => {
		Alert.alert('신고 사유를 선택해주세요.', '', [
			{
				text: '무분별한 도배',
				onPress: () => {
					handleReportPost('무분별한 도배');
					console.log('무분별한 도배 신고');
				},
			},
			{
				text: '정당/정치인 비하 및 선거 운동',
				onPress: () => {
					handleReportPost('정당/정치인 비하 및 선거 운동');
					console.log('정당/정치인 비하 및 선거 운동');
				},
			},
			{
				text: '욕설/비하',
				onPress: () => {
					handleReportPost('욕설/비하');
					console.log('욕설/비하');
				},
			},
			{
				text: '상업적 광고 및 판매',
				onPress: () => {
					handleReportPost('상업적 광고 및 판매');
					console.log('상업적 광고 및 판매');
				},
			},
			{
				text: '음란물/불건전한 만남 및 대화',
				onPress: () => {
					handleReportPost('음란물/불건전한 만남 및 대화');
					console.log('음란물/불건전한 만남 및 대화');
				},
			},
			{
				text: '유출/사칭/사기',
				onPress: () => {
					handleReportPost('유출/사칭/사기');
					console.log('유출/사칭/사기');
				},
			},
			{
				text: '취소',
				onPress: () => {
					console.log('취소');
				},
				style: 'destructive',
			},
		]);
	};

	// * 게시글 신고 기능
	const handleReportPost = async (reason: string) => {
		try {
			// db의 comment에 들어갈 정보들
			const reportData: reportPostType = {
				postId: postData._id,
				reportReason: reason,
				reportedAt: moment(Date()).format('yy/MM/DD HH:mm:ss'),
				reportWriter: userName,
			};
			dispatch(reportPost(reportData));
			Alert.alert('신고가 접수되었습니다.');
		} catch (error) {
			console.log('신고 접수 중에 오류가 발생했습니다:', error);
		}
	};

	// * 화면 갱신
	useFocusEffect(
		useCallback(() => {
			fetchPostData();
			console.log('CommunityReadingScreen 갱신됨');
		}, []),
	);

	// iOS에서 키보드 활성화시 TextInput이 안 보이는 이슈를 위한 코드
	useEffect(() => {
		if (Platform.OS === 'ios')
			StatusBarManager.getHeight((statusBarFrameData: any) => {
				setStatusBarHeight(statusBarFrameData.height);
			});
	}, []);

	// 댓글 등록 버튼 활성 및 비활성화
	useEffect(() => {
		setCommentButtonDisabled(newCommentContent.trim() === '');
	}, [newCommentContent]);

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
								openModal('menu');
								//setIsMenuModalVisible(true);
							}}>
							<ThreeDotsIcon></ThreeDotsIcon>
						</TouchableOpacity>
					</View>
				);
			},
		});
	}, []);

	// ------------------ firebase 쓴 부분(시작) ----------------------

	// * 게시글 정보 가져오기
	const fetchPostData = async () => {
		try {
			await dispatch(getOnePost({postId: route.params.postId}));
			if (postData.liker.includes(userId)) {
				setIsLiked(true);
			}
			setIsLoading(false);
			console.log(postData.postTitle, '게시글 가져오기 성공');
		} catch (error) {
			setIsLoading(false);
			console.log('DB로부터 데이터를 가져오는 중에 오류가 발생했습니다:', error);
		}
	};

	// 댓글 등록 버튼 눌렀을 때
	const handleCommentSubmit = async () => {
		try {
			const docRef = firestore().collection('커뮤니티').doc(postId);
			// db의 comment에 들어갈 정보들
			const newCommentData = {
				commenter: userName,
				userid: userId,
				commentContent: newCommentContent,
				commentedAt: moment(Date()).format('yy/MM/DD HH:mm'),
				profileImage: userProfileImage,
				_id: shortid.generate(),
			};
			// 새로운 댓글 정보들을 comment에 추가
			const updatedCommentDataList = [...commentDataList, newCommentData];
			await docRef.update({comment: updatedCommentDataList});
			// 댓글 등록 후 입력창 초기화
			setNewComment('');
			Alert.alert('댓글이 등록되었습니다.');
			fetchPostData();
		} catch (error) {
			console.log('댓글 등록 중에 오류가 발생했습니다:', error);
		}
	};

	// 댓글 삭제
	const deleteComment = async (commentId: string) => {
		// '커뮤니티' 컬렉션의 '킹태운' 문서 가져오기
		const docRef = firestore().collection('커뮤니티').doc(postId);
		// 문서 가져오기
		docRef
			.get()
			.then(doc => {
				interface commentDataType {
					_id: string;
					commentContent: string;
					commentedAt: string;
					commenter: string;
					profileImage: string;
					userId: string;
				}
				if (doc.exists) {
					// 'comment' 필드의 현재 배열 가져오기
					const comments: commentDataType[] = doc.data()?.comment || [];
					// _id 를 가진 요소를 제거할 인덱스 찾기
					const indexToRemove = comments.findIndex(comment => comment._id === commentId);

					if (indexToRemove !== -1) {
						// _id 를 가진 요소를 배열에서 제거
						comments.splice(indexToRemove, 1);
						// 업데이트된 'comment' 필드를 문서에 저장
						console.log('댓글이 성공적으로 삭제되었습니다');
						Alert.alert('댓글이 삭제되었습니다.');
						fetchPostData();
						return docRef.update({comment: comments});
					}
				}
			})
			.catch(error => {
				console.error('Error updating document:', error);
			});
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
			fetchPostData();
			setIsLiked(!isLiked);
		} catch (error) {
			console.log('좋아요에 오류가 발생했습니다:', error);
		}
	};

	// * 게시글 삭제
	const handleDeletePost = async () => {
		try {
			dispatch(deletePost({postId: route.params.postId}));
			console.log(postData.postTitle, '게시글 삭제를 완료했습니다');
			goBack();
		} catch (e) {
			console.log('삭제에 실패했습니다', e);
		}
	};

	// ------------------ firebase 쓴 부분(끝) ----------------------

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
							backgroundColor: 'red',
						}}>
						<TouchableOpacity
							onPress={() => {
								console.log('삭제 버튼 누름');
								// TODO 본인의 댓글이라면 삭제할 수 있게 해야함.
								//deleteComment(item._id);
							}}>
							<Text>삭제</Text>
						</TouchableOpacity>

						{/* 더보기 버튼 */}
						<TouchableOpacity
							onPress={() => {
								console.log('더보기 버튼');
								const commentMenuList: AlertButton[] = [
									{
										text: '삭제',
										onPress: () => {
											console.log('삭제 버튼 누름');
											// TODO 본인의 댓글이라면 삭제할 수 있게 해야함.
											//deleteComment(item._id);
										},
										style: 'destructive',
									},
									{
										text: '수정',
										onPress: () => {
											console.log('수정 기능');
										},
									},
									{
										text: '취소',
										onPress: () => {
											console.log('취소');
										},
										style: 'cancel',
									},
								];
								Alert.alert('더보기', '', commentMenuList);
							}}>
							<Text>더보기</Text>
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

	// 모달 열기 관리
	const openModal = (type: string) => {
		if (type == 'menu') {
			setIsMenuModalVisible(true);
		} else if (type == 'commentMenu') {
			setIsCommentMenuModalVisible(true);
		}
	};

	// 모달 닫기 관리
	const closeModal = (type: string) => {
		if (type == 'menu') {
			setIsMenuModalVisible(false);
		} else if (type == 'commentMenu') {
			setIsCommentMenuModalVisible(false);
		}
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			keyboardVerticalOffset={statusBarHeight + 44}>
			{/* 게시글 메뉴 모달 */}
			<Modal
				animationType={'fade'}
				transparent={true}
				visible={isMenuModalVisible}
				onRequestClose={() => closeModal('menu')}>
				<TouchableWithoutFeedback onPress={() => closeModal('menu')}>
					<View
						style={{
							flex: 1,
							backgroundColor: '#000000AA',
							justifyContent: 'flex-end',
						}}>
						<SafeAreaView>
							<View
								style={{
									backgroundColor: '#FFFFFFFF',
									width: '100%',
									borderRadius: 10,
									paddingHorizontal: 10,
									maxHeight: deviceHeight * 0.4,
								}}>
								<View>
									<Text
										style={{
											color: '#182E44',
											fontSize: 20,
											fontWeight: '500',
											margin: 15,
										}}>
										게시판 메뉴
									</Text>
									<FlatList
										data={
											userId == postData.postWriterUserId
												? communityReadingMenuList
												: communityReadingMenuList.filter(item => item.title == '신고')
										}
										renderItem={({item}) => (
											<Button title={item.title} onPress={item.onPress}></Button>
										)}></FlatList>
								</View>
							</View>
						</SafeAreaView>
					</View>
				</TouchableWithoutFeedback>
			</Modal>

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
								<Text>사진 목록</Text>
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
								<Modal visible={isImageMoreModalVisible} onRequestClose={handleMoreModalClose}>
									<Text style={{textAlign: 'center', fontSize: 20}}>전체 사진 보기</Text>
									<ScrollView contentContainerStyle={styles.modalContainer}>
										{postData.postImage.map((uri, index) => (
											<Image key={index} source={{uri}} style={styles.modalImage} />
										))}
									</ScrollView>
								</Modal>
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

			<View style={styles.inputContainer}>
				<TextInput
					style={styles.commentInputField}
					value={newCommentContent}
					onChangeText={text => setNewComment(text)}
					placeholder='댓글을 입력하세요...'
				/>
				<TouchableOpacity
					style={[styles.submitButton, isCommentButtonDisabled && styles.disabledButton]}
					disabled={isCommentButtonDisabled}
					onPress={handleCommentSubmit}>
					<Text style={styles.submitButtonText}>등록</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	postNCommentContainer: {
		flex: 9,
	},
	inputContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
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
		backgroundColor: 'rgba(200, 200, 200, 0.8)',
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
	commentInputField: {
		flex: 7,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		padding: 8,
		margin: 4,
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
	modalContainer: {
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
	keyboardContainer: {
		flex: 1,
		backgroundColor: '#ffffff',
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
