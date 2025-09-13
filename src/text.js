
import _left_diamond from './frames/keywords/left-diamond.png';
import _middle_diamond from './frames/keywords/middle-diamond.png';
import _right_diamond from './frames/keywords/right-diamond.png';

import { dna_boxes, countColors, colorReplace, bubble, doublebubble } from './images';

let diamondLeft = new Image(); diamondLeft.src = _left_diamond;
let diamondMiddle = new Image(); diamondMiddle.src = _middle_diamond;
let diamondRight = new Image(); diamondRight.src = _right_diamond;


const font = 'MyriadProBold'
const boxfont = true ? "FallingSky" : "ToppanBunkyExtraBold";
const horizontal_limit = 2700;

export function center(str, len = 16) {
  let l = str.length;
  if (l >= len) return str;
  let left = (len - l) / 2;
  let right = (len - l - left);
  return " ".repeat(left) + str + " ".repeat(right)
}

export function fitTextToWidth(ctx, text, maxWidth, initialFontSize, limit) {
  const font = 'Asimov'; // Asimov'

  let fontSize = initialFontSize;
  ctx.font = `${fontSize}px ${font}`;

  while (ctx.measureText(text).width > maxWidth && fontSize > limit) {
    fontSize -= 1;
    ctx.font = `${fontSize}px ${font}`;
  }
  return fontSize;
}

function matchMagic(array, phrase) {
  // can precalc all these regexps
  let match = array.find(str => { let regexp = new RegExp(`^${str}$`, "i"); return phrase.match(regexp) });
  return !!match;
}

const magicWords = [
  "Breeding",
  "Hand",
  "Trash",
  "Security",

  "Digixros.{0,6}",
  "Assembly.{0,6}",
  "Link",
  "(DNA )?(Digi|E)volve",

  "All Turns",
  "Your Turn",
  "Opponent's Turn",
  "Start of Your Turn",
  "Start of Opponent's Turn",
  "Start of Your Main Phase",
  "Start of Opponent's Main Phase",
  "On Play",
  "On Deletion",
  "When Attacking",
  "When Evolving",
  "When Linking",
  "When Digivolving",
  "End of Attack",
  "End of Opponent's Turn",
  "End of Your Turn",
  "End of All Turns",
  "Counter",
  "Main",
  "Once Per Turn",
  "Twice Per Turn",
]

const customSplit = (str) => {
  const result = [];
  let buffer = "";
  let inTag = false;
  let isWhitespace = false;

  for (let char of str) {
    if (char === '<') {
      if (buffer) result.push(buffer);
      buffer = "<";
      inTag = true;
    } else if (char === '>') {
      buffer += ">";
      result.push(buffer);
      buffer = "";
      inTag = false;
    } else if (inTag) {
      buffer += char;
    } else if (/\s/.test(char)) {
      if (!isWhitespace && buffer) {
        result.push(buffer);
        buffer = "";
      }
      buffer += char;
      isWhitespace = true;
    } else {
      if (isWhitespace && buffer) {
        result.push(buffer);
        buffer = "";
      }
      buffer += char;
      isWhitespace = false;
    }
  }

  if (buffer) result.push(buffer);
  return result;
};

// unused?
export function isNeueLoaded(canvas) {
  //  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  ctx.font = `275px HelveticaNeue-CondensedBold`;
  let str1 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ&,';
  let len1 = ctx.measureText(str1).width;
  let str2 = 'IIIILLLL';
  let len2 = ctx.measureText(str2).width;
  console.log(82, len1, len2);
}

// return keywords as solid components, everything else
// as spaces. 
// What about spaces in [square brackets]?
function splitTextIntoParts(text) {
  //  const words = text.split(/((\[＜).*?(\]＞))/);
  //const words = text.split(/((\[).*?(\]))/);

  // first, split into <KEYWORDs> that may include brackets
  const first_pass = text.split(/(＜[^＞]+＞)/).filter(Boolean);

  let all_words = [];

  for (let token of first_pass) {
    if (token[0] === "＜") {
      all_words.push(token);
      continue;
    }

    //let second_pass oken.split(/([⟦⸨]).*([⟧⸩])/).filter(Boolean);

    let second_pass = token.split(/([⟦⸨][^⟧]+[⟧⸩])/).filter(Boolean);
    for (let thing of second_pass) {
      if (thing[0].match(/[⟦⸨]/)) {
        all_words.push(thing);
      } else {
        // split along word boundaries
        // things breaks support on older Safari

        let pieces;
        try {
          if (3 < 4) pieces = customSplit(thing);
          pieces = thing.split(/(?<=\s)(?=\S)|(?<=\S)(?=\s)/);
        } catch (e) {
          console.log("can't look behind"); // older safari
          pieces = thing.split(/\b/)
        }

        all_words.push(...pieces);

      }

    }
  }

  return all_words;
}

