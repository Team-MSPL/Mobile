import {useEffect, useState} from 'react';
import {useAppDispatch} from '../../redux';
import {handleBookingField} from '../../redux/travel-info/travel.slice';

export function useBookingFields({prod_no, pkg_no}: {prod_no?: string | number; pkg_no?: string | number}) {
	const [fields, setFields] = useState<any[] | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<any>(null);
	const dispatch = useAppDispatch();
	useEffect(() => {
		let cancelled = false;
		async function fetchFields() {
			setLoading(true);
			setError(null);
			try {
				const res = await dispatch(
					handleBookingField({
						prod_no: prod_no,
						pkg_no: pkg_no,
					}),
				).unwrap();
				if (!cancelled) {
					setFields(res ?? []);
				}
			} catch (e) {
				if (!cancelled) setError(e);
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		fetchFields();

		return () => {
			cancelled = true;
		};
	}, [prod_no, pkg_no]);

	return {fields, loading, error};
}
