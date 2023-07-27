import {useNavigation} from '@react-navigation/native';
import {Heading, Text, Center} from 'native-base';
import React, {useEffect, useState} from 'react';
import {FlatList, Modal, View, Button, StyleSheet, TouchableOpacity, RefreshControl, TextInput} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import shortid from 'shortid';

export default function CommunityMainScreen({navigation}: any) {
	const [communityData, setCommunityData] = useState<any[]>([]);
	const [selectedItem, setSelectedItem] = useState<any | null>(null);
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

	const goNext = (item: any) => {
		navigation.navigate('CommunityReadingScreen', {
			postTitle: item.postTitle,
			key: item.postKey,
		});
		console.log(item.postKey);
	};

	useEffect(() => {
		fetchCommunityData();
	});

	const fetchCommunityData = async () => {
		try {
			const communitySnapshot = await firestore().collection('커뮤니티').orderBy('createdAt', 'desc').get();
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

	const handleRefresh = () => {
		setIsRefreshing(true); // 새로고침 시작
		fetchCommunityData().then(() => setIsRefreshing(false)); // 새로고침 완료 후 상태 변경
	};

	return (
		<View style={styles.container}>
			<FlatList
				data={communityData}
				renderItem={({item}) => (
					<View>
						<TouchableOpacity
							onPress={() => {
								goNext(item);
							}}>
							<Text>{`${item.postTitle}`}</Text>
						</TouchableOpacity>
					</View>
				)}
				keyExtractor={(item, index) => index.toString()}
				refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
			/>
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
