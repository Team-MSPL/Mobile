import {useState} from 'react';
import {styled} from 'styled-components/native';
import {colors} from '../../../utill/colors';
import {BackgroundGray, HStack, PretendardSemiBoldText} from '../../../utill/layout/layout';
import {widthPercentage} from '../../../utill/layout/responsive-size';

export default function AddInPerson() {
	const [place, setPlace] = useState('');
	const [address, setAddress] = useState('');
	const [category, setCategory] = useState('');
	const [time, setTime] = useState('');
	const categoryList = ['관광지', '숙소', '식당/카페'];
	return (
		<BackgroundGray>
			<PretendardSemiBoldText
				size={18}
				lineHeight={23.48}
				color={colors.Black}
				deco={`margin-top:${widthPercentage(64)}`}>
				장소
			</PretendardSemiBoldText>
			<InputBox onChangeText={e => setPlace(e)} placeholder={'장소명'}></InputBox>
			<PretendardSemiBoldText
				size={18}
				lineHeight={23.48}
				color={colors.Black}
				deco={`margin-top:${widthPercentage(22)}`}>
				주소
			</PretendardSemiBoldText>
			<InputBox onChangeText={e => setPlace(e)} placeholder={'주소'}></InputBox>
			<PretendardSemiBoldText
				size={18}
				lineHeight={23.48}
				color={colors.Black}
				deco={`margin-top:${widthPercentage(22)}`}>
				카테고리
			</PretendardSemiBoldText>
			<HStack justifyContent='space-between;' width={widthPercentage(306)}>
				{categoryList.map(item => (
					<CategoryButton>
						<PretendardSemiBoldText size={16} lineHeight={20} color={colors.Black}>
							{item}
						</PretendardSemiBoldText>
					</CategoryButton>
				))}
			</HStack>
			<PretendardSemiBoldText
				size={18}
				lineHeight={23.48}
				color={colors.Black}
				deco={`margin-top:${widthPercentage(22)}`}>
				머무를 시간
			</PretendardSemiBoldText>
			<InputBox onChangeText={e => setPlace(e)} placeholder={'장소명'}></InputBox>
		</BackgroundGray>
	);
}
const InputBox = styled.TextInput`
	width: ${widthPercentage(303)}px;
	height: ${widthPercentage(52)}px;
	background-color: ${colors.backgroundWhite};
	border-radius: 8px;
`;
const CategoryButton = styled.TouchableOpacity`
	width: ${widthPercentage(91)}px;
	height: ${widthPercentage(52)}px;
	border-radius: 12px;
	background-color: ${colors.backgroundWhite};
	align-items: center;
	justify-content: center;
`;
