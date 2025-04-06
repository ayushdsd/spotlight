import Lottie from 'lottie-react';
import heroAnimation from '../../assets/heroanimation.json';

const HeroAnimation = () => {
  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden" style={{ height: '400px' }}>
      {/* Lottie Hero Animation */}
      <Lottie 
        animationData={heroAnimation} 
        loop={true} 
        autoplay={true} 
        className="w-full h-full object-contain"
        style={{ maxWidth: '100%', height: '100%' }} 
      />
    </div>
  );
};

export default HeroAnimation;
