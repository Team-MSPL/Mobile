import moment, {Moment} from 'moment';
import {shareFeedTemplate} from '@react-native-kakao/share';
import {useAppDispatch} from '../../redux';
import {modalSliceActions} from '../../redux/modal/modalSlice';
const useKakaoShare = () => {
	const dispatch = useAppDispatch();
	const kakaoShare = async (e: KakaoType) => {
		try {
			console.log(e);
			const response = await shareFeedTemplate({
				template: {
					content: {
						title: e.travelName,
						imageUrl: e.photo && e.photo.trim() !== '' ? e.photo : 'https://danim.me/square_logo.png',
						link: {
							webUrl: 'http://danim.me',
							mobileWebUrl: 'http://danim.me',
						},
						description: `${moment(e.startDay).format('YY-MM-DD')} ~ ${moment(e.endDay).format(
							'YY-MM-DD',
						)}`,
					},
					buttons: [
						{
							title: '앱에서 보기',
							link: {
								androidExecutionParams: {
									kakaolink: 'Timetable',
									whatId: e.travelId,
								},
								iosExecutionParams: {
									kakaolink: 'Timetable',
									whatId: e.travelId,
								},
							},
						},
					],
				},
			});
		} catch (err) {
			console.log(err);
			dispatch(
				modalSliceActions.setOpenModal({
					modalTitle: '카카오 공유 중 문제가 발생했습니다.',
				}),
			);
		}
	};
	return {kakaoShare};
};
export default useKakaoShare;
interface KakaoType {
	travelName: string;
	travelId: string;
	startDay: Moment;
	endDay: Moment;
	photo: string;
}
