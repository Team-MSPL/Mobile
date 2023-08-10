import firestore from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';
import {HStack, Text} from 'native-base';
import React, {useCallback, useState} from 'react';
import {Dimensions, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

export default function CommunityMainScreen({navigation}: any) {
	const [communityData, setCommunityData] = useState<any[]>([]);
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const goNext = (item: any) => {
		navigation.navigate('CommunityReadingScreen', {
			postTitle: item.postTitle,
			key: item.postKey,
		});
		console.log(item.postKey);
	};

	interface postDataType {
		postTitle: string;
		postContent: string;
		postedAt: string;
		postWriter: string;
		likeList: string[];
	}

	// CommunityMainScreen으로 올 경우 새로 고침
	useFocusEffect(
		useCallback(() => {
			fetchCommunityData();
			console.log('CommunityMainScreen 갱신됨');
		}, []),
	);

	const fetchCommunityData = async () => {
		try {
			const communitySnapshot = await firestore().collection('커뮤니티').orderBy('postedAt', 'desc').get();
			const data: postDataType[] = [];

			communitySnapshot.forEach(doc => {
				const docData = doc.data() as postDataType;
				data.push(docData);
			});
			setCommunityData(data);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.log('커뮤니티 컬렉션을 읽어오는 중에 오류가 발생했습니다:', error);
		}
	};

	// 밀어서 새로고침
	const handleRefresh = () => {
		setIsRefreshing(true); // 새로고침 시작
		fetchCommunityData().then(() => setIsRefreshing(false));
	};

	// 화면 아래쪽 끝에서 정보 더 가져오기
	const onEndReached = () => {
		if (loading) {
			return;
		} else {
			fetchCommunityData();
		}
	};

	// 가져온 게시글 목록 보여주기
	const renderPostItem = ({item}: {item: postDataType}) => {
		return (
			<View style={styles.postItemContainer}>
				<TouchableOpacity
					onPress={() => {
						goNext(item);
					}}>
					<Text style={styles.postTitleText} numberOfLines={1} ellipsizeMode='tail'>
						{item.postTitle}
					</Text>
					<Text style={styles.postContentText} numberOfLines={1} ellipsizeMode='tail'>
						{item.postContent}
					</Text>
					<HStack alignItems={'center'}>
						<Icon name={'hearto'} size={12} color='red' />
						<Text style={styles.postedAtText}>
							{item.postedAt.slice(0, 16)} | {item.postWriter}
						</Text>
					</HStack>
				</TouchableOpacity>
			</View>
		);
	};

	const flatListItemSeperator = () => {
		return (
			<View
				style={{
					height: 1,
					width: '100%',
					backgroundColor: 'gray',
				}}
			/>
		);
	};

	return (
		<View style={styles.postListContainer}>
			<FlatList
				data={communityData}
				renderItem={renderPostItem}
				keyExtractor={(item, index) => index.toString()}
				initialNumToRender={10}
				ListEmptyComponent={<Text>등록된 게시글이 없습니다.</Text>}
				ItemSeparatorComponent={flatListItemSeperator}
				onEndReached={onEndReached}
				onEndReachedThreshold={0.8}
				refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	postListContainer: {
		flex: 1,
		//width: Dimensions.get('window').width,
	},
	postItemContainer: {
		alignItems: 'flex-start',
		padding: 12,
	},
	postTitleText: {
		width: Dimensions.get('window').width * 0.9,
		fontSize: 16,
		fontWeight: '700',
	},
	postContentText: {
		width: Dimensions.get('window').width * 0.9,
		fontSize: 12,
		fontWeight: '400',
	},
	postedAtText: {
		width: Dimensions.get('window').width,
		fontSize: 12,
		fontWeight: '400',
		color: 'gray',
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		backgroundColor: 'rgba(0, 0, 0, 0.5)', // Modal의 배경에 어두운 효과를 주기 위해 반투명한 배경색 사용
	},
});
