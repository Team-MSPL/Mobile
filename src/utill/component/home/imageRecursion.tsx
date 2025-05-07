import {useCallback, useEffect, useState} from 'react';
import {colors} from '../../colors';
import {HStack, PretendardSemiBoldText} from '../../layout/layout';
import {Pressable, View} from 'react-native';
import {SVGNoteList, SVGRightAdd, SvgMain1, SvgMain2, SvgMain3, SvgMain4} from '../../svg/svg';
import styled from 'styled-components/native';
import {heightPercentage, widthPercentage} from '../../layout/responsive-size';
import {useAppDispatch, useAppSelector} from '../../../redux';
import {NoteCount} from '../../../screens/more/more-info';
import LinearGradient from 'react-native-linear-gradient';
import {useFocusEffect} from '@react-navigation/native';
import {getNoteList} from '../../../redux/user/user.slice';
import {modalSliceActions} from '../../../redux/modal/modalSlice';

export default function ImageRecursion({navigation}: any) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const {socialloginProvider} = useAppSelector(state => state.userSlice);
	const [noteList, setNoteList] = useState([]);
	const dispatch = useAppDispatch();
	const getNoteListData = async () => {
		try {
			const dataList = await dispatch(getNoteList()).unwrap();
			setNoteList(dataList);
		} catch (err) {
			dispatch(modalSliceActions.setOpenModal({modalTitle: '잠시후 다시 시도해주세요'}));
		} finally {
		}
	};
	useFocusEffect(
		useCallback(() => {
			getNoteListData();
		}, []),
	);
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex(prevIndex => (prevIndex === mainViewList.length - 1 ? 0 : prevIndex + 1));
		}, 5000); // 5초마다 전환

		// 언마운트 시 interval 정리
		return () => clearInterval(interval);
	}, []);
	return (
		<View style={{position: 'relative', width: '100%', height: heightPercentage(428)}}>
			{/* SVG 배경 */}
			<View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
				{mainViewList[currentIndex].photo(heightPercentage(428))}
			</View>
			<BrighnessBox>
				{socialloginProvider != 'anonymous' && (
					<TicketTouchable>
						<NoteCount>
							<PretendardSemiBoldText size={9} lineHeight={13} color={colors.backgroundWhite}>
								{noteList.filter(item => !item.startsWith('read')).length}
							</PretendardSemiBoldText>
						</NoteCount>
						<SVGNoteList
							onPress={() => {
								navigation.navigate('NoteList');
							}}
							width={widthPercentage(33)}
							height={widthPercentage(33)}></SVGNoteList>
					</TicketTouchable>
				)}
				<HomeTextContainer
					heightFlag={socialloginProvider == 'anonymous'}
					onPress={() => {
						// navigation.navigate('RecommendPlaces');
						// selectPopularity({
						// 	id: regionList.find(item => item.subTitle == homeRegionImage.name).id,
						// 	subTitle: regionList.find(item => item.subTitle == homeRegionImage.name).subTitle,
						// });
					}}>
					<LinearGradient
						start={{x: 0, y: 0}}
						end={{x: 0, y: 1}}
						colors={['rgba(255,255,255,0)', 'black']}
						style={{
							zIndex: 101,
							position: 'absolute',
							width: '100%',
							paddingHorizontal: widthPercentage(19),
							height: heightPercentage(150),
						}}>
						<HStack>
							<Pressable
								onPress={() => {
									navigation.navigate('RecommendPlaces', {index: currentIndex});
								}}>
								{mainViewList[currentIndex].title}
							</Pressable>
						</HStack>
					</LinearGradient>
				</HomeTextContainer>
			</BrighnessBox>
		</View>
	);
}

