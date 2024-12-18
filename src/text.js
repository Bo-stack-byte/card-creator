
import _left_diamond from './frames/keywords/left-diamond.png';
import _middle_diamond from './frames/keywords/middle-diamond.png';
import _right_diamond from './frames/keywords/right-diamond.png';

import { dna_boxes, countColors, colorReplace } from './images';

let diamondLeft = new Image(); diamondLeft.src = _left_diamond;
let diamondMiddle = new Image(); diamondMiddle.src = _middle_diamond;
let diamondRight = new Image(); diamondRight.src = _right_diamond;


//const font = 'Asimov'
const font = 'MyriadProBold'
const boxfont = true ? "FallingSky" : "ToppanBunkyExtraBold";
const horizontal_limit = 2800;

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

  "Digixros.{1,6}",

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
  "End of Attack",
  "End of Opponent's Turn",
  "End of Your Turn",
  "End of All Turns",
  "Counter",
  "Main",
  "Once Per Turn",
  "Twice Per Turn",
]

function splitTextIntoParts(text) {
  //  const words = text.split(/((\[＜).*?(\]＞))/);
  //const words = text.split(/((\[).*?(\]))/);
  const words = text.split(/(\[.*?\])/);
  //  console.log(words);
  let all_words = [];
  for (let i = 0; i < words.length; i++) {
    if (words[i].includes("[")) {
      all_words.push(words[i]);
    } else {
      all_words.push(...words[i].trim().split(" "));
    }
  }
  while (all_words[0] === '') all_words.shift(); // trim empty elements
  return all_words;
}

