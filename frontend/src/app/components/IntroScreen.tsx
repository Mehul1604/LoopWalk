import { useNavigate } from "react-router";
import imgLogo from "figma:assets/947465014baeb788efe6b3e117a74e8a3f3c16f5.png";

export function IntroScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center max-w-[430px] mx-auto bg-white">
      {/* Logo */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-52 h-[248px] relative flex flex-col items-center justify-center">
          <img 
            src={imgLogo} 
            alt="LoopWalk AI Logo" 
            className="w-32 h-auto object-contain pointer-events-none mx-auto"
          />
          <h1 className="text-2xl font-medium text-foreground mt-4">LoopWalk</h1>
        </div>
      </div>

      {/* Get Started Button */}
      <div className="w-full px-[62.5px] pb-12">
        <button
          onClick={() => navigate("/start")}
          className="w-full h-[56px] rounded-full transition-colors bg-gradient-to-r from-[#E4002B] to-[#FF6D6D] text-white hover:opacity-90 active:bg-[#E4002B] active:bg-none"
        >
          <p className="font-medium leading-[24px] text-[16px] text-center tracking-[-0.3125px]">
            Get Started
          </p>
        </button>
      </div>
    </div>
  );
}