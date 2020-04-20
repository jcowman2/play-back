import React from "react";
import titleImg from "../assets/LD Square.png";

export function TitleSlide() {
  return <img src={titleImg} alt="PlayBack Title" />;
}

export function IntroSlide() {
  return (
    <div className="TutorialSlide">
      <div>It is a warm Wednesday night the summer after you turned ten.</div>
      <div>
        Searching for something to do at your grandparents' house, you stumble
        upon a dusty old TV with a VCR.
      </div>
      <div>Something about the VCR calls to you.</div>
      <div>
        Suddenly, a tiny orb blinks onto the screen. "Save me" it says....
      </div>
      <div style={{ opacity: 0.3 }}>Press any key to continue.</div>
    </div>
  );
}

export function EndSlide(props) {
  const { totalRetries } = props;
  return (
    <div className="TutorialSlide">
      <div>
        As you roll the orb into the last goal, the VHS sputters out. For the
        last time, you guess.
      </div>
      <div>From far away, you hear a quiet voice: "My thanks"</div>
      {/* <div>Total Retries: {totalRetries}</div> */}
      <div style={{ opacity: 0.6 }}>
        {
          "Thank you for playing Play<<Back! This game was created in 48 hours for Ludum Dare 46. If you have any feedback, go to github.com/jcowman2/play-back"
        }
      </div>
      <div style={{ opacity: 0.6, textAlign: "right" }}>-Joe</div>
    </div>
  );
}

export const SLIDES = [TitleSlide, IntroSlide];
