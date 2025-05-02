import { FiUser, FiUsers } from 'react-icons/fi';
import { MdOutlineWorkOutline, MdOutlineDashboard, MdOutlineSubscriptions, MdOutlineAnalytics, MdOutlinePalette, MdOutlineFeed } from 'react-icons/md';
import { TbMessages, TbClipboardList, TbBuilding } from 'react-icons/tb';

export const ArtistSidebarIcons = {
  Feed: <MdOutlineFeed className="text-2xl text-black" />,
  Dashboard: <MdOutlineDashboard className="text-2xl text-black" />,
  Jobs: <MdOutlineWorkOutline className="text-2xl text-black" />,
  'My Applications': <TbClipboardList className="text-2xl text-black" />,
  Profile: <FiUser className="text-2xl text-black" />,
  Portfolio: <MdOutlinePalette className="text-2xl text-black" />,
  Messages: <TbMessages className="text-2xl text-black" />,
  Subscription: <MdOutlineSubscriptions className="text-2xl text-black" />,
};

export const RecruiterSidebarIcons = {
  Feed: <MdOutlineFeed className="text-2xl text-black" />,
  Dashboard: <MdOutlineDashboard className="text-2xl text-black" />,
  'Post Job': <MdOutlineWorkOutline className="text-2xl text-black" />,
  'My Listings': <TbClipboardList className="text-2xl text-black" />,
  Applicants: <FiUsers className="text-2xl text-black" />,
  'Company Profile': <TbBuilding className="text-2xl text-black" />,
  Messages: <TbMessages className="text-2xl text-black" />,
  Analytics: <MdOutlineAnalytics className="text-2xl text-black" />,
};
