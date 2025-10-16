import {useLayoutEffect, useState} from 'react';
import {useAppDispatch} from '../../redux';
import {LoadingSliceActions} from '../../redux/loading/loading.slice';
import {getReserveList} from '../../redux/travel-info/travel.slice';
import {colors} from '../../utill/colors';
import {BackgroundGrayScrollView, Center, PretendardVariableText} from '../../utill/layout/layout';

export default function ReserveList() {
	const dispatch = useAppDispatch();
	const [list, setList] = useState([]);
	const handleList = async () => {
		try {
			dispatch(LoadingSliceActions.onLoading());
			const a = await dispatch(getReserveList()).unwrap();
			setList(a.data);
		} catch (e) {
			console.log(e);
		} finally {
			dispatch(LoadingSliceActions.offLoading());
		}
	};
	useLayoutEffect(() => {
		handleList();
	}, []);
	if (list.length == 0)
		return (
			<Center backgroundColor={colors.backgroundWhite}>
				<PretendardVariableText
					size={16}
					lineHeight={21}
					color={colors.Black}
					style={{
						width: '100%',
						textAlign: 'center',
						includeFontPadding: false,
					}}>
					주문 내역이 없습니다!
				</PretendardVariableText>
			</Center>
		);
	return <BackgroundGrayScrollView></BackgroundGrayScrollView>;
}
