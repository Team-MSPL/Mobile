import {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {styled} from 'styled-components/native';
import {colors} from '../../../utill/colors';
import {BackgroundGrayScrollView, HStack, PretendardSemiBoldText, VStack} from '../../../utill/layout/layout';
import {widthPercentage} from '../../../utill/layout/responsive-size';

export default function RegistTransit({navigation}: any) {
	useEffect(() => {
		navigation.setOptions({
			headerRight: () => <></>,
			headerTitle: '항공권 등록하기',
		});
	}, []);
	const [select, setSelect] = useState('가는 편');
	return (
		<BackgroundGrayScrollView>
			<HStack gap={widthPercentage(30)} justifyContent='center'>
				{['가는 편', '오는 편'].map((item, index) => (
					<TransitTouchable onPress={() => setSelect(item)}>
						<PretendardSemiBoldText
							size={20}
							lineHeight={24}
							color={select == item ? colors.Black : '#6B7280'}>
							{item}
						</PretendardSemiBoldText>
						<LinearGradient
							start={{x: 0, y: 0}}
							end={{x: 1, y: 0}}
							colors={['#2F80ED', '#84B8FF']}
							locations={[0, 1]} // ✅ 위치 지정 (0 ~ 1 사이의 값)
							style={{
								width: '100%',
								height: widthPercentage(8),
								borderRadius: 12,
								opacity: select == item ? 1 : 0,
							}}></LinearGradient>
					</TransitTouchable>
				))}
			</HStack>
		</BackgroundGrayScrollView>
	);
}
const TransitTouchable = styled(VStack).attrs({as: TouchableOpacity})``;
