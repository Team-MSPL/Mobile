import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../colors';

function formatPrice(n?: number | null) {
	if (n === null || n === undefined) return '';
	return Math.floor(Number(n)).toLocaleString();
}

export function MiniProductCard({
	image,
	title,
	originPrice,
	salePrice,
	percent,
	perPersonText,
}: {
	image?: string | null;
	title: string;
	originPrice?: number;
	salePrice?: number;
	percent?: number;
	perPersonText?: string;
}) {
	return (
		<View style={styles.cardWrap}>
			<View style={styles.cardInner}>
				<View style={styles.imageCol}>
					<Image source={{uri: image ?? ''}} style={styles.image} resizeMode='cover' />
					{/* <View
						style={{
							position: 'absolute',
							left: 6,
							bottom: 8,
							paddingHorizontal: 2,
							paddingVertical: 2,
							zIndex: 2,
							backgroundColor: '#FEAEB4',
							borderRadius: 12,
						}}>
						<Text style={{marginBottom: 6, color: colors.Black, fontSize: 24}} numberOfLines={1}>
							최저가
						</Text>
					</View> */}
				</View>

				<View style={styles.infoCol}>
					<Text style={{marginBottom: 6, color: colors.grey800, fontSize: 24}} numberOfLines={1}>
						{title}
					</Text>

					<View style={styles.priceRow}>
						{percent !== undefined && percent > 0 ? (
							<Text style={styles.percentText}>{percent}%</Text>
						) : null}
						<View style={{flexDirection: 'column'}}>
							{originPrice !== undefined && originPrice > 0 && originPrice > (salePrice ?? 0) ? (
								<Text
									style={{
										marginBottom: 6,
										color: colors.grey300,
										fontSize: 20,
										textDecorationLine: 'line-through',
									}}>
									{formatPrice(originPrice)}원
								</Text>
							) : null}
							<Text
								style={{
									marginRight: 8,
									color: colors.grey900,
									fontSize: 24,
									textDecorationLine: 'line-through',
								}}>
								{salePrice ? `${formatPrice(salePrice)}원~` : '-'}
							</Text>
						</View>
					</View>
					<Text style={{marginTop: 6, color: colors.grey700, fontSize: 20}}>{perPersonText ?? ''}</Text>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	// Styles aligned to ProductCard exactly (sizes/paddings/borderRadius/etc)
	cardWrap: {
		marginVertical: 8,
		overflow: 'hidden',
	},
	cardInner: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff',
	},
	imageCol: {
		position: 'relative',
		width: 120,
		height: 120,
		marginRight: 14,
		borderRadius: 13,
		overflow: 'hidden',
		backgroundColor: '#eee',
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		width: 120,
		height: 120,
		borderRadius: 13,
		backgroundColor: '#eee',
	},
	infoCol: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		paddingVertical: 0,
	},
	priceRow: {
		flexDirection: 'row',
		alignItems: 'flex-end',
	},
	percentText: {
		color: colors.red500,
		fontWeight: 'bold',
		marginRight: 7,
		alignSelf: 'center',
	},
});

export default MiniProductCard;
