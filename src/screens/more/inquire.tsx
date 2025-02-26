import styled from 'styled-components/native';
import {BackgroundGray, HStack, PretendardVariableText} from '../../utill/layout/layout';
import {useCallback, useRef, useState} from 'react';
import {Keyboard, Pressable} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../redux';
import {inquiryEnroll} from '../../redux/user/user.slice';
import {modalSliceActions} from '../../redux/modal/modalSlice';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {colors} from '../../utill/colors';
import {fontPercentage, heightPercentage, widthPercentage} from '../../utill/layout/responsive-size';
import {ButtonContainer} from '../enroll-info/select-multi';
import PrimaryButton from '../../utill/component/primary-button';
import {
	CancelContainer,
	PictureColorContainer,
	PictureCotainer,
	PictureElement,
	PictureScroll,
} from '../my-travel-list/input-diary';
import {SvgCancel, SvgPicture} from '../../utill/svg/svg';
import {usePhoto} from '../../utill/hooks/usePhoto';

import ImageView from 'react-native-image-viewing';
import {ImageText, ImageViewFooterComponent} from '../timetable/course-detail';
import useFirebaseStorage from '../../utill/hooks/useFirebaseStorage';
export default function Inquire({navigation}: any) {
	const [text, setText] = useState('');
	const changeText = (e: string) => {
		setText(e);
	};
	const {userName} = useAppSelector(state => state.userSlice);
	const dispatch = useAppDispatch();
	const goBack = () => {
		navigation.goBack();
	};
	const [imageIndex, setImageIndex] = useState(0);
	const [visible, setVisible] = useState(false);
	const viewingImgae = (e: number) => {
		setVisible(true);
		setImageIndex(e);
	};
	const checkHandle = () => {
		Keyboard.dismiss();
		dispatch(
			modalSliceActions.setOpenModal({
				modalTitle: '문의사항을 전송하시겠습니까?',
				modalTopText: '보내겠습니다',
				modalBottomText: '안보내겠습니다',
				modalFunction: handleInquire,
			}),
		);
	};
	const inquireImageRef = useRef<string[]>([]);
	const {uploadImage} = useFirebaseStorage();
	const handleInquire = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			inquireImageRef.current = Array(picture.length).fill('');
			const ImageFunction = picture.map(async (item, idx) => {
				let data = (await uploadImage({item: item, idx: idx, id: 'inquire', category: 'inquire'})) ?? ' ';
				inquireImageRef.current[idx] = data;
			});
			await Promise.all(ImageFunction);
			const a = await dispatch(
				inquiryEnroll({userName: userName, inquire: text + [...inquireImageRef.current]}),
			).unwrap();
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '문의완료',
					modalSubText: '빠른 시일 내에 답변드리겠습니다.\n답변은 쪽지함에서 확인하실 수 있습니다.',
					modalFunction: goBack,
					modalBottomFunctionUse: true,
					modalBottomFunction: goBack,
				}),
			);
		} catch (err) {
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: err,
				}),
			);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	const {handleImagePickerLaunch} = usePhoto();
	const [picture, setPicture] = useState([]);
	const changeImage = useCallback(
		(e: any) => {
			setPicture(e);
		},
		[picture],
	);
	const handelGetImage = async () => {
		handleImagePickerLaunch({
			photoData: picture,
			changeFunction: changeImage,
		});
	};

	const deletePicture = (e: number) => {
		let copy = [...picture];
		copy.splice(e, 1);
		setPicture(copy);
		// setpictureValue(copy);
	};
	return (
		<CouponContainer
			onPress={() => {
				Keyboard.dismiss();
			}}>
			<PretendardVariableText size={16} lineHeight={24} color={colors.Black}>
				다님에게 문의하기
			</PretendardVariableText>
			<PretendardVariableText size={20} lineHeight={27} color={colors.Black}>
				어떤 점이 좋았나요?{`\n`}또는, 불편한 사항이 있었나요?
			</PretendardVariableText>
			<CouponInput
				multiline={true}
				value={text}
				placeholder='문의 사항을 적어주세요.'
				placeholderTextColor={colors.Gray2}
				blurOnSubmit={true}
				onChangeText={(value: string) => changeText(value)}></CouponInput>
			<PictureCotainer>
				<PictureScroll horizontal={true} showsHorizontalScrollIndicator={false}>
					<PictureColorContainer onPress={handelGetImage} noBorder={false}>
						<HStack gap={3}>
							<PretendardVariableText size={14} lineHeight={21} color={colors.PointYellow}>
								사진 추가
							</PretendardVariableText>
							<SvgPicture color={colors.PointYellow} width={widthPercentage(14)} />
						</HStack>
					</PictureColorContainer>
					{picture.map((item, idx) => (
						<PictureColorContainer
							noBorder={true}
							key={idx}
							onPress={() => {
								viewingImgae(idx);
							}}>
							<CancelContainer
								onPress={() => {
									deletePicture(idx);
								}}>
								<SvgCancel
									color='white'
									width={widthPercentage(13)}
									height={widthPercentage(13)}></SvgCancel>
							</CancelContainer>
							<PictureElement
								width={widthPercentage(150)}
								height={widthPercentage(150)}
								resizeMode='cover'
								source={{uri: item}}></PictureElement>
						</PictureColorContainer>
					))}
				</PictureScroll>
			</PictureCotainer>
			<ButtonContainer>
				<PrimaryButton
					alignSelf={'center'}
					label={'문의 하기'}
					onPress={checkHandle}
					height={heightPercentage(52)}
					width={widthPercentage(327)}
					disabled={text.length == 0}
					marginBottom={10}
					backgroundColor={colors.Primary}
					textColor={colors.Black}></PrimaryButton>
			</ButtonContainer>
			<ImageView
				images={picture.map((item, idx) => ({
					uri: item,
				}))}
				onImageIndexChange={item => console.log(item)}
				imageIndex={imageIndex}
				visible={visible}
				onRequestClose={() => setVisible(false)}
				FooterComponent={index => {
					return (
						<ImageViewFooterComponent>
							<ImageText>
								{index.imageIndex + 1}/{1}
							</ImageText>
						</ImageViewFooterComponent>
					);
				}}
			/>
		</CouponContainer>
	);
}
const CouponContainer = styled(BackgroundGray).attrs({as: Pressable})`
	flex: 1;
	gap: ${heightPercentage(15)}px;
	padding-top: ${heightPercentage(10)}px;
`;
const CouponInput = styled.TextInput`
	width: ${widthPercentage(326)}px;
	height: ${heightPercentage(225)}px;
	background-color: ${colors.Gray1};
	border-radius: 8px;
	padding: ${heightPercentage(14)}px ${widthPercentage(20)}px;
	font-size: ${fontPercentage(14)}px;
	font-weight: 500;
	color: ${colors.Black};
	text-align-vertical: top;
`;
