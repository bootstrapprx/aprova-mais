"use client";

import { Dispatch, SetStateAction } from "react";

type BannerProps = {
  hide: boolean;
  setHide: Dispatch<SetStateAction<boolean>>;
};

const Banner = ({ hide, setHide }: BannerProps) => {
  if (hide) return null;

  return (
    <div>
      <button onClick={() => setHide(true)} className="hidden">
        hide
      </button>
    </div>
  );
};

export default Banner;
