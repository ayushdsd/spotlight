import spotlightLogo from "../../assets/SPOTLIGHT.png";

const LoginAnimation = () => {
  return (
    <div className="w-full max-w-[200px] mx-auto mb-10">
      <img 
        src={spotlightLogo} 
        alt="Spotlight"
        className="w-full h-auto"
        style={{ 
          filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.1))',
        }}
      />
    </div>
  );
};

export default LoginAnimation;