export function writeRuleText(ctx, rule, fontSize, bottom, preview = false) {
  let maxWidth = 2200;
  fontSize = Number(fontSize);
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillStyle = 'white';
  ctx.font = `italic ${(fontSize - 10)}px Asimov`;
  let text = rule;
  if (text.startsWith("[Rule]")) text = text.substring(6).trim();
  let width = ctx.measureText(text).width;
  let x = horizontal_limit - 50;
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 20;
  if (width > maxWidth) width = maxWidth;
  if (!preview) {
    ctx.fillRect(x - width, bottom - fontSize / 8, width + fontSize / 4, - fontSize * 0.7);
    ctx.strokeText(text, x, bottom, maxWidth);
    ctx.fillStyle = 'black';
    ctx.fillText(text, x, bottom, maxWidth);
  }
  // Rule:
  ctx.font = `${(fontSize - 10)}px Asimov`;
  let rule_word = "Rule"
  let rule_word_width = ctx.measureText(rule_word).width + 20;
  if (preview) return x - width - 10; // return start pos
  ctx.fillRect(x - width - 10, bottom + 10, -rule_word_width, -(Number(fontSize) + 20));
  console.log(730, x - width - 10, bottom + 10, -rule_word_width, -(fontSize + 20));
  // ctx.strokeStyle = 'white'; 
  ctx.fillStyle = 'white';
  ctx.fillText(rule_word, x - width - 20, bottom);
}


function drawRoundedRect(ctx, x, y, width, height, radius, stroke) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
  if (stroke) {
    ctx.stroke(); // Draw only the outline,m may be dead code now
  } else {
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'black';
    ctx.stroke(); // Draw only the outline,m may be dead code now
    ctx.fill();
  }
  ctx.restore();
}

function drawBubble(ctx, x, y, w, h, double = false) {
  ctx.globalAlpha = 0.9;
  let img = double ? doublebubble : bubble;
  ctx.drawImage(img, x - 20, y - h, w, h);
  ctx.globalAlpha = 1.0;

}

//x,y is upper left
function drawDnaBox(ctx, x, y, w, h, colors) {
  let alpha = 1.0
  if (colors.length === 0) {
    colors = ['white'];
    alpha = 0.6;
  };
  if (colors.length === 1) {
    colors.push(colors[0]);
  }

  // return;
  let images = colors.map(x => dna_boxes[x.toLowerCase()]).filter(x => x);
  console.log(135, images);
  const len = images.length;
  let per_width = w / len;

  const left = images[0];
  const right = images[len - 1];
  let hw = left.width / 2; // half-wdith

  // draw left-most box, 
  ctx.globalAlpha = alpha;
  ctx.drawImage(left, 0, 0, hw, left.height,
    x, y, per_width, h);
  // middle-boxes use combo of (50,95) + (5,50)
  for (let i = 1; i < len - 1; i++) {
    ctx.drawImage(images[i], hw, 0, hw * 0.9, left.height,
      x + per_width * i, y, per_width / 2 + 10, h);
    ctx.drawImage(images[i], hw * 0.1, 0, hw * 0.9, left.height,
      x + per_width * (i + 0.5), y, per_width / 2 + 10, h);
  }
  // draw right-most box
  ctx.drawImage(right, hw, 0, hw, right.height,
    x + per_width * (len - 1), y, per_width, h);
  ctx.globalAlpha = 1.0
  return;

};

