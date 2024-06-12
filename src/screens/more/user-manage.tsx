import {useEffect, useState} from 'react';
import {HStack, PretendardSemiBoldText} from '../../utill/layout/layout';
import {useAppSelector} from '../../redux';
import {CRYPTO_KEY} from '@env';
import CryptoJS from 'crypto-js';
import styled from 'styled-components/native';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import {colors} from '../../utill/colors';
import {SVGCopy} from '../../utill/svg/svg';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';

export default function UserManage() {
	const {userIdToken} = useAppSelector(state => state.userSlice);
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
		<HStack gap={widthPercentage(5)} marginHorizon={widthPercentage(10)} marginVertical={heightPercentage(10)}>
			<PretendardSemiBoldText size={14} lineHeight={21} color={colors.Gray3}>
				회원 번호
			</PretendardSemiBoldText>
			<ClipCopy onPress={handleCopyClipBoard}>
				<ClipBox>
					<PretendardSemiBoldText numberOfLines={1} size={14} lineHeight={21} color={colors.Gray3}>
						{cryptoItem}
					</PretendardSemiBoldText>
				</ClipBox>
				<SVGCopy width={widthPercentage(16)} height={widthPercentage(17)} />
			</ClipCopy>
		</HStack>
	);
}

const ClipBox = styled.View`
	width: 50%;
`;

export const ClipCopy = styled.TouchableOpacity`
	flex-direction: row;
`;
