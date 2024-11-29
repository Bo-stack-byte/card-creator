import React, { useRef, useState, useCallback, useEffect } from 'react';
import { eggs, basics, classics, options, tamers, evos, colorReplace } from './images';
import {
  mon_background, mega_background, egg_background, option_background, tamer_background,
  outlines, outlines_egg, outlines_tamer, outline_option,
  cost, cost_egg, cost_option, cost_evo, costs, ace_logo,
  new_evo_circles, /* new_evo2_circles, */
  new_evo_wedges,
  bottom_evos, bottoms, bottoms_plain, borders, effectboxes,
  // inherits at bottom:
  bottom_aces, inherited_security,
  bottom_property_white, bottom_property_black

} from './images';

import { enterPlainText } from './plaintext';
import { fitTextToWidth, drawBracketedText, writeRuleText } from './text';
import banner from './banner.png';
import egg from './egg.png';
import shieldsmasher from './shieldsmasher.png';
import rampager from './rampager.png'
import doublebind from './double-bind.png'
import amy from './amy.png';
import armor_cat from './armorcat.png';
//import './styles.css';
import './local-styles.css';

import SaveState from './SaveState';
import RadioGroup from './RadioGroup';
import { Base64 } from 'js-base64';
import pako from 'pako';

const version = "0.5.9";
const latest = "save cards server-side";

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
    const radius = 140;

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);

    // Add color stops to the gradient
    gradient.addColorStop(0, 'white');  // Center of the circle
    gradient.addColorStop(0.6, colorMap(color));    // Edge of the circle

    // Use the gradient to fill the circle
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
  } catch (e) {
  }

}

function borderColor(colors) {
  for (let color of colors) {
    if (color === "white" || color === "yellow") return "black";
  }
  return "";
}

function edgeColor(color) {
  if (["red", "blue", "green", "purple", "black"].includes(color)) return "black";
  return "white";

}
function contrastColor(color) {
  if (["red", "blue", "green", "purple", "black"].includes(color)) return "white";
  return "black";
}
// draw in white text on the black stripe -- unless we're a black card with a white stripe, in which case draw black
function whiteColor(color) {
  if (color?.toLowerCase() === "black") return "black";
  return "white";
}

const starter_text_empty = `{
  "cardType": "Egg",
    "cardLv": "Lv.2",
    "cardNumber": "",
    "color": "Red",
    "evolveCondition": [],
    "evolveEffect": "-", 
    "dp": "-",
    "effect": "-",
    "name": {  "english": "Tama"  },
    "playCost": "-",
    "form": "In-Training",
    "attribute": "",
    "type": "",
    "rarity": "C",
    "rule": ""
  }`;

const starter_text_0 = `  {
   "cardType": "Egg",
    "cardLv": "Lv.2",
    "cardNumber": "CS2-01",
    "color": "Green",
    "evolveCondition": [],
    "evolveEffect": "[Your Turn] While you have a red Monster or Tamer in play, all your Monsters gain +1000 DP.",
    "dp": "-",
    "effect": "-",
    "name": {  "english": "Doggie Dagger"  },
    "playCost": "-",
    "form": "In-Training",
    "attribute": "Data",
    "type": "Sword",
    "rarity": "C",
    "rule": ""
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
    "cardType": "Monster",
    "name": {  "english": "Shield Smasher"  },
    "cardLv": "Lv.6",
    "cardNumber": "CS2-11",
    "color": "Blue/Red",
    "playCost": "12",
    "evolveCondition": 
      [{ "color": "Blue", "cost": "4", "level": "5" },
       { "color": "Red", "cost": "4", "level": "5" } ],
    "dp": "9000",
    "effect": "＜Vortex＞ \uff1cSecurity Attack +1\uff1e [Your Turn] When this monster attacks a Monster with [Shield] in its name, this Monster gets +5000 DP until the end of your opponent's turn.\\n[(Security)] [All Turns] Your Monsters get +1000 DP.",
    "evolveEffect": "-",
    "securityEffect": "-",
    "specialEvolve": "-",
    "attribute": "Data",
    "form": "Ultimate",
    "type": "Sword",
    "digiXros": "[DigiXros -3] [Axe Raider] x [Pikachu]",
    "dnaEvolve": "-",
    "burstEvolve": "-",
    "rarity": "Rare",
    "rule": ""
  }`;
//     "block": ["00", "01"], just remove this entirely, no one cares

