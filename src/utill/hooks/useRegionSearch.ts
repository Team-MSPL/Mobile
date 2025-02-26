import {useDispatch} from 'react-redux';
import {useAppSelector} from '../../redux';
import {cityViewList} from '../component/enroll-info/city-list';

export const useRegionSearch = () => {
	const {country} = useAppSelector(state => state.travelSlice);
	const filterList = ['도심권', '동남권', '동북권', '서남권', '서북권'];
	const handleRegionSerarch = (e: string) => {
		return cityViewList[country]
			.map((item, index) => {
				if (index != 0) {
					return item.sub.map((value, idx) => {
						if (value.subTitle == '전체') {
							let copy = {...value, subTitle: item.title};
							return copy;
						} else {
							return value;
						}
					});
				}
			})
			.filter(item => item != undefined)
			.reduce(function (acc, cur) {
				return [...acc, ...cur];
			})
			?.filter(item => !filterList.includes(item?.subTitle))
			.filter((item, index) => item.subTitle.includes(e));
	};
	const handleCourseRegionSerarch = (e: string) => {
		return cityViewList[country]
			.map((item, index) => {
				if (index != 0) {
					return item.sub.map((value, idx) => {
						if (value.subTitle == '전체') {
							let copy = {...value, subTitle: item.title};
							return copy;
						} else {
							return value;
						}
					});
				}
			})
			.filter(item => item != undefined)
			.reduce(function (acc, cur) {
				return [...acc, ...cur];
			})
			?.filter(item => !filterList.includes(item?.subTitle))
			.filter((item, index) => item.subTitle.includes(e));
	};
	return {handleRegionSerarch, handleCourseRegionSerarch};
};
