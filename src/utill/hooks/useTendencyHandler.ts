import {useDispatch} from 'react-redux';
import {useAppSelector} from '../../redux';
import {regionRecommendSliceActions} from '../../redux/travel-info/region-recommend.slice';
import {travelSliceActions} from '../../redux/travel-info/travel.slice';
import {SvgChina} from '../svg/svg';

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
	const handleCountryClick = (country: number) => {
		dispatch(travelSliceActions.setCountry(country));
	};
	const countryList = [
		{ko: '한국', en: 'Korea'},
		{ko: '일본', en: 'Japan'},
		{ko: '중국', en: 'China'},
		{ko: '싱가포르', en: 'Singapore'},
		{ko: '베트남', en: 'Vietnam'},
		{ko: '태국', en: 'Thailand'},
		{ko: '필리핀', en: 'Philippines'},
	];

	const tendencyList = [
		{
			title: '누구와 떠나시나요?',
			multi: true,
			list: ['나홀로', '연인과', '친구와', '가족과', '효도', '자녀와', '반려동물과'],
			photo: [
				require('../../../public/tendency/alone.png'),
				require('../../../public/tendency/parents.png'),
				require('../../../public/tendency/friends.png'),
				require('../../../public/tendency/family.png'),
				require('../../../public/tendency/grandparents.png'),
				require('../../../public/tendency/kid.png'),
				require('../../../public/tendency/dog.png'),
			],
		},
		{
			title: '테마는 무엇인가요?',
			multi: true,
			list: ['힐링', '활동적인', '배움이 있는', '맛있는', '교통이 편한', '알뜰한'],
			photo: [
				require('../../../public/tendency/healing.png'),
				require('../../../public/tendency/kitesurfing.png'),
				require('../../../public/tendency/getInfo.png'),
				require('../../../public/tendency/food.png'),
				require('../../../public/tendency/comfortable.png'),
				require('../../../public/tendency/sale.png'),
			],
		},
		{
			title: '무엇을 하고싶으신가요?',
			multi: true,
			list: ['레저 스포츠', '문화시설', '사진 명소', '이색체험', '유적지', '박물관', '공원', '사찰', '성지'],
			photo: [
				require('../../../public/tendency/motocross.png'),
				require('../../../public/tendency/facility.png'),
				require('../../../public/tendency/camera.png'),
				require('../../../public/tendency/special.png'),
				require('../../../public/tendency/old-paper.png'),
				require('../../../public/tendency/museum.png'),
				require('../../../public/tendency/park.png'),
				require('../../../public/tendency/tempor.png'),
				require('../../../public/tendency/church.png'),
			],
		},
		{
			title: '어디를 가고싶으신가요?',
			multi: true,
			list: ['바다', '산', '드라이브', '산책', '쇼핑', '실내여행지', '시티투어', '전통한옥'],
			photo: [
				require('../../../public/tendency/beach.png'),
				require('../../../public/tendency/mountain.png'),
				require('../../../public/tendency/comfortable.png'),
				require('../../../public/tendency/walk.png'),
				require('../../../public/tendency/online-shopping.png'),
				require('../../../public/tendency/indoor.png'),
				require('../../../public/tendency/buildings.png'),
				require('../../../public/tendency/tranditionalHouse.png'),
			],
		},
	];
	const regionTendencyList = [
		{
			title: '누구와 떠나시나요?',
			multi: true,
			list: ['혼자여행', '커플 여행', '우정 여행', '가족 여행', '효도 여행', '어린 자녀와'],
			photo: [
				require('../../../public/tendency/alone.png'),
				require('../../../public/tendency/parents.png'),
				require('../../../public/tendency/friends.png'),
				require('../../../public/tendency/family.png'),
				require('../../../public/tendency/grandparents.png'),
				require('../../../public/tendency/kid.png'),
			],
		},
		{
			title: '테마는 무엇인가요?',
			multi: true,
			list: ['힐링', '활동적인', '배움이 있는', '맛있는', '교통이 편한', '알뜰한'],
			photo: [
				require('../../../public/tendency/healing.png'),
				require('../../../public/tendency/kitesurfing.png'),
				require('../../../public/tendency/getInfo.png'),
				require('../../../public/tendency/food.png'),
				require('../../../public/tendency/comfortable.png'),
				require('../../../public/tendency/sale.png'),
			],
		},
		{
			title: '무엇을 하고 싶으신가요?',
			multi: true,
			list: ['레저 스포츠', '문화시설', '사진 명소', '이색체험', '역사여행'],
			photo: [
				require('../../../public/tendency/motocross.png'),
				require('../../../public/tendency/facility.png'),
				require('../../../public/tendency/camera.png'),
				require('../../../public/tendency/special.png'),
				require('../../../public/tendency/old-paper.png'),
			],
		},
		{
			title: '어디를 가고 싶으신가요?',
			multi: true,
			list: ['바다', '산', '드라이브', '산책', '쇼핑', '자연경관', '시티투어', '전통한옥'],
			photo: [
				require('../../../public/tendency/beach.png'),
				require('../../../public/tendency/mountain.png'),
				require('../../../public/tendency/comfortable.png'),
				require('../../../public/tendency/walk.png'),
				require('../../../public/tendency/online-shopping.png'),
				require('../../../public/tendency/park.png'),
				require('../../../public/tendency/buildings.png'),
				require('../../../public/tendency/tranditionalHouse.png'),
			],
		},
		{
			title: '어느 계절에 가고 싶으신가요?',
			multi: true,
			list: ['봄', '여름', '가을', '겨울'],
			photo: [
				require('../../../public/tendency/spring.png'),
				require('../../../public/tendency/summer.png'),
				require('../../../public/tendency/fall.png'),
				require('../../../public/tendency/winter.png'),
			],
		},
	];

	return {tendencyList, regionTendencyList, handleButtonClick, countryList, handleCountryClick};
};
