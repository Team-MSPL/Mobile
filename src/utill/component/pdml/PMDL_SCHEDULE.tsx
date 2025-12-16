import React from 'react';
import {View} from 'react-native';
import ModuleShell from './ModuleShell';
import MediaGallery from './MediaGallery';
import {PretendardSemiBoldText} from '../../layout/layout';
import {colors} from '../../colors';

/**
 * PMDL_SCHEDULE
 *
 * Renders schedule modules. Defensive: many fields can be objects like { desc: "..." } or plain strings.
 * The previous error ("Objects are not valid as a React child (found: object with keys {desc})")
 * was caused by passing an object directly into <Text>. This component extracts .desc when needed.
 */

function getDesc(val: any): string {
	if (val == null) return '';
	if (typeof val === 'string') return val;
	if (typeof val === 'number') return String(val);
	// some PDML fields are shaped like { desc: "..." } or { title: { desc: "..." } }
	if (typeof val === 'object') {
		if (typeof val.desc === 'string') return val.desc;
		if (typeof val.title === 'object' && typeof val.title.desc === 'string') return val.title.desc;
		// fallback: try JSON-ish safe string
		try {
			return String(val);
		} catch {
			return '';
		}
	}
	return '';
}

export default function PMDL_SCHEDULE({moduleKey, moduleData}: {moduleKey: string; moduleData: any}) {
	if (!moduleData) return null;
	const title = moduleData.module_title ?? moduleData.title ?? moduleKey;
	const content = moduleData.content ?? moduleData;
	const props = content?.properties ?? {};
	const scheduleList = props?.schedule_list?.list ?? [];

	if (!Array.isArray(scheduleList) || scheduleList.length === 0) return null;

	return (
		<ModuleShell title={title}>
			{scheduleList.map((day: any, dIdx: number) => {
				const dailyTitle = getDesc(day?.daily_title ?? day?.title) || null;
				const dailySchedule = day?.daily_schedule_list ?? {};
				const rows = Array.isArray(dailySchedule?.list) ? dailySchedule.list : [];

				return (
					<View key={dIdx} style={{marginBottom: 16}}>
						{dailyTitle ? (
							<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
								{dailyTitle}
							</PretendardSemiBoldText>
						) : null}

						{rows.map((r: any, rIdx: number) => {
							// time/content may be objects
							const timeText = getDesc(r?.time ?? r?.time_desc ?? r?.time_text) || '';
							const contentText = getDesc(r?.content ?? r?.desc ?? r?.schedule_desc) || '';
							// media may be in r.media.media or r.media
							const mediaArr = Array.isArray(r?.media?.media)
								? r.media.media
								: Array.isArray(r?.media)
								? r.media
								: [];
							return (
								<View key={rIdx} style={{marginBottom: 12}}>
									<View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
										{timeText ? (
											<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
												{timeText}
											</PretendardSemiBoldText>
										) : (
											<View style={{width: 84}} />
										)}
										<View style={{flex: 1}}>
											{contentText ? (
												<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
													{contentText}
												</PretendardSemiBoldText>
											) : null}
											{Array.isArray(mediaArr) && mediaArr.length > 0 ? (
												<View style={{marginTop: 8}}>
													<MediaGallery media={mediaArr} />
												</View>
											) : null}
										</View>
									</View>
								</View>
							);
						})}
					</View>
				);
			})}
		</ModuleShell>
	);
}
