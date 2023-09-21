import styled from 'styled-components/native';
import Home from '../../../public/home.svg';
import Place from '../../../public/place.svg';
import Cancel from '../../../public/cancel.svg';
import Check from '../../../public/check.svg';
import Map from '../../../public/map.svg';
import Right from '../../../public/right.svg';
import AirPlain from '../../../public/airplain.svg';
import Calendar from '../../../public/calendar.svg';
import Community from '../../../public/community.svg';
import Profile from '../../../public/profile.svg';
import RightAdd from '../../../public/rightAdd.svg';
import Picture from '../../../public/picture.svg';
import MileStone from '../../../public/milestone.svg';
import Review from '../../../public/review.svg';
import Start from '../../../public/start.svg';
import Coffee from '../../../public/coffee.svg';
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
export const SvgRight = styled(Right)<{color?: string}>`
	color: color;
`;
export const SvgAirplain = styled(AirPlain)<{color?: string}>`
	color: color;
`;
export const SvgCalendar = styled(Calendar)<{color?: string}>`
	color: color;
`;
export const SvgCommunity = styled(Community)<{color?: string}>`
	color: color;
`;
export const SvgProfile = styled(Profile)<{color?: string}>`
	color: color;
`;
export const SvgRightAdd = styled(RightAdd)<{color?: string}>`
	color: color;
`;
export const SvgPicture = styled(Picture)<{color?: string}>`
	color: color;
`;
export const SvgMilestone = styled(MileStone)<{color?: string}>`
	color: color;
`;
export const SvgReview = styled(Review)<{color?: string}>`
	color: color;
`;
export const SvgStart = styled(Start)<{color?: string}>`
	color: color;
`;
export const SvgCoffee = styled(Coffee)<{color?: string}>`
	color: color;
`;
