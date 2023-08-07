import {useNavigation} from '@react-navigation/native';
import {Heading, Center, StatusBar, Row, HStack, Icon} from 'native-base';
import {useEffect, useRef, useState} from 'react';

import {
	View,
	Text,
	FlatList,
	TextInput,
	TouchableOpacity,
	Image,
	StyleSheet,
	Alert,
	Dimensions,
	Modal,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
	NativeModules,
} from 'react-native';
import firestore, {firebase} from '@react-native-firebase/firestore';
import {useAppDispatch} from '../../redux';
import {communitySliceActions} from '../../redux/community/community.slice';
import moment from 'moment';
import {getStorage} from '../../redux/login-info/login.slice';
import shortid from 'shortid';

const {StatusBarManager} = NativeModules;
export default function CommunityReadingScreen({navigation, route}: any) {
	const goBack = () => {
		navigation.goBack();
	};

	const [commentDataList, setCommentDataList] = useState<string[]>([]);
	const [postContent, setPostContent] = useState<string>('');
	const [newComment, setNewComment] = useState<string>('');
	const [postImageList, setPostImageList] = useState<string[]>([]);
	const [imageSize, setImageSize] = useState(Dimensions.get('window').width / 4 - 16);
	const [isMoreModalVisible, setMoreModalVisible] = useState<boolean>(false);
	const [isDetailImageModalVisible, setIsDetailImageModalVisible] = useState<boolean>(false);
	const [isCommentButtonDisabled, setCommentButtonDisabled] = useState<boolean>(true);
	const [likeCount, setLikeCount] = useState(0);
	const [isLiked, setIsLiked] = useState<boolean>(false);

	// firestore로부터 데이터 가져옴
	useEffect(() => {
		fetchPostData();
	}, []);

	const fetchPostData = async () => {
		try {
			const docRef = firestore().collection('커뮤니티').doc(route.params.postTitle);
			const docSnapshot = await docRef.get();
			if (docSnapshot.exists) {
				const data = docSnapshot.data();
				const originCommentDataList = data?.commentDataList ?? [];
				const commentDataList = originCommentDataList.map((data: any) => ({
					...data,
					commentedAt: moment(data.commentedAt).format('yy/MM/DD HH:mm'),
				}));
				console.log('댓글 가져오기', commentDataList);
				setCommentDataList(commentDataList);

				const postContent = data?.postContent ?? '';
				setPostContent(postContent);

				const postImageList = data?.postImageList ?? [];
				setPostImageList(postImageList);
				console.log(postImageList);

				const likeList = data?.likeList ?? [];
				if (likeList.some((item: string) => item === '123')) {
					setIsLiked(isLiked);
				}
				setLikeCount(likeList.length);
				console.log('좋아요 수 ', likeCount);
			} else {
				console.log(route.params.postTitle, '문서가 존재하지 않습니다.');
			}
		} catch (error) {
			console.log('데이터를 가져오는 중에 오류가 발생했습니다:', error);
		}
	};

	// iOS에서 키보드 활성화시 TextInput이 안 보이는 이슈를 위한 코드
	useEffect(() => {
		if (Platform.OS === 'ios')
			StatusBarManager.getHeight((statusBarFrameData: any) => {
				setStatusBarHeight(statusBarFrameData.height);
			});
	}, []);
	const [statusBarHeight, setStatusBarHeight] = useState(0);
	const scrollViewRef = useRef<ScrollView>(null);

	// 댓글 등록 버튼 활성 및 비활성화
	useEffect(() => {
		setCommentButtonDisabled(newComment.trim() === '');
	}, [newComment]);

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

	const handleTextInputFocus = () => {
		// 텍스트 입력 창이 포커스되면 스크롤 뷰를 해당 입력 창 위치로 스크롤
		scrollViewRef.current?.scrollToEnd({animated: true});
	};

	const handleResize = () => {
		const newSize = Dimensions.get('window').width / 4 - 16;
		setImageSize(newSize);
	};

	// *댓글 등록 버튼 눌렀을 때
	const handleCommentSubmit = async () => {
		try {
			const docRef = firestore().collection('커뮤니티').doc(route.params.postTitle);
			const newCommentData = {
				commenter: '여기는 나중에 바꿔야함',
				userid: '다님에서 제공하는 각 유저의 고유 아이디 값',
				comment: newComment,
				commentedAt: moment(Date()).format('yy/MM/DD HH:mm'),
			};
			// 새로운 댓글을 commentList에 추가
			const updatedCommentDataList = [...commentDataList, newCommentData];
			await docRef.update({commentDataList: updatedCommentDataList});
			// 댓글 등록 후 입력창 초기화
			setNewComment('');
			Alert.alert('댓글이 등록되었습니다.');
			fetchPostData();
		} catch (error) {
			console.log('댓글 등록 중에 오류가 발생했습니다:', error);
		}
	};

	// 가져온 댓글 보여주기
	const renderCommentItem = ({item}: {item: any}) => {
		return (
			<View style={styles.commentItemContainer}>
				<HStack space={1} alignItems='center'>
					{/* TODO: 이미지를 유저 개인 프로필 사진 가져오는 걸로 바꿔야 함.*/}
					<Image
						source={require('/Users/sjw/Danim_RN/Mobile/public/images/danim_logo.png')}
						style={styles.commentProfileImage}></Image>
					<Text>{item.commenter}</Text>
				</HStack>
				<Text>{item.comment}</Text>
				<Text style={{fontSize: 8}}>{item.commentedAt}</Text>
			</View>
		);
	};

	const renderPostImageItem = ({item}: {item: string}) => (
		<View style={[styles.imageContainer, {width: imageSize, height: imageSize}]}>
			{item ? <Image source={{uri: item}} style={styles.image} /> : <Text>이미지를 불러오는 중...</Text>}
		</View>
	);

	// 사진 자세히 보기
	const handleDetailImagePress = () => {
		setIsDetailImageModalVisible(true);
	};

	// 사진 더보기 버튼 눌렀을 때
	const handleMoreButtonPress = () => {
		setMoreModalVisible(true);
	};

	const handleMoreModalClose = () => {
		setMoreModalVisible(false);
	};

	// 좋아요 버튼을 눌렀을 때
	const handleLikePress = async () => {
		setIsLiked(!isLiked);
		console.log('좋아요 버튼 안 눌러졌나요? ', isLiked);
		try {
			const docRef = firestore().collection('커뮤니티').doc(route.params.postTitle);
			if (isLiked) {
				// TODO shortid 대신에 userid로 수정해야 함.
				await docRef.update({
					likeList: firestore.FieldValue.arrayRemove('123123'),
				});
			} else {
				await docRef.update({
					likeList: firestore.FieldValue.arrayUnion('123123'),
				});
			}
			fetchPostData();
		} catch (error) {
			console.log('좋아요에 오류가 발생했습니다:', error);
		}
	};

	return (
		<KeyboardAvoidingView
			style={styles.keyboardContainer}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={statusBarHeight + 44}>
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<View style={styles.container}>
					<ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollViewContainer}>
						<View onStartShouldSetResponder={() => true}>
							<Text>제목: {route.params.postTitle}</Text>
							<Text>본문</Text>
							<Text style={styles.postContentText}>{postContent}</Text>
							<Text>사진 목록</Text>
							<View style={styles.imageContainer}>
								{postImageList.slice(0, 8).map((uri, index) => (
									<Image key={index} source={{uri}} style={styles.image} />
								))}
								{postImageList.length > 8 && (
									<TouchableOpacity style={styles.moreButton} onPress={handleMoreButtonPress}>
										<Text style={styles.moreButtonText}>더보기</Text>
									</TouchableOpacity>
								)}
							</View>
							<Modal visible={isMoreModalVisible} onRequestClose={handleMoreModalClose}>
								<Text style={{textAlign: 'center', fontSize: 20}}>전체 사진 보기</Text>
								<ScrollView contentContainerStyle={styles.modalContainer}>
									{postImageList.map((uri, index) => (
										<Image key={index} source={{uri}} style={styles.modalImage} />
									))}
								</ScrollView>
							</Modal>
							<View style={styles.likeContainer}>
								<TouchableOpacity style={styles.likeButton} onPress={handleLikePress}>
									<Icon name={isLiked ? 'heart' : 'heart-o'} size={20} color='white' />
									<Text style={styles.likeButtonText}>{isLiked ? '좋아요 취소' : '좋아요'}</Text>
								</TouchableOpacity>
								<Text style={styles.likesCount}>{likeCount}명이 좋아합니다</Text>
							</View>
							<Text>댓글</Text>
							<FlatList
								data={commentDataList}
								renderItem={renderCommentItem}
								keyExtractor={(item, index) => index.toString()}
								ListEmptyComponent={<Text>등록된 댓글이 없습니다.</Text>}
							/>
						</View>
					</ScrollView>
					<View style={styles.inputContainer}>
						<TextInput
							style={styles.input}
							value={newComment}
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
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	commentProfileImage: {
		width: 24,
		height: 24,
		marginBottom: 8,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#5DC3DB',
		resizeMode: 'contain',
	},
	scrollViewContainer: {
		flexGrow: 1,
	},
	container: {
		flex: 1,
		padding: 16,
	},
	postContentText: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 16,
	},
	commentItemContainer: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		padding: 8,
		marginBottom: 8,
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 16,
	},
	input: {
		flex: 1,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		padding: 8,
	},
	submitButton: {
		backgroundColor: 'blue',
		padding: 10,
		borderRadius: 8,
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
		flex: 1,
		justifyContent: 'center',
		alignItems: 'flex-start',
		marginBottom: 48,
	},
	likeButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'blue',
		padding: 10,
		borderRadius: 5,
	},
	likeButtonText: {
		color: 'white',
		fontWeight: 'bold',
		marginLeft: 5,
	},
	likesCount: {
		marginTop: 10,
	},
});
