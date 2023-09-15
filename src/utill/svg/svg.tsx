import styled from 'styled-components/native';
import Home from '../../../public/home.svg';
import Place from '../../../public/place.svg';
import Cancel from '../../../public/cancel.svg';
import Check from '../../../public/check.svg';
import Map from '../../../public/map.svg';
export const SvgHome = styled(Home)<{color: string; marginRight?: number}>`
	color: color;
	margin: 0px ${props => props.marginRight ?? 0}px 0px 0px;
`;
export const SvgPlace = styled(Place)<{color: string; marginRight?: number}>`
	color: color;
	margin: 0px ${props => props.marginRight ?? 0}px 0px 0px;
`;
export const SvgCancel = styled(Cancel)<{color: string}>`
	color: color;
`;
export const SvgCheck = styled(Check)<{color: string}>`
	color: color;
`;
export const SvgMap = styled(Map)<{color?: string}>`
	color: color;
`;
