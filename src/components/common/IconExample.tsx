import { 
  HomeIcon, 
  UserIcon, 
  BriefcaseIcon, 
  ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/outline';
import { 
  RiSpotifyLine, 
  RiInstagramLine, 
  RiYoutubeLine 
} from 'react-icons/ri';

export default function IconExample() {
  return (
    <div className="p-8 space-y-8">
      {/* Heroicons (Minimalist) */}
      <div className="space-y-4">
        <h2 className="font-modern text-2xl font-semibold">Minimalist Icons (Heroicons)</h2>
        <div className="flex gap-4">
          <HomeIcon className="w-6 h-6 text-primary-600" />
          <UserIcon className="w-6 h-6 text-secondary-600" />
          <BriefcaseIcon className="w-6 h-6 text-accent-600" />
          <ChatBubbleLeftRightIcon className="w-6 h-6 text-dark-600" />
        </div>
      </div>

      {/* React Icons (Line style) */}
      <div className="space-y-4">
        <h2 className="font-minimal text-2xl font-semibold">Social Icons (React Icons)</h2>
        <div className="flex gap-4">
          <RiSpotifyLine className="w-6 h-6 text-primary-600" />
          <RiInstagramLine className="w-6 h-6 text-secondary-600" />
          <RiYoutubeLine className="w-6 h-6 text-accent-600" />
        </div>
      </div>

      {/* Font Examples */}
      <div className="space-y-4">
        <h2 className="font-display text-2xl">Font Examples</h2>
        <div className="space-y-2">
          <p className="font-sans text-lg">Plus Jakarta Sans (Original)</p>
          <p className="font-display text-lg">Playfair Display (Original)</p>
          <p className="font-modern text-lg">Space Grotesk (New Modern)</p>
          <p className="font-minimal text-lg">DM Sans (New Minimal)</p>
        </div>
      </div>
    </div>
  );
}
