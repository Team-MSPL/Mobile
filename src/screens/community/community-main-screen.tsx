import {useNavigation} from '@react-navigation/native';
import {Heading, Text, Center} from 'native-base';
import {color} from 'native-base/lib/typescript/theme/styled-system';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-google-signin/google-signin';
import {useState} from 'react';
import {Dimensions, FlatList, Modal, View, Button} from 'react-native';

export default function CommunityMainScreen() {
	const goNext = () => {
		navigation.navigate('Home');
	};
	const navigation = useNavigation();
	return (
		<SafeAreaView>
			<Center>
				<Text>커뮤니티 글이 있겠지 모~</Text>
			</Center>
		</SafeAreaView>
	);
}
