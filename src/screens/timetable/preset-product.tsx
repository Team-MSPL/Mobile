import {styled} from 'styled-components/native';
import {useAppSelector} from '../../redux';
import {colors} from '../../utill/colors';
import StepText from '../../utill/component/enroll-info/step-text';
import PrimaryButton from '../../utill/component/primary-button';
import {BackgroundGrayScrollView, HStack, PretendardSemiBoldText, VStack} from '../../utill/layout/layout';
import {heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {SVGDanimLogo, SvgStart} from '../../utill/svg/svg';
import {MarginContainer} from './preset-detail';

export default function PresetProduct({navigation}: any) {
	const {presetProducts} = useAppSelector(state => state.travelSlice);
	const handleSkip = () => {
		navigation.navigate('Timetable');
	};
	const handelDetail = item => {
		navigation.navigate('ProductDetail', {item: item});
	};
	return (
		<>
			<BackgroundGrayScrollView>
				<StepText
					marginTop={heightPercentage(10)}
					marginBottom={heightPercentage(10)}
					styleText='상품 추천'
					mainText={`잠깐!${`\n`}이런 여행 상품은 어떠신가요?`}
					subText='일정과 관련된 투어 상품으로 준비해 봤어요!'></StepText>
				{presetProducts[0]?.map((item, idx) => (
					<ProductContainer
						key={idx}
						onPress={() => {
							handelDetail(item);
						}}>
						<ProductImage source={{uri: item?.prod_img_url}}></ProductImage>
						<VStack deco='padding:10px;' gap={5}>
							<HStack justifyContent='space-between'>
								<HStack gap={3}>
									<SVGDanimLogo width={15} />
									<PretendardSemiBoldText size={14} lineHeight={17} color={colors.Gray4}>
										다님
									</PretendardSemiBoldText>
								</HStack>
								<HStack>
									<SvgStart width={11} color={'#FFDE4C'} />
									<PretendardSemiBoldText size={14} lineHeight={17} color={colors.Gray4}>
										{item?.avg_rating_star}
									</PretendardSemiBoldText>
								</HStack>
							</HStack>
							<PretendardSemiBoldText size={24} lineHeight={29} numberOfLines={2} color={colors.Black}>
								{item?.prod_name}
							</PretendardSemiBoldText>
							<PretendardSemiBoldText size={24} lineHeight={29} numberOfLines={2} color={colors.Black}>
								₩ {item?.b2b_price.toLocaleString('ko-KR')} ~
							</PretendardSemiBoldText>
							<PretendardSemiBoldText
								size={16}
								lineHeight={21}
								numberOfLines={2}
								color={colors.PointYellow}
								deco={'text-align:center;margin-top:10px;'}>
								상품 자세히 보기 {'>'}
							</PretendardSemiBoldText>
						</VStack>
					</ProductContainer>
				))}
				<MarginContainer />
			</BackgroundGrayScrollView>
			<SkipButton onPress={handleSkip}>
				<PretendardSemiBoldText
					size={16}
					lineHeight={21}
					numberOfLines={2}
					color={colors.backgroundWhite}
					deco={'text-align:center;'}>
					건너뛰기
				</PretendardSemiBoldText>
			</SkipButton>
		</>
	);
}
const ProductContainer = styled.TouchableOpacity`
	width: ${widthPercentage(327)}px;
	min-height: ${heightPercentage(345)}px;
	border-radius: 8px;
	border-color: ${colors.Gray200};
	border-width: 1px;
	background-color: ${colors.backgroundWhite};
	margin-bottom: ${heightPercentage(10)}px;
`;
const ProductImage = styled.Image`
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(162)}px;
	border-top-left-radius: 8px;
	border-top-right-radius: 8px;
`;
const SkipButton = styled.TouchableOpacity`
	position: absolute;
	width: ${widthPercentage(327)}px;
	height: ${heightPercentage(60)}px;
	border-radius: 8px;
	background-color: ${colors.Gray5};
	align-self: center;
	align-items: center;
	justify-content: center;
	bottom: 10px;
`;
