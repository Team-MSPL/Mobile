import {Pressable, ScrollView} from 'react-native';
import {colors} from '../../utill/colors';
import {BackgroundGray, PretendardSemiBoldText, PretendardVariableText} from '../../utill/layout/layout';
import styled from 'styled-components/native';
import {heightPercentage} from '../../utill/layout/responsive-size';
import moment from 'moment';
import ImageView from 'react-native-image-viewing';
import {ImageText, ImageViewFooterComponent} from '../timetable/course-detail';
import {useState} from 'react';

export default function NoticeDetail({route}: any) {
	const [visible, setVisible] = useState(false);
	const openImage = () => {
		setVisible(true);
	};
	return (
		<BackgroundGray>
			<ScrollView>
				<PretendardSemiBoldText size={14} lineHeight={21} color={colors.Black}>
					{route.params.data.noticeTitle}
				</PretendardSemiBoldText>
				<PretendardVariableText marginTop={heightPercentage(10)} size={14} lineHeight={21} color={colors.Black}>
					{route.params.data.noticeContent}
				</PretendardVariableText>
				{route.params.data.noticeImage.map((value, index) => (
					<Pressable key={index} onPress={openImage}>
						<NoticeImage source={{uri: value}}></NoticeImage>
					</Pressable>
				))}
				<PretendardVariableText
					marginTop={heightPercentage(10)}
					textAlign='right'
					size={12}
					lineHeight={18}
					color={colors.Gray4}>
					{moment(route.params.data.noticedAt).format('YYYY.MM.DD')}
				</PretendardVariableText>
				<ImageView
					images={route.params.data?.noticeImage.map((value, index) => ({
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
									{index.imageIndex + 1}/{route.params.data?.noticeImage.length}
								</ImageText>
							</ImageViewFooterComponent>
						);
					}}
				/>
			</ScrollView>
		</BackgroundGray>
	);
}
const NoticeImage = styled.Image`
	width: 90%;
	height: ${heightPercentage(300)}px;
	resize-mode: contain;
	align-self: center;
`;
