import React, { useRef, useState, useEffect } from 'react';
import { eggs, basics, options, tamers, evos, colorReplace } from './images';
import { fitTextToWidth, drawBracketedText } from './text';
import banner from './banner.png';
import egg from './egg.png';
import shieldsmasher from './shieldsmasher.png';
import rampager from './rampager.png'
import doublebind from './double-bind.png'
import amy from './amy.png';

import { Base64 } from 'js-base64';
import pako from 'pako';

// version 0.4.5  3+ colors and others
// version 0.4.4  less errors, fix egg text
// version 0.4.3  multi color, egg.
// version 0.4.2. Better error handling, re-orient custom image


function contrastColor(color) {
  if (["red", "blue", "green", "purple", "black"].includes(color)) return "white";
  return "black";
}
// draw in white text on the black stripe -- unless we're a black card with a white stripe, in which case draw black
function whiteColor(color) {
  if (color?.toLowerCase() === "black") return "black";
  return "white";
}

const starter_text_0 = `  {
   "cardType": "Egg",
    "cardLv": "Lv.2",
    "cardNumber": "CS2-01",
    "color": "Green",
    "evolveCondition": [],
    "evolveEffect": "[Your Turn] While you have a red Monster or Tamer in play, all your Monsters gain +1000 DP.",
    "dp": "-",
    "effect": "-",
    "id": "CS2-01",
    "name": {  "english": "Doggie Dagger"  },
    "playCost": "-",
    "form": "In-Training",
    "attribute": "Data",
    "type": "Sword",
    "rarity": "C"
  }
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
    "effect": "＜Vortex＞ \uff1cSecurity Attack +1\uff1e [Your Turn] When this monster attacks a Monster with [Shield] in its name, this Monster gets +5000 DP until the end of your opponent's turn.\\n[Security] [All Turns] Your Monsters get +1000 DP.",
    "evolveEffect": "-",
    "securityEffect": "-",
    "specialEvolve": "-",
    "attribute": "Data",
    "form": "Ultimate",
    "type": "Sword",
    "digiXros": "[DigiXros -3] [Axe Raider] x [Pikachu]",
    "dnaEvolve": "-",

    "aceEffect": "-",
    "burstEvolve": "-",
    "rarity": "Rare"
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
    "effect": "＜Resurrect＞ ＜Piercing＞ [When Evolving] Delete all of your opponent's Monsters with the biggest level. Then delete all of your opponent's Monsters with the smallest DP.",
    "securityEffect": "-",
    "attribute": "Virus",
    "form": "Ultimate",
    "type": "Sword/Shield",
    "digiXros": "-",

    "aceEffect": "-",
    "burstEvolve": "-",
    "rarity": "Secret Rare"
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
    "attribute": "Data",

    "rarity": "Rare"
    }`;

const starter_text = starter_text_1a;


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

