import React from 'react';
import ModuleShell from './ModuleShell';
import {PretendardSemiBoldText} from '../../layout/layout';
import {colors} from '../../colors';
export default function PMDL_EXCHANGE_VALID({moduleKey, moduleData}: {moduleKey: string; moduleData: any}) {
	const content = moduleData?.content ?? moduleData;
	const props = content?.properties ?? {};
	return (
		<ModuleShell title={moduleData?.module_title ?? moduleKey}>
			<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
				{props?.exchange?.desc ?? ''}
			</PretendardSemiBoldText>
			{props?.exchange_description?.desc ? (
				<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
					{props.exchange_description.desc}
				</PretendardSemiBoldText>
			) : null}
			{props?.expired?.desc ? (
				<PretendardSemiBoldText size={18} lineHeight={22} color={colors.Black}>
					{props.expired.desc}
				</PretendardSemiBoldText>
			) : null}
		</ModuleShell>
	);
}
