import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import { HStack } from 'native-base';
import { useEffect, useRef, useState } from 'react';
import {
	Alert,
	Dimensions,
	FlatList,
	Image,
	InputAccessoryView,
	Modal,
	NativeModules,
	Platform,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import shortid from 'shortid';

const {StatusBarManager} = NativeModules;
export default function CommunityReadingScreen({navigation, route}: any) {
	const goBack = () => {
		navigation.goBack();
	};

	const [commentDataList, setComment] = useState<string[]>([]);
	const [postContent, setPostContent] = useState<string>('');
	const [newCommentContent, setNewComment] = useState<string>('');
	const [postImage, setPostImage] = useState<string[]>([]);
	const [imageSize, setImageSize] = useState(Dimensions.get('window').width / 4 - 16);
	const [isMoreModalVisible, setMoreModalVisible] = useState<boolean>(false);
	const [isDetailImageModalVisible, setIsDetailImageModalVisible] = useState<boolean>(false);
	const [isCommentButtonDisabled, setCommentButtonDisabled] = useState<boolean>(true);
	const [likeCount, setLikeCount] = useState(0);
	const [isLiked, setIsLiked] = useState<boolean>(false);
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
	const [statusBarHeight, setStatusBarHeight] = useState(0);
	const scrollViewRef = useRef<ScrollView>(null);

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
				const comment = data?.comment ?? [];
				setComment(comment);

				const postContent = data?.postContent ?? '';
				setPostContent(postContent);

				const postImage = data?.postImage ?? [];
				setPostImage(postImage);

				const likeList = data?.likeList ?? [];
				// TODO 유저 닉네임으로 적용시켜야 함.
				if (likeList.some((item: string) => item === '아이폰xs')) {
					setIsLiked(true);
				}
				setLikeCount(likeList.length);
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
			// db의 comment에 들어갈 정보들
			const newCommentData = {
				// TODO commenter에 유저 닉네임 적용시켜야 함.
				commenter: '아이폰xs',
				// TODO userid에 다님에서 발급해주는 고유 id값 적용시켜야 함.
				userid: 'danim신제원',
				commentContent: newCommentContent,
				commentedAt: moment(Date()).format('yy/MM/DD HH:mm'),
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
				<Text>{item.commentContent}</Text>
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
				// TODO 유저 닉네임으로 수정해야함.
				await docRef.update({
					likeList: firestore.FieldValue.arrayRemove('아이폰xs'),
				});
			} else {
				await docRef.update({
					likeList: firestore.FieldValue.arrayUnion('아이폰xs'),
				});
			}
			fetchPostData();
		} catch (error) {
			console.log('좋아요에 오류가 발생했습니다:', error);
		}
	};

	// 새로 고침
	const handleRefresh = () => {
		setIsRefreshing(true); // 새로고침 시작
		fetchPostData().then(() => setIsRefreshing(false)); // 새로고침 완료 후 상태 변경
	};

	return (
		<View style={styles.container}>
			<View style={styles.postNCommentContainer}>
				<FlatList
					ListHeaderComponent={
						<View>
							<Text>제목: {route.params.postTitle}</Text>
							<Text>본문</Text>
							<Text style={styles.postContentText}>{postContent}</Text>
							<Text>사진 목록</Text>
							<View style={styles.imageContainer}>
								{postImage.slice(0, 8).map((uri, index) => (
									<Image key={index} source={{uri}} style={styles.image} />
								))}
								{postImage.length > 8 && (
									<TouchableOpacity style={styles.moreButton} onPress={handleMoreButtonPress}>
										<Text style={styles.moreButtonText}>더보기</Text>
									</TouchableOpacity>
								)}
							</View>
							<Modal visible={isMoreModalVisible} onRequestClose={handleMoreModalClose}>
								<Text style={{textAlign: 'center', fontSize: 20}}>전체 사진 보기</Text>
								<ScrollView contentContainerStyle={styles.modalContainer}>
									{postImage.map((uri, index) => (
										<Image key={index} source={{uri}} style={styles.modalImage} />
									))}
								</ScrollView>
							</Modal>
							<View style={styles.likeContainer}>
								<TouchableOpacity style={styles.likeButton} onPress={handleLikePress}>
									<Icon name={isLiked ? 'heart' : 'hearto'} size={20} color='red' />
									<Text style={styles.likeButtonText}>{isLiked ? '좋아요 취소' : '좋아요'}</Text>
								</TouchableOpacity>
								<Text style={styles.likesCount}>{likeCount}명이 좋아합니다</Text>
							</View>
							<Text>댓글</Text>
						</View>
					}
					data={commentDataList}
					renderItem={renderCommentItem}
					keyExtractor={(item, index) => index.toString()}
					initialNumToRender={10}
					ListEmptyComponent={<Text>등록된 댓글이 없습니다.</Text>}
				/>
			</View>
			<SafeAreaView>
				<InputAccessoryView>
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
				</InputAccessoryView>
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: Dimensions.get('window').height,
	},
	postNCommentContainer: {
		flex: 1,
	},
	postContentText: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 16,
	},
	commentItemContainer: {
		height: Dimensions.get('window').height * 0.1,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		padding: 8,
		margin: 8,
	},
	commentProfileImage: {
		width: 24,
		height: 24,
		marginBottom: 8,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#5DC3DB',
		resizeMode: 'contain',
	},
	inputContainer: {
		padding: 4,
		flexDirection: 'row',
		alignItems: 'center',
		height: Dimensions.get('window').height * 0.08,
		width: Dimensions.get('window').width,
		backgroundColor: 'white',
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
