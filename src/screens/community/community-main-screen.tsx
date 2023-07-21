import {useNavigation} from '@react-navigation/native';
import {Heading, Text, Center} from 'native-base';
import {color} from 'native-base/lib/typescript/theme/styled-system';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-google-signin/google-signin';
import React, {useEffect, useState} from 'react';
import {
	Dimensions,
	FlatList,
	Modal,
	View,
	Button,
	StyleSheet,
	TouchableOpacity,
	TouchableHighlight,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import CommunityDetailModal from '../../utill/component/community-detail-modal';
import CommunityBottomPopSheet from '../../utill/component/community-bottom-popup-sheet';

export default function CommunityMainScreen() {
	const [communityData, setCommunityData] = useState<any[]>([]);
	const [selectedItem, setSelectedItem] = useState<any | null>(null);
	const [modalVisible, setModalVisible] = useState(false);

	useEffect(() => {
		// Firebase Firestore에서 '커뮤니티' 컬렉션의 모든 문서 읽어오기 (postNum 필드의 내림차순으로 정렬)
		const fetchCommunityData = async () => {
			try {
				const communitySnapshot = await firestore().collection('커뮤니티').orderBy('postNum', 'desc').get();
				const data: any[] = [];

				communitySnapshot.forEach(doc => {
					const docData = doc.data();
					data.push(docData);
				});

				setCommunityData(data);
			} catch (error) {
				console.log('커뮤니티 컬렉션을 읽어오는 중에 오류가 발생했습니다:', error);
			}
		};

		fetchCommunityData();
	}, []);

	const handleButtonPress = (item: any) => {
		setSelectedItem(item);
		setModalVisible(true);
	};

	return (
		<View style={styles.container}>
			<FlatList
				data={communityData}
				renderItem={({item}) => (
					<View>
						<TouchableOpacity onPress={() => handleButtonPress(item)}>
							<Text>{`${item.postTitle}`}</Text>
						</TouchableOpacity>
					</View>
				)}
				keyExtractor={(item, index) => index.toString()}
			/>
			<Modal visible={modalVisible} animationType='slide' onRequestClose={() => setModalVisible(false)}>
				<View style={styles.modalContainer}>
					<Text fontSize={'3xl'}>본문 내용</Text>
					<Text fontSize={'xl'}>{selectedItem?.postContent}</Text>
					<Text>댓글</Text>
					<FlatList
						data={communityData}
						renderItem={({item}) => (
							<View>
								<Text>{`${item.commentList}`}</Text>
							</View>
						)}
						keyExtractor={(item, index) => index.toString()}
					/>
					{/* 이곳에 모달 내용 추가 */}
					<Button title='창 닫기' onPress={() => setModalVisible(false)} />
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		backgroundColor: 'rgba(0, 0, 0, 0.5)', // Modal의 배경에 어두운 효과를 주기 위해 반투명한 배경색 사용
	},
});