const starter_text_1b = `  {
    "cardType": "Monster",
    "name": {  "english": "Rampager"  },
    "cardLv": "Lv.7",
    "cardNumber": "CS2-18",
    "color": "Yellow/Blue",
    "playCost": "14",
    "evolveCondition": 
      [{ "color": "Yellow", "cost": "5", "level": "6" },
       { "color": "Blue", "cost": "5", "level": "6" },
       { "color": "Green", "cost": "5", "level": "6" } ],
    "specialEvolve": "-",
    "dp": "14000",
    "dnaEvolve": "[DNA Digivolve] Yellow Lv.6 + Blue Lv.6\u00a0: Cost 0",
    "evolveEffect": "-",
    "effect": "\uff1cBlast DNA Digivolve (Colossal Sword + Onyx Shield)\uff1e\\n＜Resurrect＞ ＜Piercing＞ \\n [When Thinking] Delete all of your opponent's Monsters with the biggest level. Then delete all of your opponent's Monsters with the smallest DP.",
    "securityEffect": "-",
    "attribute": "Virus",
    "form": "Ultimate",
    "type": "Sword/Shield",
    "digiXros": "-",
    "aceEffect": "Overflow \uff1c-5\uff1e (As this card would move from the field or from under a card to another area, lose 4 memory.)",
    "burstEvolve": "-",
    "rarity": "Secret Rare",
    "rule": ""

  }
`
const starter_text_2 = `  {
  "cardType": "Option",
  "name": {      "english": "Double Bind"    },
  "cardNumber": "CS1-13",
  "color": "Yellow/Green",
  "evolveEffect": "-",
  "playCost": "7",
  "attribute": "Rock",
  "effect": "[Main] Suspend 2 of your opponent's Monsters. Then, return 1 of your opponent's suspended Monster to its owner's hand.",
  "securityEffect": "[Security] Activate this card's [Main] effect.",

  "rarity": "Rare"
  }`;

const starter_text_3 = `   {
    "cardType": "Tamer",
    "cardNumber": "CS2-17",
    "color": "Blue/Red",
    "effect": "[Start of Your Main Phase] If you have a monster, gain 1 memory.\\n[Main] By suspending this Tamer, until the end of your opponent's turn, 1 of your opponent's Monsters gains \\"[Start of Your Main Phase] Attack with this Monster\\".",
    "name": {   "english": "Aggressive Amy"   },
    "playCost": "3",
    "securityEffect": "[Security] Play this card without paying the cost.",
    "type": "Data",
    "rarity": "Rare"
    }`;

const starter_text = starter_text_empty;


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

// show i of len piece, scaled by scale, start at x,y
function scalePartialImage(ctx, img, i, len, scale, start_x, start_y, crop_top = 0) {

  if (!img) return;
  let y = scale; let x = y * (img.width / img.height);
  let fw = x / len; // smaller frame length here
  let ww = img.width / len;
  let top = 0; let bottom = 0;
  if (crop_top > 0) top = crop_top;
  if (crop_top < 0) bottom = crop_top;
  ctx.drawImage(img,
    i * ww, top, // crop x,y
    ww * 1.2, img.height + bottom, // crop w,h
    start_x + i * fw, start_y, // place x,y
    x / len * 1.2, y // place w,h
  );

}






