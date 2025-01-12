import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { eggs, basics, options, tamers, colorReplace } from './images';
import {
  mon_background, mega_background, egg_background, option_background, tamer_background,
  ace_backgrounds,
  outlines, outlines_egg, outlines_tamer, outline_option,

  cost, cost_egg, cost_option, cost_evo, costs,
  ace_logo, foil, linkdp,
  new_evo_circles, /* new_evo2_circles, */
  new_evo_wedges,
  bottoms, bottoms_plain, borders, effectboxes,

  // inherits at bottom:
  bottom_evos, bottom_egg_evos,
  bottom_aces, inherited_security,
  bottom_property_white, bottom_property_black

} from './images';

import { enterPlainText, custom_1, custom_2, custom_3, custom_4, custom_5 } from './plaintext';
import { fitTextToWidth, drawBracketedText, writeRuleText, center } from './text';
import banner from './banner.png';
import egg from './egg.png';
import placeholder from './placeholder.png';
import shieldsmasher from './shieldsmasher.png';
import rampager from './rampager.png';
import featherbackground from './feather-background.png';
import featherling from './featherling.png';

import doublebind from './double-bind.png'
import amy from './amy.png';
import armor_cat from './armorcat.png';
//import './styles.css';
import './local-styles.css';

import { restoreState, SaveState } from './SaveState';
import RadioGroup from './RadioGroup';
import { Base64 } from 'js-base64';
import pako from 'pako';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const version = "0.7.3.1"; 
const latest = "link monster stuff, fix evo wedges"

// version 0.7.3.x  link monster, BETA, fix evo wedges
// version 0.7.2    generate multiple images in a row, BETA, try using a JSON array to see how
// version 0.7.1    have both diamond text and blue brackets at same time
// version 0.7.0    free form parsing becoming more formal, and more crash bugs fixed
// version 0.6.27   fix some slices not drawing; fix some bracketed text not appearing in blue
// version 0.6.26.x make ACE ESS transparent; make egg ESS transparent again
// version 0.6.25.x fix white inherit boxes; effect box improvements; black (white) attribute bar improvements
// version 0.6.24 fix offsets for black bar on eggs; not quite pixel perfect
// version 0.6.23 text inside <tags> isn't broken up; [brackets] at start of line are blue again; digixros multiline; egg logo on eggs
// version 0.6.22 spacing around blue keyword boxes; get rid of right-hand image overflowing by 20 pixels; force missing fields into JSON
// version 0.6.21 optioninherit made, and tamerinherit improved
// version 0.6.20 fix evo circle not loading bug; improve freeform parsing 
// version 0.6.19 black outline on colored text; improved bubble; when digivolviong; overflow number in text; fix restore of old cards
// version 0.6.18 ace frames and alignment fixed
// version 0.6.17 fontsize in JSON
// version 0.6.16 disabling scaling, neue warning
// version 0.6.15 HelveticaNeue instead of AyarKasone for costs
// version 0.6.14 DP number width
// version 0.6.13 put image data into blob
// version 0.6.12 digixros + rule text non-overlap
// verison 0.6.11 more obvious multi-level select; fix helvetica font as backup
// version 0.6.10 hide outline, ace frame
// version 0.6.9  foil frame, ess image
// version 0.6.8  no digi on eggs; offset name on trait-less option/tamer; AyarKasone back for evo; blue keywords a better blue
// version 0.6.7  skinny up two-digit DP number; specialOffset tuneable; rounded corners
// version 0.6.6  try to pixel match both ex2-039 and bt14-014; customize effect height; scale effectbox (but not for options)
// version 0.6.5  fix pixels of effect text and DP and other things to be near-pixel-perfect
// version 0.6.4  massive font upgrade: name, effect/keywords, traits, level all identical to print cards now
// version 0.6.3  fix width on bubble and DNA and multi-line; DNA now uses proper colored box"
// version 0.6.2  handle 'digivolve' as well as 'evolve'; helvetica as backup font; straggling pixels fixed; playcost and evocost offsets broken and then fixed
// version 0.6.1  rainbow colors; zoom; better baseline; proper font on cost; fix shift on play cost when evo
// version 0.6.0  undo; new format; disable classic mode; freeform auto parsed
// version 0.5.10 save cards with versions, color wheels on ESS effects-side
// version 0.5.9  save cards server-side
// version 0.5.8  black/white bar at bottom of name block if any trait
// version 0.5.7  bubble text italicized and rounded and compressed to fit (but also for keywords); rule text now working
// version 0.5.6  rule text box
// version 0.5.5  proper ESS symbols for options and inherit-less tamers; font updates; 'security' defaults to blue use [(security)] for magenta
// version 0.5.4  pie wedges for evo; adjustable font; squeeze text horizontally beyond some threshold                            
// version 0.5.3  aces
// version 0.5.2  megas done, freeform input                                                                                      
// version 0.5.1  Prototype for new modern cards; old functionality may still be around but not tested
// version 0.5.0  Updated many small and some big things that weren't looking right; moving towards modern
// version 0.4.9  "Save image locally" was broken
// version 0.4.8  fix "force clear"
// version 0.4.7  line feeds, more permissive of blue block text
// version 0.4.6  updated link, force draw
// version 0.4.5  3+ colors and others
// version 0.4.4  less errors, fix egg text
// version 0.4.3  multi color, egg.
// version 0.4.2. Better error handling, re-orient custom image

function empty(s) {
  if (!s) return true;
  if (s.length < 2) return true;
  if (s === "-") return true;
  return false;
}

// handles empty imageOptions object, or incomplete one
function initObject(target, reference) {
  if (!target) return ({ ...reference });
  for (const key in reference) {
    if (!target.hasOwnProperty(key)) {
      target[key] = reference[key];
    }
  }
  return target;
}

function effectBoxScale(source_height, offset) {
  let y_scale = (source_height + Number(offset) - 30) / (source_height)
  return y_scale;
}


// stringroundremoved, dec 17


/*  // Draw an evo circle instead of loading an image

function colorMap(color) {
  switch (color.toLowerCase()) {
    case "blue": return "#5C8FC7";
    case "green": return "#459A70";
    case "purple": return "#58569d"
    default: return color;
  }
}
function coloredCircle(canvas, centerX, centerY, color) {
  try {
    const ctx = canvas.getContext('2d');
    setupRoundedCorners(ctx, canvas.width, canvas.height, 15);
    const radius = 140;
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    // Add color stops to the gradient
    gradient.addColorStop(0, 'white');  // Center of the circle
    gradient.addColorStop(0.6, colorMap(color));    // Edge of the circle
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
  } catch (e) {
  }
}*/

function borderColor(colors) {
  for (let color of colors) {
    if (color === "white" || color === "yellow") return "black";
  }
  return "";
}

// returns [fillColor, edgeColor, boolean if we need edge]
// color should be lowercase array before we get here
function textColor(colors) {
  let border = (colors.includes("white") || colors.includes("yellow"));
  let fillColor = 'white';
  let strokeColor = 'black';
  if (colors.length === 1 && (colors[0] === 'yellow' || colors[0] === 'white')) {
    fillColor = 'black';
    strokeColor = 'white';
    border = false; // may not draw border at all
  }
  return [fillColor, strokeColor, border];
}

/*function edgeColor(color) {
  if (["red", "blue", "green", "purple", "black", "all"].includes(color.toLowerCase())) return "black";
  return "white";
}*/

function contrastColor(color) {
  if (["red", "blue", "green", "purple", "black", "all"].includes(color)) return "white";
  return "black";
}
// draw in white text on the black stripe -- unless we're a black card with a white stripe, in which case draw black
function whiteColor(color) {
  if (color?.toLowerCase() === "black") return "black";
  return "white";
}

const hasLevel = (type) => {
  return (type === "EGG" || type === "MONSTER" || type === "MEGA" || type === "ACE" || type === "LINK");
}
const levelHeight = (type) => {
  if (type === "EGG") return - 110;
  if (type === "MEGA" || type === "LINK") return 500;
  return 0;
}
const hasEvo = (type) => {
  return (type === "MONSTER" || type === "MEGA" || type === "ACE" ||
    type === "TAMER" || type === "TAMERINHERIT" || type === "LINK");    
}
const hasDP = (type) => {
  return (type === "MONSTER" || type === "MEGA" || type === "ACE" || type === "LINK");
}