export function writeRuleText(ctx, rule, fontSize, bottom, preview = false) {
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillStyle = 'white';
  ctx.font = `italic ${(fontSize - 10)}px Asimov`;
  let text = rule;
  if (text.startsWith("[Rule]")) text = text.substring(6).trim();
  let width = ctx.measureText(text).width;
  let x = horizontal_limit - 100;
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 20;
if (!preview) {
    ctx.fillRect(x - width, bottom - fontSize / 8, width + fontSize / 4, - fontSize * 0.7);
    ctx.strokeText(text, x, bottom);
    ctx.fillStyle = 'black';
    ctx.fillText(text, x, bottom);
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
  if (stroke)
    ctx.stroke(); // Draw only the outline
  else
    ctx.fill();
  ctx.restore();
}

//x,y is upper left
function drawDnaBox(ctx, x, y, w, h, colors) {
  if (colors.length === 0) return;
  // return;
  let images = colors.map(x => dna_boxes[x.toLowerCase()]).filter(x => x);
  console.log(135, images);
  const len = images.length;
  let per_width = w / len;

  const left = images[0];
  const right = images[len - 1];
  let hw = left.width / 2; // half-wdith

  // draw left-most box, 
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
  return;

};

//x,y is upper left
function drawColoredRectangle(ctx, x, y, width, height, color) {
  //#922969 darker ois lower
  const cardWidth = horizontal_limit; // !
  height = Number(height);
  let color0, color1, color2;
  switch (color) {
    case 'purple': color0 = '#720949'; color1 = '#b24999'; break;
    case 'green': color0 = 'darkgreen'; color1 = 'lightgreen'; break;
    case 'bubble': color0 = 'black'; color1 = 'black'; break;
    case 'darkblue': color0 = '#0D1544'; color1 = '#4D5584'; break;

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
  if (color === 'bubble') {
    ctx.globalAlpha = 0.4;
    d = 10;
  }
  ctx.fillStyle = gradient;
  if (width > (cardWidth - x)) width = cardWidth - x;
  //let radius = (color === 'bubble') ? height / 2 : 0;
  //  ctx.fillRect(x - d, y - height - 10 - d, width + 10 + 2 * d, height + 2 * d, height / 3, false);
  drawRoundedRect(ctx, x - d, y - height - 10 - d, width + 10 + 2 * d, height + 2 * d, height / 3, false);
  ctx.globalAlpha = 1;
  if (color === 'bubble') {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 8;
    drawRoundedRect(ctx, x - d, y - height - 10 - d, width + 10 + 2 * d, height + 2 * d, height / 3, true);
    //  ctx.strokeRect(x - d, y - height - 10 - d, width + 10 + d * 2, height + d * 2);
  }
  ctx.strokeStyle = '';
  ctx.lineWidth = 0;



}

// x,y is upper left?

function drawDiamondRectangle(ctx, x, y, width, height) {
  if (Math.random() < 0.0)
    _1drawDiamondRectangle(ctx, x, y, width, height)
  else
    _2drawDiamondRectangle(ctx, x, y, width, height)
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

function _2drawDiamondRectangle(ctx, x, y, width, height) {
  // Calculate the half-height and half-width for the triangles
  //console.log(238, x, y, width, height);
  y -= height;
  const halfHeight = height / 2;
  // Create the gradient from dark brown to medium brown
  const gradient = ctx.createLinearGradient(0, y, 0, y + height);
  gradient.addColorStop(0, '#7E3329'); // Dark brown
  gradient.addColorStop(0.6, '#C36327'); // Medium brown
  gradient.addColorStop(0.9, '#E38367'); // "light" brown

  // Begin drawing the shape
  ctx.beginPath();
  ctx.moveTo(x, y + halfHeight); // Start at the left triangle point
  ctx.lineTo(x + halfHeight / 2, y); // Top-left corner
  ctx.lineTo(x + width - halfHeight / 2, y); // Top-right corner
  ctx.lineTo(x + width, y + halfHeight); // Right triangle point
  ctx.lineTo(x + width - halfHeight / 2, y + height); // Bottom-right corner
  ctx.lineTo(x + halfHeight / 2, y + height); // Bottom-left corner
  ctx.closePath(); // Close the path

  // Fill the shape with gradient
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.lineWidth = 2;
  ctx.strokeStyle = 'black';
  ctx.stroke();
}

function replaceBracketsAtStart(line) {
  // Tokenize the input string to handle both types of brackets
  const tokens = line.match(/(\[[^\]]+\]|＜[^＞]+＞|\S+)/g);
  if (!tokens) return line;


  let replacing = true;

  for (let i = 0; i < tokens.length; i++) {
    // Check for brackets at the start of the line
    if (replacing && tokens[i].startsWith('[') && tokens[i].endsWith(']')) {
      tokens[i] = tokens[i].replace('[', '⟦').replace(']', '⟧');
    } else if (replacing && tokens[i].startsWith('＜') && tokens[i].endsWith('＞')) {
      // don't replace <＞ yet
    } else {
      // Stop replacing when a token is not in brackets
      replacing = false;
    }
  }

  return tokens.join(' ');
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

// if "extra" is "bubble", put text in black bubble
// if "extra" is "effect", then put all [bracketed text] at start of line in blue
// _maxWidth is unused :(
export function drawBracketedText(ctx, fontSize, text, x, y, _maxWidth, lineHeight, extra, preview = false) {
  let maxWidth = horizontal_limit - x;
  if (extra === "bubble") maxWidth -= 150;
  console.debug(308, "calling with", fontSize, text, y, "XXX", lineHeight);
  lineHeight = Number(lineHeight);
  let yOffset = y;
  let lines = [];
  text = text.replaceAll(/</ig, "＜").replaceAll(/>/ig, "＞");
  let right_limit = horizontal_limit;
  const dna_colors = countColors(text);
  if (extra === "dna") text = colorReplace(text);

  const paragraphs = text.split("\n");
  for (let p = 0; p < paragraphs.length; p++) {
    let graf = prepareKeywords(paragraphs[p], extra.startsWith("effect"));

    const words = splitTextIntoParts(graf);
    let line = '';
    const italics = (extra === "bubble" || extra === "dna") ? "italic" : "100";

    let scale = 1.0;


    for (let n = 0; n < words.length; n++) {
      ctx.font = `${italics} ${fontSize}px ${font}`;
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine.replaceAll(/[＜＞[\]]/ig, ''));
      const testWidth = metrics.width * scale;
      //      console.log(`is ${testWidth} bigger than ${maxWidth}, added word ${words[n]} to ${line}`);

      if (testWidth > maxWidth && n > 0) {
        //      let currentWidth = ctx.measureText(line).width;
        //console.log(267, "pushing " + Math.round(currentWidth) + " <" + line + ">");
        //   wrapAndDrawText(ctx, line, x, yOffset, bracketedWords);
        lines.push({ ctx, line, x, yOffset });
        line = words[n] + ' ';
        yOffset += lineHeight; // 117.5; //  117.5 for EX2-039 w/90.5 font:for smaller lines lineHeight* 1.3;
      } else {
        line = testLine;
      }
    }

    //    console.log(277, "pushing  <" + line + ">");

    // wrapAndDrawText(ctx, line, x, yOffset, bracketedWords);
    lines.push({ ctx, line, x, yOffset });
    yOffset += lineHeight; // use 117.5

    // 2700 should not be hard-coded
    let max_end = Math.max.apply(Math,
      lines.map(l => wrapAndDrawText(l.ctx, fontSize, l.line, l.x, l.yOffset, extra, right_limit, true)));
    //console.log(515, 'max end', max_end);
    if (max_end > right_limit) max_end = right_limit;
    const pre_width = max_end - x;

    let h = (yOffset - y);
    if (extra === 'bubble') {
      if (!preview)
        drawColoredRectangle(ctx, x - 10, y - fontSize * 1.1 + h, pre_width, yOffset - y, 'bubble');
    }
    if (extra === "dna") {
      if (!preview) {
        drawDnaBox(ctx, x - fontSize / 2, y - fontSize * 1.3 - 10, pre_width + fontSize / 2, (yOffset - y) * 1.1 + 20, dna_colors);
      }
    }
  }

  console.log(372, lines);
  for (let line of lines) {

    wrapAndDrawText(line.ctx, fontSize, line.line, line.x, line.yOffset, extra, right_limit, preview);
  }



  return yOffset + lineHeight + 2;

}

function getColor(phrase) {
  if (phrase.match(/DigiXros/i)) return 'green';
  if (['Hand', 'Trash', 'Breeding', 'Once Per Turn', 'Twice Per Turn'].includes(phrase)) return 'purple';
  if (phrase.match(/(Digi|E)volve/i)) return 'darkblue';
  return 'blue';
}

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
  ctx.save();
  ctx.scale(scale, 1);


  // console.log(313, `is ${testWidth} bigger than ${cardWidth}`);
  text.split(/([[⟦].*?[\]⟧])/).forEach(phrase => {
    let cleanPhrase = phrase.replace(/[⟦[\]⟧]/gi, "");
    if (
      (phrase.startsWith("⟦") && phrase.endsWith("⟧")) ||
      (phrase.startsWith("[") && phrase.endsWith("]") && matchMagic(magicWords, cleanPhrase))
    ) {
      // Calculate the width of the bracketed text
      let color = getColor(cleanPhrase);
      // console.log(292, cleanPhrase);
      if (cleanPhrase.startsWith("(") && cleanPhrase.endsWith(")")) {
        color = "purple";
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
      if (!preview) ctx.fillText(cleanPhrase, start + width / 2 + 5, y - 10, cardWidth - lastX - 5, phraseWidth);
      ctx.textAlign = 'left';

      lastX += width; // phraseWidth + fontSize;
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
          if (!preview) drawDiamondRectangle(ctx, lastX, y - 8, scale * wordWidth + 10, h);
          ctx.scale(scale, 1);
          ctx.fillStyle = 'white'; // white on colored background
          if (!preview) ctx.fillText(cleanWord, lastX / scale + 5, y - 10, cardWidth - lastX);
          lastX += scale * wordWidth + 15;
          ctx.restore();
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
            //  console.log(334, lastX, word);

            // First, draw the black stroke
            ctx.lineWidth = width; // Thicker stroke
            ctx.strokeStyle = stroke;
            if (!preview) ctx.strokeText(word, lastX, y); //  cardWidth - lastX);


            ctx.lineWidth = 2; // Smaller stroke to define the edges
            ctx.fillStyle = fill;
            if (!preview) {
              ctx.fillText(word, lastX, y); //  cardWidth - lastX);
              ctx.strokeText(word, lastX, y);
            }
            width = ctx.measureText(word).width;
            //            if (width > y) width = y;
            width += ctx.measureText(' ').width;
            lastX += width * scale;
          }

          /*
        ctx.font = `90px ${font}`;
        ctx.fillStyle = 'black';
        ctx.fillText(word, lastX, y);
        lastX += ctx.measureText(word).width + ctx.measureText(' ').width;
        */
        }
      })
    }
  });
  ctx.restore();
  return lastX;
}

