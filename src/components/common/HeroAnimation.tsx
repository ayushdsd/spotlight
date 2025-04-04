import Lottie from 'lottie-react';
import heroAnimation from '../../assets/heroanimation.json';

const HeroAnimation = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Lottie Hero Animation */}
      <Lottie 
        animationData={heroAnimation} 
        loop={true} 
        autoplay={true} 
        className="w-full h-full"
        style={{ maxWidth: '100%', maxHeight: '100%' }} 
      />
    </div>
  );
};

export default HeroAnimation;
