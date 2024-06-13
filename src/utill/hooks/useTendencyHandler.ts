import {useDispatch} from 'react-redux';
import {useAppSelector} from '../../redux';
import {regionRecommendSliceActions} from '../../redux/travel-info/region-recommend.slice';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';

export const useTendencyHandler = () => {
	const {regionTendency} = useAppSelector(state => state.regionRecommendSlice);
	const {tendency} = useAppSelector(state => state.travelSlice);
	const dispatch = useDispatch();
	const handleButtonClick = ({index, region, item}: {index: number; region: boolean; item: number}) => {
		let copy = [...(region ? regionTendency : tendency)];
		let copy2 = [...(region ? regionTendency[index] : tendency[index])];
		copy2[item] = copy2[item] == 1 ? 0 : 1;
		copy[index] = copy2;
		dispatch(
			region ? regionRecommendSliceActions.enrollRegionTendency(copy) : travelSliceActions.enrollTendency(copy),
		);
	};
	const tendencyList = [
		{
			title: '누구와 떠나시나요?',
			multi: true,
			list: ['나홀로', '연인과', '친구와', '가족과', '효도', '자녀와', '반려동물과'],
		},
		{
			title: '테마는 무엇인가요?',
			multi: true,
			list: ['힐링', '액티비티', '배움이 있는', '맛있는', '교통이 편한', '알뜰한'],
		},
		{
			title: '무엇을 하고싶으신가요?',
			multi: true,
			list: ['레저 스포츠', '문화시설', '사진 명소', '이색체험', '유적지', '박물관', '공원', '사찰', '성지'],
		},
		{
			title: '어디를 가고싶으신가요?',
			multi: true,
			list: ['바다', '산', '드라이브', '산책', '쇼핑', '실내여행지', '시티투어', '전통한옥'],
		},
	];
	const regionTendencyList = [
		{
			title: '누구와 떠나시나요?',
			multi: true,
			list: ['혼자여행', '커플 여행', '우정 여행', '가족 여행', '효도 여행', '어린 자녀와'],
		},
		{
			title: '테마는 무엇인가요?',
			multi: true,
			list: ['힐링', '에너제틱', '배움이 있는', '맛있는', '교통이 편한', '알뜰한'],
		},
		{
			title: '무엇을 하고 싶으신가요?',
			multi: true,
			list: ['레저 스포츠', '문화시설', '사진 명소', '이색체험', '역사여행'],
		},
		{
			title: '어디를 가고 싶으신가요?',
			multi: true,
			list: ['바다', '산', '드라이브', '산책', '쇼핑', '자연경관', '시티투어', '전통한옥'],
		},
		{
			title: '어느 계절에 가고 싶으신가요?',
			multi: true,
			list: ['봄', '여름', '가을', '겨울'],
		},
	];

	return {tendencyList, regionTendencyList, handleButtonClick};
};
