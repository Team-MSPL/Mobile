import {useNavigation} from '@react-navigation/native';
import {Text, ThreeDotsIcon} from 'native-base';
import {useState} from 'react';
import {
	Button,
	Dimensions,
	FlatList,
	Modal,
	SafeAreaView,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';

export default function CommunityReadingBottomPopSheet() {
	const navigation = useNavigation();
	const goNext = () => {
		navigation.navigate('CommunityWritingScreen');
	};

	const [menuModalVisible, setMenuModalVisibile] = useState(false);
	const deviceHeight = Dimensions.get('window').height;
	const communityReadingMenuList = [
		{
			title: '수정',
			onPress: () => {
				console.log('글 수정 페이지로 이동');
				setMenuModalVisibile(!menuModalVisible);
				goNext();
			},
		},
		{
			title: '삭제',
			onPress: () => {
				console.log('글쓰기 페이지로 이동');
				setMenuModalVisibile(!menuModalVisible);
				goNext();
			},
		},
		{
			title: '신고',
			onPress: () => console.log('신고 페이지로 이동'),
		},
	];

	const flatListItemSeperator = () => {
		return (
			<View
				style={{
					height: 1,
					width: '100%',
					backgroundColor: 'blue',
				}}
			/>
		);
	};

	return (
		<View>
			<TouchableOpacity
				onPress={() => {
					setMenuModalVisibile(true);
				}}>
				<View>
					<ThreeDotsIcon></ThreeDotsIcon>
				</View>
			</TouchableOpacity>
			<Modal
				animationType={'fade'}
				transparent={true}
				visible={menuModalVisible}
				onRequestClose={() => setMenuModalVisibile(false)}>
				<TouchableWithoutFeedback onPress={() => setMenuModalVisibile(false)}>
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
									padding: 24,
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
										data={communityReadingMenuList}
										renderItem={({item}) => (
											<Button title={item.title} onPress={item.onPress}></Button>
										)}
										ItemSeparatorComponent={flatListItemSeperator}
										scrollEnabled={false}
									/>
								</View>
							</View>
						</SafeAreaView>
					</View>
				</TouchableWithoutFeedback>
			</Modal>
		</View>
	);
}
