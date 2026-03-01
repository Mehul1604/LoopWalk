import { useNavigate } from "react-router";
import imgLogo from "figma:asset/e6170f9cb188eb4718c90deb8d4b36d8fdbad1df.png";

export function IntroScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center max-w-[430px] mx-auto bg-white">
      {/* Logo */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-52 h-[248px] relative">
          <img 
            src={imgLogo} 
            alt="LoopWalk AI Logo" 
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          />
        </div>
      </div>

      {/* Get Started Button */}
      <div className="w-full px-[62.5px] pb-12">
        <button
          onClick={() => navigate("/start")}
          className="w-full h-[56px] rounded-full transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <p className="font-medium leading-[24px] text-[16px] text-center tracking-[-0.3125px]">
            Get Started
          </p>
        </button>
      </div>
    </div>
  );
}