// not using radius
const setupRoundedCorners = (ctx, width, height, radius) => {
  radius = 200;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(width - radius, 0);
  ctx.quadraticCurveTo(width, 0, width, radius);
  ctx.lineTo(width, height - radius);
  ctx.quadraticCurveTo(width, height, width - radius, height);
  ctx.lineTo(radius, height);
  ctx.quadraticCurveTo(0, height, 0, height - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.clip();
};

const starter_text_empty = `{
    "name": {  "english": "Tama"  },
    "color": "Red",
    "cardType": "Digi-Egg",
    "playCost": "-",
    "cardLv": "Lv.2",
    "cardNumber": "",
    "dp": "-",
    "effect": "-",
    "form": "In-Training",
    "attribute": "",
    "type": "",
    "rarity": "C",
    "specialEvolve": "-",
    "securityEffect": "-",
    "rule": "",
    "digiXros": "",
    "dnaEvolve": "-",
    "burstEvolve": "-",
    "evolveEffect": "-", 
    "rule": "",
    "cardNumber": "X-01",
    "imageOptions":{
      "url": "", "x_pos": 0, "y_pos": 0, "x_scale": 95, "y_scale": 95,
      "ess_x_pos": 40, "ess_y_pos": 40, "ess_x_end": 50, "ess_y_end": 50,
      "fontSize": 90.5,
      "foregroundImage": 0
    }
  }`;

const starter_text_0 = `  {
    "name": {  "english": "Doggie Dagger"  },
    "color": "Green",
    "cardType": "Digi-Egg",
    "cardLv": "Lv.2",
    "cardNumber": "CS2-01",
    "dp": "-",
    "effect": "-",
    "playCost": "-",
    "form": "In-Training",
    "attribute": "Data",
    "type": "Sword",
    "rarity": "C",
    "evolveCondition": [],
    "evolveEffect": "[Your Turn] While you have a red Monster or Tamer in play, all your Monsters gain +1000 DP.",
    "cardNumber": "CS-01",
    "imageOptions":{
      "url": "", "x_pos": 0, "y_pos": 0, "x_scale": 95, "y_scale": 95,
      "ess_x_pos": 40, "ess_y_pos": 40, "ess_x_end": 50, "ess_y_end": 50,
      "fontSize": 90.5
    }
}`;

const starter_text_1 = `
     ʟᴠ.4 — Armored Cat — CS1-18
[Champion | Data | Shield] [Yel.]
Play cost: 6 | Evolution: 3 from Lv.3 [Yel.]
     6000 DP

＜Armor Purge＞
     · Inherited Effect:
`

const starter_text_1a = `  {
    "name": {  "english": "Shield Smasher"  },
    "color": "Blue/Red",
    "cardType": "Digimon",
    "playCost": "12",
    "dp": "9000",
    "cardLv": "Lv.6",
    "form": "Ultimate",
    "attribute": "Data",
    "type": "Sword",
    "evolveCondition": 
      [{ "color": "Blue/Red", "cost": "4", "level": "5" }],
    "effect": "＜Vortex＞ \uff1cSecurity Attack +1\uff1e [Your Turn] When this monster attacks a Monster with [Shield] in its name, this Monster gets +5000 DP until the end of your opponent's turn.\\n[(Security)] [All Turns] Your Monsters get +1000 DP.",
    "evolveEffect": "-",
    "securityEffect": "-",
    "specialEvolve": "-",
    "digiXros": "[DigiXros -3] [Axe Raider] x [Pikachu]",
    "dnaEvolve": "-",
    "burstEvolve": "-",
    "rarity": "Rare",
    "rule": "[Rule] Trait: Has the [Virus] attribute",
    "cardNumber": "CS2-11",
    "imageOptions":{
      "url": "", "x_pos": 0, "y_pos": 0, "x_scale": 95, "y_scale": 95,
      "ess_x_pos": 40, "ess_y_pos": 40, "ess_x_end": 50, "ess_y_end": 50,
      "fontSize": 90.5
    }
  }`;

const starter_text_1b = `  {
    "name": {  "english": "Rampager"  },
    "color": "Yellow/Blue",
    "cardType": "Monster",
    "playCost": "14",
    "dp": "14000",
    "cardLv": "Lv.7",
    "securityEffect": "-",
    "form": "Ultimate",
    "attribute": "Virus",
    "type": "Sword/Shield",
    "evolveCondition": 
      [{ "color": "Yellow", "cost": "5", "level": "6" },
       { "color": "Blue", "cost": "5", "level": "6" },
       { "color": "Green", "cost": "5", "level": "6" } ],
    "specialEvolve": "-",
    "effect": "\uff1cBlast DNA Digivolve (Colossal Sword + Onyx Shield)\uff1e\\n＜Resurrect＞ ＜Piercing＞ \\n [When Thinking] Delete all of your opponent's Monsters with the biggest level. Then delete all of your opponent's Monsters with the smallest DP.",
    "evolveEffect": "-",
    "dnaEvolve": "[DNA Digivolve] Yellow Lv.6 + Blue Lv.6\u00a0: Cost 0",
    "digiXros": "-",
    "aceEffect": "Overflow \uff1c-5\uff1e (As this card would move from the field or from under a card to another area, lose 4 memory.)",
    "burstEvolve": "-",
    "rarity": "Secret Rare",
    "rule": "",
    "cardNumber": "CS2-18",
    "imageOptions":{
      "url": "", "x_pos": 0, "y_pos": 0, "x_scale": 95, "y_scale": 95,
      "ess_x_pos": 40, "ess_y_pos": 40, "ess_x_end": 50, "ess_y_end": 50,
      "fontSize": 90.5
    }
  }`;

const starter_text_1c = `{
  "name": {
    "english": "FairyFeatherlink"
  },
  "aceEffect": "-",
  "attribute": "Bird",
  "block": [
    "01"
  ],
  "burstEvolve": "-",
  "cardLv": "Lv.3",
  "cardNumber": "CS3-02",
  "cardType": "Monster",
  "color": "Green",
  "digiXros": "-",
  "evolveCondition": [
    {
      "color": "Green",
      "cost": "0",
      "level": "2"
    }
  ],
  "evolveEffect": "[Link][Bird] rait: Cost 1",
  "dnaEvolve": "-",
  "dp": "2000",
  "effect": "-",
  "form": "Rookie",
  "id": "CS3-02",
  "link": "[Link]: [Bird] trait: Cost 1",
  "linkdp": "1500",
  "linkeffect": "＜Dodge＞ (When this Monster would be deleted, you may\\nsuspend it to prevent that deletion.)",
  "playCost": "3",
  "rarity": "Special",
  "securityEffect": "-",
  "specialEvolve": "-",
  "type": "Spellcaster",
  "version": "Normal",
  "imageOptions": {
    "url": "",
    "x_pos": "9",
    "y_pos": "-16",
    "x_scale": "84",
    "y_scale": "84",
    "ess_x_pos": "12",
    "ess_y_pos": "24",
    "ess_x_end": 50,
    "ess_y_end": 50,
    "fontSize": 90.5,
    "foregroundImage": "1"
  },
  "rule": "",
  "author": "",
  "artist": ""
}`;

const starter_text_2 = `  {
  "name": {      "english": "Double Bind"    },
  "color": "Yellow/Green",
  "cardType": "Option",
  "playCost": "7",
  "attribute": "Rock",
  "effect": "[Main] Suspend 2 of your opponent's Monsters. Then, return 1 of your opponent's suspended Monster to its owner's hand.",
  "securityEffect": "[Security] Activate this card's [Main] effect.",
  "rarity": "Rare",
  "evolveEffect": "-",
  "digiXros": "-",
  "rarity": "Secret Rare",
  "rule": "",
  "cardNumber": "CS1-13",
    "imageOptions":{
      "url": "", "x_pos": 0, "y_pos": 0, "x_scale": 95, "y_scale": 95,
      "ess_x_pos": 40, "ess_y_pos": 40, "ess_x_end": 50, "ess_y_end": 50,
      "fontSize": 90.5
    }
  }`;

const starter_text_3 = `   {
    "name": {   "english": "Aggressive Amy"   },
    "color": "Blue/Red",
    "cardType": "Tamer",
    "playCost": "3",
    "type": "Data",
    "effect": "[Start of Your Main Phase] If you have a monster, gain 1 memory.\\n[Main] By suspending this Tamer, until the end of your opponent's turn, 1 of your opponent's Monsters gains \\"[Start of Your Main Phase] Attack with this Monster\\".",
    "securityEffect": "[Security] Play this card without paying the cost.",
    "evolveEffect": "-",
    "digiXros": "-",
    "rarity": "Secret Rare",
    "rule": "",
    "cardNumber": "CS2-17",
    "imageOptions":{
      "url": "", "x_pos": 0, "y_pos": 0, "x_scale": 95, "y_scale": 95,
      "ess_x_pos": 40, "ess_y_pos": 40, "ess_x_end": 50, "ess_y_end": 50,
      "fontSize": 90.5
    }
    }`;

const starter_text = starter_text_empty;


// deprecated from our old "share" functionality, that put the entire JSON blob into the URL compressed+encoded 
const decodeAndDecompress = (encodedString) => {
  try {
    const decoded = Base64.toUint8Array(encodedString);
    const decompressed = pako.inflate(decoded, { to: 'string' });
    return decompressed;
  } catch {
    return "";
  }
  //  return JSON.parse(decompressed);
};

/*  
  // obsolete to create share links
  const getShare = () => {
    console.log("jsonText", jsonText);
    const compressed = pako.deflate(jsonText);
    const encoded = Base64.fromUint8Array(compressed, true); // URL-safe
    console.log("encoded", encoded);
    const here = new URL(window.location.href);
    const baseUrl = here.origin + here.pathname;
 
    let url = baseUrl + "?share=" + encoded;
    setShareURL(url);
    navigator && navigator.clipboard && navigator.clipboard.writeText(url) && alert("URL copied to clipboard");
  }*/

// show i of len piece, scaled by scale, start at x,y
function scalePartialImage(ctx, img, _i, _len, scale, start_x, start_y, crop_top = 0, y_scale = 1) {

  let len = 1;
  let i = 0;

  // stupid to hardcode tihis
  let width = 2977;
  let height = 4158 - 17;
  let i_width = width / _len;

  if (!img) return;


  ctx.save(); // Save the current state
  ctx.beginPath();
  //console.log(405, "clipping to ", i_width * _i, 0, i_width * (_i + 1), height);
  ctx.rect(i_width * _i, 0, i_width * (_i + 1), height);
  ctx.clip();

  i -= 0.0
  let y = scale; let x = y * (img.width / img.height);
  let fw = x / len; // smaller frame length here
  let ww = img.width / len;
  let top = 0; let bottom = 0;
  if (crop_top > 0) top = crop_top;
  if (crop_top < 0) bottom = crop_top;


  try {
    ctx.drawImage(img,
      i * ww, top, // crop x,y
      ww * 1.0, img.height + bottom, // crop w,h
      start_x + i * fw, start_y, // place x,y
      x / len, y * y_scale// place w,h
    );
  } catch (e) {
    console.log(426, "couldn't draw partial " + _i);
  }



  ctx.restore(); // Restore the previous state

}



function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}





