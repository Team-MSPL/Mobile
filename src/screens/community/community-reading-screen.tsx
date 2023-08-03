import {useNavigation} from '@react-navigation/native';
import {Heading, Center, KeyboardAvoidingView} from 'native-base';
import {useEffect, useState} from 'react';
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
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useAppDispatch} from '../../redux';
import {communitySliceActions} from '../../redux/community/community.slice';

export default function CommunityReadingScreen({navigation, route}: any) {
	const goBack = () => {
		navigation.goBack();
	};

	const [commentList, setCommentList] = useState<string[]>([]);
	const [postContent, setPostContent] = useState<string>('');
	const [newComment, setNewComment] = useState<string>('');
	const [postImageList, setPostImageList] = useState<string[]>([]);
	const [imageSize, setImageSize] = useState(Dimensions.get('window').width / 4 - 16);
	const [isMoreModalVisible, setIsMoreModalVisible] = useState<boolean>(false);
	const [isDetailImageModalVisible, setIsDetailImageModalVisible] = useState<boolean>(false);

	const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

	const dispatch = useAppDispatch();
	dispatch(communitySliceActions.setPostInfo());
	useEffect(() => {
		fetchPostData();
	}, []);
	useEffect(() => {
		setIsButtonDisabled(newComment.trim() === '');
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
	const handleResize = () => {
		const newSize = Dimensions.get('window').width / 4 - 16;
		setImageSize(newSize);
	};

	const fetchPostData = async () => {
		try {
			const docRef = firestore().collection('커뮤니티').doc(route.params.postTitle);
			const docSnapshot = await docRef.get();

			if (docSnapshot.exists) {
				const data = docSnapshot.data();
				const commentList = data?.commentList ?? [];
				setCommentList(commentList);

				const postContent = data?.postContent ?? '';
				setPostContent(postContent);

				const postImageList = data?.postImageList ?? [];
				setPostImageList(postImageList);
				console.log(postImageList);
			} else {
				console.log(route.params.postTitle, '문서가 존재하지 않습니다.');
			}
		} catch (error) {
			console.log('데이터를 가져오는 중에 오류가 발생했습니다:', error);
		}
	};

	const handleCommentSubmit = async () => {
		if (newComment.trim() === '') {
			return; // 댓글이 비어있으면 등록하지 않음
		}

		try {
			const docRef = firestore().collection('커뮤니티').doc(route.params.postTitle);

			// 새로운 댓글을 commentList에 추가
			const updatedCommentList = [...commentList, newComment];
			await docRef.update({commentList: updatedCommentList});

			// 댓글 등록 후 입력창 초기화
			setNewComment('');
			Alert.alert('댓글이 등록되었습니다.');
			fetchPostData();
		} catch (error) {
			console.log('댓글 등록 중에 오류가 발생했습니다:', error);
		}
	};

	const renderCommentItem = ({item}: {item: string}) => {
		return (
			<View style={styles.commentItemContainer}>
				<Text>{item}</Text>
			</View>
		);
	};

	const renderPostImageItem = ({item}: {item: string}) => (
		<View style={[styles.imageContainer, {width: imageSize, height: imageSize}]}>
			{item ? <Image source={{uri: item}} style={styles.image} /> : <Text>이미지를 불러오는 중...</Text>}
		</View>
	);
	const handleMoreButtonPress = () => {
		setIsMoreModalVisible(true);
	};

	const handleDetailImagePress = () => {
		setIsDetailImageModalVisible(true);
	};

	const handleModalClose = () => {
		setIsMoreModalVisible(false);
	};

	return (
		<View style={styles.container}>
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
			<Modal visible={isMoreModalVisible} onRequestClose={handleModalClose}>
				<Text style={{textAlign: 'center', fontSize: 20}}>전체 사진 보기</Text>
				<ScrollView contentContainerStyle={styles.modalContainer}>
					{postImageList.map((uri, index) => (
						<Image key={index} source={{uri}} style={styles.modalImage} />
					))}
				</ScrollView>
			</Modal>

			<Text>댓글</Text>
			<FlatList
				data={commentList}
				renderItem={renderCommentItem}
				keyExtractor={(item, index) => index.toString()}
				ListEmptyComponent={<Text>등록된 댓글이 없습니다.</Text>}
			/>
			<View style={styles.inputContainer}>
				<TextInput
					style={styles.input}
					value={newComment}
					onChangeText={text => setNewComment(text)}
					placeholder='댓글을 입력하세요...'
				/>
				<TouchableOpacity
					style={[styles.submitButton, isButtonDisabled && styles.disabledButton]}
					disabled={isButtonDisabled}
					onPress={handleCommentSubmit}>
					<Text style={styles.submitButtonText}>등록</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
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
});
