import {useNavigation} from '@react-navigation/native';
import {Heading, Text, Center, IconButton, ThreeDotsIcon} from 'native-base';
import {color} from 'native-base/lib/typescript/theme/styled-system';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-google-signin/google-signin';
import {useState} from 'react';
import {Dimensions, FlatList, Modal, View, Button, TouchableOpacity} from 'react-native';
import CommunityWriteScreen from '../../screens/community/community-writing-screen';

export default function CommunityBottomPopSheet() {
	const goNext = () => {
		navigation.navigate('CommunityWritingScreen');
	};
	const navigation = useNavigation();

	const [modalVisible, setModalVisibile] = useState(false);
	const deviceHeight = Dimensions.get('window').height;
	const communityMenuList = [
		{
			title: '글 쓰기',
			onPress: () => {
				console.log('글쓰기 페이지로 이동');
				setModalVisibile(!modalVisible);
				goNext();
			},
		},
		{
			title: '신고',
			onPress: () => console.log('신고 페이지로 이동'),
		},
	];
	return (
		<SafeAreaView>
			<TouchableOpacity
				onPress={() => {
					setModalVisibile(!modalVisible);
				}}>
				<View>
					<ThreeDotsIcon></ThreeDotsIcon>
				</View>
			</TouchableOpacity>
			<Modal
				animationType={'fade'}
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisibile(!modalVisible)}>
				<View
					style={{
						flex: 1,
						backgroundColor: '#000000AA',
						justifyContent: 'flex-end',
					}}>
					<View
						style={{
							backgroundColor: '#FFFFFFFF',
							width: '100%',
							borderTopRightRadius: 10,
							borderTopLeftRadius: 10,
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
				</View>
			</Modal>
		</SafeAreaView>
	);
}
