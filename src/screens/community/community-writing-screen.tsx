import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Text} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import shortid from 'shortid';

export default function CommunityWritingScreen({navigation}: any) {
	const goBack = () => {
		navigation.goBack();
	};

	const [title, setTitle] = useState<string>('');
	const [content, setContent] = useState<string>('');

	const handleTitleChange = (text: string) => {
		setTitle(text);
	};

	const handleContentChange = (text: string) => {
		setContent(text);
	};

	const handleSubmit = () => {
		// Firebase Firestore에 데이터 저장
		firestore()
			.collection('커뮤니티')
			.doc(title) // 제목을 문서 ID로 사용
			.set({
				postTitle: title,
				postContent: content,
				postKey: shortid.generate(),
				createdAt: firestore.FieldValue.serverTimestamp(),
				// 여러 필드값 추가 가능
				// 예: author: 'John Doe', views: 0, likes: 0, ...
			})
			.then(() => {
				console.log('글이 성공적으로 저장되었습니다.');
			})
			.catch(error => {
				console.log('글을 저장하는 중에 오류가 발생했습니다:', error);
			});
	};

	return (
		<View style={styles.container}>
			<Text>제목</Text>
			<TextInput
				style={styles.titleInput}
				placeholder='제목을 입력하세요'
				onChangeText={handleTitleChange}
				value={title}
			/>
			<Text>본문 내용</Text>
			<TextInput
				style={styles.contentInput}
				placeholder='내용을 입력하세요'
				onChangeText={handleContentChange}
				value={content}
				multiline={true} // 여러 줄 입력 가능하도록 설정
			/>
			<Button
				title='글 등록'
				onPress={() => {
					handleSubmit();
					goBack();
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		justifyContent: 'center',
		alignItems: 'center',
	},
	titleInput: {
		width: '100%',
		height: 40,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		paddingHorizontal: 10,
		marginBottom: 16,
	},
	contentInput: {
		width: '100%',
		height: 200,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		paddingHorizontal: 10,
		textAlignVertical: 'top', // 내용 입력시 상단 정렬
		marginBottom: 16,
	},
});
