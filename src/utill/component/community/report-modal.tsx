import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import {
	Alert,
	Dimensions,
	FlatList,
	Modal,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import shortid from 'shortid';

export default function ReportModal({
	postId,
	userName,
	isVisible,
	closeReportModal,
}: {
	postId: string;
	userName: string;
	isVisible: boolean;
	closeReportModal: () => void;
}) {
	const reportMenuList = [
		{
			title: '무분별한 도배',
			onPress: () => {
				handleReport('무분별한 도배');
				console.log('무분별한 도배 신고');
			},
		},
		{
			title: '정당/정치인 비하 및 선거 운동',
			onPress: () => {
				handleReport('정당/정치인 비하 및 선거 운동');
				console.log('정당/정치인 비하 및 선거 운동');
			},
		},
		{
			title: '욕설/비하',
			onPress: () => {
				handleReport('욕설/비하');
				console.log('욕설/비하');
			},
		},
		{
			title: '상업적 광고 및 판매',
			onPress: () => {
				handleReport('상업적 광고 및 판매');
				console.log('상업적 광고 및 판매');
			},
		},
		{
			title: '음란물/불건전한 만남 및 대화',
			onPress: () => {
				handleReport('음란물/불건전한 만남 및 대화');
				console.log('음란물/불건전한 만남 및 대화');
			},
		},
		{
			title: '유출/사칭/사기',
			onPress: () => {
				handleReport('유출/사칭/사기');
				console.log('유출/사칭/사기');
			},
		},
		{
			title: '기타 - 사유 작성',
			onPress: () => {
				handleReport('기타 - 사유 작성');
				console.log('기타');
			},
		},
	];

	const handleReport = async (reason: string) => {
		try {
			const docRef = firestore().collection('게시글 신고');
			// db의 comment에 들어갈 정보들
			const reportData = {
				// TODO reportWriter 유저 닉네임 적용시켜야 함.
				reportWriter: userName,
				reportReason: reason,
				reportedAt: moment(Date()).format('yy/MM/DD HH:mm:ss'),
				postId: postId,
			};
			// 새로운 댓글 정보들을 comment에 추가
			await docRef.doc(shortid.generate()).set(reportData);
			Alert.alert('신고가 접수되었습니다.');
			closeReportModal();
		} catch (error) {
			console.log('신고 접수 중에 오류가 발생했습니다:', error);
		}
	};

	const renderReportMenuItem = ({item}: any) => {
		return (
			<TouchableOpacity onPress={item.onPress} style={{paddingVertical: 10, paddingHorizontal: 20}}>
				<Text>{item.title}</Text>
			</TouchableOpacity>
		);
	};

	// 구분선
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
		<Modal
			animationType={'fade'}
			transparent={true}
			visible={isVisible}
			onRequestClose={() => closeReportModal()}
			style={styles.modalContainer}>
			<TouchableWithoutFeedback onPress={() => closeReportModal()}>
				<View
					style={{
						flex: 1,
						backgroundColor: '#000000AA',
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<SafeAreaView>
						<View
							style={{
								backgroundColor: '#FFFFFFFF',
								borderRadius: 10,
								paddingHorizontal: 10,
								height: Dimensions.get('window').height * 0.5,
								padding: 24,
								width: Dimensions.get('window').width * 0.9,
							}}>
							<View>
								<Text
									style={{
										color: '#182E44',
										fontSize: 20,
										fontWeight: '500',
										marginBottom: 24,
									}}>
									신고 사유 선택
								</Text>
								<FlatList
									data={reportMenuList}
									renderItem={renderReportMenuItem}
									ItemSeparatorComponent={flatListItemSeperator}
									scrollEnabled={false}
								/>
							</View>
						</View>
					</SafeAreaView>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	modalContainer: {
		flex: 1,
	},
});
