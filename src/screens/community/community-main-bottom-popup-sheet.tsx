import {useNavigation} from '@react-navigation/native';
import {Heading, Text, Center, IconButton, ThreeDotsIcon} from 'native-base';
import {color} from 'native-base/lib/typescript/theme/styled-system';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-google-signin/google-signin';
import {useState} from 'react';
import {Dimensions, FlatList, Modal, View, Button, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import CommunityWriteScreen from './community-writing-screen';
import firestore from '@react-native-firebase/firestore';
import { SvgAst } from 'react-native-svg';

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
		{
			title: '신고',
			onPress: () => {
				console.log('신고 페이지로 이동');
			},
		},
	];

	const reportMenuList = [
		{
			title: '무분별한 도배',
			onPress: () => {
				console.log('무분별한 도배 신고');
			},
		},
		{
			title: '정당/정치인 비하 및 선거 운동',
			onPress: () => {
				console.log('정당/정치인 비하 및 선거 운동');
			},
		},
		{
			title: '욕설/비하',
			onPress: () => {
				console.log('욕설/비하');
			},
		},
		{
			title: '상업적 광고 및 판매',
			onPress: () => {
				console.log('상업적 광고 및 판매');
			},
		},
		{
			title: '음란물/불건전한 만남 및 대화',
			onPress: () => {
				console.log('음란물/불건전한 만남 및 대화');
			},
		},
		{
			title: '유출/사칭/사기',
			onPress: () => {
				console.log('유출/사칭/사기');
			},
		},
		{
			title: '기타 - 사유 작성',
			onPress: () => {
				console.log('기타');
			},
		},
	];

	// const handleReportSubmit = () => {
	// 	try {
	// 		firestore()
	// 			.collection('게시글 신고')
	// 			.doc(title) // 제목을 문서 ID로 사용
	// 			.set({
	// 				reporterToken: jwtToken,
	// 				postTitle: title,
	// 				postContent: content,
	// 				reportedAt: firestore.FieldValue.serverTimestamp(),
	// 				postImageList: images,
	// 			})
	// 			.then(() => {
	// 				console.log('신고가 성공적으로 되었습니다.');
	// 			})
	// 			.catch(error => {
	// 				console.log('신고를 하는 중에 오류가 발생했습니다:', error);
	// 			});

	// 		console.log('신고가 등록되었습니다.');
	// 		// 게시글 등록 완료 후 필요한 처리를 추가하면 됩니다.
	// 	} catch (error) {
	// 		console.log('게시글 등록 중에 오류가 발생했습니다:', error);
	// 	}
	// };

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
				onRequestClose={() => setMenuModalVisibile(false)}
			>
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
									borderRadius:10,
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
