import React from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {styled} from 'styled-components/native';
import {useAppDispatch, useAppSelector} from '../../../../redux';
import {
	setBuyerCountry,
	setBuyerEmail,
	setBuyerFirstName,
	setBuyerLastName,
	setBuyerTelCountryCode,
	setBuyerTelNumber,
	setCustomField,
} from '../../../../redux/product/bookingSlice';
import {colors} from '../../../colors';
import {heightPercentage, widthPercentage} from '../../../layout/responsive-size';
import CountrySelector from '../payfield/CountrySelector';

export default function BuyerInfoSection({onComplete}: {onComplete?: () => void}) {
	const {buyer_first_name, buyer_last_name, buyer_Email, buyer_tel_country_code, buyer_tel_number, buyer_country} =
		useAppSelector(state => state.bookingSlice);
	const dispatch = useAppDispatch();

	return (
		<View style={styles.container}>
			<Text style={{marginBottom: 6, color: colors.grey800, fontSize: 24}}>구매자 성</Text>
			<TextInput
				placeholder='Last name'
				placeholderTextColor={colors.grey400}
				value={buyer_last_name}
				onChangeText={e => {
					dispatch(setBuyerLastName(e));
				}}
				style={styles.input}
			/>

			<Text style={{marginBottom: 6, color: colors.grey800, fontSize: 24, marginTop: 8}}>구매자 이름</Text>
			<TextInput
				placeholder='First name'
				placeholderTextColor={colors.grey400}
				value={buyer_first_name}
				onChangeText={e => {
					dispatch(setBuyerFirstName(e));
				}}
				style={styles.input}
			/>

			<Text style={{marginBottom: 6, color: colors.grey800, fontSize: 24, marginTop: 8}}>이메일</Text>
			<TextInput
				placeholder='email@example.com'
				placeholderTextColor={colors.grey400}
				value={buyer_Email}
				onChangeText={e => {
					dispatch(setBuyerEmail(e));
				}}
				style={styles.input}
				keyboardType='email-address'
				autoCapitalize='none'
			/>

			<Text style={{marginBottom: 6, color: colors.grey800, fontSize: 24, marginTop: 8}}>전화번호</Text>
			<CountrySelector
				valueCode={buyer_country}
				label='국가 선택'
				onSelect={({code, dial}) => {
					dispatch(setBuyerCountry(code));
					dispatch(setBuyerTelCountryCode(String(dial)));
				}}
			/>

			<View style={{flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
				<TouchableOpacity activeOpacity={0.85} style={styles.countryDialBox}>
					<Text style={styles.countryDialText}>
						{buyer_tel_country_code ? `+${String(buyer_tel_country_code)}` : '+82'}
					</Text>
				</TouchableOpacity>

				<View style={{width: 12}} />

				<TextInput
					placeholder='01012345678'
					placeholderTextColor={colors.grey400}
					value={String(buyer_tel_number ?? '')}
					onChangeText={e => {
						dispatch(setBuyerTelNumber(e));
					}}
					style={[styles.input, {flex: 1}]}
					keyboardType='phone-pad'
				/>
			</View>

			<View style={{height: 12}} />

			<Button height={54} onPress={() => onComplete && onComplete()}>
				<Text style={{color: colors.backgroundWhite, fontSize: 17}}>작성 완료</Text>
			</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {paddingVertical: 8, paddingHorizontal: 0},
	label: {marginBottom: 6},
	input: {
		height: 54,
		borderRadius: 12,
		backgroundColor: colors.greyOpacity100,
		paddingHorizontal: 12,
		color: colors.grey800,
	},
	countryDialBox: {
		height: 54,
		width: 90,
		borderRadius: 12,
		backgroundColor: colors.greyOpacity100,
		paddingHorizontal: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	countryDialText: {
		color: colors.grey800,
	},
});
const Button = styled.TouchableOpacity<{height: number}>`
	min-width: ${widthPercentage(64)}px;
	height: ${props => heightPercentage(props.height)}px;
	border-radius: 10px;
	padding: 7.5px 19px;
	gpa: 10px;
	background-color: ${colors.Gray5};
	align-items: center;
	justify-content: center;
`;
