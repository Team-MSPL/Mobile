import React, {useState} from 'react';
import {View, Image, TouchableOpacity, LayoutAnimation, Platform, UIManager} from 'react-native';
import ModuleShell from './ModuleShell';
import MapCard from './MapCard';
import {PretendardSemiBoldText} from '../../layout/layout';
import {colors} from '../../colors';
import {buildImageUrl} from './imageUrl';
import {GOOGLE_API_KEY} from '@env';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
	// @ts-ignore
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function PMDL_EXCHANGE_LOCATION({moduleKey, moduleData}: {moduleKey: string; moduleData: any}) {
	if (!moduleData) return null;
	const content = moduleData.content ?? moduleData;
	const locations = content?.properties?.locations?.list ?? [];
	if (!Array.isArray(locations) || locations.length === 0) return null;

	const [expanded, setExpanded] = useState<Record<number, boolean>>({});

	function toggle(idx: number) {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setExpanded(p => ({...p, [idx]: !p[idx]}));
	}

	return (
		<ModuleShell title={moduleData?.module_title ?? moduleKey}>
			{locations.map((entry: any, idx: number) => {
				const info = entry?.location_info?.properties ?? entry?.location_info ?? {};
				const storeName = info?.store_name?.desc ?? info?.store_name ?? '';
				const latlng = info?.latlng ?? null;
				const lat = latlng ? Number(latlng.latitude ?? latlng.lat) : null;
				const lng = latlng ? Number(latlng.longitude ?? latlng.lng) : null;
				const desc = latlng?.desc ?? info?.location_name?.desc ?? null;

				const stationList = entry?.station_list?.list ?? [];
				const firstStation = Array.isArray(stationList) && stationList.length > 0 ? stationList[0] : null;
				const photoPath = firstStation?.photo?.media?.[0]?.source_content ?? null;
				const photoUri = buildImageUrl(photoPath);
				const provideService = firstStation?.provide_service?.desc ?? null;
				const activeTimeList = firstStation?.active_time?.list ?? [];

				const isExpanded = Boolean(expanded[idx]);

				return (
					<View
						key={idx}
						style={{
							backgroundColor: '#fff',
							borderRadius: 10,
							padding: 0,
							marginBottom: 12,
							borderWidth: 1,
							borderColor: colors.grey100,
							overflow: 'hidden',
						}}>
						<TouchableOpacity
							activeOpacity={0.9}
							onPress={() => toggle(idx)}
							style={{
								paddingHorizontal: 16,
								paddingVertical: 14,
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between',
							}}>
							<View style={{flex: 1, paddingRight: 12}}>
								<View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 6}}>
									<View
										style={{
											backgroundColor: '#F8CFC8',
											paddingHorizontal: 10,
											paddingVertical: 4,
											borderRadius: 6,
											marginRight: 10,
										}}>
										<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
											{firstStation?.provide_service?.desc ?? '교환 가능'}
										</PretendardSemiBoldText>
									</View>
									<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
										{storeName}
									</PretendardSemiBoldText>
								</View>
								{desc ? (
									<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
										{desc}
									</PretendardSemiBoldText>
								) : null}
							</View>
							{/* <View style={{ marginLeft: 8 }}>
                <Icon name={isExpanded ? "icon-chevron-up" : "icon-chevron-down"} size={20} color={colors.grey500} />
              </View> */}
						</TouchableOpacity>

						{isExpanded ? (
							<View style={{paddingHorizontal: 16, paddingBottom: 16}}>
								<View style={{height: 1, backgroundColor: colors.grey100, marginBottom: 12}} />

								<View style={{flexDirection: 'row'}}>
									{photoUri ? (
										<Image
											source={{uri: photoUri}}
											style={{width: 92, height: 68, borderRadius: 8}}
											resizeMode='cover'
											onError={e =>
												console.warn(
													'[PMDL_EXCHANGE_LOCATION] photo load error:',
													photoUri,
													e.nativeEvent,
												)
											}
										/>
									) : (
										<View
											style={{
												width: 92,
												height: 68,
												borderRadius: 8,
												backgroundColor: colors.Black,
											}}
										/>
									)}

									<View style={{flex: 1, marginLeft: 12}}>
										<View
											style={{
												flexDirection: 'row',
												justifyContent: 'space-between',
												marginBottom: 12,
											}}>
											<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
												서비스 제공
											</PretendardSemiBoldText>
											<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
												{provideService ?? '-'}
											</PretendardSemiBoldText>
										</View>

										<View style={{height: 12}} />

										{Array.isArray(activeTimeList) && activeTimeList.length > 0 ? (
											<View style={{marginTop: 8}}>
												<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
													운영 시간
												</PretendardSemiBoldText>
												<View
													style={{
														borderWidth: 1,
														borderColor: colors.grey100,
														borderRadius: 8,
														overflow: 'hidden',
													}}>
													<View
														style={{
															flexDirection: 'row',
															backgroundColor: colors.Black,
															paddingVertical: 10,
														}}>
														<View style={{flex: 1, paddingLeft: 12}}>
															{' '}
															<PretendardSemiBoldText
																size={18}
																lineHeight={22}
																color={colors.Black}>
																주
															</PretendardSemiBoldText>
														</View>
														<View style={{width: 100, alignItems: 'center'}}>
															{' '}
															<PretendardSemiBoldText
																size={18}
																lineHeight={22}
																color={colors.Black}>
																운영시간
															</PretendardSemiBoldText>
														</View>
														<View style={{width: 100, alignItems: 'center'}}>
															{' '}
															<PretendardSemiBoldText
																size={18}
																lineHeight={22}
																color={colors.Black}>
																마감시간
															</PretendardSemiBoldText>
														</View>
														<View
															style={{width: 96, alignItems: 'center', paddingRight: 12}}>
															{' '}
															<PretendardSemiBoldText
																size={18}
																lineHeight={22}
																color={colors.Black}>
																운영 여부
															</PretendardSemiBoldText>
														</View>
													</View>

													{activeTimeList.map((row: any, rIdx: number) => (
														<View
															key={rIdx}
															style={{
																flexDirection: 'row',
																paddingVertical: 12,
																borderTopWidth: 1,
																borderTopColor: colors.grey100,
																alignItems: 'center',
															}}>
															<View style={{flex: 1, paddingLeft: 12}}>
																<PretendardSemiBoldText
																	size={18}
																	lineHeight={22}
																	color={colors.Black}>
																	{row?.week_title?.desc ?? ''}
																</PretendardSemiBoldText>
															</View>
															<View style={{width: 100, alignItems: 'center'}}>
																<PretendardSemiBoldText
																	size={18}
																	lineHeight={22}
																	color={colors.Black}>
																	{row?.start_time?.desc ?? '-'}
																</PretendardSemiBoldText>
															</View>
															<View style={{width: 100, alignItems: 'center'}}>
																<PretendardSemiBoldText
																	size={18}
																	lineHeight={22}
																	color={colors.Black}>
																	{row?.end_time?.desc ?? '-'}
																</PretendardSemiBoldText>
															</View>
															<View
																style={{
																	width: 96,
																	alignItems: 'center',
																	paddingRight: 12,
																}}>
																<PretendardSemiBoldText
																	size={18}
																	lineHeight={22}
																	color={colors.Black}>
																	{row?.close_desc?.desc ?? '-'}
																</PretendardSemiBoldText>
															</View>
														</View>
													))}
												</View>
											</View>
										) : null}
									</View>
								</View>

								{lat != null && lng != null ? (
									<View style={{marginTop: 12}}>
										<MapCard
											lat={lat}
											lng={lng}
											desc={desc}
											googleApiKey={GOOGLE_API_KEY}
											zoom={latlng?.zoom_lv ? Number(latlng.zoom_lv) : 16}
										/>
									</View>
								) : null}
							</View>
						) : null}
					</View>
				);
			})}
		</ModuleShell>
	);
}
