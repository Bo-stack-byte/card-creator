import React, { useRef, useState, useEffect } from 'react';
import { basics, options, tamers, evos, colorReplace } from './images';
import { fitTextToWidth, drawBracketedText } from './text';
import banner from './banner.png';
import egg from './egg.png';
import { Base64 } from 'js-base64';
import pako from 'pako';


// version 0.4. At least as good as the prior one.

function contrastColor(color) {
  if (["red", "blue", "green", "purple", "black"].includes(color)) return "white";
  return "black";
}
// draw in white text on the black stripe -- unless we're a black card with a white stripe, in which case draw black
function whiteColor(color) {
  if (color.toLowerCase() === "black") return "black";
  return "white";
}

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
    "block": ["00", "01"],
    "burstEvolve": "-",
    "rarity": "Rare"
  }`;

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
    "block": ["00", "01"],
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

  "block": ["01"],
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

    "rarity": "Rare",
    "block": ["01"]
    }`;

const starter_text = starter_text_1a;


const decodeAndDecompress = (encodedString) => {
  const decoded = Base64.toUint8Array(encodedString);
  const decompressed = pako.inflate(decoded, { to: 'string' });
  return decompressed;
//  return JSON.parse(decompressed);
};

function CustomCreator() {
  
  const params = new URLSearchParams(window.location.search);
  let share = params.get("share");
  console.log("share", share);
  let start = share ? decodeAndDecompress(share) : starter_text;
  console.log("start", start);
  const canvasRef = useRef(null);
  const [userImg, setUserImg] = useState(null);
  const [jsonText, setJsonText] = useState(start);
  const [imageUrl, setImageUrl] = useState("");
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

  let jsonerror = "none";
  const handleTextareaChange = (event) => {
    // update the form data
    console.log("event", event);
    console.log("json", event.target.value);
    let jsonTxt = event.target.value;
    setJsonText(jsonTxt);
    try {
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
    )
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
    console.log("in use, before draw");
    console.log(jsonText.substring(0, 200));
    draw();
    console.log("in use, after draw");

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
    img.src = imageUrl;
    img.onload = () => {
      setUserImg(img);
    };
  };

  const sample = (number) => {
    console.log("UPDATING TO " + number);
    switch (number) {
      case 1: setJsonText(starter_text_1a); break;
      case 2: setJsonText(starter_text_1b); break;
      case 3: setJsonText(starter_text_2); break;
      case 4: setJsonText(starter_text_3); break;
      default: // nothing
    }
  }

  const getShare = () => { 
    console.log("jsonText", jsonText);
    const compressed = pako.deflate(jsonText);
    const encoded = Base64.fromUint8Array(compressed, true); // URL-safe
    console.log("encoded", encoded);
    let url = window.location.href  + "?share=" + encoded;
    setShareURL(url);
    navigator && navigator.clipboard && navigator.clipboard.writeText(url) && alert("URL copied to clipboard");
  }

  const draw = () => {
    let json;
    try {
      json = JSON.parse(jsonText);
    } catch {
      console.log("json error");
      return;
    }
    console.log("parsing", json);

    const colors = (json && json.color && json.color.toLowerCase().split("/")) || ["white", "black"]; // todo: better default
    // default to 2 colors
    if (colors.length === 1) colors.push(colors[0]);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const leftImg = new Image();
    const rightImg = new Image();
    const eggImg = new Image();

    let t;
    let array = basics;
    if (t = json.cardType) {
      if (t.match(/option/i)) array = options;
      if (t.match(/tamer/i)) array = tamers;
    }

    eggImg.src = egg;

    console.log(1233);
    const _evos = json.evolveCondition;

    const afterLoad = () => {
      console.log("LOADING");
      // Set the canvas dimensions
      canvas.width = 2977;
      canvas.height = 4158;

      if (userImg) {
        ctx.drawImage(userImg, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.drawImage(eggImg, 0, 0, canvas.width, canvas.height);
      }

      // Draw the left half of the left image scaled down

      try {
        ctx.drawImage(leftImg,
          0, 0, leftImg.width / 2, leftImg.height,
          0, 0, canvas.width / 2, canvas.height);
      } catch { };

      // Draw the right half of the right image scaled down
      try {
        ctx.drawImage(rightImg,
          rightImg.width / 2, 0, rightImg.width / 2, rightImg.height,
          canvas.width / 2, 0, canvas.width / 2, canvas.height);
      } catch { };

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

      if (t.match(/mon/i)) {


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
      if (t.match(/option/i)) {
        delta_y -= 100;
      }
      if (t.match(/tamer/i)) {
        delta_y -= 150;
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
      ctx.fillStyle = contrastColor(colors[1]);
      ctx.font = `bold 100px Arial`;
      ctx.fillText(id, 2780, 3400 + delta_y);

      // traits: form, attribute, type
      let form = json.form || '';
      let attribute = json.attribute || '';
      let type = json.type || '';
      // todo don't show when all blank
      const traits = ` ${form}      |     ${attribute}      |      ${type}      `;
      ctx.fillStyle = whiteColor(colors[1]);
      if (t.match(/tamer/i)) {
        ctx.fillStyle = 'black';
        delta_y += 50;
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
      if (sec_effect) {
        drawBracketedText(ctx, sec_effect,
          900 + delta_y * 2, 3800 + delta_y * 2,
          1600, 90);
      }
    }
    console.log(`srcs are ${array[colors[0]]} and ${array[colors[1]]}...`);

    let imagesToLoad = 2 + (_evos ? _evos.length : 0);
    let imagesLoaded = 0;
    const checkAllImagesLoaded = () => {
      imagesLoaded++;
      console.log("now", imagesLoaded);
      if (imagesLoaded === imagesToLoad) { // Change this number based on the number of images
        console.log("LOADING");
        // Set the canvas dimensions  
        afterLoad();
      }
    };

    // have all images loaded before we draw
    leftImg.onload = checkAllImagesLoaded;
    rightImg.onload = checkAllImagesLoaded;
    // if we get an error, still increment and continue
    leftImg.onerror = rightImg.onerror = eggImg.onerror = checkAllImagesLoaded;

    leftImg.src = array[colors[0]];
    rightImg.src = array[colors[1]];

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
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'exported-image.png';
    link.click();
  };

  console.log("a", flattenedJson);
  return (
    <table>
      <tr>
        <td>
          Ask support or request features over on <a href="https://discord.gg/MWEZYxG2">Discord</a>.
          <br />
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
              <table style={{maxWidth: "300px"}}>
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

          <input type="file" onChange={loadUserImage} />
          <br />
          --- OR ---
          <br />
          <input
            type="text"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <br />
          <button onClick={loadImageFromUrl}>Load Image from that URL</button>
          <br />
          <hr />
          <button onClick={draw}>Force Draw</button>
          <hr />
          <button onClick={handleExport}>Save Image Locally</button>
          <hr />
          <button onClick={getShare}>Share!</button>
          <br />
          <a href={shareURL}>{shareURL}</a>
          <hr />
          <span> Unimplemented: ace, block, <br />
           burst, rarity  <br />
          </span>
        </td>
      </tr>
    </table>

  );
}

export default CustomCreator;

