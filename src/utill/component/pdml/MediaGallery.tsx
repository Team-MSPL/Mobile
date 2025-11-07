import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {PretendardSemiBoldText} from '../../layout/layout';
import {colors} from '../../colors';
import {buildImageUrl} from './imageUrl';

/**
 * MediaGallery
 * - media: array of { source_content, source_type, ... }
 * - normalizes URLs using buildImageUrl
 * - calls onOpen(uri) on tap (for full-screen viewer)
 */
export default function MediaGallery({
	media,
	onOpen,
	imageStyle,
}: {
	media: any[];
	onOpen?: (uri: string) => void;
	imageStyle?: any;
}) {
	if (!Array.isArray(media) || media.length === 0) return null;
	return (
		<View style={{marginTop: 8}}>
			{media.map((m: any, i: number) => {
				const src = m?.source_content ?? '';
				const uri = buildImageUrl(src);
				if (!uri) return null;
				return (
					<TouchableOpacity key={i} activeOpacity={0.9} onPress={() => onOpen?.(uri)}>
						<Image
							source={{uri}}
							style={[
								{
									width: '100%',
									height: 160,
									borderRadius: 8,
									marginBottom: 8,
									backgroundColor: colors.Gray3,
								},
								imageStyle,
							]}
							resizeMode='cover'
							onError={e => {
								// eslint-disable-next-line no-console
								console.warn('[MediaGallery] image load error:', uri, e.nativeEvent);
							}}
						/>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}
