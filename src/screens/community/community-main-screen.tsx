import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import {HStack, Text, ThreeDotsIcon} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {
	ActivityIndicator,
	Button,
	Dimensions,
	FlatList,
	Modal,
	RefreshControl,
	SafeAreaView,
	StyleSheet,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import shortid from 'shortid';
import {useAppDispatch, useAppSelector} from '../../redux';
import {getPostList, postListType, savePost} from '../../redux/community/community.slice';

export default function CommunityMainScreen({navigation}: any) {
	const [communityData, setCommunityData] = useState<any[]>([]);
	const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);

	const dispatch = useAppDispatch(); // redux에 있는 함수를 쓸 수 있게 해줌.
	const {postList} = useAppSelector(state => state.communitySlice); // slice에 있는 변수를 가져옴.

	useFocusEffect(
		useCallback(() => {
			dispatch(getPostList());
		}, []),
	);

	interface postDataType {
		postTitle: string;
		postContent: string;
		postId: string;
		postedAt: string;
		postWriter: string;
		likeList: string[];
	}

	const deviceHeight = Dimensions.get('window').height;
	const communityMenuList = [
		{
			title: '글 쓰기',
			onPress: () => {
				console.log('글쓰기 페이지로 이동');
				closeModal();
				goCommunityWritingScreen();
			},
		},
	];

	// 게시글 읽는 화면으로 이동
	const goCommunityReadingScreen = (item: any) => {
		navigation.navigate('CommunityReadingScreen', {
			postId: item.postId,
			key: item.postKey,
		});
		console.log(item.postKey);
	};

	// 게시글 작성하는 화면으로 이동
	const goCommunityWritingScreen = () => {
		navigation.navigate('CommunityWritingScreen', {
			postId: shortid.generate(),
			title: '',
			content: '',
			images: [],
			isNewPost: true,
		});
	};

	// 앱 바 우측 더보기
	useEffect(() => {
		navigation.setOptions({
			headerRight: () => {
				return (
					<View>
						<TouchableOpacity
							onPress={() => {
								openModal();
							}}>
							<ThreeDotsIcon></ThreeDotsIcon>
						</TouchableOpacity>
					</View>
				);
			},
		});
	}, []);

	// CommunityMainScreen으로 올 경우 새로 고침
	useFocusEffect(
		useCallback(() => {
			fetchCommunityData();
		}, []),
	);

	// 커뮤니티 정보 가져오기
	const fetchCommunityData = async () => {
		try {
			dispatch(getPostList());
			console.log('DB로부터 게시글을 가져오는데 성공했습니다.');
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			console.log('DB로부터 게시글을 읽어오는 중에 오류가 발생했습니다:', error);
		}
	};

	// 밀어서 새로고침
	const handleRefresh = () => {
		setIsRefreshing(true); // 새로고침 시작
		fetchCommunityData().then(() => setIsRefreshing(false));
	};

	// 화면 아래쪽 끝에서 정보 더 가져오기
	const onEndReached = () => {
		if (isLoading) {
			return;
		} else {
			fetchCommunityData();
		}
	};

	// 가져온 게시글 목록 UI
	const renderPostItem = (data: {item: postListType}) => {
		return (
			<View style={styles.postItemContainer}>
				<TouchableOpacity
					onPress={() => {
						console.log('게시글 읽는 화면으로 가는 함수 구현해야 함');
						//goCommunityReadingScreen(item);
					}}>
					<Text style={styles.postTitleText} numberOfLines={1} ellipsizeMode='tail'>
						{data.item.postTitle}
					</Text>
					<HStack alignItems={'center'}>
						<Icon name={'hearto'} size={12} color='red' />
						<Text style={styles.postedAtText}>
							{data.item.postedAt.slice(0, 16)} | {data.item.postWriter}
						</Text>
					</HStack>
				</TouchableOpacity>
			</View>
		);
	};

	// 메뉴 모달창 아이템 구분선
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

	// 모달 열기 관리
	const openModal = () => {
		setIsMenuModalVisible(true);
	};

	// 모달 닫기 관리
	const closeModal = () => {
		setIsMenuModalVisible(false);
	};

	return (
		<View style={styles.postListContainer}>
			{isLoading ? (
				<ActivityIndicator size='large' color='#0000ff' />
			) : (
				<FlatList
					data={postList}
					renderItem={renderPostItem}
					initialNumToRender={10}
					ListEmptyComponent={<Text>등록된 게시글이 없습니다.</Text>}
					ItemSeparatorComponent={flatListItemSeperator}
					onEndReached={onEndReached}
					onEndReachedThreshold={0.8}
					refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
				/>
			)}

			<TouchableOpacity
				onPress={() => {
					dispatch(
						savePost({
							postTitle: '테스트1',
							postContent: '테스트 본문',
							postImage: [],
							postedAt: moment(Date()).format('yy/MM/DD HH:mm:ss'),
						}),
					);
				}}>
				<Text>버튼</Text>
			</TouchableOpacity>

			<Modal
				animationType={'fade'}
				transparent={true}
				visible={isMenuModalVisible}
				onRequestClose={() => closeModal()}>
				<TouchableWithoutFeedback onPress={() => closeModal()}>
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
										data={communityMenuList}
										renderItem={({item}) => (
											<Button title={item.title} onPress={item.onPress}></Button>
										)}></FlatList>
								</View>
							</View>
						</SafeAreaView>
					</View>
				</TouchableWithoutFeedback>
			</Modal>

			{/* {isLoading ? (
				<ActivityIndicator size='large' color='#0000ff' />
			) : (
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
			)}
			<Modal
				animationType={'fade'}
				transparent={true}
				visible={isMenuModalVisible}
				onRequestClose={() => closeModal()}>
				<TouchableWithoutFeedback onPress={() => closeModal()}>
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
										data={communityMenuList}
										renderItem={({item}) => (
											<Button title={item.title} onPress={item.onPress}></Button>
										)}></FlatList>
								</View>
							</View>
						</SafeAreaView>
					</View>
				</TouchableWithoutFeedback>
			</Modal> */}
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