//x,y is upper left
function drawColoredRectangle(ctx, x, y, width, height, color) {
  console.log(195, x, y, width, height, color);
  //#922969 darker ois lower
  if (color === 'bubble') {
    drawBubble(ctx, x, y, width, height);
    return;
  }
  if (color === 'doublebubble') {
    drawBubble(ctx, x, y, width, height, true);
    return;
  }
  const cardWidth = horizontal_limit; // !
  height = Number(height);
  let color0, color1, color2;
  switch (color) {
    case 'purple': color0 = '#720949'; color1 = '#b24999'; break;
    case 'green': color0 = 'darkgreen'; color1 = 'lightgreen'; break;
    case 'doublebubble':
    case 'bubble': color0 = 'black'; color1 = 'black'; break;
    case 'darkblue': color0 = '#0D1544'; color1 = '#4D5584'; break;
    case 'red': color0 = '#530B07'; color1 = '#A12015'; color2 = '#DB6D52'; break;
    case 'yellow': color0 = 'yellow'; color1 = 'yellow'; break;

    case 'blue':
    default:
      color0 = '#41386A'; color1 = '#4765CC'; color2 = '#55D8E6';
  }
  // Draw the background rectangle with gradient
  const gradient = ctx.createLinearGradient(x, y - height, x, y);
  gradient.addColorStop(0, color0);
  gradient.addColorStop(1, color1);
  if (color2) {
    gradient.addColorStop(0.3, color0);
    gradient.addColorStop(0.6, color1);
    gradient.addColorStop(0.99, color2);
  }
  let d = 0;
  if (color.includes('bubble')) {
    ctx.globalAlpha = 0.4;
    d = 10;
  }
  ctx.fillStyle = gradient;
  if (width > (cardWidth - x)) width = cardWidth - x;
  //let radius = (color === 'bubble') ? height / 2 : 0;
  //  ctx.fillRect(x - d, y - height - 10 - d, width + 10 + 2 * d, height + 2 * d, height / 3, false);
  drawRoundedRect(ctx, x - d, y - height - 10 - d, width + 0 + 2 * d, height + 2 * d, height / 3, false);
  ctx.globalAlpha = 1;
  if (color.includes('bubble')) { // dead code
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 8;
    drawRoundedRect(ctx, x - d, y - height - 10 - d, width + 0 + 2 * d, height + 2 * d, height / 3, true);
    //  ctx.strokeRect(x - d, y - height - 10 - d, width + 10 + d * 2, height + d * 2);
  }
  ctx.strokeStyle = '';
  ctx.lineWidth = 0;



}

// x,y is upper left? maybe center left

export function drawDiamondRectangle(ctx, x, y, width, height, color, strokeColor) {
  if (Math.random() < 0.0)
    _1drawDiamondRectangle(ctx, x, y, width, height)
  else
    _2drawDiamondRectangle(ctx, x, y, width, height, color, strokeColor)
}

function _1drawDiamondRectangle(ctx, x, y, width, height) {
  x = Number(x) - 20;
  height = Number(height) + 10;
  let f = 30; // fudge factor
  let cw = width - height - 1 * f + 20;

  let top = y - height * 0.9;
  ctx.drawImage(diamondLeft, x - f, top, height * 0.9, height);
  ctx.drawImage(diamondMiddle, x - f + height * 0.9, top, cw, height);
  ctx.drawImage(diamondRight, x + height * 0.9 + cw - f, top, height * 0.9, height);


}

function _2drawDiamondRectangle(ctx, x, y, width, height, color, strokeColor) {
  // Calculate the half-height and half-width for the triangles
  //console.log(238, x, y, width, height);
  y -= height;
  const halfHeight = height / 2;
  // Create the gradient from dark brown to medium brown
  const gradient = ctx.createLinearGradient(0, y, 0, y + height);
  gradient.addColorStop(0, color || '#7E3329'); // Dark brown
  gradient.addColorStop(0.6, color || '#C36327'); // Medium brown
  gradient.addColorStop(0.9, color || '#E38367'); // "light" brown

  // Begin drawing the shape
  ctx.beginPath();
  ctx.moveTo(x, y + halfHeight); // Start at the left triangle point
  ctx.lineTo(x + halfHeight / 2, y); // Top-left corner
  ctx.lineTo(x + width - halfHeight / 2, y); // Top-right corner
  ctx.lineTo(x + width, y + halfHeight); // Right triangle point
  ctx.lineTo(x + width - halfHeight / 2, y + height); // Bottom-right corner
  ctx.lineTo(x + halfHeight / 2, y + height); // Bottom-left corner
  ctx.closePath(); // Close the path

  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.lineWidth = 5;
  ctx.strokeStyle = strokeColor || 'black';
  ctx.stroke();
}

