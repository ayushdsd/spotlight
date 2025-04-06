import React from 'react';
import Lottie, { LottieComponentProps } from 'lottie-react';
import heroAnimation from '../../assets/heroanimation.json';

const HeroAnimation: React.FC = () => {
  const lottieProps: Partial<LottieComponentProps> = {
    animationData: heroAnimation,
    loop: true,
    autoplay: true,
    className: "w-full h-full object-cover",
    style: {
      maxWidth: '100%',
      maxHeight: '100vh',
      objectFit: 'cover',
      objectPosition: 'center'
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-blue-50 to-white">
      <div className="absolute inset-0 z-0">
        <Lottie {...lottieProps} />
      </div>
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] z-10" />
    </div>
  );
};

export default HeroAnimation;
