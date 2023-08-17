import {useNavigation} from '@react-navigation/native';
import {Text, ThreeDotsIcon} from 'native-base';
import {useState} from 'react';
import {Button, Dimensions, FlatList, Modal, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function CommunityMainBottomPopSheet() {
	const navigation = useNavigation();
	const goNext = () => {
		navigation.navigate('CommunityWritingScreen');
	};

	const [menuModalVisible, setMenuModalVisibile] = useState(false);
	const [reportModalVisible, setReportModalVisible] = useState(false);

	const deviceHeight = Dimensions.get('window').height;
	const communityMenuList = [
		{
			title: '글 쓰기',
			onPress: () => {
				console.log('글쓰기 페이지로 이동');
				setMenuModalVisibile(false);
				goNext();
			},
		},
	];

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
			<Modal
				animationType={'fade'}
				transparent={true}
				visible={reportModalVisible}
				onRequestClose={() => setReportModalVisible(!reportModalVisible)}></Modal>
		</View>
	);
}
