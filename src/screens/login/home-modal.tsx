import styled from 'styled-components/native';
import {colors} from '../../utill/colors';
import {fontPercentage, heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import CustomButton from '../../utill/component/custom-button';
import {useAppDispatch, useAppSelector} from '../../redux';
import {userSliceActions} from '../../redux/user/user.slice';
import {SVGHomeDown, SVGHomeUp} from '../../utill/svg/svg';
import {PretendardSemiBold, PretendardVariable} from '../../utill/layout/layout';

export default function HomeModal({navigation, route}: {navigation: any; route: {params: ParamsType}}) {
	const goHome = () => {
		navigation.goBack();
	};

	const {userName, functionToken} = useAppSelector(state => state.userSlice);
	const texts = {
		회원가입: {
			main: `${userName} 님, 반가워요.\n여행을 준비하러 가볼까요?`,
			sub: `회원가입 기념으로 사용 가능한\n이용권이 ${functionToken}개 발급되었습니다.\n여행지 및 일정 추천을 받아봐요!`,
		},
		재가입: {
			main: `${userName} 님,\n 다시 돌아온 것을 환영해요.\n기다리고 있었어요!`,
			sub: `여행지 및 일정 추천을 받아볼까요?`,
		},
	};
	return (
		<HomeModalContainer>
			<MainText>{texts[route.params.status].main}</MainText>
			<SubText>{texts[route.params.status].sub}</SubText>
			<SVGHomeUp
				width={widthPercentage(145)}
				height={heightPercentage(173)}
				style={{position: 'absolute', left: widthPercentage(145), top: heightPercentage(450)}}></SVGHomeUp>
			<SVGHomeDown
				width={widthPercentage(145)}
				height={heightPercentage(173)}
				style={{position: 'absolute', left: widthPercentage(195), top: heightPercentage(550)}}></SVGHomeDown>
			<ButtonContainer>
				<CustomButton label='추천 받으러 가기' onPress={goHome}></CustomButton>
			</ButtonContainer>
		</HomeModalContainer>
	);
}

const ButtonContainer = styled.View`
	position: absolute;
	bottom: 0px;
	width: ${widthPercentage(375)}px;
	align-items: center;
	justify-content: center;
`;
const HomeModalContainer = styled.View`
	flex: 1;
	background-color: ${colors.backgroundWhite};
	align-items: center;
`;
const MainText = styled(PretendardVariable)`
	font-size: ${fontPercentage(20)}px;
	font-weight: 600;
	color: ${colors.Gray5};
	line-height: ${heightPercentage(30)}px;
	margin-bottom: ${heightPercentage(10)}px;
	margin-top: ${heightPercentage(209)}px;
`;
const SubText = styled(PretendardSemiBold)`
	font-size: ${fontPercentage(16)}px;
	font-weight: 600;
	color: ${colors.Gray4};
	line-height: ${heightPercentage(22.4)}px;
`;
interface ParamsType {
	status: '회원가입' | '재가입';
}
