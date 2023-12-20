import {useEffect, useState} from 'react';
import {HStack, MainContainer} from '../../utill/layout/layout';
import {useAppSelector} from '../../redux';
import {CRYPTO_KEY} from '@env';
import CryptoJS from 'crypto-js';
import styled from 'styled-components/native';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import {colors} from '../../utill/colors';

export default function UserManage() {
	const {userIdToken, socialloginProvider} = useAppSelector(state => state.userSlice);
	const [cryptoItem, setCryptoItem] = useState('');
	const getCrypto = () => {
		try {
			const secret_key = CRYPTO_KEY;
			if (!secret_key) {
				console.log('No Secret Key.');
				return null;
			}
			const encrypted = CryptoJS.AES.encrypt(userIdToken, secret_key).toString();
			setCryptoItem(encrypted);
		} catch (e) {
			console.log('Encryption error occur : ', e);
			//return null;
		}
	};
	useEffect(() => {
		getCrypto();
	}, []);
	const handleCopyClipBoard = async () => {
		try {
			Clipboard.setString(cryptoItem);
			Toast.show({type: 'success', text1: '복사가 완료되었습니다.', position: 'bottom'});
		} catch (err) {
			console.log('qwe', err);
		}
	};
	return (
		<MainContainer>
			<ManageHstack>
				<LeftText>계정 타입</LeftText>
				<ProviderText>{socialloginProvider}</ProviderText>
			</ManageHstack>
			<ManageHstack>
				<LeftText>회원 번호</LeftText>
				<ClipCopy onPress={handleCopyClipBoard}>
					<ClipText numberOfLines={1}>{cryptoItem}</ClipText>
					<Icon name='copy1' size={25} color={'black'}></Icon>
				</ClipCopy>
			</ManageHstack>
		</MainContainer>
	);
}

const LeftText = styled.Text`
	font-size: 20px;
	font-weight: 500;
	color: ${colors.selectButton};
	width: 30%;
`;
const ManageHstack = styled(HStack)`
	justify-content: space-between;
	margin: 10px 0px;
`;
const ProviderText = styled.Text`
	font-size: 20px;
	font-weight: 400;
	color: black;
`;
export const ClipText = styled(ProviderText)`
	width: 60%;
	font-size: 18px;
`;

export const ClipCopy = styled.TouchableOpacity`
	flex-direction: row;
	justify-content: flex-end;
`;
