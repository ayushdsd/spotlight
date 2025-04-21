import { FiHome, FiBriefcase, FiUser, FiMessageSquare, FiStar, FiClipboard, FiBarChart2, FiUsers, FiFileText, FiMail, FiBookOpen } from 'react-icons/fi';
import { MdOutlineWorkOutline, MdOutlineDashboard, MdOutlineSubscriptions, MdOutlineAnalytics, MdOutlinePalette, MdOutlineFeed } from 'react-icons/md';
import { TbMessages, TbClipboardList, TbBuilding } from 'react-icons/tb';

export const ArtistSidebarIcons = {
  Feed: <MdOutlineFeed className="text-2xl text-blue-500" />,
  Dashboard: <MdOutlineDashboard className="text-2xl text-indigo-500" />,
  Jobs: <MdOutlineWorkOutline className="text-2xl text-green-500" />,
  'My Applications': <TbClipboardList className="text-2xl text-yellow-500" />,
  Profile: <FiUser className="text-2xl text-pink-500" />,
  Portfolio: <MdOutlinePalette className="text-2xl text-purple-500" />,
  Messages: <TbMessages className="text-2xl text-cyan-500" />,
  Subscription: <MdOutlineSubscriptions className="text-2xl text-orange-500" />,
};

export const RecruiterSidebarIcons = {
  Feed: <MdOutlineFeed className="text-2xl text-blue-500" />,
  Dashboard: <MdOutlineDashboard className="text-2xl text-indigo-500" />,
  'Post Job': <MdOutlineWorkOutline className="text-2xl text-green-500" />,
  'My Listings': <TbClipboardList className="text-2xl text-yellow-500" />,
  Applicants: <FiUsers className="text-2xl text-pink-500" />,
  'Company Profile': <TbBuilding className="text-2xl text-purple-500" />,
  Messages: <TbMessages className="text-2xl text-cyan-500" />,
  Analytics: <MdOutlineAnalytics className="text-2xl text-orange-500" />,
};
