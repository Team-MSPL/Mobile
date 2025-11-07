import React from 'react';
import ModuleShell from './ModuleShell';
import HtmlRenderer from './HtmlRenderer';
import MediaGallery from './MediaGallery';
import {PretendardSemiBoldText} from '../../layout/layout';
import {colors} from '../../colors';
import {View} from 'react-native';

/**
 * GenericModule: use buildImageUrl indirectly by using MediaGallery which normalizes urls.
 * Keeps previous behaviors but uses the shared media component.
 */
export default function GenericModule({
	moduleKey,
	moduleData,
	googleApiKey,
	onOpenMedia,
}: {
	moduleKey: string;
	moduleData: any;
	googleApiKey?: string;
	onOpenMedia?: (url: string) => void;
}) {
	if (!moduleData) return null;
	const title = moduleData.module_title ?? moduleData.title ?? moduleKey;
	const content = moduleData.content ?? moduleData;
	if (!content) return null;

	if (moduleData?.use_html && content?.type === 'text' && content?.desc) {
		return (
			<ModuleShell title={title}>
				<HtmlRenderer html={String(content.desc)} />
			</ModuleShell>
		);
	}

	if (content?.type === 'text' && content?.desc) {
		return (
			<ModuleShell title={title}>
				<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
					{String(content.desc).replace(/<\/?[^>]+(>|$)/g, '')}
				</PretendardSemiBoldText>
			</ModuleShell>
		);
	}

	if (content?.media && Array.isArray(content.media) && content.media.length > 0) {
		return (
			<ModuleShell title={title}>
				<MediaGallery media={content.media} onOpen={onOpenMedia} />
			</ModuleShell>
		);
	}

	if (Array.isArray(content?.list) && content.list.length > 0) {
		return (
			<ModuleShell title={title}>
				{content.list.map((it: any, idx: number) => {
					const desc = it?.desc ?? '';
					const mediaArr = Array.isArray(it?.media) ? it.media : [];
					return (
						<View key={idx} style={{marginBottom: 12}}>
							{desc ? (
								<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
									{desc.replace(/<\/?[^>]+(>|$)/g, '')}
								</PretendardSemiBoldText>
							) : null}
							<MediaGallery media={mediaArr} onOpen={onOpenMedia} />
						</View>
					);
				})}
			</ModuleShell>
		);
	}

	if (content?.type === 'properties' && content?.properties) {
		return (
			<ModuleShell title={title}>
				{Object.entries(content.properties).map(([k, v]: any) => {
					if (!v) return null;
					if (v.type === 'text' && v.desc) {
						return (
							<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
								{String(v.desc).replace(/<\/?[^>]+(>|$)/g, '')}
							</PretendardSemiBoldText>
						);
					}
					if (v.type === 'list' && Array.isArray(v.list)) {
						return (
							<View key={k} style={{marginTop: 8}}>
								{v.title ? (
									<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
										{v.title}
									</PretendardSemiBoldText>
								) : null}
								{v.list.map((li: any, i: number) => (
									<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
										- {li?.desc ?? ''}
									</PretendardSemiBoldText>
								))}
							</View>
						);
					}
					if (v.type === 'content' && v.desc) {
						return v.use_html ? (
							<HtmlRenderer key={k} html={String(v.desc)} />
						) : (
							<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
								{String(v.desc).replace(/<\/?[^>]+(>|$)/g, '')}
							</PretendardSemiBoldText>
						);
					}
					return null;
				})}
			</ModuleShell>
		);
	}

	// fallback: nothing
	return null;
}
