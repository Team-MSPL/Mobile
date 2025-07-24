import {useState} from 'react';
import {styled} from 'styled-components/native';
import {colors} from '../../../utill/colors';
import PrimaryButton from '../../../utill/component/primary-button';
import {BackgroundGray, BackgroundGrayScrollView, HStack, PretendardSemiBoldText} from '../../../utill/layout/layout';
import {heightPercentage, widthPercentage} from '../../../utill/layout/responsive-size';
import {SVGMinus, SVGPlus} from '../../../utill/svg/svg';
import {ButtonContainer, SVGContainer} from '../select-multi';

export default function AddInPerson({navigation}: any) {
	const [place, setPlace] = useState('');
	const [address, setAddress] = useState('');
	const [category, setCategory] = useState('');
	const [timeValue, setTimeValue] = useState(0);
	const categoryList = ['관광지', '숙소', '식당/카페'];
	// const handleSubmit = () => {
	// 	let data={
	// 		name: place,
	// 		lat: Number(details?.geometry.location.lat),
	// 		lng: Number(details?.geometry.location.lng),
	// 		formatted_address: details?.formatted_address.replace('대한민국 ', ''),
	// 		photo: '',
	// 		region: details?.formatted_address.replace('대한민국 ', ''),
	// 	}
	// };
	return (
		<BackgroundGrayScrollView>
			<PretendardSemiBoldText
				size={18}
				lineHeight={23.48}
				color={colors.Black}
				deco={`margin-top:${widthPercentage(64)}`}>
				장소
			</PretendardSemiBoldText>
			<InputBox onChangeText={e => setPlace(e)} value={place} placeholder={'장소명'}></InputBox>
			<PretendardSemiBoldText
				size={18}
				lineHeight={23.48}
				color={colors.Black}
				deco={`margin-top:${widthPercentage(22)}`}>
				주소
			</PretendardSemiBoldText>
			<InputBox onChangeText={e => setAddress(e)} value={address} placeholder={'주소'}></InputBox>
			<PretendardSemiBoldText
				size={18}
				lineHeight={23.48}
				color={colors.Black}
				deco={`margin-top:${widthPercentage(22)}`}>
				카테고리
			</PretendardSemiBoldText>
			<HStack
				justifyContent='space-between;'
				width={widthPercentage(327)}
				deco={`margin-top: ${widthPercentage(5)}px`}>
				{categoryList.map(item => (
					<CategoryButton onPress={() => setCategory(item)} isActive={item == category}>
						<PretendardSemiBoldText size={16} lineHeight={20} color={colors.Gray400}>
							{item}
						</PretendardSemiBoldText>
					</CategoryButton>
				))}
			</HStack>
			<HStack justifyContent='space-between' deco={`margin-top:${widthPercentage(22)}`}>
				<PretendardSemiBoldText size={18} color={colors.Gray5} lineHeight={24}>
					머무를 시간
				</PretendardSemiBoldText>
				<HStack justifyContent='space-around' width={widthPercentage(182)}>
					<SVGContainer
						width={20}
						disabled={timeValue < 1}
						onPress={() => {
							setTimeValue(timeValue - 1);
						}}
						color={timeValue < 1 ? colors.backgroundWhite : colors.Gray1}>
						{timeValue >= 1 && (
							<SVGMinus width={widthPercentage(15)} height={widthPercentage(15)} color={colors.Gray2} />
						)}
					</SVGContainer>

					<PretendardSemiBoldText size={16} color={colors.Gray5} lineHeight={21.6}>
						{timeValue + 1}시간
					</PretendardSemiBoldText>
					<SVGContainer
						width={20}
						disabled={timeValue > 1}
						onPress={() => {
							setTimeValue(timeValue + 1);
						}}
						color={timeValue > 1 ? colors.backgroundWhite : colors.Gray5}>
						{timeValue <= 1 && (
							<SVGPlus width={widthPercentage(15)} height={widthPercentage(15)} color={colors.Primary} />
						)}
					</SVGContainer>
				</HStack>
			</HStack>
			<PrimaryButton
				label={'등록하기'}
				width={widthPercentage(327)}
				height={heightPercentage(60)}
				onPress={() => {}}
				marginTop={50}
				marginBottom={10}
				backgroundColor={colors.Gray5}
				textColor={colors.backgroundWhite}></PrimaryButton>
		</BackgroundGrayScrollView>
	);
}
const InputBox = styled.TextInput`
	width: ${widthPercentage(327)}px;
	height: ${widthPercentage(52)}px;
	background-color: ${colors.backgroundWhite};
	color: ${colors.Gray400};
	border-radius: 12px;
	border-width: 1px;
	border-color: ${colors.Gray200};
	margin-top: ${widthPercentage(5)}px;
	padding: ${widthPercentage(17)}px ${widthPercentage(14)}px;
`;
const CategoryButton = styled.TouchableOpacity<{isActive: boolean}>`
	min-width: ${widthPercentage(31)}px;
	padding: 0px ${widthPercentage(30)}px;
	height: ${widthPercentage(52)}px;
	border-radius: 12px;
	background-color: ${props => (props.isActive ? colors.PrimarySecondary : colors.backgroundWhite)};
	align-items: center;
	justify-content: center;
	border-width: 1px;
	border-color: ${props => (props.isActive ? colors.Primary : colors.Gray200)};
`;
