// http://mycours.es/crc/00C90226
const DARK = "#03171B";
const MID_DARK = "#1D3742";
const MID_LIGHT = "#6D7F8D";
const LIGHT = "#D7DCE3";
const RED = "#AD343E";
const DARK_RED = "#7E262E";
const GREEN = "#94FBAB";

export const GAME_BG = DARK;
export const SPIRIT_FILL = LIGHT;
export const WALL_FILL_UNSELECTED = MID_LIGHT;
export const WALL_FILL_SELECTED = LIGHT;
export const GOAL_FILL = GREEN;
export const PUSHER_FILL = DARK_RED;
export const PUSHER_FILL_SELECTED = RED;
export const STATIC_WALL_FILL = MID_DARK;

export const SPIRIT = "spirit";
export const GROUND = "ground";
export const GOAL = "goal";
export const PUSHER = "pusher";

export const UP = "up";
export const DOWN = "down";
export const LEFT = "left";
export const RIGHT = "right";

export const LOOP_INTERVAL = 10;
export const OBJ_VELOCITY = 500; // units per second
export const OBJ_VELOCITY_ANGULAR = 20;
export const MAX_SPEED = 3;

/* Spirit */
export const GRAVITY_X = 0;
export const GRAVITY_Y = 0.2;
export const REGULAR_AIR_FRICTION = 0.025;
export const DENSITY_FREEZE = 0.00001;
export const DENSITY_UNFREEZE = 0.001;
