import styled from 'styled-components/native';
import {Fragment, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../redux';
import {getNotice} from '../../redux/user/user.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {colors} from '../../utill/colors';
import {HStack, VStack, devicesHeight, devicesWidth} from '../../utill/layout/layout';
import Icon from 'react-native-vector-icons/AntDesign';
import {Pressable, TouchableOpacity} from 'react-native';
import moment from 'moment';
import ImageView from 'react-native-image-viewing';
import {ImageText, ImageViewFooterComponent} from '../timetable/course-detail';
export default function Notice({navigation}: any) {
	const dispatch = useAppDispatch();

	const [noticeList, setNoticeList] = useState<NoticeType[]>([]);
	const {isLoading} = useAppSelector(state => state.loadingSlice);
	const [visible, setVisible] = useState(false);
	const [select, setSelect] = useState(-1);

	const openImage = () => {
		setVisible(true);
	};
	const getNoteListData = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const dataList = await dispatch(getNotice()).unwrap();
			setNoticeList(dataList);
			console.log(dataList);
		} catch (err) {
			dispatch(modalSliceActions.setOpenModal({modalTitle: '잠시후 다시 시도해주세요'}));
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	useEffect(() => {
		getNoteListData();
	}, []);
	if (isLoading) return <></>;
	const clickNotice = (e: number) => {
		if (e == select) {
			setSelect(-1);
		} else {
			setSelect(e);
		}
	};
	return (
		<>
			<MainContainer>
				{noticeList.length == 0 ? (
					<ElementText>공지가 없습니다!</ElementText>
				) : (
					<ElementScrollView>
						{noticeList.map((item, idx) => (
							<Fragment key={idx}>
								<ElementContainer
									onPress={() => {
										clickNotice(idx);
									}}>
									<VStack>
										<ElementText>{item.noticeTitle}</ElementText>
										<ElementAtText>{moment(item.noticedAt).format('YY-MM-DD')}</ElementAtText>
									</VStack>
									<Icon name={idx == select ? 'up' : 'down'} size={25} color={'black'}></Icon>
								</ElementContainer>
								{select == idx && (
									<NoticeElementContainer>
										<NoticeElementText>{item.noticeContent}</NoticeElementText>
										{item.noticeImage.map((value, index) => (
											<Pressable key={index} onPress={openImage}>
												<NoticeImage source={{uri: value}}></NoticeImage>
											</Pressable>
										))}
									</NoticeElementContainer>
								)}
							</Fragment>
						))}
					</ElementScrollView>
				)}
			</MainContainer>
			<ImageView
				images={noticeList[select]?.noticeImage.map((value, index) => ({
					uri: value,
				}))}
				onImageIndexChange={item => console.log(item)}
				imageIndex={0}
				visible={visible}
				onRequestClose={() => setVisible(false)}
				FooterComponent={index => {
					return (
						<ImageViewFooterComponent>
							<ImageText>
								{index.imageIndex + 1}/{noticeList[select]?.noticeImage.length}
							</ImageText>
						</ImageViewFooterComponent>
					);
				}}
			/>
		</>
	);
}

const NoticeElementText = styled.Text`
	font-size: 17px;
	font-weight: 500;
	color: black;
	margin: 0px 0px 10px 0px;
`;
const NoticeImage = styled.Image`
	width: 90%;
	height: 300px;
	resize-mode: contain;
	align-self: center;
`;
const ElementAtText = styled.Text`
	font-size: 15px;
	font-weight: 500;
	color: black;
`;
const ElementText = styled.Text`
	font-size: 20px;
	font-weight: 500;
	color: black;
`;
const MainContainer = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
	padding: 10px;
	background-color: ${colors.main};
`;
const ElementContainer = styled(HStack).attrs({as: TouchableOpacity})`
	width: 100%;
	border-bottom-width: 1px;
	justify-content: space-between;
	padding: 10px;
	border-bottom-color: ${colors.regionNormal};
`;
const NoticeElementContainer = styled.View`
	padding: 10px;
	flex: 1;
`;
const ElementScrollView = styled.ScrollView`
	width: 100%;
`;
interface NoticeType {
	_id: string;
	noticeTitle: string;
	noticeContent: string;
	noticeImage: [string, string];
	noticedAt: string;
	__v: number;
}
