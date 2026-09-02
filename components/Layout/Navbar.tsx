import { FC } from "react";

export const Navbar: FC = () => {
  return (
    <header className="flex h-[60px] flex-shrink-0 items-center border-b border-[#EBE7E0] bg-[#FBF9F6] px-4 sm:px-8">
      
      <div className="flex items-center gap-3">
        
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#607264] text-sm font-semibold tracking-widest text-white shadow-sm">
          AP
        </div>

        <span
          className="text-xl text-[#2D2A26]"
          style={{
            fontFamily: "'Playfair Display', serif"
          }}
        >
          Alighned Path
        </span>

      </div>

    </header>
  );
};