function splitByBrackets(input) {
  const regex = /\[[^\]]*\]/g;
  const matches = input.match(regex) || [];
  const parts = input.split(regex);

  let result = [];
  for (let i = 0; i < parts.length; i++) {
    result.push(parts[i]);
    if (i < matches.length) {
      result.push(matches[i]);
    }
  }
  return result;
}

function replaceBracketsAtStart(line) {
  // Tokenize the input string to handle both types of brackets

  const _tokens = splitByBrackets(line);
  // const tokens = line.match(/(\[[^\]]+\]|＜[^＞]+＞|\S+)/g);
  // console.log(339, _tokens);
  const tokens = _tokens.filter(l => l).flatMap(
    l => l.startsWith("[") ? l : l.match(/( \[[^\] ]+\] |＜[^＞]+＞|\S+|\s+)/g)
  );
  //  const _tokens = line.match(/( \[[^\] ]+\] |＜[^＞]+＞|\S+|\s+)/g);

  if (!tokens) return line;

  let replacing = true;

  for (let i = 0; i < tokens.length; i++) {
    // Check for brackets at the start of the line
    if (replacing && tokens[i].startsWith('[') && tokens[i].endsWith(']')) {
      tokens[i] = tokens[i].replace('[', '⟦').replace(']', '⟧');
    } else if (replacing && tokens[i].startsWith('＜') && tokens[i].endsWith('＞')) {
      // don't replace <＞ yet
    } else if (tokens[i].trim().length < 1) {
      // empty space is fine
    } else {
      // Stop replacing when a token is not in brackets
      replacing = false;
    }
  }

  return tokens.join('');
}


function prepareKeywords(str, replaceBrackets) {
  const output = (replaceBrackets ?
    replaceBracketsAtStart(str) :
    str);

  return output.replace(/(＜[^＞]*?＞)/g, (match) => {
    return match.replace(/ /g, '_');
  });
}

// ⟦ ⟧
// MAIN ENTRY POINT
// drawbracketedtext calls splittextintoparts