function CustomCreator() {


  useEffect(() => {
    // first time init
  }, []);

  const params = new URLSearchParams(window.location.search);
  let share = params.get("share");
  let start = share ? decodeAndDecompress(share) : "";
  start ||= starter_text;
  const canvasRef = useRef(null);
  const [userImg, setUserImg] = useState(null);
  const [jsonText, setJsonText] = useState(start);
  const [imageOptions, setImageOptions] = useState({
    url: "", x_pos: 0, y_pos: 0, x_scale: 95, y_scale: 95
  }
  );

  const [showJson, setShowJson] = useState(false);
  const [formData, setFormData] = useState({}); // redundant
  const [shareURL, setShareURL] = useState("");

  const toggleView = () => {
    setShowJson(!showJson);
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
    draw();
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
    Object.entries(flattenedJson).map(([key, value]) => {
      formData[key] = value;
    }
    )
  }

  let jsonerror = "none";
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (canvas.width != 2977) {
      canvas.width = 2977;
      canvas.height = 4158;
    }
    draw(canvas, ctx);

  }, [userImg, jsonText]); // Redraw on image or text change

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

  const loadImageFromUrl = () => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // of CORS
    img.src = imageOptions.url;
    img.onload = () => {
      setUserImg(img);
    };
  };

  const sample = (number) => {
    console.log("UPDATING TO " + number);
    let text = '';
    switch (number) {
      case 0: text = starter_text_0; break;
      case 1: text = starter_text_1a; break;
      case 2: text = starter_text_1b; break;
      case 3: text = starter_text_2; break;
      case 4: text = starter_text_3; break;
      default: return;
    }

    setJsonText(text);
    console.log("SETTING JSON TEXT", text);
    jsonToFields(text);

  }

  const getShare = () => {
    console.log("jsonText", jsonText);
    const compressed = pako.deflate(jsonText);
    const encoded = Base64.fromUint8Array(compressed, true); // URL-safe
    console.log("encoded", encoded);
    let url = window.location.href + "?share=" + encoded;
    setShareURL(url);
    navigator && navigator.clipboard && navigator.clipboard.writeText(url) && alert("URL copied to clipboard");
  }

  //  const draw = (canvas, ctx) => {
  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let json;
    try {
      json = JSON.parse(jsonText);
    } catch {
      console.log("json error");
      return;
    }

    if (document.fred === 72) return;

    const colors = (json && json.color && json.color.toLowerCase().split("/")) || ["red"]; // todo: better default

    const frameImages = Array.from({ length: colors.length }, () => new Image());
    const baseImg = new Image();

    let t;
    let array = basics;
    let type = "MONSTER";
    if (t = json.cardType) {
      if (t.match(/option/i)) type = "OPTION";
      if (t.match(/tamer/i)) type = "TAMER";
      if (t.match(/egg/i) || t.match(/tama/i)) type = "EGG";
    }

    const _evos = json.evolveCondition;
    const afterLoad = () => {
      console.log(document.fred);
      console.log("LOADING");
      // Set the canvas dimensions

      // background image
      let back_img = userImg || baseImg;
      console.log(back_img);
      console.log("imageOptions", imageOptions);
      let i_width = canvas.width * Number(imageOptions.x_scale) / 100;
      let i_height = canvas.height * Number(imageOptions.y_scale) / 100;
      let i_x_pct = (100 - Number(imageOptions.x_scale)) / 2 + Number(imageOptions.x_pos);
      let i_y_pct = (100 - Number(imageOptions.y_scale)) / 2 + Number(imageOptions.y_pos);
      ctx.drawImage(back_img, i_x_pct * canvas.width / 100, i_y_pct * canvas.height / 100, i_width, i_height);
     
      // multicolor
      let w = canvas.width;
      let h = canvas.height;
      let len = frameImages.length;
      let fw = w / len; // frame width
      for (let i = 0; i < len; i++) {
        let frame = frameImages[i];
        if (!frame.src.match(/undefined/)){
          try {
            ctx.drawImage(frame,
              i * fw, 0, fw, h,
              i * fw, 0, fw, h);
          } catch { console.log(`img ${i} broken`, frame) };
        }
      }

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const height = 390;
      // evo circles
      if (_evos) {
        for (let n = _evos.length; n--; n >= 0) {
          console.log(`n is ${n} and height is ${height * n}`);
          const evo = _evos[n];
          const evo_level = `Lv.${evo.level}`;
          const evo_cost = evo.cost;
          const evo_color = evo.color.toLowerCase();
          const circle = new Image();
          circle.src = evos[evo_color];

          ctx.drawImage(circle, 60, 640 + height * n);
          // TODO: contrasting colors
          ctx.font = `bold 60px Roboto`;
          ctx.fillStyle = contrastColor(evo_color);
          ctx.fillText(evo_level, 355, 850 + height * n);
          ctx.font = `bold 170px Roboto`;
          ctx.fillStyle = contrastColor(evo_color);
          ctx.fillText(evo_cost, 355, 970 + height * n);
          ctx.strokeText(evo_cost, 355, 970 + height * n);
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
      const playcost = json.playCost;
      if (playcost && playcost !== "-") {
        ctx.font = 'bold 220px Roboto';
        ctx.fillStyle = 'white';
        ctx.fillText(playcost, x, 395);
      }

      if (type === "MONSTER") {


        // dp
        ctx.fillStyle = 'black';
        x = 2450;
        ctx.font = 'bold 300px Roboto';
        if (dp_k)
          ctx.fillText(dp_k, x, 380 - 60);
        ctx.font = 'bold 150px Roboto';
        if (dp_k > 9) x += 100;
        if (dp_m)
          ctx.fillText(dp_m, x + 200, 380 - 30);

        // level
        const level = (json.cardLv === "-") ? "Lv.-" : json.cardLv;
        ctx.font = '900 200px "Big Shoulders Text"'
        ctx.fillStyle = whiteColor(colors[0]);
        ctx.fillText(level, 410, 3400);
      }

      let delta_y = 0;
      switch (type) {
        case "OPTION": delta_y -= 100; break;
        case "TAMER":  delta_y -= 150; break;
        case "EGG":    delta_y -= 150; break;
        case "MONSTER": break;
        default: alert(1);
      }

      // name
      try {
        const name = json.name.english;
        const maxWidth = 1400;
        const initialFontSize = 240;
        const fontSize = fitTextToWidth(ctx, name, maxWidth, initialFontSize);
        ctx.font = `bold ${fontSize}px Roboto`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white'; // Text color

        ctx.lineWidth = 30; // Border width
        ctx.strokeStyle = 'black'; // Border color       
        ctx.strokeText(name, 1480, 3380 + delta_y);

        ctx.lineWidth = 10; // Border width
        ctx.fillText(name, 1480, 3380 + delta_y);
      } catch { };


      // card number
      const id = json.cardNumber;
      ctx.textAlign = 'right';
      ctx.fillStyle = contrastColor(colors[colors.length-1]);
      ctx.font = `bold 100px Arial`;
      ctx.fillText(id, 2780, 3400 + delta_y);

      // traits: form, attribute, type
      let form = json.form || '';
      let attribute = json.attribute || '';
      let c_type = json.type || '';
      // todo don't show when all blank
      const traits = ` ${form}      |     ${attribute}      |      ${c_type}      `;
      console.log("Traits", traits)
      ctx.fillStyle = whiteColor(colors[colors.length-1]);
      console.log("fill", ctx.fillStyle, colors[colors.length-1] );
      if (type === "TAMER") {
        ctx.fillStyle = 'black';
        delta_y += 50;
      }
      if (type === "EGG") {
        delta_y += 40;
      }

      ctx.font = `60px Roboto`;
      ctx.fillText(traits, 2780, 3500 + delta_y * 0.9);

      ///// MAIN TEXT 
      let y_line = 2800 - 400;
      // effect
      ctx.font = `bold 90px Arial`;
      ctx.textAlign = 'start';
      ctx.textBaseline = 'bottom'; // Align text to the bottom


      // DNA evo
      let dna_evo = json.dnaEvolve;
      if (dna_evo && dna_evo !== "-") {
        dna_evo = colorReplace(dna_evo);
        // BT10-009 EX3-014: shaded box
        // st19-10 solid box
        y_line = drawBracketedText(ctx, dna_evo, 300, y_line, 2400, 90, "bubble");
      }

      // special evo
      const spec_evo = json.specialEvolve;
      if (spec_evo && spec_evo !== "-") {
        // BT10-009 EX3-014: shaded box
        // st19-10 solid box
        y_line = drawBracketedText(ctx, spec_evo, 300, y_line, 2400, 90, "bubble");
      }

      const effect = json.effect;
      ctx.fillStyle = 'black';

      if (effect) {
        y_line = drawBracketedText(ctx, effect,
          //wrapText(ctx, effect, // + effect, 
          300, y_line,
          2400, 90);
      }

      // digixros, put right after effect for now
      const xros = json.digiXros;
      if (xros && xros !== "-") {
        // BT10-009 EX3-014: shaded box
        // st19-10 solid box
        /*y_line =  */ drawBracketedText(ctx, xros, 300, y_line, 2400, 90, "bubble");
      }

      // evo effect
      ctx.font = `bold 100px Arial`;
      ctx.font = `bold 90px Roboto`;
      ctx.textAlign = 'start';
      ctx.textBaseline = 'bottom'; // Align text to the bottom


      const evo_effect = json.evolveEffect;
      const sec_effect = (evo_effect && evo_effect !== "-") ? evo_effect : json.securityEffect;
      ctx.fillStyle = 'black';
      console.log("55555 " + delta_y);
      if (type === "EGG") delta_y += 40
      if (sec_effect) {
        drawBracketedText(ctx, sec_effect,
          900 + delta_y * 2, 3800 + delta_y * 2,
          1600, 90);
      }
    }

    // 1 for base, 1 per color, 1 per evo circle
    let imagesToLoad = 1 + colors.length + (_evos ? _evos.length : 0);
    let imagesLoaded = 0;
    const checkAllImagesLoaded = () => {
      imagesLoaded++;
      if (imagesLoaded === imagesToLoad) { // Change this number based on the number of images
        // Set the canvas dimensions  
        afterLoad();
      }
    };

    for (let f of frameImages) {
        f.onload = f.onerror = checkAllImagesLoaded
    }
    baseImg.onload = baseImg.onerror = checkAllImagesLoaded

    // have all images loaded before we draw

    switch (type) {
      case "OPTION": array = options; baseImg.src = doublebind; break;
      case "TAMER": array = tamers; baseImg.src = amy; break
      case "EGG": array = eggs; baseImg.src = egg; break;
      case "MONSTER": baseImg.src = shieldsmasher; break;
      default: alert(4);
    }
    // can i lock this in?
    if (json && json.name && json.name.english == "Rampager") {
      baseImg.src = rampager;
    }
    for (let i = 0; i < frameImages.length; i++) {
      frameImages[i].src = array[colors[i]]
    }

    if (_evos) {
      for (let n = _evos.length; n--; n >= 0) {
        const evo_color = _evos[n].color.toLowerCase();
        // will declaring the same image still have it loaded?
        const circle = new Image();
        circle.onerror = circle.onload = checkAllImagesLoaded;
        circle.src = evos[evo_color];
      }
    }

    console.log(`sources set ${imagesToLoad}`);

    //  setTimeout(() => afterLoad(), 100); // bad wat to sycnrhoncoursly load 
    //leftImg.onload = () => {
    // console.log("loading left...");
    //ightImg.onload = () => {


  }

  const handleExport = () => {
    /*  const canvas = canvasRef.current;
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'exported-image.png';
      link.click();*/
  };

  return (
    <table>
      <tr>
        <td>
          Ask support or request features over on <a href="https://discord.gg/MWEZYxG2">Discord</a>.
          <br />
          <button onClick={() => sample(0)}> Sample Egg </button><br />
          <button onClick={() => sample(1)}> Sample Monster A </button><br />
          <button onClick={() => sample(2)}> Sample Monster B </button><br />
          <button onClick={() => sample(3)}> Sample Option </button><br />
          <button onClick={() => sample(4)}> Sample Tamer </button><br />

        </td>
        <td colSpan={2}>
          <img src={banner} style={{ width: "792px", height: "224px", transform: "rotate(10deg)" }} />
        </td></tr>
      <tr>
        <td><br /><br /><br /></td>
      </tr>
      <tr>
        <td valign={"top"}>
          <button onClick={toggleView}>
            {showJson ? 'Show Key:Value Pairs' : 'Show JSON'}
          </button>
          <br />
          {showJson ? (

            <textarea cols={40} rows={20}
              value={jsonText}
              onChange={handleTextareaChange}

            //           onChange={(e) => handleTextAreaChange(e.target.value)}
            />
          ) : (
            <div>
              <table style={{ maxWidth: "300px" }}>
                {!flattenedJson ? (<tr><td>Error in JSON, try again <br /> ${jsonerror} </td></tr>
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
          )}

        </td>
        <td valign={"top"}>
          <div>
            <canvas ref={canvasRef}
              style={{
                width: '296px',  // Visually scale the canvas down for easier editing
                height: '416px'  // Visually scale the canvas down for easier editing
              }}>

            </canvas>
          </div>
        </td>
        <td valign={"top"}>
          Choose image:
          <input type="file" onChange={loadUserImage} />
          <br />
          --- OR ---
          <br />
          <input
            type="text"
            placeholder="Enter image URL"
            value={imageOptions.url}
            // onChange={(e) => setImageUrl(e.target.value)}
            onChange={updateImg}
          />
          <br />
          <button onClick={loadImageFromUrl}>Load Image from that URL</button>
          <br />
          Offset (in percent):
          X: <input type="number" style={{ width: "50px" }} name="x_pos" value={imageOptions.x_pos} onChange={updateImg} />
          Y: <input type="number" style={{ width: "50px" }} name="y_pos" value={imageOptions.y_pos} onChange={updateImg} />
          <br />
          Fill size (in percent):
          X: <input type="number" style={{ width: "50px" }} name="x_scale" value={imageOptions.x_scale} onChange={updateImg} />
          Y: <input type="number" style={{ width: "50px" }} name="y_scale" value={imageOptions.y_scale} onChange={updateImg} />
          <hr />
          <button onClick={draw}>Force Draw</button>

          <hr />

          <button onClick={handleExport}>Save Image Locally</button>
          <hr />
          <button onClick={getShare}>Share!</button>
          <br />
          <a class={{ fontSize: "8px;" }} href={shareURL}>{shareURL}</a>
          <hr />
          <span> Unimplemented: ace, burst, rarity <br />
          </span>
        </td>
      </tr>
    </table>

  );
}

export default CustomCreator;