function CustomCreator() {
  useEffect(() => {
    console.error("FIRST TIME");
    let ref = params.get("ref");
    console.error(285, ref);
     if (ref) restoreState(ref);
  
    // first time init
  }, []);

  let restoreState = async (ref) => {
    console.error(302, ref);
    try {
      const response = await fetch(`/api/data/${ref}`);
      const result = await response.json();
      const cardState = result.cardState;
      console.error(288, cardState);
      if (cardState.fontSize) setFontSize(cardState.fontSize);
      if (cardState.jsonText) setJsonText(cardState.jsonText);
    } catch (err) {
      console.error('Error restoring:', err);
    }
  };


  const params = new URLSearchParams(window.location.search);
  let share = params.get("share");
  let start = share ? decodeAndDecompress(share) : "";
  start ||= starter_text;
 const canvasRef = useRef(null);
  const [userImg, setUserImg] = useState(null);
  const [doDraw, setDoDraw] = useState(true);
  const [jsonText, setJsonText] = useState(start);
  const [fontSize, setFontSize] = useState(90);
  const [selectedOption, setSelectedOption] = useState('AUTO'); // radio buttons 
  const [imageOptions, setImageOptions] = useState({
    url: "", x_pos: 0, y_pos: 0, x_scale: 95, y_scale: 95
  }
  );
 
  
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // copied from the customs channel

  let custom_1 = `     ʟᴠ.3 — ScrapBacomon
[Rookie | Data | Mutant/ʟᴍᴡ] [Gre.]
Play cost: 3 | Digivolution: 0 from Lv.2 [Gre.]
     1000 DP

[Rule] Trait: Has the [Free] type.
[On Play] Reveal the top 3 cards of your deck. Add 1 card with the [Mutant] traut and 1 card with the [ʟᴍᴡ] trait among them to the hand. Return the rest to the bottom of the deck.

     · Inherited Effect:
[All Turns] [Once Per Turn] When 1 other Digimon digivolves, <Draw 1>.
`;
  let custom_2 = `Imperialdramon: Fighter Mode 
Purple/Red | Lv.6
13000 DP
Play cost: 13
Digivolution cost: 5 from purple or red Lv.5
[[Digivolve] [Imperialdramon: Dragon Mode]: Cost 2]
Mega | Virus | Ancient Dragonkin 

<Security A. +1> <Piercing>
[When Digivolving] By returning 1 Multicolor Digimon card from this Digimon's digivolution cards to the hand, return all digivolution cards of 1 of your opponent's Digimon with as high or lower level as returned card to the bottom of the deck. Then, delete it.
[Your Turn] This Digimon doesn't activate [Security] effects of the cards it checks.
`;
  let custom_3 = `Patamon
Level 3 yellow/purple
Playcost: 3
Digivolve: 1 from lvl 2 yellow/purple
Rookie | Data | Mammal
1000 DP
[Digivolve] [Tokomon]: Cost 0

[On Play] Reveal the top 3 cards of your deck. Add 1 card with the [Mythical Beast] trait and 1 card with the [LIBERATOR] trait among them to the hand. Return the rest to the bottom of the deck. 

[Rule] Trait: Also has [Mythical Beast] Type.
-----
Inherited Effect: [On Deletion] You may place 1 card from either player's trash face down in the battle area as a [Relic] Option card. (Option/White/Relic/"[Main] <Delay> Lose 1 Memory")
`;
  let custom_4 = `Steal!!!! — [Option]
[Gre.]
Cost: 3

     [Main] <Draw 1> for every Tamer your opponent has in play.

     · Security Effect: [Security] <Draw 1>, then add this card to the hand.`;

  const customs = [
    custom_1,
    custom_2, custom_3, custom_4
  ];
  const custom_starter = customs[Math.floor(Math.random() * customs.length)];
  const [showJson, setShowJson] = useState(2);
  const [formData, setFormData] = useState({}); // redundant
  const [shareURL, setShareURL] = useState("");
  const [freeform, setFreeForm] = useState(custom_starter);

  const toggleView = () => {
    setShowJson((showJson + 1) % 3);
  };

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

  const updateImg = (e) => {
    const { name, value } = e.target;
    setImageOptions(prevState => ({
      ...prevState,
      [name]: value
    }));
    //    draw(); handled by useEffect()
  };

  const jsonToFields = (text) => {
    try {
      parsedJson = JSON.parse(text);
      flattenedJson = flattenJson(parsedJson);
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

  const handleFreeformChange = (event) => {
    console.log(302, event.target.form.free.value);
    let input = event.target.form.free.value;
    if (input.length < 5) return;
    console.log(304, input);
    let jsonTxt = enterPlainText(input.split("\n"));
    console.log(307, jsonTxt);
    setJsonText(jsonTxt);
    jsonToFields(jsonTxt);

  }

  const handleTextareaChange = (event) => {
    // update the form data
    let jsonTxt = event.target.value;
    setJsonText(jsonTxt);
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

  const handleInputChange = (key, value) => {
    console.log("form data", formData);
    const newFormData = { ...formData, [key]: value };
    setFormData(newFormData);

    // Update the JSON text based on form data
    try {
      const updatedJson = JSON.parse(jsonText);
      const keys = key.split('.');
      let current = updatedJson;
      keys.forEach((k, index) => {
        if (index === keys.length - 1) {
          current[k] = value;
        } else {
          current = current[k];
        }
      });

      setJsonText(JSON.stringify(updatedJson, null, 2));
    } catch {
      // json error
    }
  };

  let parsedJson, flattenedJson;
  try {
    parsedJson = JSON.parse(jsonText);
    flattenedJson = flattenJson(parsedJson);
    console.log(flattenedJson);
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
    switch (number) {
      case 0: text = starter_text_0;; img_src = egg; break;
      case 1: text = starter_text_1a; img_src = shieldsmasher; break;
      case 2: text = starter_text_1b; img_src = rampager; break;
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
      setJsonText(text);
    } else {
      setFreeForm("");
      if (showJson === 2) setShowJson(0);
      setJsonText(text);
    }
    console.log("SETTING JSON TEXT", text);
    jsonToFields(text);
    if (img_src) {
      const img = new Image();
      img.src = img_src;
      img.onload = () => {
        setUserImg(img);
      };
    }
    console.log(433, "making true");
    setDoDraw(true);
  }

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
  }

  const draw2 = (x, y) => draw(x, y, true);

  //  const draw = (canvas, ctx) => {
  //  const draw = async (x, y, clear) => {

  const draw = useCallback(async (x, y, clear) => {
    if (!doDraw) return false;
    console.error("START DRAW");
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    console.log("===");
    if (clear) {
      console.log("clear is ", clear);
      //canvas.width = 2977;
    }
    if (document.fonts.check('bold 60px Roboto')) {
      //      console.error("roboto pass1");
    } else {
      //      console.error("roboto fail1");
    }

    await document.fonts.ready;

    if (document.fonts.check('bold 60px Roboto')) {
      //    console.error("roboto pass2");
    } else {
      //   console.error("roboto fail2");
    }


    if (clear === true) {
      canvas.width = 2977;
      canvas.height = 4158 - 17;
    }
    let json;
    try {
      json = JSON.parse(jsonText);
    } catch {
      console.log("json error");
      return;
    }

    if (document.fred === 72) return;

    let modern = 1;


    let t;
    let array = basics;
    let background = mon_background;
    if (modern) array = outlines;
    if (document.getElementById("classic").checked) array = classics;
    console.log(503, selectedOption);
    let type = selectedOption;
    let overflow = undefined;
    if (type === "AUTO") {
      type = "MONSTER";
      if (json.cardLv === "Lv.6" || json.cardLv === "Lv.7") {
        type = "MEGA";
      }
      if (json.aceEffect && json.aceEffect.length > 5) {
        type = "ACE";
      }
      if ((t = json.cardType)) {
        if (t.match(/option/i)) { type = "OPTION"; }
        if (t.match(/tamer/i)) {
          type = "TAMER";
          if (json.evolveEffect && json.evolveEffect !== "-")
            type = "TAMERWITHINHERIT";
        }
        if (t.match(/egg/i) || t.match(/tama/i)) { type = "EGG"; }
      }
    }
    switch (type) {
      case "MEGA": background = mega_background; break;
      case "OPTION": background = option_background; break;
      case "TAMER":
      case "TAMERINHERIT":
        background = tamer_background; break;
      case "EGG": background = egg_background; break;
      case "MONSTER": break;
      case "ACE":
        let match = json.aceEffect && json.aceEffect.match(/Overflow\s*.-(\d+)/i);
        console.log(524, match);
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

    console.log(467, type, background);
    const colors = (json && json.color && json.color.toLowerCase().split("/")) || ["red"]; // todo: better default
    // options don't need to load frames
    const len = (type === "OPTION") ? 1 : colors.length;
    const frameImages = Array.from({ length: len }, () => new Image());
    const baseImg = new Image();
    // baseImg.loaded = false;
    baseImg.src = egg; // default to get started
    const shellImg = new Image();

    const _evos = json.evolveCondition;
    const afterLoad = async () => {
      console.log(document.fred);
      console.log("LOADING2");
      console.log(json);


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


      // background image
      let back_img = userImg || baseImg;
      //      console.log("imageOptions", imageOptions);
      let i_width = canvas.width * Number(imageOptions.x_scale) / 100;
      let i_height = canvas.height * Number(imageOptions.y_scale) / 100;
      let i_x_pct = (100 - Number(imageOptions.x_scale)) / 2 + Number(imageOptions.x_pos);
      let i_y_pct = (100 - Number(imageOptions.y_scale)) / 2 + Number(imageOptions.y_pos);
      ctx.drawImage(back_img, i_x_pct * canvas.width / 100, i_y_pct * canvas.height / 100, i_width, i_height);

      if (modern) {
        // new style background
        // we know shellimg is loaded because of pre-flight
        //        shellImg.src = background;
        ctx.drawImage(shellImg, 0, 0, canvas.width, canvas.height);

        ctx.textAlign = 'center';
        ctx.fillStyle = (type === "OPTION") ? 'white' : 'black'; // ?

        ctx.font = `bold 80px Roboto`;
        ctx.fillText(json.cardType.toUpperCase(), 1480, 180);
      }

      //   let w = canvas.width;
      //      let h = canvas.height;
      let len = colors.length;
      // multicolor
      //    let fw = w / len; // frame width
      let offset_x = 90, offset_y = 72;
      if (!modern) { offset_x = 0; offset_y = 0; }

      let bottom = offset_y + 2760;
      if (type === "EGG") bottom -= 640;
      if (type === "MONSTER") bottom -= 500;
      if (type === "ACE") bottom -= 480;
      if (type === "TAMER" || type === "TAMERINHERIT") bottom -= 640;

      const effectbox = document.getElementById("effectbox").checked;
      if (effectbox) {
        for (let i = 0; i < len; i++) {
          let col = colors[i];
          if (!col) continue;
          let box = new Image();
          box.src = effectboxes[col];
          scalePartialImage(ctx, box, i, len, 825, offset_x + 80, bottom);
        }
      }

      bottom += 800;
      let rule = json.rule;
      if (rule && rule.length > 1) {
        writeRuleText(ctx, rule, fontSize, bottom);
      }


      if (type === "MEGA") {
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
      for (let i = 0; i < len; i++) {
        let frame = frameImages[i];
        if (modern) {
          let name_field = bottoms; // i'm so sorry this is named 'bottom'
          if (type === "OPTION" || type === "TAMER" || type === "TAMERINHERIT") name_field = bottoms_plain;
          let col = colors[i];

          if (outlines[col]) {

            // why bother doing "top" differently?
            //              let top = new Image(); top.src = outlines[col];
            // left/top/right of outline, sometimes bottom
            if (frame) {
              let l = (type === "OPTION") ? 1 : len; // just 1 option "outline"
              let fudge = (type === "OPTION" || !i) ? 0 : 0.04;
              fudge = 0;
              // 1.05 is fudge factor because our frames aren't all left-justified the same
              // this makes them  the same, but they might be the same wrong
              scalePartialImage(ctx, frame, i + (fudge), l, 3950, offset_x, offset_y);
            }
            // very bottom, evo conditions

            if (type !== "MEGA") {
              let img = bottom_evos[col];
              // scale = 606 specifically for bottom_evo_${color}.png
              let scale = 735;
              let height = 3550;
              if (type === "ACE") {
                img = bottom_aces[col];
                scale = 606;
              }
              if (type === "OPTION" || type === "TAMER") {
                img = inherited_security[col];
                scale = 740;
                height = 3450;
              }
              if (type === "TAMERINHERIT") {
                // tamer inherit has ESS box but raised height
                height = 3450;
              }
              scalePartialImage(ctx, img, i, len, scale, 164, height);
            }
            if (type === "MONSTER" || type === "MEGA" || type === "ACE") {
              // bottom of frame
              let border = borders[col];
              let y = 3550 - 440;
              if (type === "MEGA") y += 500;
              if (type === "ACE") y += 1;
              scalePartialImage(ctx, border, i, len, 67.3, 166, y);

              // todo: play with these numbers some more. scale is 67.2-67.5,
              // and left is 166
            }
            // name block
            let y = 3550 - 365;
            if (type === "EGG" || type === "OPTION" || type === "TAMER" || type === "TAMERINHERIT") y -= 90;
            if (type === "OPTION" || type === "TAMER" || type === "TAMERINHERIT") y += 0; // 40;
            if (type === "MEGA") y += 500;
            let img_name = name_field[col];
            let scale = 364.2;
            if (type === "OPTION" || type === "TAMER" || type === "TAMERINHERIT") scale = 305;
            scalePartialImage(ctx, img_name, i, len, scale, 164, y);


            // do the black (white) bar on anything with a trait, or anything with "Lv.*" text
            if (i === len - 1) {
              let skip = false;
              let bar_offset = 273;

              if (type === "OPTION" || type === "TAMER" || type === "TAMERINHERIT") {
                skip = true;
                bar_offset = 242;
              }
              if (!empty(json.form) || !empty(json.attribute) || !empty(json.type)) skip = false;

              // do underline for traits, check st19 arisa because Tamers might need it
              if (!skip) {
                let bar_img = (colors[0] === "black") ? bottom_property_white : bottom_property_black;

                let scale = 4.015;
                ctx.drawImage(bar_img,
                  162, y + bar_offset,
                  bar_img.width * scale,
                  bar_img.height * scale * 1.06) // stretch a little
              }
            }
          }
        }
      }

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const height = 390;
      // evo circles
      if (_evos && _evos.length > 0) {

        // only two handled for now
        offset_y -= 20;
        if (modern) ctx.drawImage(cost_evo, offset_x, offset_y + 600, 500, 500);

        let base = -135; // degrees
        let each = 360 / (_evos.length);
        for (let n = 0; n < _evos.length; n++) {
          //console.log(`n is ${n} and height is ${height * n}`);
          const evo = _evos[n];
          if (!evo.level) continue;

          const evo_level = `Lv.${evo.level}`;
          const evo_cost = evo.cost;
          const evo_color = evo.color.toLowerCase();

          const circle = new Image();
          let X = offset_x + 130;
          let Y = offset_y + 125 + 600;

          // only handling 2 colors for now
          if (modern) {
            const wedge = new Image();
            wedge.src = new_evo_wedges[evo_color];

            let circles =  /* n? new_evo2_circles : (*/ new_evo_circles;
            circle.src = circles[evo_color];
            //  circle.onload = () => {
            //  console.log(735, "onload for " + evo_color);
            let x = X;
            let y = Y;
            const imgWidth = 310; // Your image display width
            const imgHeight = 310; // Your image display height

            const radius = imgWidth / 2;
            // TODO: wait for .onLoad();
            let start = base + n * each
            const startAngle = (start * Math.PI) / 180;
            const sweepAngle = (each * Math.PI) / 180;
            console.log(823, startAngle, sweepAngle);

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x + radius, y + radius);
            ctx.arc(x + radius, y + radius, radius, startAngle, startAngle + sweepAngle);
            ctx.lineTo(x + radius, y + radius);
            ctx.clip();
            ctx.drawImage(circle, 0, 0, 291, 291, x, y, imgWidth, imgHeight);
            ctx.restore();


            ctx.drawImage(wedge, 0, 0, 291, 291, x - 134, y - 118, 5.27 * wedge.width, 5.27 * wedge.height);
            //       }
          } else {
            circle.src = evos[evo_color];
            ctx.drawImage(circle, 60, 640 + height * n);
            coloredCircle(canvas, 370, 920 + height * n, evo_color);
          }
          // we're drawing this with every circle
          let index = modern ? 0 : n;

          ctx.font = `bold 60px Roboto`;
          ctx.lineWidth = 5;
          ctx.strokeStyle = edgeColor(evo_color);
          ctx.strokeText(evo_level, 355, 850 + height * index);
          ctx.fillStyle = contrastColor(evo_color);
          ctx.fillText(evo_level, 355, 850 + height * index);


          ctx.font = `bold 170px Roboto`;
          ctx.lineWidth = 10;
          ctx.strokeStyle = edgeColor(evo_color);
          ctx.strokeText(evo_cost, 355, 970 + height * index);
          ctx.fillStyle = contrastColor(evo_color);
          ctx.fillText(evo_cost, 355, 970 + height * index);
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
      //playcost
      const playcost = json.playCost !== "-" ? json.playCost : undefined;
      if (type === "MONSTER" || type === "EGG" || true) {
        if (modern) {
          let img = playcost ? cost : cost_egg;
          if (type === "OPTION") img = cost_option;
          ctx.drawImage(img, offset_x, offset_y, 500, 500);
          for (let color of colors) {
            let i = costs[color];
            if (i) ctx.drawImage(i, offset_x, offset_y, 500, 500);
          }
        }
        if (playcost) {
          ctx.font = 'bold 250px Helvetica';
          ctx.fillStyle = 'white';
          ctx.fillText(playcost, x + 15, 380 - 20);
        }
      }


      if (type === "ACE" && overflow) {
        ctx.font = `70px FallingSky`;

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

      }

      if (type === "MONSTER" || type === "MEGA" || type === "ACE") {

        // dp
        ctx.fillStyle = 'black';
        x = 2450;
        ctx.font = 'bold 300px Helvetica';
        if (dp_k) {
          ctx.lineWidth = 15;
          ctx.strokeStyle = 'white';
          ctx.strokeText(dp_k, x, 380 - 100);
          ctx.fillText(dp_k, x, 380 - 100);
        }
        ctx.font = 'bold 150px Helvetica';
        if (dp_k > 9) x += 100;
        if (dp_m) {
          ctx.lineWidth = 15;
          ctx.strokeStyle = 'white';
          ctx.strokeText(dp_m, x + 200, 380 - 60);
          ctx.fillText(dp_m, x + 200, 380 - 60);
        }
        ctx.font = '100px Helvetica';
        ctx.lineWidth = 15;
        ctx.strokeStyle = 'white';
        ctx.strokeText("DP", x + 240, 380 - 180);
        ctx.fillText("DP", x + 240, 380 - 180);
      }
      if (type === "EGG" || type === "MONSTER" || type === "MEGA" || type === "ACE") {
        // level
        const level = (json.cardLv === "-" || json.cardLv === undefined) ? "Lv.-" : json.cardLv;
        ctx.font = '900 200px "Big Shoulders Text"'
        // roboto preferred
        //        ctx.font = '900 200px "Roboto"'

        ctx.fillStyle = whiteColor(colors[0]);
        let y = 3400;
        if (type === "EGG") y -= 100;
        if (type === "MEGA") y += 500;
        ctx.fillText(level, 390, y);
      }

      let delta_y = 0;
      switch (type) {
        case "OPTION":
        case "TAMER":
        case "TAMERINHERIT": delta_y -= 130; break;
        case "EGG": delta_y -= 100; break;
        case "MEGA": delta_y += 500; break;
        case "MONSTER": case "ACE": break;
        default: alert(1);
      }

      // name
      try {
        const name = json.name.english;
        let ace_offset = (type === "ACE") ? -ace_logo.width / 2 : 0;
        const maxWidth = 1700 + ace_offset * 2;

        const initialFontSize = 200;
        const fontSize = fitTextToWidth(ctx, name, maxWidth, initialFontSize, 150);
        // PF Das Grotesk Pro Bold is the actual font but $$
        //ctx.font = `bold ${fontSize}px Roboto`; // better looking I
        //        ctx.font = `700 ${fontSize}px Schibsted Grotesk`; // has curved lowercase l
        ctx.font = `700 ${fontSize}px FallingSky`; // has curved lowercase l
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';

        ctx.lineWidth = 30; // Border width
        let bc = borderColor(colors);
        ctx.strokeStyle = bc;

        let actualWidth = ctx.measureText(name).width;
        let scale = (maxWidth) / actualWidth;
        let endWidth = Math.min(maxWidth, actualWidth);
        console.log(918, scale);
        if (scale > 1) scale = 1;
        // at  a certain point we should do multiple lines
        ctx.save();
        ctx.scale(scale, 1);
        if (bc !== "") {
          ctx.lineWidth = 20; // Border width
          ctx.strokeText(name, (1480 + ace_offset) / scale, 3360 + delta_y);
        }
        ctx.lineWidth = 2; // Border width
        ctx.fillText(name, (1480 + ace_offset) / scale, 3360 + delta_y);
        ctx.restore();

        if (type === "ACE") {
          let end = endWidth / 2;
          ctx.drawImage(ace_logo, 1480 + ace_offset + end + 10, 3360 + delta_y - 100);
        }
      } catch { };


      // card number
      const id = json.cardNumber;
      ctx.textAlign = 'right';
      ctx.fillStyle = contrastColor(colors[colors.length - 1]);
      ctx.font = `bold 90px Arial`;
      ctx.fillText(id, 2780, 3400 + delta_y);

      // traits: form, attribute, type
      let form = json.form || '';
      let attribute = json.attribute || '';
      let c_type = json.type || '';
      // todo don't show when all blank
      let traits = ` ${c_type}   `;
      if (form || attribute) {
        traits = ` ${form}      |     ${attribute}      |   ${traits}`;
      }
      //console.log("Traits", traits)
      ctx.fillStyle = whiteColor(colors[0]);
      if (type === "TAMER" || type === "TAMERINHERIT" || type === "OPTION") {
        delta_y -= 10;
      }
      if (type === "MEGA") {
        delta_y += 50;
      }
      if (type === "EGG") {
        delta_y += 0;
      }

      ctx.font = `bold 60px Roboto`;
      ctx.fillText(traits, 2750, 3500 + delta_y * 0.9);

      ///// MAIN TEXT 
      let y_line = 2800 - 400;
      // effect
      if (type === "MEGA") y_line += 500 + 100;
      ctx.font = `bold 90px Arial`;
      ctx.textAlign = 'start';
      ctx.textBaseline = 'bottom'; // Align text to the bottom


      // DNA evo
      let dna_evo = json.dnaEvolve;
      if (dna_evo && dna_evo !== "-") {
        dna_evo = colorReplace(dna_evo);
        // BT10-009 EX3-014: shaded box
        // st19-10 solid box
        y_line = drawBracketedText(ctx, fontSize, dna_evo, 300, y_line, 3000, fontSize, "bubble");
      }

      // special evo
      const spec_evo = json.specialEvolve;
      if (spec_evo && spec_evo !== "-") {
        // BT10-009 EX3-014: shaded box
        // st19-10 solid box
        y_line = drawBracketedText(ctx, fontSize, spec_evo, 300, y_line, 3000, fontSize, "bubble");
      }

      let effect = json.effect;
      ctx.fillStyle = 'black';

      if (type === "MONSTER") y_line += 180;
      if (effect && effect !== "-") {
        effect = colorReplace(effect, true);
        y_line = drawBracketedText(ctx, fontSize, effect,
          //wrapText(ctx, effect, // + effect, 
          300, y_line,
          2455,
          fontSize, type === "OPTION" ? "effect-option" : "effect");
      }

      // digixros, put right after effect for now
      const xros = json.digiXros;
      if (xros && xros !== "-") {
        // BT10-009 EX3-014: shaded box
        // st19-10 solid box
        /*y_line =  */ drawBracketedText(ctx, fontSize, xros, 300, y_line, 3000, fontSize, "bubble");
      }

      // evo effect
      ctx.textAlign = 'start';
      ctx.textBaseline = 'bottom'; // Align text to the bottom


      const evo_effect = json.evolveEffect;
      console.log("a", evo_effect);
      const sec_effect = (evo_effect && evo_effect !== "-") ? evo_effect : json.securityEffect;
      //ctx.fillStyle = 'red';
      let delta_x = delta_y;
      if (type === "ACE") {
        delta_x -= 60; delta_y += 100;
      } else if (type === "TAMER" || type === "TAMERINHERIT" || type === "OPTION") {
        delta_x = 0; delta_y = -50;
      } else {
        delta_x = 0; delta_y = 0;
      }
      if (sec_effect && type !== "MEGA") {
        drawBracketedText(ctx, fontSize, sec_effect,
          700 + delta_x * 2, 3740 + delta_y * 2,
          2500 - 400 - delta_x * 2, fontSize, "effect");
      }
    }



    // 1 for basic style frame, 1 for custom image, 1 per color, 2 per evo circle
    let imagesToLoad = 2 + frameImages.length + 2 * (_evos ? _evos.length : 0);
    console.log(817, frameImages.length, _evos && _evos.length);
    let imagesLoaded = 0;
    console.log(818, frameImages);
    const checkAllImagesLoaded = (e) => {
      //      console.log(770, e);
      imagesLoaded++;
      console.log(771, "image loaded", imagesLoaded, imagesToLoad);
      if (imagesLoaded === imagesToLoad) { // Change this number based on the number of images
        // Set the canvas dimensions  
        afterLoad();
      }
    };

    for (let f of frameImages) {
      f.onload = f.onerror = function () { checkAllImagesLoaded(f); }
    }
    // this has a race condition    
    baseImg.onload = baseImg.onerror = function () { checkAllImagesLoaded(baseImg); }
    if (baseImg.complete) {
      console.error("base img already loaded");
      //    baseImg.src = baseImg.src; // reload
    } else {

    }
    shellImg.src = background;
    shellImg.onload = shellImg.onerror = function () { checkAllImagesLoaded(shellImg); }
    switch (type) {
      case "OPTION": array = options; break;
      // how is outlines_tamer different from outlines_egg??
      case "TAMER":
      case "TAMERINHERIT": array = modern ? outlines_tamer : tamers; break;
      case "EGG": array = modern ? outlines_egg : eggs; break;
      case "MONSTER": break;
      case "MEGA": break;
      case "ACE": break;
      default: alert(4);
    }

    if (type === "OPTION") {
      frameImages[0].src = outline_option;
    } else {
      for (let i = 0; i < frameImages.length; i++) {
        frameImages[i].src = array[colors[i]];
      }
    }
    console.log(803, frameImages);
    if (_evos) {
      for (let n = _evos.length; n--; n >= 0) {
        const evo_color = _evos[n].color.toLowerCase();
        // will declaring the same image still have it loaded?
        {
          const circle = new Image();
          circle.onerror = circle.onload = () => checkAllImagesLoaded(circle);
          circle.src = new_evo_circles[evo_color];
        }
        {
          const wedge = new Image();
          wedge.onerror = wedge.onload = () => checkAllImagesLoaded(wedge);
          wedge.src = new_evo_wedges[evo_color];
        }

      }
    }

    console.log(906, `sources set ${imagesToLoad} loaded ${imagesLoaded} base: ${!!baseImg.complete}`);

    //  setTimeout(() => afterLoad(), 100); // bad wat to sycnrhoncoursly load 
    //leftImg.onload = () => {
    // console.log("loading left...");
    //ightImg.onload = () => {


  }, [userImg, jsonText, imageOptions, selectedOption, doDraw, fontSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    console.log(1111, selectedOption, doDraw);

    if (canvas.width !== 2977) {
      canvas.width = 2977;
      canvas.height = 4158 - 17;
    }
    console.log(1113, doDraw);
    if (doDraw)
      draw(canvas, ctx);

  }, [
    userImg,
    jsonText,
    imageOptions, selectedOption,
    doDraw, fontSize,
    draw]);



  const handleExport = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'exported-image.png';
    link.click();
  };

  let json_modes = ["Fields", "JSON", "Freeform"];
  let button_text = `Showing ${json_modes[showJson]}, click to toggle to ${json_modes[(showJson + 1) % 3]}`;
  let invite = "https://discord.gg/PRXgdCwp";
  return (
    <table>
      <tr style={{ fontSize: "smaller" }} >
        <td width={"30%"} style={{ fontSize: "smaller" }}>
          Ask support or request features over on <a href={invite}>Discord</a>.
          <br />

          <p style={{ fontFamily: "Asimov" }}> Classic templates originally came from Quietype on WithTheWill.</p>
          <p style={{ fontFamily: "FallingSky" }}>Shout out to pinimba and Zaffy who kept this dream alive in previous years.</p>
          <p style={{ fontFamily: "Roboto" }}>Some modern templates from <a href="https://www.reddit.com/r/DigimonCardGame2020/comments/14fgi6o/magic_set_editor_custom_card_new_template_bt14/">Weyrus and FuutsuFIX</a> based on work by Eronan.</p>
          Check out my <a href="https://digi-viz.com/">other UI project</a>, beta-testers wanted!
          <br />
          <br />
          Version {version} {latest}
          <br />
          <br />
          <button onClick={() => sample(0)}> Sample Egg </button><br />
          <button onClick={() => sample(5)}> Sample Monster </button><br />
          <button onClick={() => sample(1)}> Sample Mega </button><br />
          <button onClick={() => sample(2)}> Sample ACE </button><br />
          <button onClick={() => sample(3)}> Sample Option </button><br />
          <button onClick={() => sample(4)}> Sample Tamer </button><br />

        </td>
        <td colSpan={2}>
          <img src={banner} alt={"Digi Viz Card Creator"} style={{ width: "792px", height: "224px", transform: "rotate(10deg)" }} />
        </td></tr>
      <tr>
        <td><br />Try pasting your custom card into the freeform field! A random one is there already to test...<br /><br /></td>
      </tr>
      <tr>
        <td
          width={"30%"}
          valign={"top"}>
          <RadioGroup selectedOption={selectedOption} handleOptionChange={handleOptionChange} />
          <button onClick={toggleView}>
            {button_text}
          </button>
          <br />
          {(showJson === 1) ? (

            <textarea cols={40} rows={20}
              value={jsonText}
              onChange={handleTextareaChange}

            //           onChange={(e) => handleTextAreaChange(e.target.value)}
            />
          ) : (showJson === 0) ? (
            <div>
              <table style={{ maxWidth: "300px" }}>
                {!flattenedJson ? (<tr><td>Error in JSON, try again <br /> {jsonerror} </td></tr>
                ) :
                  Object.entries(flattenedJson).map(([key, value]) =>
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
            <textarea defaultValue={freeform} name="free" cols={40} rows={10} /><br />
            <input type="button" value={"Parse Freeform card!"} onClick={handleFreeformChange} />
          </form>)}
        </td>
        <td valign={"top"}>
          <div>
            <canvas id="cardImage" ref={canvasRef}
              style={{
                width: '296px',  // Visually scale the canvas down for editing
                height: '416px',
                backgroundColor: '#eef'
              }}>

            </canvas>
          </div>
        </td>
        <td valign={"top"}>
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
          Offset (in percent):
          X: <input type="number" style={{ width: "50px" }} name="x_pos" value={imageOptions.x_pos} onChange={updateImg} />
          Y: <input type="number" style={{ width: "50px" }} name="y_pos" value={imageOptions.y_pos} onChange={updateImg} />
          <br />
          Fill size (in percent):
          X: <input type="number" style={{ width: "50px" }} name="x_scale" value={imageOptions.x_scale} onChange={updateImg} />
          Y: <input type="number" style={{ width: "50px" }} name="y_scale" value={imageOptions.y_scale} onChange={updateImg} />
          <hr />
          <button onClick={draw2}>Force Draw</button>

          <hr />

          <button onClick={handleExport}>Save Image Locally</button>
          <hr />
          <SaveState jsonText={jsonText} fontSize={fontSize} />
          <button onClick={getShare}>Share!</button>
          <br />
          <a class={{ fontSize: "8px;" }} href={shareURL}>{shareURL}</a>
          <hr />
          <span>
            <label>Font size: <input type="number" style={{ width: "50px" }} name="fontSize" value={fontSize} onChange={(e) => { console.log(1268, e.target.value); setFontSize(e.target.value) }} />Font Size </label>
            <br />
            <label><input name="classic" id="classic" type="checkbox" value="1" /> Try Classic Card Style (barely supported, probably broken, might be easier to load an old version)</label>
            <br />
            <label><input name="effectbox" id="effectbox" type="checkbox" value="1" /> Put effect box (this hasn't been used since BT14 but could help with contrast on light backgrounds)</label>

            <br />
            <br /> Unimplemented:  burst, rarity <br />
          </span>
        </td>
      </tr>
    </table>

  );
}

export default CustomCreator;

