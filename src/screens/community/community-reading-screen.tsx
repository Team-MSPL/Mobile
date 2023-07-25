import {useNavigation} from '@react-navigation/native';
import {Heading, Center} from 'native-base';
import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TextInput, TouchableOpacity, Image, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function CommunityMainScreen({navigation, route}: any) {
	const goBack = () => {
		navigation.goBack();
	};

	const [commentList, setCommentList] = useState<string[]>([]);
	const [postContent, setPostContent] = useState<string>('');
	const [newComment, setNewComment] = useState<string>('');

	useEffect(() => {
		fetchPostData();
	});

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
			} else {
				console.log('킹태운 문서가 존재하지 않습니다.');
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

	return (
		<View style={styles.container}>
			<Text>제목: {route.params.postTitle}</Text>
			<Text>본문</Text>
			<Text style={styles.postContentText}>{postContent}</Text>
			<Text>댓글</Text>
			<FlatList
				data={commentList}
				renderItem={renderCommentItem}
				keyExtractor={(item, index) => index.toString()}
				ListEmptyComponent={<Text>No comments available</Text>}
			/>
			<View style={styles.inputContainer}>
				<TextInput
					style={styles.input}
					value={newComment}
					onChangeText={text => setNewComment(text)}
					placeholder='댓글을 입력하세요...'
				/>
				<TouchableOpacity style={styles.button} onPress={handleCommentSubmit}>
					<Text style={styles.buttonText}>등록</Text>
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
	button: {
		marginLeft: 8,
		backgroundColor: '#007BFF',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 8,
	},
	buttonText: {
		color: 'white',
		fontWeight: 'bold',
	},
});
