import imgAppleWatchSeries1046Mm1 from "figma:asset/e6170f9cb188eb4718c90deb8d4b36d8fdbad1df.png";

function Button() {
  return (
    <div className="absolute bg-[#369] h-[56px] left-[62.5px] rounded-[3.4028234663852886e+38px] top-[516px] w-[304px]" data-name="button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[152px] not-italic text-[16px] text-center text-white top-[16px] tracking-[-0.3125px]">Get Started</p>
    </div>
  );
}

function Div() {
  return (
    <div className="bg-white h-[945px] relative shrink-0 w-full" data-name="div">
      <div className="absolute h-[248px] left-[111px] top-[296.5px] w-[208px]" data-name="Apple Watch Series 10 46mm  1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgAppleWatchSeries1046Mm1} />
      </div>
      <Button />
    </div>
  );
}

export default function LoopWalkFinalProject() {
  return (
    <div className="bg-[#daf7dc] content-stretch flex flex-col items-start px-[421.5px] relative size-full" data-name="LoopWalk Final Project">
      <Div />
    </div>
  );
}