// if "extra" is "bubble" of "doublebubble", put text in black bubble
// if "extra" is "effect", then put all [bracketed text] at start of line in blue
// _maxWidth is unused :(
export function drawBracketedText(ctx, fontSize, text, x, y, _maxWidth, lineHeight, extra, preview = false) {

  // preprocess
  text = text.replaceAll('((', '⸨').replaceAll('))', '⸩');

  fontSize = Number(fontSize);
  let maxWidth = horizontal_limit - x;
  if (extra.includes("bubble")) maxWidth -= 150;
  //console.debug(308, "calling with", fontSize, text, y, "XXX", lineHeight);
  lineHeight = Number(lineHeight);
  let yOffset = y;
  let lines = [];
  text = text.replaceAll(/</ig, "＜").replaceAll(/>/ig, "＞");
  // console.log(341, text);
  let right_limit = horizontal_limit;
  const dna_colors = countColors(text);
  if (extra === "dna") text = colorReplace(text);
  //console.log(345, text);
  const paragraphs = text.split("\n");

  // no need for a lot of magic, just make sure each line first in 1
  if (extra === "doublebubble") {
    // force each line to fit
    let lines = text.split("\n");
    console.log(195.2, ctx.font);
    console.log(195.1, _maxWidth, lineHeight, lines.length);
    drawColoredRectangle(ctx, x - 10, y - fontSize, _maxWidth, lineHeight * lines.length * 1.2, extra);
    y -= lineHeight * lines.length * 1.1
    ctx.font = `italic ${fontSize}px Asimov`;
    for (let index in lines) {
      let line = lines[index];
      ctx.fillText(line, x, y+fontSize * .2, _maxWidth - 100);
 //     wrapAndDrawText(ctx, fontSize, line, x, y, extra, right_limit, preview);
      y += lineHeight * 0.9;
    }
    return;
  }


  for (let p = 0; p < paragraphs.length; p++) {
    let graf = prepareKeywords(paragraphs[p], extra.startsWith("effect"));
    const words = splitTextIntoParts(graf);
    let line = '';
    const italics = (extra === "bubble" || extra === "doublebubble" || extra === "dna") ? "italic" : "100";

    let scale = 1.0;


    for (let n = 0; n < words.length; n++) {
      ctx.font = `${italics} ${fontSize}px ${font}`;
      const testLine = line + words[n];//  + ' ';
      const metrics = ctx.measureText(testLine.replaceAll(/[＜＞[\]]/ig, ''));
      const testWidth = metrics.width * scale;

      //console.log(`XXX is ${testWidth} bigger than ${maxWidth}, added word ${words[n]} to ${line}`);

      if (testWidth > maxWidth && n > 0) {
        //      let currentWidth = ctx.measureText(line).width;
        //console.log(267, "pushing " + Math.round(currentWidth) + " <" + line + ">");
        //   wrapAndDrawText(ctx, line, x, yOffset, bracketedWords);
        line = line.trim();
        lines.push({ ctx, line, x, yOffset });

        line = words[n];//  + ' ';
        yOffset += lineHeight; // 117.5; //  117.5 for EX2-039 w/90.5 font:for smaller lines lineHeight* 1.3;
      } else {
        line = testLine;
      }
    }

    line = line.trim();
    // wrapAndDrawText(ctx, line, x, yOffset, bracketedWords);
    lines.push({ ctx, line, x, yOffset });
    yOffset += lineHeight; // use 117.5

    // 2700 should not be hard-coded
    let max_end = Math.max.apply(Math,
      lines.map(l => wrapAndDrawText(l.ctx, fontSize, l.line, l.x, l.yOffset, extra, right_limit, true)));
    //console.log(515, 'max end', max_end);


    if (max_end > right_limit) {
      // this will overflow anyway
      max_end = right_limit;
    }
    const pre_width = max_end - x;

    let h = (yOffset - y);
    if (extra.includes("bubble")) {
      if (!preview)
        drawColoredRectangle(ctx, x - 10, y - fontSize * 1.1 + h, pre_width + fontSize, yOffset - y, extra);
    }
    if (extra === "dna") {
      if (!preview) {
        drawDnaBox(ctx, x - fontSize * 0.5, y - fontSize * 1.3, pre_width + fontSize, (yOffset - y) * 1.1 + 20, dna_colors);
      }
    }
  }

  //console.log(372, lines);
  for (let line of lines) {
    wrapAndDrawText(line.ctx, fontSize, line.line, line.x, line.yOffset, extra, right_limit, preview);
  }



  return yOffset + lineHeight + 2;

}


// brackets to use:
//      ⸨ ⸩
// ⟦ 

function getColor(phrase, default_color = 'blue') {
  console.error(551, phrase);
  if (phrase.match(/DigiXros/i)) return 'green';
  if (phrase.match(/Assembly/i)) return 'green';
  if (phrase === "Link") return 'green';
  if (['Hand', 'Trash', 'Breeding'].includes(phrase)) return 'purple';
  if (['Once Per Turn', 'Twice Per Turn'].includes(phrase)) return 'red';
  if (phrase.match(/(Digi|E)volve/i)) return 'darkblue';
  return default_color;
}

