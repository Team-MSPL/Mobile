import {useNavigation} from '@react-navigation/native';
import {Heading, Text, Center, IconButton, ThreeDotsIcon} from 'native-base';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useState} from 'react';
import {Dimensions, FlatList, Modal, View, Button, TouchableOpacity} from 'react-native';

export default function CommunityDetailModal() {
	const [modalVisible, setModalVisibile] = useState(false);
	const deviceHeight = Dimensions.get('window').height;
	return (
		<SafeAreaView>
			<Modal
				animationType={'fade'}
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisibile(!modalVisible)}>
				<View
					style={{
						flex: 1,
						backgroundColor: '#000000AA',
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
						</View>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
}