export const mainViewList = [
	{
		title: (
			<View style={{position: 'relative', alignSelf: 'flex-start'}}>
				<PretendardSemiBoldText
					size={23}
					lineHeight={35}
					color={colors.backgroundWhite}
					style={{maxWidth: widthPercentage(320)}} // 적절한 최대 폭
				>
					<PretendardSemiBoldText size={23} lineHeight={35} color={colors.Primary}>
						자연 속 여유
					</PretendardSemiBoldText>
					를 느끼고{'\n'}싶은 당신을 초대합니다
				</PretendardSemiBoldText>

				<SVGRightAdd
					color='white'
					width={heightPercentage(24)}
					height={heightPercentage(24)}
					style={{
						position: 'absolute',
						right: -heightPercentage(28),
						bottom: heightPercentage(10), // 두 번째 줄 기준으로 붙음
					}}
				/>
			</View>
		),
		subTitle: (
			<PretendardSemiBoldText size={23} lineHeight={35} color={colors.backgroundWhite}>
				<PretendardSemiBoldText size={23} lineHeight={35} color={colors.Primary}>
					자연 속 여유
				</PretendardSemiBoldText>
				를 느끼고{`\n`}싶은 당신을 위해
			</PretendardSemiBoldText>
		),
		photo: (height?: number) => (
			<SvgMain1 width={widthPercentage(375)} height={height ?? '100%'} preserveAspectRatio='none' />
		),
	},
	{
		title: (
			<View style={{position: 'relative', alignSelf: 'flex-start'}}>
				<PretendardSemiBoldText size={23} lineHeight={35} color={colors.backgroundWhite}>
					<PretendardSemiBoldText size={23} lineHeight={35} color={colors.Primary}>
						문화
					</PretendardSemiBoldText>
					와{' '}
					<PretendardSemiBoldText size={23} lineHeight={35} color={colors.Primary}>
						트렌드
					</PretendardSemiBoldText>
					가 살아 숨 쉬는{`\n`}공간으로 당신을 초대합니다
				</PretendardSemiBoldText>
				<SVGRightAdd
					color='white'
					width={heightPercentage(24)}
					height={heightPercentage(24)}
					style={{
						position: 'absolute',
						right: -heightPercentage(28),
						bottom: heightPercentage(10), // 두 번째 줄 기준으로 붙음
					}}
				/>
			</View>
		),
		subTitle: (
			<PretendardSemiBoldText size={23} lineHeight={35} color={colors.backgroundWhite}>
				<PretendardSemiBoldText size={23} lineHeight={35} color={colors.Primary}>
					문화
				</PretendardSemiBoldText>
				와{' '}
				<PretendardSemiBoldText size={23} lineHeight={35} color={colors.Primary}>
					트렌드
				</PretendardSemiBoldText>
				가{`\n`}아 숨 쉬는 공간
			</PretendardSemiBoldText>
		),
		photo: (height?: number) => (
			<SvgMain2 width={widthPercentage(375)} height={height ?? '100%'} preserveAspectRatio='none' />
		),
	},
	{
		title: (
			<View style={{position: 'relative', alignSelf: 'flex-start'}}>
				<PretendardSemiBoldText size={23} lineHeight={35} color={colors.backgroundWhite}>
					이 순간과 연결된{' '}
					<PretendardSemiBoldText size={23} lineHeight={35} color={colors.Primary}>
						과거의 세계
					</PretendardSemiBoldText>
					로{`\n`}당신을 초대합니다
				</PretendardSemiBoldText>
				<SVGRightAdd
					color='white'
					width={heightPercentage(24)}
					height={heightPercentage(24)}
					style={{
						position: 'absolute',
						right: heightPercentage(98),
						bottom: heightPercentage(10), // 두 번째 줄 기준으로 붙음
					}}
				/>
			</View>
		),
		subTitle: (
			<PretendardSemiBoldText size={23} lineHeight={35} color={colors.backgroundWhite}>
				<PretendardSemiBoldText size={23} lineHeight={35} color={colors.Primary}>
					과거의 세계
				</PretendardSemiBoldText>
				와 연결될 시간
			</PretendardSemiBoldText>
		),
		photo: (height?: number) => (
			<SvgMain3 width={widthPercentage(375)} height={height ?? '100%'} preserveAspectRatio='none' />
		),
	},
	{
		title: (
			<View style={{position: 'relative', alignSelf: 'flex-start'}}>
				<PretendardSemiBoldText size={23} lineHeight={35} color={colors.backgroundWhite}>
					<PretendardSemiBoldText size={23} lineHeight={35} color={colors.Primary}>
						열정
					</PretendardSemiBoldText>
					이 가득한 당신을{`\n`}이곳으로 초대합니다
				</PretendardSemiBoldText>
				<SVGRightAdd
					color='white'
					width={heightPercentage(24)}
					height={heightPercentage(24)}
					style={{
						position: 'absolute',
						right: -heightPercentage(28),
						bottom: heightPercentage(10), // 두 번째 줄 기준으로 붙음
					}}
				/>
			</View>
		),
		subTitle: (
			<PretendardSemiBoldText size={23} lineHeight={35} color={colors.backgroundWhite}>
				<PretendardSemiBoldText size={23} lineHeight={35} color={colors.Primary}>
					열정
				</PretendardSemiBoldText>
				이 가득한 당신을 위해
			</PretendardSemiBoldText>
		),
		photo: (height?: number) => (
			<SvgMain4 width={widthPercentage(375)} height={height ?? '100%'} preserveAspectRatio='none' />
		),
	},
];

const BackgroundImage = styled.ImageBackground`
	width: 100%;
	height: ${heightPercentage(408)}px;
`;
const BrighnessBox = styled.View`
	flex: 1;
	background-color: rgba(0, 0, 0, 0.3);
	top: -${heightPercentage(20)}px;
`;

const TicketTouchable = styled.TouchableOpacity`
	border-radius: 99px;
	top: ${heightPercentage(39)}px;
	left: ${widthPercentage(305)}px;
	width: ${widthPercentage(50)}px;
	height: ${widthPercentage(50)}px;
	align-items: center;
	justify-content: center;
`;
const HomeTextContainer = styled.Pressable<{heightFlag: boolean}>`
	top: ${props => heightPercentage(props.heightFlag ? 275 : 215)}px;
`;
