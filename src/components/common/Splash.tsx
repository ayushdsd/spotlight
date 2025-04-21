import { useEffect, useState } from 'react';
import spotlightLogo from '../../assets/SPOTLIGHT.png';

const Splash = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream-50">
      <div className="relative w-64">
        <img 
          src={spotlightLogo} 
          alt="Spotlight"
          className="w-full h-auto animate-fade-in"
          style={{ 
            filter: 'drop-shadow(0 0 24px #bae6fd)',
          }}
        />
        <div className="absolute inset-0 bg-blue-100/60 rounded-full animate-splash" />
      </div>
    </div>
  );
};

export default Splash;
