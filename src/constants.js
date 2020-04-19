// http://mycours.es/crc/00C90226
const DARK = "#03171B";
const MID_DARK = "#1D3742";
const MID_LIGHT = "#6D7F8D";
const LIGHT = "#D7DCE3";
const RED = "#AD343E";
const GREEN = "#94FBAB";

export const GAME_BG = DARK;
export const SPIRIT_FILL = LIGHT;
export const WALL_FILL_UNSELECTED = MID_LIGHT;
export const WALL_FILL_SELECTED = LIGHT;
export const GOAL_FILL = GREEN;

export const UP = "up";
export const DOWN = "down";
export const LEFT = "left";
export const RIGHT = "right";

export const LOOP_INTERVAL = 10;
export const OBJ_VELOCITY = 1000; // units per second
export const OBJ_VELOCITY_ANGULAR = 75;

/* Spirit */
export const GRAVITY_X = 0;
export const GRAVITY_Y = 0.2;
export const REGULAR_AIR_FRICTION = 0.025;
export const DENSITY_FREEZE = 0.00001;
export const DENSITY_UNFREEZE = 0.001;
