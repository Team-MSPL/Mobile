import React from 'react';
import ModuleShell from './ModuleShell';
import MapCard from './MapCard';
import MediaGallery from './MediaGallery';
import {buildImageUrl} from './imageUrl';
import {View} from 'react-native';
import {PretendardSemiBoldText} from '../../layout/layout';
import {colors} from '../../colors';
import {GOOGLE_API_KEY} from '@env';

/**
 * PMDL_EXPERIENCE_LOCATION (updated)
 * - uses buildImageUrl for photos
 */
export default function PMDL_EXPERIENCE_LOCATION({moduleKey, moduleData}: {moduleKey: string; moduleData: any}) {
	if (!moduleData) return null;
	const content = moduleData.content ?? moduleData;
	const list = Array.isArray(content?.list) ? content.list : [];
	if (list.length === 0) return null;

	// show each list item (but keep simple: first latlng + photo)
	return (
		<ModuleShell title={moduleData?.module_title ?? moduleKey}>
			{list.map((it: any, idx: number) => {
				const latlng = it?.latlng ?? it?.content?.latlng ?? null;
				const photo = it?.photo?.media?.[0]?.source_content ?? null;
				const photoUri = buildImageUrl(photo);
				const desc = latlng?.desc ?? it?.location_name?.desc ?? it?.desc ?? null;
				const lat = latlng ? Number(latlng.latitude ?? latlng.lat) : null;
				const lng = latlng ? Number(latlng.longitude ?? latlng.lng) : null;
				return (
					<View key={idx} style={{marginBottom: 12}}>
						{desc ? (
							<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
								{String(desc).replace(/<\/?[^>]+(>|$)/g, '')}
							</PretendardSemiBoldText>
						) : null}
						{photoUri ? <MediaGallery media={[{source_content: photo}]} /> : null}
						{lat != null && lng != null ? (
							<MapCard
								lat={lat}
								lng={lng}
								desc={desc}
								googleApiKey={GOOGLE_API_KEY}
								zoom={latlng?.zoom_lv ? Number(latlng.zoom_lv) : 12}
							/>
						) : null}
					</View>
				);
			})}
		</ModuleShell>
	);
}