function CustomCreator() {
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    console.error("FIRST TIME");
    const params = new URLSearchParams(window.location.search);
    let ref = params.get("ref");
    let vid = params.get("v");
    if (ref) myRestoreState(ref, vid);

    // first time init
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  const myRestoreState = async (ref, id) => {
    try {
      let cardState = await restoreState(ref, id);
      console.log(320, cardState);
      if (!cardState) return;
      let jsonText = "";
      let jsonObject = undefined;
      if ("jsonText" in cardState) {
        jsonText = cardState.jsonText;
        jsonObject = JSON.parse(jsonText);
      }
      console.log(415, jsonText, jsonObject);

      jsonObject.imageOptions = initObject(jsonObject.imageOptions, initImageOptions);


      if ("fontSize" in cardState) {
        jsonObject.imageOptions.fontSize = cardState.fontSize;
        console.log(418, jsonText, jsonObject);
      }
      // handle all other new options here before getting text back


      jsonText = JSON.stringify(jsonObject, null, 2);
      console.log(422, jsonText);
      updateJson(jsonText); // this must be first

      if ("drawFrame" in cardState) setDrawFrame(cardState.drawFrame);
      if ("effectBox" in cardState) setEffectBox(cardState.effectBox);
      if ("baselineOffset" in cardState) setBaselineOffset(cardState.baselineOffset);
      if ("specialOffset" in cardState) setSpecialOffset(cardState.specialOffset);
      if ("lineSpacing" in cardState) setLineSpacing(cardState.lineSpacing);
    } catch (e) {
      console.error("restore error: " + e);
    }
  };


  const params = new URLSearchParams(window.location.search);
  let share = params.get("share");
  let ref = params.get("ref");
  let start = share ? decodeAndDecompress(share) : "";
  start ||= starter_text;
  const canvasRef = useRef(null);
  const [backImg, setBackImg] = useState(null);
  const [userImg, setUserImg] = useState(null);
  const [doDraw, setDoDraw] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [jsonText, setJsonText] = useState([start]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jsonIndex, setJsonIndex] = useState(0);
  const [effectBox, setEffectBox] = useState(false);
  const [drawFrame, setDrawFrame] = useState(true);
  const [aceFrame, setAceFrame] = useState(true);
  const [drawOutline, setDrawOutline] = useState(true);
  const [skipDraw, setSkipDraw] = useState(false);
  const [addFoil, setAddFoil] = useState(false);
  /*
    const [isSelecting, setIsSelecting] = useState(false);
  
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [endX, setEndX] = useState(0);
    const [endY, setEndY] = useState(0);
  */
  const [baselineOffset, setBaselineOffset] = useState(0);
  const [specialOffset, setSpecialOffset] = useState(0);
  const [lineSpacing, setLineSpacing] = useState(10);
  const [selectedOption, setSelectedOption] = useState('AUTO'); // radio buttons 

  const initImageOptions = useMemo(() => {
    return {
      url: "", x_pos: 0, y_pos: 0, x_scale: 95, y_scale: 95,
      ess_x_pos: 40, ess_y_pos: 40, ess_x_end: 50, ess_y_end: 50,
      fontSize: 90.5,
      foregroundImage: 0
    };
  }, []);

  let imageOptions = "";
  try {
    let json = JSON.parse(jsonText);
    imageOptions = json.imageOptions;
  } catch { }
  imageOptions = initObject(imageOptions, initImageOptions);


  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  let _canvas = canvasRef.current;
  let neue = true;
  if (_canvas) {
    let correct = 1714;
    let _ctx = _canvas.getContext("2d");
    _ctx.font = `275px HelveticaNeue-CondensedBold`;
    let fontwidth = Math.round(_ctx.measureText("AAAaaa423434i").width);
    neue = (fontwidth === correct);
  }

  const customs = [
    custom_1,
    custom_2, custom_3, custom_4,
    custom_5
  ];
  const custom_starter = `# This is a sample custom text taken from the customs channel.
# Start typing to watch it update.
# (Undo and updates to the other forms won't propagate here.)

` + customs[Math.floor(Math.random() * (customs.length - 0))];
  // if a shared card, default to the fields list
  const [showJson, setShowJson] = useState(ref ? 0 : 2);
  const [formData, setFormData] = useState({}); // redundant
  // const [shareURL, setShareURL] = useState("");
  const [freeform, setFreeForm] = useState(custom_starter);


  const flattenJson = (obj, parentKey = '', result = {}) => {
    for (let key in obj) {
      const propName = parentKey ? `${parentKey}.${key}` : key;
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        flattenJson(obj[key], propName, result);
      } else if (Array.isArray(obj[key])) {
        for (let element in obj[key]) {
          flattenJson(obj[key][element], `${propName}.${element}`, result);
          //          result[`${propName}.${element}`] = JSON.stringify(obj[key][element]); // Convert arrays to string for display
        }
        //        result[propName] = JSON.stringify(obj[key]); // Convert arrays to string for display
      } else {
        result[propName] = obj[key];
      }
    }
    return result;
  };


  const jsonToFields = (text) => {

    let imageOptions = "";
    console.log(6871, text);
    let json;
    try {
      json = JSON.parse(text);
      console.log(687, "first parse", json);
      imageOptions = json.imageOptions;
    } catch { 
      return; // no json to parse, don't populate fields...
      // what if array?
    }
    imageOptions = initObject(imageOptions, initImageOptions);
    console.log(6872, "img object", JSON.stringify(imageOptions));
    console.log(687, "pre-json", JSON.stringify(json));
    json.imageOptions = {...imageOptions };
    console.log(687, "postjson", JSON.stringify(json));
    try {
      let temp_parsedJson = json; // JSON.parse(text);
      if (Array.isArray(temp_parsedJson)) {
        // if an array of objects, only show the first in text fields
        parsedJson = temp_parsedJson[0];
      } else {
        parsedJson = temp_parsedJson;
      }
      console.log(6873, parsedJson);
      //
     // if (!parsedJson.imageOptions) parsedJson.imageOptions = imageOptions;
     // parsedJson.imageOptions = initObject(parsedJson.imageOptioons, initImageOptions);
      flattenedJson = flattenJson(parsedJson);

      console.log(445, flattenedJson);
    } catch (e) {
      jsonerror = e;
      console.error("json error");
      return;
    }
    Object.entries(flattenedJson).forEach(([key, value]) => {
      formData[key] = value;
    }
    )
  }

  let jsonerror = "none";

  // any missing fields are added
  const addAllFields = (json) => {
    if (!("name" in json)) {
      json.name = {};
    }
    for (let field of ["color", "cardType", "playCost",
      "dp", "cardLv", "form", "attribute", "type", "rarity",
      "linkdp",
      "specialEvolve", "effect", "evolveEffect", "securityEffect",
      "rule", "digiXros", "burstEvolve", "cardNumber",
      "author", "artist"]) {
      if (!(field in json)) {
        console.log("Missing field added " + field);
        json[field] = "";
      }
    }
    if (!("evolveCondition" in json)) {
      json.evolveCondition = [];
    }

    if (!("english" in json.name)) {
      json.name.english = "Mon";
    }
    //console.log(681, json);
    if (json.evolveCondition.length === 0) {
      json.evolveCondition.push({ color: "", cost: "", level: "" });
    }
    imageOptions = initObject(imageOptions, initImageOptions);
    json.imageOptions = imageOptions;
    return json;
  }

  const updateJson = (text) => {

    let json;
    try {
      json = JSON.parse(text);
      imageOptions = json.imageOptions;
    } catch (e) {
      console.error("incomplete json:", e);

    }
    // only fix things if we've got a valid json
    if (json) {
      if (Array.isArray(json)) {
        if (json.length === 0) {
          // empty array? set to 1-array of empty object
          json = [{}]
        }
        for (let subImage of json) {
          subImage = addAllFields(subImage);
        }
      } else {
        json = addAllFields(json);
      }

      jsonToFields(text);
      // f
    }
    console.log(670, json);
    text = JSON.stringify(json, null, 2);
    console.log(599, json);

    const newHistory = jsonText.slice(0, currentIndex + 1);
    setJsonText([...newHistory, text]);
    setCurrentIndex(newHistory.length);
  }


  const handleFreeformChange = (event) => {
    console.log(302, event.target.form.free.value);
    let input = event.target.form.free.value;
    if (input.length < 5) return;
    console.log(304, input);
    let jsonTxt = enterPlainText(input.split("\n"));
    console.log(307, jsonTxt);
    updateJson(jsonTxt);
    jsonToFields(jsonTxt);

  }

  const handleTextareaChange = (event) => {
    // update the form data
    let jsonTxt = event.target.value;
    updateJson(jsonTxt);
    jsonToFields(jsonTxt);
    /*  try {
        parsedJson = JSON.parse(event.target.value);
        flattenedJson = flattenJson(parsedJson);
        console.log(flattenedJson);
      } catch (e) {
        jsonerror = e;
        console.error("json error");
        return;
      }
      Object.entries(flattenedJson).map(([key, value]) => {
        formData[key] = value;
      }
      ) */
  }

  const updateZoom = (e) => {
    let z = e.target.value;
    // moved validation logic out of here
    setZoom(z);
  }

  const handleInputChange = (key, value) => {
    console.log("form data", formData);
    const newFormData = { ...formData, [key]: value };
    setFormData(newFormData);

    // Update the JSON text based on form data
    try {
      const updatedJson = JSON.parse(jsonText[currentIndex]);
      const keys = key.split('.');
      let current = updatedJson;
      keys.forEach((k, index) => {
        if (index === keys.length - 1) {
          current[k] = value;
        } else {
          current = current[k];
        }
      });
      updateJson(JSON.stringify(updatedJson, null, 2));
    } catch {
      // json error
    }
  };

  let parsedJson, flattenedJson;
  try {
    parsedJson = JSON.parse(jsonText[currentIndex]);
    flattenedJson = flattenJson(parsedJson);
  } catch (e) {
    jsonerror = e.toString();
    //  console.error("json error");
  }

  const loadUserImage = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        setUserImg(img);
      };
    };
    reader.readAsDataURL(file);
  };

  /*
  const loadImageFromUrl = () => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // of CORS
    img.src = imageOptions.url;
    img.onload = () => {
      setUserImg(img);
    };
  };*/

  const sample = (number) => {
    console.log("UPDATING TO " + number);
    let text = '';
    let img_src = '';
    let back_src = '';
    switch (number) {
      case 0: text = starter_text_0;; img_src = egg; break;
      case 1: text = starter_text_1a; img_src = shieldsmasher; break;
      case 2: text = starter_text_1b; img_src = rampager; break;
      case 6: text = starter_text_1c; img_src = featherling; back_src = featherbackground; break;
      case 3: text = starter_text_2; img_src = doublebind; break;
      case 4: text = starter_text_3; img_src = amy; break;
      case 5: text = starter_text_1; img_src = armor_cat; break;
      default: alert(3); return;
    }
    console.log(409, "omg");
    setDoDraw(false);
    console.log(411, doDraw);

    //  this.state.selectedOption = "AUTO";
    //    if (selectedOption !== "AUTO") 
    setSelectedOption("AUTO");
    if (number === 5) {
      setShowJson(2);
      setFreeForm(text);
      text = enterPlainText(text.split("\n"));
      updateJson(text);
    } else {
      setFreeForm("");
      if (showJson === 2) setShowJson(0);
      updateJson(text);
    }
    console.log("SETTING JSON TEXT", text);
    jsonToFields(text);
    console.error(889, img_src);
    if (img_src) {

      const img = new Image();
      img.src = img_src;
      img.onload = () => {
        console.error("foreground");
        setUserImg(img);
      };
    }
    console.error(896, back_src);
    if (back_src) {
      console.error("settings back");
      const img2 = new Image();
      img2.src = back_src;
      img2.onload = () => {
        console.error(901, img2);
        setBackImg(img2);
      }
      img2.onerror = () => {
        console.error(908, img2);      
      }
    }
    console.log(433, "making true");
    setDoDraw(true);
  }


  const draw2 = (x, y) => draw(x, y, true);

  //  const draw = (canvas, ctx) => {
  //  const draw = async (x, y, clear) => {

  const draw = useCallback(async (x, y, clear) => {
    if (!doDraw) return false;
    console.log(643, "START DRAW");
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setupRoundedCorners(ctx, canvas.width, canvas.height, 15);

    console.log("===");
    if (clear) {
      console.log("clear is ", clear);
      //canvas.width = 2977;
    }
    if (document.fonts.check('bold 60px Helvetica')) {
    } else {
    }

    await document.fonts.ready;
    console.log(745, neue);

    if (document.fonts.check('bold 60px Roboto')) {
      //    console.error("roboto pass2");
    } else {
      //   console.error("roboto fail2");
    }


    if (clear === true) {
      canvas.width = 2977;
      canvas.height = 4158 - 17;
      const ctx = canvas.getContext('2d');
      setupRoundedCorners(ctx, canvas.width, canvas.height, 15);
    }
    let json;
    try {
      json = JSON.parse(jsonText[currentIndex]);
      if (Array.isArray(json)) {
        let arrayIndex = Number(jsonIndex);
        if (arrayIndex >= json.length) arrayIndex = json.length - 1;
        json = json[arrayIndex];
      }
    } catch {
      console.log("json error");
      return;
    }

    // if given an array, only draw first object
    if (Array.isArray(json)) {
      json = json[0];
    }


    let modern = 1;

    let t;
    let array = basics;
    let cardframes = [mon_background];
    if (modern) array = outlines;
    let type = selectedOption;
    let overflow = undefined;
    const evo_effect = json.evolveEffect || json.digivolveEffect;

    if (type === "AUTO") {
      type = "MONSTER";
      if (json.cardLv === "Lv.6" || json.cardLv === "Lv.7") {
        type = "MEGA";
      }
      if (json.linkdp) {
        type = "LINK";
      }
      if (json.aceEffect && json.aceEffect.length > 5) {
        type = "ACE";
      }
      if ((t = json.cardType)) {
        if (t.match(/option/i)) {
          type = "OPTION";
          if (!empty(evo_effect))
            type = "OPTIONINHERIT";
        }
        if (t.match(/tamer/i)) {
          type = "TAMER";
          if (!empty(evo_effect))
            type = "TAMERINHERIT";
        }
        if (t.match(/egg/i) || t.match(/tama/i)) { type = "EGG"; }
      }
    }

    const colors = (json && json.color && json.color.toLowerCase().split("/")) || ["red"]; // todo: better default

    switch (type) {
      case "MEGA": cardframes = [mega_background]; break;
      case "OPTION":
      case "OPTIONINHERIT": cardframes = [option_background]; break;
      case "TAMER":
      case "TAMERINHERIT":
        cardframes = [tamer_background]; break;
      case "EGG": cardframes = [egg_background]; break;
      case "LINK":
      case "MONSTER": break;
      case "ACE":
        if (aceFrame) {
          if (ace_backgrounds[colors[0]]) cardframes = colors.map(c => ace_backgrounds[c] || mon_background);
        }
        let match = json.aceEffect && json.aceEffect.match(/Overflow\s*.-(\d+)/i);
        if (match) {
          overflow = parseInt(match[1]);
        } else { // if no overflow set, use level as backup
          match = json.cardLv && json.cardLv.match(/\d+/);
          console.log(528, match);
          if (match) overflow = parseInt(match) - 2;
        }
        break;
      default:
    }

    // options don't need to load frames
    const len = (type === "OPTION" || type === "OPTIONINHERIT") ? 1 : colors.length;
    const frameImages = Array.from({ length: len }, () => new Image());
    const baseImg = new Image();
    // baseImg.loaded = false;



    baseImg.src = placeholder; // default to get started
    const shellImages = [];
    const evoImages = [];
    const wedgeImages = [];
    const _evos = json.evolveCondition || json.digivolveCondition;
    const afterLoad = async () => {
      console.log(document.fred);
      console.log("LOADING2");
      console.log(json);

      const drawMon = (mon_img) => {
        console.log(986, json);
        // mon image
        //      console.log("imageOptions", imageOptions);
        let i_width = canvas.width * Number(imageOptions.x_scale) / 100;
        let i_height = canvas.height * Number(imageOptions.y_scale) / 100;
        let i_x_pct = (100 - Number(imageOptions.x_scale)) / 2 + Number(imageOptions.x_pos);
        let i_y_pct = (100 - Number(imageOptions.y_scale)) / 2 + Number(imageOptions.y_pos);
        // path to verify we don't overwrite right-most edge
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width - 30, canvas.height);
        ctx.clip();
        ctx.drawImage(mon_img,
          i_x_pct * canvas.width / 100, i_y_pct * canvas.height / 100, i_width, i_height / 1);
        ctx.restore();
        //   let w = canvas.width;
  
      }


      if (document.fonts.check('bold 60px Roboto')) {
        //     console.error("roboto pass3");
      } else {
        //     console.error("roboto fail3");
      }

      await document.fonts.ready;

      if (document.fonts.check('bold 60px Roboto')) {
        //console.error("roboto pass4");
      } else {
        //  console.error("roboto fail4");
      }

      // Set the canvas dimensions

      let imageOptions = "";
      try {
        let json = JSON.parse(jsonText[currentIndex]);
        imageOptions = json.imageOptions;
        console.log(527, 222, imageOptions);
      } catch { }
      imageOptions = initObject(imageOptions, initImageOptions);

      // DRAW BACKGROUND, IF WE HAVE IT
      let background_img = backImg;
      console.log(1073, background_img);
      if (background_img && background_img.src) {
        console.log("DRAWING");
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width - 30, canvas.height);
        ctx.clip();
        ctx.drawImage(background_img, 0,0, canvas.width, canvas.height);
        ctx.restore();

      }

      let mon_img = userImg || baseImg;
      if (Number(imageOptions.foregroundImage) === 0)    drawMon(mon_img);
      //      let h = canvas.height;
      let len = colors.length;
      // multicolor
      //    let fw = w / len; // frame width
      let offset_x = 90, offset_y = 72;
      if (!modern) { offset_x = 0; offset_y = 0; }

      let bottom = offset_y + 2760;
      if (type === "EGG") bottom -= 640;
      if (type === "MONSTER" || type === "LINK") bottom -= 500;
      if (type === "ACE") bottom -= 480;
      if (type.startsWith("TAMER") || type.startsWith("OPTION")) bottom -= 640;

      if (skipDraw) return;

      if (effectBox) {
        for (let i = 0; i < len; i++) {
          /*let col = colors[i];
          if (!col) continue;
          let box = new Image();
          box.src = effectboxes[col];*/
          //          let true_bottom = 4000;
          //        let y_scale = ((true_bottom) - (bottom + 60 - baselineOffset)) / box.height;
          const box = effectFrames[i];
          if (box && box.complete) {
            console.log(1051, box, box.height);
            let y_scale = effectBoxScale(box.height, baselineOffset);
            scalePartialImage(ctx, box, i, len, 825, offset_x + 100, bottom + 60 - baselineOffset, 0, y_scale);
          }
        }
      }

      if (drawFrame) {
        // new style background
        // we know shellimg is loaded because of pre-flight

        if (addFoil) {

          const baseImage = shellImages[0];
          //          const overlayImage = foil;

          const offScreenCanvas = document.createElement('canvas');
          offScreenCanvas.width = canvas.width;
          offScreenCanvas.height = canvas.height;
          const offScreenCtx = offScreenCanvas.getContext('2d');

          // Draw base image on off-screen canvas
          offScreenCtx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

          // Create image data for the base image
          const baseImageData = offScreenCtx.getImageData(0, 0, canvas.width, canvas.height);
          const basePixels = baseImageData.data;

          // Clear the off-screen canvas before drawing the overlay image
          offScreenCtx.clearRect(0, 0, canvas.width, canvas.height);
          offScreenCtx.drawImage(foil, 0, 0, canvas.width, canvas.height);

          // Create image data for the overlay image
          const overlayImageData = offScreenCtx.getImageData(0, 0, canvas.width, canvas.height); // Use canvas.width and canvas.height for consistency
          const overlayPixels = overlayImageData.data;

          for (let i = 0; i < basePixels.length; i += 4) {
            const baseAlpha = basePixels[i + 3] / 255;
            const overlayAlpha = overlayPixels[i + 3] / 255;

            // Composite alpha
            const finalAlpha = overlayAlpha + baseAlpha * (1 - overlayAlpha);

            if (finalAlpha > 0) {
              basePixels[i] = Math.round((overlayPixels[i] * overlayAlpha + basePixels[i] * baseAlpha * (1 - overlayAlpha)) / finalAlpha); // Red
              basePixels[i + 1] = Math.round((overlayPixels[i + 1] * overlayAlpha + basePixels[i + 1] * baseAlpha * (1 - overlayAlpha)) / finalAlpha); // Green
              basePixels[i + 2] = Math.round((overlayPixels[i + 2] * overlayAlpha + basePixels[i + 2] * baseAlpha * (1 - overlayAlpha)) / finalAlpha); // Blue
              // basePixels[i + 3] = Math.round(finalAlpha * 255); // Alpha
            }
          }
          offScreenCtx.putImageData(baseImageData, 0, 0);

          // Draw the composite image on the main canvas
          ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height); // Draw the original base image scaled to canvas
          ctx.drawImage(offScreenCanvas, 0, 0, canvas.width, canvas.height); // Draw the composite image scaled to canvas

          // Put the modified image data back to the off-screen canvas
          offScreenCtx.putImageData(baseImageData, 0, 0);
          // Draw the composite image on the main canvas
          let ace_scale = 1; // aceFrame ? .: 0.95;
          ctx.drawImage(shellImages[0], 0, 0, canvas.width * ace_scale, canvas.height * ace_scale);
          ctx.drawImage(offScreenCanvas, 0, 0, canvas.width, canvas.height);

        } else {
          let len = shellImages.length;
          for (let i = 0; i < len; i++) {
            scalePartialImage(ctx, shellImages[i], i, len, 4141, 0, 0)
          }

          //          ctx.drawImage(shellImages[0], 0, 0, canvas.width * ace_scale, canvas.height * ace_scale);
        }
      }

      if (Number(imageOptions.foregroundImage) === 1)    drawMon(mon_img); 

      //// DRAW TOP TEXT
      ctx.textAlign = 'center';
      ctx.fillStyle = 'white';
      ctx.font = `bold 84px Roboto`;
      if (!type.startsWith("OPTION")) {
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 6
        ctx.strokeText(json.cardType.toUpperCase(), 1490, 180);
      }
      ctx.fillText(json.cardType.toUpperCase(), 1490, 180);


      // OUTLINE?

      if (type === "MEGA" && drawOutline) {
        console.log(602, frameImages.length);
        // draw the left and right line all the way down. crop off the top 1000 pixels
        try {
          if (frameImages[0].complete)
            scalePartialImage(ctx, frameImages[0], 0, len, 3950, offset_x, offset_y + 1100, 600);
          let last = len - 1;
          if (frameImages[last].complete)
            scalePartialImage(ctx, frameImages[last], last, len, 3950, offset_x, offset_y + 1100, 600);
        } catch (e) { // couldn't sufficiently check this w/o a try/catch
          console.log(611, e);
        }
      }

      /// WRITE NAME
      let has_traits = (!empty(json.form) || !empty(json.attribute) || !empty(json.type));

      for (let i = 0; i < len; i++) {
        let frame = frameImages[i];
        if (modern) {
          let name_field = bottoms; // i'm so sorry this is named 'bottom'
          if (type.startsWith("OPTION") || type.startsWith("TAMER")) name_field = bottoms_plain;
          let col = colors[i];


          if (outlines[col]) {

            if (frame && drawOutline) {
              let l = (type.startsWith("OPTION")) ? 1 : len; // just 1 option "outline"
              let fudge = (type === "OPTION" || !i) ? 0 : 0.04;
              fudge = 0;
              // 1.05 is fudge factor because our frames aren't all left-justified the same
              // this makes them  the same, but they might be the same wrong
              // y - 1.5 to avoid tiniest stray pixels above egg frame on upper left
              scalePartialImage(ctx, frame, i + (fudge), l, 3950, offset_x, offset_y - 1.5);
            }

            let y_scale = 1;
            ///// EVO BOX AT BOTTOM (OR LINK BOX)
            if (type !== "MEGA") {
              let img = bottom_evos[col];
              // scale = 606 specifically for bottom_evo_${color}.png
              let scale = 735;
              let height = 3550;
              if (type === "LINK") {
                img = bottoms_plain[col];
                scale = 305;
                height = 3210;
                y_scale = 1.5;
              }
              if (type === "ACE") {
                img = bottom_aces[col];
                scale = 606;
              }
              if (type === "OPTION" || type === "TAMER" || type === "EgjgjGG") {
                img = inherited_security[col];
                scale = 740;
                height = 3450;
              }
              console.log(1199, type);
              // egg doesn't change inherited but does change scale and height 
              if (type === "EGG") {
                img = bottom_egg_evos[col];
                scale = 720;
                height = 3470;

              }

              if (type === "TAMERINHERIT" || type === "OPTIONINHERIT") {
                // tamer inherit has ESS box but raised height
                height = 3450;
              }
              scalePartialImage(ctx, img, i, len, scale, 164, height, undefined, y_scale);
            }


            // DRAW ESS BOX
            let ess_i_width = (Number(imageOptions.ess_x_end) - Number(imageOptions.ess_x_pos)) * mon_img.width / 100
            let ess_i_height = (Number(imageOptions.ess_y_end) - Number(imageOptions.ess_y_pos)) * mon_img.height / 100
            let ess_x = Number(imageOptions.ess_x_pos) * mon_img.width / 100
            let ess_y = Number(imageOptions.ess_y_pos) * mon_img.height / 100
            let ess_pos_y = 3700;
            let ess_pos_x = 240;
            let size_x = 350;
            let size_y = 350;

            if (type === "MEGA" || type === "OPTION" || type === "TAMER") ess_pos_y = 0;
            if (type.endsWith("INHERIT")) ess_pos_y -= 105;
            if (type === "LINK") {
              ess_pos_y -= 310;
              ess_pos_x += 2200;
              size_y = 150;
              ctx.save();
              ctx.translate(ess_pos_x + size_x / 2, ess_pos_y + size_y / 2);
              ctx.rotate(Math.PI / 2)
              ess_pos_x = -size_x / 2 
              ess_pos_y = -size_y / 2; // i've translated to where i need to be

            }
            if (type === "EGG") ess_pos_y -= 80;
            if (type === "ACE") {
              ess_pos_y += 135;
              ess_pos_x += 30;
              size_x = size_y = 250;
            }
            if (ess_pos_y) {
              ctx.drawImage(mon_img,
                ess_x, ess_y, ess_i_width, ess_i_height,
                ess_pos_x, ess_pos_y, size_x, size_y
              );
            }
            if (type === "LINK") {
              ctx.restore();
            }

            // DP LINK BOX
            if (type === "LINK") {
              let w = linkdp.width; let h = linkdp.height;
              let s = 4.72
              ctx.drawImage(linkdp,
                2530, 3210, w * s, h * s);

              ctx.save();
              ctx.translate(2680, 3610);
              ctx.rotate(Math.PI / 2);
              ctx.font = "bold 90px HelveticaNeue-CondensedBold, AyarKasone, Helvetica";
              ctx.fillStyle = "white";
              ctx.textAlign = "right";
              ctx.textBaseline = "bottom";
              ctx.fillText(json.linkdp, 0, 0);

              ctx.font = `60px 'Helvetica'`;
              ctx.textAlign = "center";
              ctx.fillText("DP", -250, -60);
              ctx.font = `100px 'Helvetica'`;

              ctx.fillText("+", -250, 0);
              ctx.restore();

              

              }

            // DRAW BOTTOM OF BOX?
            if (drawOutline && (type === "LINK" || type === "MONSTER" || type === "MEGA" || type === "ACE")) {
              // bottom of frame
              let border = borders[col];
              let y = 3550 - 440;
              if (type === "MEGA") y += 500;
              if (type === "ACE") y += 1;
              scalePartialImage(ctx, border, i, len, 67.3, 166, y);

              // todo: play with these numbers some more. scale is 67.2-67.5,
              // and left is 166
            }

            let start_x = 164;
            // name block
            if (true) {
              let scale = 364.2;
              let y = 3550 - 365;
              if (type === "EGG" || type.startsWith("OPTION") || type.startsWith("TAMER")) y -= 90;
              //  if (type.startsWith("OPTION") || type.startsWith("TAMER")) y += 0; // 40;
              if (type === "MEGA" || type === "LINK") y += 500;
              if (type === "ACE" && aceFrame) {
                y += 30;
                start_x -= 4
                scale = 368
              }
              let y_scale = 1;
              let img_name = name_field[col];
              if (type.startsWith("OPTION") || type.startsWith("TAMER")) scale = 305;
              if (type === "EGG") {
                // egg is weirder, needs so much special case 
                y -= 34;
                scale = 365;
                y_scale = 1.03;
              }

              scalePartialImage(ctx, img_name, i, len, scale, start_x, y, 0, y_scale);


              // do the black (white) bar on anything with a trait, or anything with "Lv.*" text
              if (i === len - 1) {
                let skip = false;
                let bar_offset = 273;

                if (type.startsWith("OPTION") || type.startsWith("TAMER")) {
                  skip = true;
                  bar_offset = 252;
                }
                // more special cases for egg, this sucks
                if (type === "EGG") {
                  skip = true;
                  bar_offset = 292 - 14;
                }

                if (has_traits) skip = false;

                // do underline for traits, check st19 arisa because Tamers might need it
                if (!skip) {
                  let bar_img = (colors[0] === "black") ? bottom_property_white : bottom_property_black;

                  let scale = 4.015;
                  if (true) ctx.drawImage(bar_img,
                    162, y + bar_offset,
                    bar_img.width * scale * 0.999,
                    bar_img.height * scale * 1.17) // stretch a little
                }
              }
            }
          }
        }
      } // end multi-color drawing

      // rule text can either be at the very end
      // if digixros && rule are both small, they can be on the same line (BT18-072)
      // if ruletext is short it could be after the effect text, above digixros (BT18-028, BT19-065)
      // sometimes they have the full digixros effect and the rule above it (BT15-012)

      bottom += 800;
      const rule = json.rule;
      const xros = json.digiXros;
      const fontSize = Number(json.imageOptions.fontSize) || 90.5
      let rule_offset = 0;
      let xros_offset = 0;

      if (!empty(xros)) {
        let preview = drawBracketedText(ctx, fontSize, xros, 300, bottom,
          3000, Number(fontSize) + Number(lineSpacing), "bubble", true);
        // our text should end at roughly bottom + 
        xros_offset = preview - (bottom + fontSize * 2);
        console.log(1254, 'x', preview, bottom);
      }
      if (rule && xros) {
        let rule_start = writeRuleText(ctx, rule, fontSize, bottom, true);
        let xros_length = ctx.measureText(xros).width;
        let fudge = 260;

        if (300 + xros_length + fudge > rule_start) {
          rule_offset = (Number(fontSize) * 1.2 + Number(lineSpacing) * 2.0);
        }
      }
      if (!empty(rule)) {
        console.log(1069, "bottom is " + (bottom - xros_offset - rule_offset));
        writeRuleText(ctx, rule, fontSize, bottom - xros_offset - rule_offset);
      }

      if (xros && xros !== "-") {
        // BT10-009 EX3-014: shaded box
        // st19-10 solid box
        drawBracketedText(ctx, fontSize, xros, 300, bottom - xros_offset, 3000, Number(fontSize) + Number(lineSpacing), "bubble");
      }



      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const height = 390;

      // EVO CIRCLES: only monsters (and tamers, why not) can have evo circles
      if (hasEvo(type)) {
        if (_evos && _evos.length > 0 && (
          _evos[0].color || _evos[0].level || _evos[0].cost)) {

          // BT-14 and up, there is never two evo circles any more (until direct on tamers).
          // This assumes that all circle evos are from the same level and for the same cost, just different colors.
          // Post BT-14 alterate conditions were handled via special digivolve lines.
          // For now there is just one circle. Ask in feedback if you want more. 


          let evo1_level = "Lv." + _evos[0].level;
          if (_evos[0].level && _evos[0].level.toUpperCase() === "TAMER") evo1_level = "TAMER";
          let evo1_cost = _evos[0].cost;
          let index = 0 // just 1 circle 
          let evo1_colors = _evos.map(e => e.color ? e.color.toLowerCase().split("/"): [] )
            .reduce((acc, curr) => acc.concat(curr), []);
          ctx.drawImage(cost_evo, offset_x, offset_y + 600, 500, 500);

          let base = -135; // degrees
          let each = 360 / (evo1_colors.length);

          for (let i in evo1_colors) {
            i = Number(i);
            let X = offset_x + 130;
            let Y = offset_y + 125 + 600;

            const imgWidth = 310; // height, too
            const imgHeight = 310; // height, too

            const circle = evoImages[i]
            const wedge = wedgeImages[i];
            const radius = imgWidth / 2;
            // TODO: wait for .onLoad()? Or did we.
            let start = base + i * each
            const startAngle = (start * Math.PI) / 180;
            const sweepAngle = (each * Math.PI) / 180;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(X + radius, Y + radius);
            ctx.arc(X + radius, Y + radius, radius, startAngle, startAngle + sweepAngle);
            ctx.lineTo(X + radius, Y + radius);
            ctx.clip();
            try {
              ctx.drawImage(circle, 0, 0, 291, 291, X, Y, imgWidth, imgHeight);
            } catch (e) {
              console.error(1329, "no circle", e);
            }
            ctx.restore();
            try {
            ctx.drawImage(wedge, 0, 0, 291, 291, X - 130, Y - 127, 5.15 * wedge.width, 5.45 * wedge.height);
            } catch (e) {
              console.error(1576, "no wedge", e);
            }
          }

          ctx.font = `bold 90px Roboto, Helvetica`; //  Roboto`;
          ctx.font = `bold 90px HelveticaNeue-CondensedBold, AyarKasone, Helvetica`;

          ctx.lineWidth = 10;

          let [fillColor, strokeColor, border] = textColor(evo1_colors);
          if (evo1_colors.length === 1 && (evo1_colors[0] === 'yellow' || evo1_colors[0] === 'white')) {
            fillColor = 'black';
            border = false;
          }
          if (border) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 10;
            ctx.strokeText(evo1_level, 375, 870 + height * index, 140);
          }
          ctx.fillStyle = fillColor; // contrastColor(evo_color);
          ctx.fillText(evo1_level, 375, 870 + height * index, 140);

          // I *swear* that Helvetica is right for the digit 0, but that's nuts, why would that be different?
          ctx.font = `bold 220px HelveticaNeue-CondensedBold, Helvetica, AyarKasone`;
          if (border) {
            ctx.lineWidth = 10;
            ctx.strokeText(evo1_cost, 375, 1010 + height * index);
          }
          ctx.fillText(evo1_cost, 375, 1010 + height * index);
        }
      }

      let _dp = parseInt(json.dp);
      let dp_k, dp_m;
      if (isNaN(_dp)) {
      } else {
        dp_k = parseInt(_dp / 1000);
        if (dp_k === 0) dp_k = "";
        dp_m = (_dp % 1000).toString().padStart(3, '0');
      }


      let x = 355;
      //playcost. If 0 or more, show that number. Else show egg symbol.
      const playcost = parseInt(json.playCost)
      if (true) {
        let img = undefined;
        if (type === "EGG") img = cost_egg;
        if (playcost >= 0) {
          img = cost;
          if (type.startsWith("OPTION")) img = cost_option;
        }
        if (img) {
          ctx.drawImage(img, offset_x, offset_y, 500, 500);
          for (let color of colors) {
            let i = costs[color];
            if (i) ctx.drawImage(i, offset_x, offset_y, 500, 500);
          }
        }
        if (playcost >= 0) {
          ctx.font = `bold 290px HelveticaNeue-CondensedBold, Helvetica`;
          ctx.fillStyle = 'white';
          ctx.fillText(playcost, x + 15, 370);
        }
      }


      if (type === "ACE" && overflow) {
        ctx.font = `70px MyriadProBold`;

        // fake blur 
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.6)';
        ctx.lineWidth = 15;
        ctx.strokeText(overflow, 1045, 3605);

        ctx.strokeStyle = '#eee';
        ctx.lineWidth = 10;
        ctx.strokeText(overflow, 1045, 3605);


        ctx.shadowBlur = 0; // Remove shadow blur for the fill text
        ctx.fillStyle = 'rgba(32, 32, 32, 0.8)'; // '#444';
        ctx.fillText(overflow, 1045, 3605);


        // this isn't quite right, it's too slanted. maybe gothic ?
        ctx.font = `italic 111px MyriadCondenser`;
        // ctx.font = `italic 90px "Adobe Gothic Std"`;
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 5;
        ctx.fillStyle = '#ddd';
        //        ctx.fillText('lose  4  memory', 1850, 3730);
        ctx.strokeText(overflow, 2040, 3735);
        ctx.fillText(overflow, 2040, 3735);



        // now put it in its second place

      }

      if (hasDP(type)) {
        // dp
        ctx.fillStyle = 'black';
        x = 2540;
        y = 410;
        ctx.font = `bold 350px 'HelveticaNeue-CondensedBold', 'Helvetica`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';


        let dp_x = x - 5;
        while (dp_k > 0) {
          // right-to-left for dp_k
          let letterSpacing = -25;
          let dp_char = dp_k % 10;
          ctx.lineWidth = 20;
          ctx.strokeStyle = 'white';
          ctx.strokeText(dp_char, dp_x, y);
          ctx.fillText(dp_char, dp_x, y);
          dp_x -= (ctx.measureText(dp_char).width + letterSpacing);
          dp_k = Math.floor(dp_k / 10);
        }

        ctx.font = `bold 175px 'HelveticaNeue-CondensedBold', 'Helvetica'`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        dp_x = x + 10;
        if (dp_m) {
          for (let dp_char of dp_m) {
            let letterSpacing = 5;
            ctx.lineWidth = 15;
            ctx.strokeStyle = 'white';
            ctx.strokeText(dp_char, dp_x, y - 25);
            ctx.fillText(dp_char, dp_x, y - 25);
            dp_x += (ctx.measureText(dp_char).width + letterSpacing);
            // left-to-right for dp_m
          }
        }
        ctx.font = `100px 'Helvetica'`;
        ctx.lineWidth = 15;
        ctx.strokeStyle = 'white';
        ctx.strokeText("DP", x + 130, y - 200);
        ctx.fillText("DP", x + 130, y - 200);
      }


      /////// LEVEL
      if (hasLevel(type)) {
        let level = (json.cardLv === "-" || json.cardLv === undefined) ? "Lv.-" : json.cardLv;
        // roboto preferred
        //        ctx.font = '900 200px "Roboto"'

        ctx.fillStyle = whiteColor(colors[0]);
        let y = 3400;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';

        y += levelHeight(type);
        y += 100
        ctx.font = '900 200px "Big Shoulders Text"'
        ctx.font = '900 150px "ProhibitionRough", "Big Shoulders Text"'
        let x = 250;

        level = (level + "    ").substring(0, 4);
        ctx.font = '150px "ProhibitionRough", "Big Shoulders Text"'
        ctx.fillText(level[0], x, y - 10);
        x += ctx.measureText(level[0]).width;

        ctx.font = '900 110px "ProhibitionRough", "Big Shoulders Text"'
        ctx.fillText(level[1], x, y - 13);
        x += ctx.measureText(level[1]).width;

        ctx.font = '900 110px "ProhibitionRough", "Big Shoulders Text"'
        ctx.fillText(level[2], x, y - 18);
        x += ctx.measureText(level[2]).width + 10;

        ctx.font = '220px "ProhibitionRough", "Big Shoulders Text"'
        ctx.fillText(level.substring(3), x, y);
        x += ctx.measureText(level[0]).width;

      }

      //// NAME 
      let delta_y = 0;
      switch (type) {
        case "OPTION":
        case "OPTIONINHERIT":
        case "TAMER":
        case "EGG":
        case "TAMERINHERIT": delta_y -= 125; if (!has_traits) delta_y += 30; break;
        case "LINK":
        case "MEGA": delta_y += 500; break;
        case "MONSTER": break;
        case "ACE": if (aceFrame) delta_y += 30; break;
        default: alert(1);
      }

      // name
      try {
        const name = json.name.english;
        let ace_offset = (type === "ACE") ? -ace_logo.width / 2 : 0;
        const maxWidth = 1600 + ace_offset * 2;

        const initialFontSize = 200;
        const namefontSize = fitTextToWidth(ctx, name, maxWidth, initialFontSize, 180);
        // PF Das Grotesk Pro Bold is the actual font but $$
        //ctx.font = `bold ${fontSize}px Roboto`; // better looking I
        //        ctx.font = `700 ${fontSize}px Schibsted Grotesk`; // has curved lowercase l
        ctx.font = `700 ${namefontSize}px ToppanBunkyExtraBold`; // has curved lowercase l
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';

        ctx.lineWidth = 30; // Border width
        let bc = borderColor(colors);
        ctx.strokeStyle = bc;

        let actualWidth = ctx.measureText(name).width;
        let scale = (maxWidth) / actualWidth;
        let endWidth = Math.min(maxWidth, actualWidth);
        if (scale > 1) scale = 1;
        // at  a certain point we should do multiple lines
        ctx.save();
        ctx.scale(scale, 1);
        let name_line = 3328
        if (bc !== "") {
          ctx.lineWidth = 20; // Border width
          ctx.strokeText(name, (1480 + ace_offset) / scale, name_line + delta_y);
        }
        ctx.lineWidth = 2; // Border width
        ctx.fillText(name, (1480 + ace_offset) / scale, name_line + delta_y);
        ctx.restore();


        if (type === "ACE") {
          let end = endWidth / 2;
          ctx.drawImage(ace_logo, 1480 + ace_offset + end + 10, name_line + delta_y - 95);
        }
      } catch { };

      // card number
      const id = json.cardNumber;
      ctx.textAlign = 'right';
      ctx.fillStyle = contrastColor(colors[colors.length - 1]);
      ctx.font = `bold 100px 'HelveticaNeue-CondensedBold', 'Helvetica'`;

      // Helvetica seems basically right but needs to be made skinny
      // ToppanBunkyExtraBold has serifs on 1 now??
      // myriadprobold wrong on 7 6 1
      // asimov has wrong 6
      // ayarkasone has the right 1 but the wrong 5
      // levetica and arial may be too plain? or not.
      // not roboto because the 6 needs a hook
      // fallingsky ihas the wrong 1

      ctx.fillText(id, 2740, 3300 + delta_y);

      // traits: form, attribute, type
      let form = json.form || '';
      let attribute = json.attribute || '';
      let c_type = json.type || '';
      // todo don't show when all blank
      let traits = ` ${c_type}   `;


      if (form || attribute) {
        traits = ` ${center(form)} | ${center(attribute)} | ${center(c_type)}`;
      }
      //console.log("Traits", traits)
      ctx.fillStyle = whiteColor(colors[0]);
      if (type.startsWith("OPTION") || type.startsWith("TAMER") || type === "EGG") {
        delta_y += 10;
      }
      if (type === "MEGA") {
        //        delta_y += 50;
      }
      if (type === "EGG") {
        delta_y += 0;
      }

      ctx.font = `bold 60px "FallifngSky", "MyrggiadProBold", "RepoMedium", "Robgoto"`;
      ctx.font = `60px MyriadProBold`;
      ctx.fillText(traits, 2750, 3490 + delta_y)// * 0.9);

      ///// MAIN TEXT 
      let y_line = bottom - 640; // set above for effectbox / rule

      //      let b = Number(baselineOffset);
      let so = Number(specialOffset);
      y_line -= Number(baselineOffset);

      //console.log(1149, b, baselineOffset, y_line);
      ctx.font = `bold 90px Arial`;
      ctx.textAlign = 'start';
      ctx.textBaseline = 'bottom'; // Align text to the bottom


      const fontSize_n = Number(fontSize);
      // DNA evo and special evo appear above the effect line
      const dna_evo = json.dnaEvolve || json.dnaDigivolve; // colorReplace is inside drawBracketedText
      const spec_temp = json.specialEvolve || json.specialDigivolve;
      const spec_evo = colorReplace(spec_temp, true);
      const delta = fontSize_n + so;
      let special_baseline = y_line;
      console.log(1277, special_baseline, y_line, (fontSize_n + so))
      if (!empty(spec_evo)) {
        special_baseline -= (delta);
        drawBracketedText(ctx, fontSize_n, spec_evo, 270, special_baseline, 3000 * 0, Number(fontSize_n) + Number(lineSpacing), "bubble");
      }
      if (!empty(dna_evo)) {
        special_baseline -= (delta);
        drawBracketedText(ctx, fontSize_n, dna_evo, 270, special_baseline, 3000 * 0, Number(fontSize_n) + Number(lineSpacing), "dna");
      }

      let effect = json.effect;
      ctx.fillStyle = 'black';

      y_line += 80;
      //      if (type === "MONSTER") y_line += 180;

      if (effect && effect !== "-") {
        effect = colorReplace(effect, true);
        y_line = drawBracketedText(ctx, fontSize, effect,
          //wrapText(ctx, effect, // + effect, 
          250, y_line,
          2455,
          Number(fontSize) + Number(lineSpacing), type.startsWith("OPTION") ? "effect-option" : "effect",
          false
        );
      }


      // evo effect
      ctx.textAlign = 'start';
      ctx.textBaseline = 'bottom'; // Align text to the bottom


      console.log("a", evo_effect);
      let sec_effect = (evo_effect && evo_effect !== "-") ? evo_effect : json.securityEffect;
      if (json.link) {
        sec_effect = json.link + "\n\n" + json.linkeffect;
      }
      sec_effect = colorReplace(sec_effect, true);

      //ctx.fillStyle = 'red';
      let delta_x = delta_y;
      let shrink = 0;
      if (type === "ACE") {
        delta_x -= 60; delta_y += 100;
      } else if (type.startsWith("OPTION") || type.startsWith("TAMER") || type === "EGG") {
        delta_x = 0; delta_y = -50;
      } else if (type === "LINK") {
        delta_x = -220; delta_y = -200; shrink = 1000;
      } else {
        delta_x = 0; delta_y = 0;
      }
      let max_width = 2500 - 400 - delta_x * 2 - shrink;
      if (sec_effect && type !== "MEGA") {
        drawBracketedText(ctx, fontSize, sec_effect,
          700 + delta_x * 2, 3740 + delta_y * 2,
          max_width, Number(fontSize) + Number(lineSpacing), "effect");
      }
    }

    /*
    if (false)
      if (isSelecting) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 30;
        console.log(1026, "x", startX, startY, endX - startX, endY - startY);

        ctx.strokeRect(startX * 2977 / 355,
          startY * canvas.height / 499,
          (endX - startX) * 2977 / 355,
          (endY - startY) * canvas.height / 499
        )
      }
        */


    let evo_circle_colors = [];
    if (_evos) {
      evo_circle_colors = _evos.map(e => e.color ? e.color.toLowerCase().split("/") : [] )
        .reduce((acc, curr) => acc.concat(curr), []);
    }
    const effectFrames = effectBox ? Array.from({ length: len }, () => new Image()) : [];

    // N for basic style frame, 1 for custom image, 1 per color, 2 per evo circle, 1 per effect box
    let imagesToLoad = cardframes.length + 1 + frameImages.length + 2 * (evo_circle_colors.length) + effectFrames.length;
    console.log(817, frameImages.length, _evos && _evos.length);
    let imagesLoaded = 0;

    await new Promise((resolve) => {
      const checkAllImagesLoaded = (text, failure) => {
        imagesLoaded++;
        console.log(771, failure ? "IMAGE FAILED" : "image loaded,", imagesLoaded, imagesToLoad, text);
        if (imagesLoaded === imagesToLoad) { // Change this number based on the number of images
          // Set the canvas dimensions  
          afterLoad();
          console.log(1765, "RESOLVING...");
          resolve();
          console.log(1765, "... resolved");
        }
      };

      for (let i = 0; i < effectFrames.length; i++) {
        effectFrames[i].src = effectboxes[colors[i]];
        effectFrames[i].onload = function () { checkAllImagesLoaded("box" + i); }
        effectFrames[i].onerror = function () { checkAllImagesLoaded("box" + i, true); }

      }

      for (let f of frameImages) {
        f.onload = function () { checkAllImagesLoaded(f.src); }
        f.onerror = function () { checkAllImagesLoaded(f.src, true); }
      }
      // this has a race condition    
      baseImg.onload = function () { checkAllImagesLoaded("baseimage"); }
      baseImg.onerror = function () { checkAllImagesLoaded("baseimage", true); }
      if (baseImg.complete) {
        console.log("base img already loaded");
        //    baseImg.src = baseImg.src; // reload
      } else {

      }

      for (let i in evo_circle_colors) {
        let my_color = evo_circle_colors[i];
        let evoI = new Image();
        evoImages[i] = evoI;
        evoI.src = new_evo_circles[my_color]
        console.log(1688, new_evo_circles[my_color]);
        evoI.onload = function () { checkAllImagesLoaded(`evo circle ${i} ${my_color}`); }
        evoI.onerror = function () { checkAllImagesLoaded(`evo circle ${i} ${my_color}`, true); }
        let wedgeI = new Image();
        wedgeImages[i] = wedgeI;
        wedgeI.src = new_evo_wedges[my_color]
        wedgeI.onload = function () { checkAllImagesLoaded(`evo wedge ${i} ${my_color}`); }
        wedgeI.onerror = function () { checkAllImagesLoaded(`evo wedge ${i} ${my_color}`, true); }
      }
      for (let i in cardframes) {
        shellImages[i] = new Image();
        shellImages[i].src = cardframes[i];
        shellImages[i].onload = shellImages[i].onerror = function () { checkAllImagesLoaded(`shell src  ${i} ${shellImages[i].src}`); }
      }


      switch (type) {
        case "OPTION":
        case "OPTIONINHERIT": array = options; break;
        // how is outlines_tamer different from outlines_egg??
        case "TAMER":
        case "TAMERINHERIT": array = modern ? outlines_tamer : tamers; break;
        case "EGG": array = modern ? outlines_egg : eggs; break;
        case "MONSTER": break;
        case "MEGA": break;
        case "ACE": break;
        case "LINK": break;
        default: alert(4);
      }


      if (type.startsWith("OPTION")) {
        frameImages[0].src = outline_option;
      } else {
        for (let i = 0; i < frameImages.length; i++) {
          frameImages[i].src = array[colors[i]];
        }
      }
      console.log(906, `sources set ${imagesToLoad} loaded ${imagesLoaded} base: ${!!baseImg.complete}`);

    });
    //  setTimeout(() => afterLoad(), 100); // bad wat to sycnrhoncoursly load 
    //leftImg.onload = () => {
    // console.log("loading left...");
    //ightImg.onload = () => {


  }, [userImg, backImg, jsonText, selectedOption, doDraw, currentIndex,
    effectBox, drawFrame, skipDraw, addFoil, baselineOffset, specialOffset,
    lineSpacing, initImageOptions, jsonIndex,
    //, endY, isSelecting, startX, startY, 
    neue,
    aceFrame, drawOutline
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (canvas.width !== 2977) {
      canvas.width = 2977;
      canvas.height = 4158 - 17;
    }
    setupRoundedCorners(ctx, canvas.width, canvas.height, 15);

    if (doDraw)
      draw(canvas, ctx);

  }, [
    userImg,
    jsonText,
    imageOptions, selectedOption,
    doDraw,
    draw]);



  const handleExport = async () => {
    let name = 'custom-card.png';
    let json = {};
    try {
      json = JSON.parse(jsonText[currentIndex]);
    } catch (e) {
      console.error(e);
      return;
    }
    if (Array.isArray(json)) {
      const zip = new JSZip();
      for (let i = 0; i < json.length; i++) {
        setJsonIndex(i);
        console.log(1879, i);
        await draw(0, 0, false)
        await sleep(2000);
        console.log(1879, i);
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL('image/png');
        const base64Data = dataUrl.split(',')[1]; // Get base64 part
        zip.file(`image${i + 1}.png`, base64Data, { base64: true });
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'images.zip');
    } else {
      try {
        name = json.name.english;
        name = name.replace(/[^a-zA-Z0-9]+/g, '-') + ".png";
        exportOneImage(name);
      } catch (e) {
        console.error(e);
      }
    }
  }

  const exportOneImage = (name) => {
    if (!name) name = 'custom-card.png';
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setupRoundedCorners(ctx, canvas.width, canvas.height, 15);
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = name;
    link.click();
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const invite = 'https://discord.gg/THzb53dTDW';
  let button = (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
      <button
        onClick={handleUndo}
        style={{ backgroundColor: showJson === 1 ? 'lightblue' : 'white', marginRight: 'auto' }}
      >
        Undo
      </button>

      <button
        onClick={() => setShowJson(1)}
        style={{ backgroundColor: showJson === 1 ? 'lightblue' : 'white' }}
      >
        Raw
      </button>
      <button
        onClick={() => setShowJson(0)}
        style={{ backgroundColor: showJson === 0 ? 'lightblue' : 'white' }}
      >
        Text Fields
      </button>
      <button
        onClick={() => setShowJson(2)}
        style={{ backgroundColor: showJson === 2 ? 'lightblue' : 'white' }}
      >
        Free Form
      </button>

    </div>
  );
  let z = zoom;
  if (!z) z = 100;
  if (z < 25) z = 25;
  if (z > 300) z = 300;
  const width = (355 * z / 100) || 355;
  const height = (499 * z / 100) || 499;

  /*
  const handleMouseDown = (e) => {
    setIsSelecting(true);
    const rect = canvasRef.current.getBoundingClientRect();
    setStartX(e.clientX - rect.left);
    setStartY(e.clientY - rect.top);
  };
 
  const handleMouseMove = (e) => {
    if (!isSelecting) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setEndX(e.clientX - rect.left);
    setEndY(e.clientY - rect.top);
  };
 
  const handleMouseUp = () => {
    if (!isSelecting) return;
    setIsSelecting(false);
    const width = ((endX - startX) / 355) * 100;
    const height = ((endY - startY) / 499) * 100;
    const x = (startX / 355) * 100;
    const y = (startY / 499) * 100;
 
    setImageOptions(prev => ({
      ...prev,
      ess_x_pos: x,
      ess_y_pos: y,
      ess_x_end: x + width,
      ess_y_end: y + height
      //        rectangleCoordinates: { x, y, width, height }
    }));
    console.log(1768, 'Rectangle Coordinates (%):', { x, y, width, height });
  };
 
  removed from <canvas />?
  onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
 
*/

  console.log(52799, imageOptions);

  let json_t = jsonText[currentIndex];

  return (
    <table>
      <tbody>
        <tr>
          <td width={"25%"} valign={"top"}>
            <div style={{ overflowY: "scroll", maxHeight: "600px" }}>
              <RadioGroup selectedOption={selectedOption} handleOptionChange={handleOptionChange} />
              {button}
              <br />
              {(showJson === 1) ? (

                <textarea cols={40} rows={25}
                  value={jsonText[currentIndex]}
                  onChange={handleTextareaChange}

                //           onChange={(e) => handleTextAreaChange(e.target.value)}
                />
              ) : (showJson === 0) ? (
                <div>
                  <table style={{ maxWidth: "300px" }}>
                    {!flattenedJson ? (<tr><td>Error in JSON, try again <br /> {jsonerror} </td></tr>
                    ) :
                      Object.entries(flattenedJson).filter(([key, value]) => !key.includes("imageOptions")).map(([key, value]) =>
                        <tr>
                          <td key={key}>
                            <label>{key}: </label>
                          </td>
                          <td>
                            {key.match(/effect/i) ? (
                              <textarea
                                value={formData[key] ?? value}
                                onChange={(e) => handleInputChange(key, e.target.value)} />) : (
                              <input
                                value={formData[key] ?? value}
                                onChange={(e) => handleInputChange(key, e.target.value)} />)
                            }
                          </td>
                        </tr>
                      )}
                  </table>
                </div>
              ) : (<form>
                <textarea onChange={handleFreeformChange} defaultValue={freeform} name="free" cols={40} rows={25} /><br />
              </form>)}
            </div>
          </td>
          <td width={"25%"} valign={"top"}>
            <div>
              <canvas id="cardImage" ref={canvasRef}
                style={{
                  width: width + 'px', // traditional cards are roughly 300 x 416, let's zoom in
                  height: height + 'px',
                  backgroundColor: '#eef',
                  borderRadius: '20px',  // this radius is scaled differently than the one in the function
                  overflow: 'hidden'
                }}>
              </canvas>
              <br />
              <label>Zoom: <input type="number" style={{ width: "50px" }} name="zoom" value={zoom} onChange={updateZoom} />% </label>


            </div>
          </td>
          <td width={"25%"} valign={"top"}>
            {
              neue || (<p>HelveticaNeue may not be loaded.</p>)
            }

            Choose image:
            <input type="file" onChange={loadUserImage} />
            <br />
            {/*          --- OR ---
          <br />
          <input
            type="text"
            name="url"
            placeholder="Enter image URL"
            value={imageOptions.url}
            // onChange={(e) => setImageUrl(e.target.value)}
            onChange={updateImg}
          />
          <br />
          <button onClick={loadImageFromUrl}>Load Image from that URL</button>
          */}
            <br />
            {
              flattenedJson && Object.entries(flattenedJson).filter(([key, value]) => key.includes("imageOptions.")).map(([k, v]) => [k, v, k.split(".")[1]]).map(([key, value, label]) =>
                <tr>
                  <td key={label}>
                    <label>{label}: </label>
                  </td>
                  <td>
                    {key.match(/effect/i) ? (
                      <textarea
                        value={formData[key] ?? value}
                        onChange={(e) => handleInputChange(key, e.target.value)} />) : (
                      <input type={label === "url" ? "text" : "number"}
                        value={formData[key] ?? value}
                        onChange={(e) => handleInputChange(key, e.target.value)} />)
                    }
                  </td>
                </tr>
              )}
            xy_pos, xy_scale are positing & scale for main image, in percent
            <br />
            ess_xy_pos ess_xy_end are corners of box for ess image,
            { /*
            Offset (in percent):
            X: <input type="number" style={{ width: "50px" }} name="x_pos" value={imageOptions.x_pos} onChange={updateImg} />
            Y: <input type="number" style={{ width: "50px" }} name="y_pos" value={imageOptions.y_pos} onChange={updateImg} />
            <br />
            Fill size (in percent):
            X: <input type="number" style={{ width: "50px" }} name="x_scale" value={imageOptions.x_scale} onChange={updateImg} />
            Y: <input type="number" style={{ width: "50px" }} name="y_scale" value={imageOptions.y_scale} onChange={updateImg} />
            <hr />
            ESS start (in percent):
            X: <input type="number" style={{ width: "50px" }} name="ess_x_pos" value={stringRound(imageOptions.ess_x_pos)} onChange={updateImg} />
            Y: <input type="number" style={{ width: "50px" }} name="ess_y_pos" value={stringRound(imageOptions.ess_y_pos)} onChange={updateImg} />
            <br />
            ESS end (in percent):
            X: <input type="number" style={{ width: "50px" }} name="ess_x_end" value={stringRound(imageOptions.ess_x_end)} onChange={updateImg} />
            Y: <input type="number" style={{ width: "50px" }} name="ess_y_end" value={stringRound(imageOptions.ess_y_end)} onChange={updateImg} />
            <br />
                */}
            {/* isSelecting ? "TRACE" : "(dragging  rectangle temporarily disabled)" */}
            <hr />
            <button onClick={draw2}>Force Draw</button>

            <hr />

            <button onClick={handleExport}>Save Image Locally</button>
            <hr />
            <SaveState jsonText={jsonText[currentIndex]} drawFrame={drawFrame}
              addFoil={addFoil} drawOutline={drawOutline} aceFrame={aceFrame}
              effectBox={effectBox} baselineOffset={baselineOffset} specialOffset={specialOffset} lineSpacing={lineSpacing}
            />
            <hr />
            <span>
              <label>Line spacing: <input type="number" style={{ width: "50px" }} name="lineSpacing" value={lineSpacing} onChange={(e) => { setLineSpacing(e.target.value) }} /> </label>
              {json_t && json_t.length > 0 && json_t[0] === '[' && (
                <label>index: <input type="number" style={{ width: "50px" }} name="jsonIndex" value={jsonIndex} onChange={(e) => { setJsonIndex(Number(e.target.value)) }} /> </label>)}
              <br />
              <label>Move effect baseline up by: <input type="number" style={{ width: "50px" }} name="baseline" value={baselineOffset} onChange={(e) => setBaselineOffset(e.target.value)} /> </label>
              <br />
              <label>Move special evo text up by: <input type="number" style={{ width: "50px" }} name="specialOffset" value={specialOffset} onChange={(e) => setSpecialOffset(e.target.value)} /> </label>
              <br />
              <label>
                <input type="checkbox" checked={effectBox} onChange={(e) => { setEffectBox(e.target.checked) }} />
                Effect box </label>  <br />
              <label>
                <input type="checkbox" checked={drawFrame} onChange={(e) => { setDrawFrame(e.target.checked) }} />
                Card Frame </label>
              <label>
                <input type="checkbox" checked={addFoil} onChange={(e) => { setAddFoil(e.target.checked) }} />
                Add Foil </label>
              <label>
                <input type="checkbox" checked={aceFrame} onChange={(e) => { setAceFrame(e.target.checked) }} />
                ACE Frame (beta) </label>
              <br />
              <label>
                <input type="checkbox" checked={drawOutline} onChange={(e) => { setDrawOutline(e.target.checked) }} />
                Outline </label>  <br />
              <label style={{ display: "xxx" }} >
                <input type="checkbox" checked={skipDraw} onChange={(e) => { setSkipDraw(e.target.checked) }} />
                Skip Draw </label>  <br />
              <span> &nbsp; &nbsp; </span>
              <br /> Unimplemented:  burst, rarity <br />
            </span>
          </td>
          <td width={"25%"} valign={"top"}>
            <button onClick={() => sample(0)}> Sample Egg </button><br />
            <button onClick={() => sample(5)}> Sample Monster </button><br />
            <button onClick={() => sample(1)}> Sample Mega </button><br />
            <button onClick={() => sample(2)}> Sample ACE </button><br />
            <button onClick={() => sample(6)}> Sample Link </button><br />
            <button onClick={() => sample(3)}> Sample Option </button><br />
            <button onClick={() => sample(4)}> Sample Tamer </button><br />
            <p />
            <span>For now using these formatting hints while we figure out the best way:</span>
            <p>
              To have colors replaced by circles, put the color in parentheses.
            </p>
            <p> Put ⟦text⟧ in these crazy brackets to force the text to blue.</p>
            <p> Put text that would otherwise be blue in parens to make it purple, like ⟦(test)⟧ or [(Five Times Per Turn)].</p>
            <p> "Force Draw" may be needed in weird circumstances. </p>
          </td>
        </tr>
        <tr style={{ fontSize: "smaller" }} >
          <td width={"30%"} style={{ fontSize: "smaller" }}>
            Version {version} {latest}
            <p style={{ fontFamily: "ToppanBunkyExtraBold" }}>Ask support or request features over on <a href={invite}>Discord</a>.</p>
            <p style={{ fontFamily: "ProhibitionRough" }}><a href="./fontguide.html">FONT GUIDE</a> &nbsp; &nbsp;  <a href="./roadmap.txt">roadmap</a></p>
            <p style={{ fontFamily: "Roboto" }}>Some modern templates from <a href="https://www.reddit.com/r/DigimonCardGame2020/comments/14fgi6o/magic_set_editor_custom_card_new_template_bt14/">Weyrus and FuutsuFIX</a> based on work by Eronan.</p>
            <p style={{ fontFamily: "AyarKasone" }}> More templates from <a href="https://digi-lov.tumblr.com/post/748763635923435520/digimon-card-template">Digi-Lov</a></p>
            <p style={{ fontFamily: "FallingSky" }}>Shout out to pinimba, Zaffy, and Digimoncard.io who kept this dream alive in previous years.</p>
            <p style={{ fontFamily: "Asimov" }}> Classic templates originally came from Quietype on WithTheWill.</p>
            Check out my <a href="https://digi-viz.com/">other UI project</a>, beta-testers wanted!
            <br />
            <br />
            <br />
            <br />

          </td>
          <td colSpan={3}>
            <img src={banner} alt={"Digi Viz Card Creator"} style={{ width: "700", height: "224px", transform: "rotate(-1deg)", zIndex: -3 }} />
          </td></tr>
      </tbody>
    </table>

  );
}

export default CustomCreator;

