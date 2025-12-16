// useBuildReservationPayload.ts
import {useAppSelector} from '../../../../redux';
import {getBuyerObject, getCustomArray, getTrafficArray} from '../../../../redux/product/bookingSlice';
import {buildReservationPayloadPure} from './buildReservationPayloadPure';

export function useBuildReservationPayload() {
	const buyerObj = useAppSelector(state => getBuyerObject(state.bookingSlice));
	const customArray = useAppSelector(state => getCustomArray(state.bookingSlice));
	const trafficArr = useAppSelector(state => getTrafficArray(state.bookingSlice));
	const guideLangCode = useAppSelector(state => state.bookingSlice.guideLangCode);

	return (args: {params: any; pkgData: any; pdt: any; s_date?: string | null; orderNote?: string | null}) => {
		return buildReservationPayloadPure({
			...args,
			buyerObj,
			customArray,
			trafficArr,
			guideLangCode,
		});
	};
}
