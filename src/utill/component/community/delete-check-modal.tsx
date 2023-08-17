import {Button, Dimensions, Modal, SafeAreaView, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';

export default function DeleteCheckModal({
	isVisible,
	closePostDeleteModal,
	onPressDeleteBtn,
}: {
	isVisible: boolean;
	closePostDeleteModal: () => void;
	onPressDeleteBtn: () => void;
}) {
	const deletePost = () => {
		// Delete logic
		onPressDeleteBtn();
		closePostDeleteModal();
	};

	return (
		<Modal
			animationType={'fade'}
			transparent={true}
			visible={isVisible}
			onRequestClose={() => closePostDeleteModal()}
			style={styles.modalContainer}>
			<TouchableWithoutFeedback onPress={() => closePostDeleteModal()}>
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
									게시글을 삭제하시겠습니까?
								</Text>
								<Button title='Delete' onPress={() => deletePost()} />
								<Button title='Cancel' onPress={() => closePostDeleteModal()} />
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
