import {ThreeDotsIcon} from 'native-base';
import {useState} from 'react';
import {
	Button,
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

export default function ReportModal({navigation}: any) {
	const [isReportModalVisible, setIsReportModalVisibile] = useState<boolean>(false);

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

	const renderReportMenuItem = ({item}: any) => {
		return (
			<TouchableOpacity onPress={item.onPress} style={{paddingVertical: 10, paddingHorizontal: 20}}>
				<Text>{item.title}</Text>
			</TouchableOpacity>
		);
	};
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
					setIsReportModalVisibile(true);
				}}>
				<View>
					<ThreeDotsIcon></ThreeDotsIcon>
				</View>
			</TouchableOpacity>
			<Modal
				animationType={'fade'}
				transparent={true}
				visible={isReportModalVisible}
				onRequestClose={() => setIsReportModalVisibile(false)}
				style={styles.modalContainer}>
				<TouchableWithoutFeedback onPress={() => setIsReportModalVisibile(false)}>
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	modalContainer: {
		flex: 1,
	},
});
