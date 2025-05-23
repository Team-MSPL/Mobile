import styled from 'styled-components/native';
import {colors} from '../../colors';
import {HStack, PretendardVariableText} from '../../layout/layout';
import {useAppDispatch, useAppSelector} from '../../../redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {eventSliceActions} from '../../../redux/event/event.slice';
import {Linking} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {cooperationList} from '../../../screens/home/main';
import {heightPercentage, widthPercentage} from '../../layout/responsive-size';
import {modalSliceActions} from '../../../redux/modal/modalSlice';
import {logEvent} from '../../../../firebaseAnalytice';

export default function Cooperation() {
	const dispatch = useAppDispatch();
	const closeModal = () => {
		dispatch(eventSliceActions.setCooperationState({status: false, type: ''}));
	};
	const {cooperationType} = useAppSelector(state => state.eventSlice);
	const closeModalOneDay = async () => {
		await AsyncStorage.setItem(cooperationType, moment().format('DD').toString());
		closeModal();
	};
	const hanldeCooperation = async (e: {title: string; link: string; photo: any}) => {
		if (e.title == 'travleMedic') {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '다님 이용자만을 위한 할인쿠폰이에요!',
					modalTopText: '쿠폰 사용하러 가기 (홈페이지 이동)',
					modalFunction: async () => {
						await logEvent(e?.title, {});
						Linking.openURL(e.link);
					},
					travleMedic: true,
					modalSubTitle: '* 해외3개월이하 보험가입시 적용됩니다.',
				}),
			);
		} else {
			await logEvent(e?.title, {});
			Linking.openURL(e.link);
		}
	};

	return (
		<Container>
			<ViewContaniner>
				<Carousel
					loop
					style={{
						height: heightPercentage(427),
					}}
					width={widthPercentage(337)}
					autoPlay={true}
					data={cooperationList.filter((item, idx) => idx != (cooperationType == 'inbound' ? 0 : 1))}
					scrollAnimationDuration={1000}
					onSnapToItem={() => {}}
					autoPlayInterval={5000}
					renderItem={({item}) => (
						<EventTouable
							onPress={() => {
								hanldeCooperation(item);
							}}>
							<EventImage resizeMode='cover' source={item.photo}></EventImage>
						</EventTouable>
					)}
				/>
				<EventHStack>
					<TextPressable onPress={closeModalOneDay}>
						<PretendardVariableText size={15} lineHeight={21.6} color={colors.Black}>
							오늘 그만 보기
						</PretendardVariableText>
					</TextPressable>
					<TextPressable onPress={closeModal}>
						<PretendardVariableText size={15} lineHeight={21.6} color={colors.Black}>
							닫기
						</PretendardVariableText>
					</TextPressable>
				</EventHStack>
			</ViewContaniner>
		</Container>
	);
}
const TextPressable = styled.Pressable`
	width: 50%;
	align-items: center;
	height: 100%;
	justify-content: center;
`;
const Container = styled.View`
	position: absolute;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	background-color: rgba(128, 128, 128, 0.9);
`;
const EventImage = styled.Image`
	width: ${widthPercentage(337)}px;
	height: ${heightPercentage(427)}px;
`;
const ViewContaniner = styled.View`
	background-color: white;
	width: ${widthPercentage(337)}px;
	height: ${heightPercentage(487)}px;
	border-radius: 5px;
`;
const EventHStack = styled(HStack)`
	justify-content: space-around;
	height: 10%;
`;
const EventTouable = styled.TouchableOpacity``;
