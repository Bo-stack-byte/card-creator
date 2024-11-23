import basic_red from './frames/basic-red.png';
import basic_blue from './frames/basic-blue.png';
import basic_yellow from './frames/basic-yellow.png';
import basic_green from './frames/basic-green.png';
import basic_purple from './frames/basic-purple.png';
import basic_black from './frames/basic-black.png';
import basic_white from './frames/basic-white.png';

import classic_red from './frames/classic-red.png';
import classic_blue from './frames/classic-blue.png';
import classic_yellow from './frames/classic-yellow.png';
import classic_green from './frames/classic-green.png';
import classic_purple from './frames/classic-purple.png';
import classic_black from './frames/classic-black.png';
import classic_white from './frames/classic-white.png';


import egg_red from './frames/egg-red.png';
import egg_blue from './frames/egg-blue.png';
import egg_yellow from './frames/egg-yellow.png';
import egg_green from './frames/egg-green.png';
import egg_purple from './frames/egg-purple.png';
import egg_black from './frames/egg-black.png';
import egg_white from './frames/egg-white.png';


import option_red from './frames/option-red.png';
import option_blue from './frames/option-blue.png';
import option_yellow from './frames/option-yellow.png';
import option_green from './frames/option-green.png';
import option_purple from './frames/option-purple.png';
import option_black from './frames/option-black.png';
import option_white from './frames/option-white.png';


import tamer_red from './frames/tamer-red1.png';
import tamer_blue from './frames/tamer-blue1.png';
import tamer_yellow from './frames/tamer-yellow1.png';
import tamer_green from './frames/tamer-green1.png';
import tamer_purple from './frames/tamer-purple1.png';
import tamer_black from './frames/tamer-black1.png';
import tamer_white from './frames/tamer-white1.png';


import evo_red from './frames/evo-red_out.png';
import evo_blue from './frames/evo-blue_out.png';
import evo_yellow from './frames/evo-yellow_out.png';
import evo_green from './frames/evo-green_out.png';
import evo_purple from './frames/evo-purple_out.png';
import evo_black from './frames/evo-black_out.png';
import evo_white from './frames/evo-white_out.png';



export const basics = {
  'red': basic_red,
  'blue': basic_blue,
  'yellow': basic_yellow,
  'green': basic_green,
  'purple': basic_purple,
  'black': basic_black,
  'white': basic_white,
}

export const classics = {
  'red': classic_red,
  'blue': classic_blue,
  'yellow': classic_yellow,
  'green': classic_green,
  'purple': classic_purple,
  'black': classic_black,
  'white': classic_white,
}


export const eggs = {
  'red': egg_red,
  'blue': egg_blue,
  'yellow': egg_yellow,
  'green': egg_green,
  'purple': egg_purple,
  'black': egg_black,
  'white': egg_white,
}

export const options = {
  'red': option_red,
  'blue': option_blue,
  'yellow': option_yellow,
  'green': option_green,
  'purple': option_purple,
  'black': option_black,
  'white': option_white,
}

export const tamers = {
  'red': tamer_red,
  'blue': tamer_blue,
  'yellow': tamer_yellow,
  'green': tamer_green,
  'purple': tamer_purple,
  'black': tamer_black,
  'white': tamer_white,
}


export const evos = {
  'red': evo_red,
  'blue': evo_blue,
  'yellow': evo_yellow,
  'green': evo_green,
  'purple': evo_purple,
  'black': evo_black,
  'white': evo_white,
}

export function colorReplace(str) {
  str = str.replaceAll(/Red/ig, "🔴");
  str = str.replaceAll(/Blue/ig, "🔵");
  str = str.replaceAll(/Yellow/ig, "🟡");
  str = str.replaceAll(/Green/ig, "🟢");
  str = str.replaceAll(/Purple/ig, "🟣");
  str = str.replaceAll(/Black/ig, "⚫"); // that's black, really
  str = str.replaceAll(/White/ig, "⚪");
  return str;
// ⬤  ⬤ 🔴 🔶 🟡
  
}
