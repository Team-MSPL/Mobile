import {styled} from 'styled-components/native';
import {colors} from '../../utill/colors';
import RouteButton from '../../utill/component/route-button';
import {BackgroundGray, Center, PretendardSemiBoldText, PretendardVariableText} from '../../utill/layout/layout';
import {widthPercentage} from '../../utill/layout/responsive-size';
import {SvgCheck} from '../../utill/svg/svg';

export default function Fail({navigation}: any) {
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
					예약 실패
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
					문제가 발생했습니다
				</PretendardSemiBoldText>
				<PretendardVariableText
					size={16}
					lineHeight={21}
					color={colors.Gray4}
					style={{
						width: '100%',
						textAlign: 'center',
						includeFontPadding: false,
					}}></PretendardVariableText>
			</Center>
			<RouteButton
				navigation={navigation}
				nextTitle={'SelectDay'}
				nextText={'이전으로'}
				leftText={'홈으로 돌아가기'}
				btnFunction={() => {
					navigation.goBack();
				}}
				goNext={() => {}}
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