// style is called 'extra' in other functions
function wrapAndDrawText(ctx, fontSize, text, x, y, style, cardWidth, preview = false) {
  //console.log(361, fontSize, text, x, y, style, preview);
  fontSize = Number(fontSize);
  y = Number(y);
  //  let cardWidth = 2700; // shouldn't be hard-coded; we need our start pos
  let lastX = x;
  let scale = 1;
  // ⟦⟧ 
  if (!preview) {
    let width = wrapAndDrawText(ctx, fontSize, text, x, y, style, cardWidth, true);
    if (width > cardWidth) scale = cardWidth / width;
    // compress all text equally, but we should let keywords stay a bit wider if we can    
  }
  //  ctx.save();
  // ctx.scale(scale, 1);

  let default_color = 'blue'; // default for [brackets]
  if (style === "effect") default_color = 'blue';
  if (style === "dna") default_color = 'darkblue';
  if (style === "bubble") default_color = 'green';

  // split by <> first
  let angle_phrases = text.split(/([<＜].*?[>＞])/);
  let phrases = [];
  for (let ap of angle_phrases) {
    let temp = ap.startsWith("＜") ? [ap] : ap.split(/([[⟦⸨].*?[\]⟧⸩])/);
    phrases.push(...temp);
  }
  //let phrases = text.split(/([[⟦].*?[\]⟧])/);
  phrases.forEach((phrase, index) => {
    let cleanPhrase = phrase.replace(/[⟦[\]⟧]/gi, "");
    //console.log(574, "p", phrase, "cp", cleanPhrase)
    if (
      (phrase.startsWith("⟦") && phrase.endsWith("⟧")) ||
      (phrase.startsWith("⸨") && phrase.endsWith("⸩")) ||
      (phrase.startsWith("[") && phrase.endsWith("]") && matchMagic(magicWords, cleanPhrase)) ||
      (false && phrase.startsWith("[") && phrase.endsWith("]") && index < 2)// first hrase
    ) {
      // Calculate the width of the bracketed text
      let color = getColor(cleanPhrase, default_color);
      //console.log(292, cleanPhrase);
      if (cleanPhrase.startsWith("(") && cleanPhrase.endsWith(")")) {
        color = "purple";
        cleanPhrase = cleanPhrase.slice(1, -1);
      }
      if (cleanPhrase.startsWith("⸨") && cleanPhrase.endsWith("⸩")) {
        color = "green";
        cleanPhrase = cleanPhrase.slice(1, -1);
      }
      const italics = (style === "bubble" || style === "dna") ? "italic" : "";

      ctx.font = `100 ${(fontSize - 10)}px ${boxfont}`;
      const phraseWidth = ctx.measureText(cleanPhrase).width;
      let start = lastX; let width = phraseWidth + 50;
      if (!preview) drawColoredRectangle(ctx, start, y + 3, width, fontSize, color);
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      //console.log(328, lastX, cleanPhrase, (cardWidth - lastX - 5));
      if (!preview) ctx.fillText(cleanPhrase, start + width / 2, y - 10, cardWidth - lastX - 5, phraseWidth);
      ctx.textAlign = 'left';

      lastX += width + 2; // phraseWidth + fontSize;
      ctx.font = `${italics} ${(fontSize)}px ${font}`;

    } else {
      phrase.split(/(＜.*?＞)/).forEach(word => {
        if (word.includes("＜")) {
          const cleanWord = word.replace(/[＜＞_]/g, '  ');
          //          ctx.font = `600 ${(fontSize - 5)}px Schibsted Grotesk`;
          //   ctx.font = `bold ${(fontSize - 5)}px Roboto`;
          ctx.font = `100 ${(fontSize - 10)}px ${boxfont}`;

          const wordWidth = ctx.measureText(cleanWord).width;
          //console.log(314, wordWidth, cardWidth, lastX, cleanWord);
          let h = Number(fontSize);
          let width = wordWidth;
          if (width > cardWidth - lastX) { // too big, limit width
            width = cardWidth - lastX;
          }
          if (!preview) drawDiamondRectangle(ctx, lastX, y - 8, width + 10, h);
          //    ctx.scale(scale, 1);
          ctx.fillStyle = 'white'; // white on colored background
          let diamondOffset = -5; // how much to slide keyword in text around
          if (!preview) ctx.fillText(cleanWord, lastX - diamondOffset, y - 10, cardWidth - lastX);
          console.log(621, "xxx", cleanWord);
          lastX += scale * wordWidth + 15;
          //  ctx.restore();
          ctx.font = ` ${fontSize}px ${font}`;
        } else {
          let width = 12;
          let stroke = 'black';
          let fill = 'white';
          if (style.includes("option")) {
            width = 3;
            stroke = 'white';
            fill = 'black';
          }

          if (word.length > 0) {
            //            console.log(334, lastX, word);

            // First, draw the black stroke
            ctx.lineWidth = width; // Thicker stroke
            ctx.strokeStyle = stroke;
            ctx.textAlign = 'left';
            if (!preview) {
              ctx.strokeText(word, lastX, y); //  cardWidth - lastX);
            }

            ctx.lineWidth = 2; // Smaller stroke to define the edges
            ctx.fillStyle = fill;
            if (!preview) {
              ctx.fillText(word, lastX, y); //  cardWidth - lastX);
            }
            width = ctx.measureText(word).width;
            //            if (width > y) width = y;
            //width += ctx.measureText(' ').width;
            lastX += width * scale;
          }

        }
      })
    }
  });
  // ctx.restore();
  return lastX;
}

