import React from "react";
import titleImg from "../assets/LD Square.png";

export function TitleSlide() {
  return <img src={titleImg} alt="PlayBack Title" />;
}

export function Tutorial() {
  return (
    <div className="TutorialSlide">
      <div>It is a warm Wednesday night the summer after you turned ten.</div>
      <div>
        Searching for something to do at your grandparents' house, you stumble
        upon a dusty old TV with a VCR.
      </div>
      <div>Something about the VCR calls to you.</div>
      <div>
        Suddenly, a single pixel blinks onto the screen. "Save me" it says....
      </div>
      <div style={{ opacity: 0.3 }}>Press any key to continue.</div>
    </div>
  );
}

export const SLIDES = [Tutorial, TitleSlide];
