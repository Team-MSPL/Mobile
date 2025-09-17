import {styled} from 'styled-components/native';
import {colors} from '../../utill/colors';
import RouteButton from '../../utill/component/route-button';
import {BackgroundGray, Center, PretendardSemiBoldText, PretendardVariableText} from '../../utill/layout/layout';
import {widthPercentage} from '../../utill/layout/responsive-size';
import {SvgCheck} from '../../utill/svg/svg';

export default function Success({navigation}: any) {
	return (
		<BackgroundGray>
			<Center>
				<CheckIconContainer>
					<SvgCheck color='white' width={50} height={50} />
				</CheckIconContainer>
				<PretendardSemiBoldText
					size={30}
					lineHeight={35}
					color={colors.Black}
					style={{
						width: '100%',
						textAlign: 'center',
						includeFontPadding: false,
					}}>
					예약완료
				</PretendardSemiBoldText>
				<PretendardSemiBoldText
					size={20}
					lineHeight={25}
					color={colors.Black}
					style={{
						width: '100%',
						textAlign: 'center',
						includeFontPadding: false,
					}}>
					나그네님의 예약이 완료되었습니다.
				</PretendardSemiBoldText>
				<PretendardVariableText
					size={16}
					lineHeight={21}
					color={colors.Gray4}
					style={{
						width: '100%',
						textAlign: 'center',
						includeFontPadding: false,
					}}>
					10분 내로 주문 내역 및 바우처가 이메일로{`\n`}발송될 예정입니다.
				</PretendardVariableText>
			</Center>
			<RouteButton
				navigation={navigation}
				nextTitle={'SelectDay'}
				nextText={'예약 확인하기'}
				leftText={'홈으로 돌아가기'}
				btnFunction={() => {}}
				LeftBtnFunction={() => {
					navigation.popToTop();
				}}
				type={'planner'}></RouteButton>
		</BackgroundGray>
	);
}
const CheckIconContainer = styled.View`
	width: ${widthPercentage(90)}px;
	height: ${widthPercentage(90)}px;
	border-radius: 50px;
	background-color: #cafb07;
	align-items: center;
	justify-content: center;
	margin-bottom: 20px;
`;
