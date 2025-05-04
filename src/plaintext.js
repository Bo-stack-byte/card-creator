

// shared from the tcg-sim project, un-typescripted
import { getDot } from './images';

let all_colors = ["Red", "Blue", "Yellow", "Green", "Black", "Purple", "White", "Rainbow"]; //rainbow unsupported right now

// copied from the customs channel

export const custom_1 = `     ʟᴠ.3 — ScrapBacomon
[Rookie | Data | Mutant/ʟᴍᴡ] [Gre.]
Play cost: 3 | Digivolution: 0 from Lv.2 [Gre.]
     1000 DP

[Rule] Trait: Has the [Free] type.
[On Play] Reveal the top 3 cards of your deck. Add 1 card with the [Mutant] traut and 1 card with the [ʟᴍᴡ] trait among them to the hand. Return the rest to the bottom of the deck.

     · Inherited Effect:
[All Turns] [Once Per Turn] When 1 other Digimon digivolves, <Draw 1>.
`;

export const custom_2 = `Imperialdramon: Fighter Mode 
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

export const custom_3 = `Patamon
Level 3 yellow/purple
Playcost: 3
Digivolve: 1 from lvl 2 yellow/purple
Rookie | Data | Mammal
1000 DP
[Digivolve] [Tokomon]: Cost 0

[On Play] Reveal the top 3 cards of your deck. Add 1 card with the [Mythical Beast] trait and 1 card with the [LIBERATOR] trait among them to the hand. Return the rest to the bottom of the deck. 

[Rule] Trait: Also has [Mythical Beast] Type.
-----
Inherited Effect: [On Deletion] You may place 1 card from either player's trash face down in the battle area.

`;

export const custom_4 = `Steal!!!! — [Option]
[Gre.]
Cost: 3

     [Main] <Draw 1> for every Tamer your opponent has in play.

     · Security Effect: [Security] <Draw 1>, then add this card to the hand.`;

export const custom_5 = `Arresterdramon X MetalTyrannomon
Lv.5 🟣 / ⚫
Playcost: 8
Digivolve: 4 from Lv.4 ⚫ / 🟣
{Digivolve from Lv.4 w/<Save> in text: 3 cost}
Type: Enhancement/Dragonkin/Cyborg
Attribute: Virus
7000 DP

<Blocker>
[On Play][When Digivolving] Until the end of your opponent's turn, 1 of their Digimon gains "[Start of Main] Forced attack." If digixrossed with 2 materials, <De-Digivolve 1> 1 of their Digimon.

{Digixros -1} [Arresterdramon] x [MetalTyrannomon]

Inheritable: [Opponent's Turn] This Digimon with <Save> in its text gains <Reboot>.
Author: MuqRei
`
export const custom_6 = `Kentaurosmon (X Antibody)
Yellow/Blue | Lv.6
12000 DP
Play cost: 12
Digivolution cost: 4 from yellow or blue Lv.5
[[Digivolve] [Kentaurosmon]: Cost 1]
Mega | Vaccine | Holy Warrior/X Antibody/Royal Knight 

[When Digivolving] [When Attacking] (Once Per Turn) By trashing your top security card, 1 of your opponent's Digimon gets -10000 DP until the end of their turn. Then, until the end of their turn, 1 of their Digimon or Tamers can't suspend.
[All Turns] (Once Per Turn) When an effect would trash your security stack, If there're 6 or fewer security cards and [Kentaurosmon] or [X Antibody] is in this Digimon's digivolution cards, you may trash your opponent's top security card and place 1 yellow card from your hand as your top security card instead.
Author: Vansjoo`;

export const custom_7 = `Lv.3 - Roleplaymon
[Stnd./Appmon | Game | Ropure/7CA] [Yel.] [Blk.]
Play Cost: 3 | Digivolve: 1 from Lv.2 [Yel.] [Blk.]
2000 DP

[On Play] Reveal the top 4 cards of your deck. Add 1 Digimon with the [7CA] trait to your hand. Return the rest to the bottom of the deck.
---
[Link] [Appmon] trait: Cost: 1
[When Attacking] [Once Per Turn] 1 of your opponent's Digimon gets -2000 DP for the turn.
+2000 DP
Author: shawndamarbledcat
`;


// unsupported, 
export const custom_8 = `MarinChimairamon - 🟦🟩🟪
Lv.5 / Ultimate / Vaccine / Composite
Play: Cost 9 / Digivolve 🟦: Cost 4 / 9000DP
[PIERCING]
(On Play)/(When Digivolving) For each of this Digimon's digivolution cards, trash any 1 digivolution card from 1 of your opponent's Digimon. Then, delete 1 of their unsuspended Digimon with as many or fewer digivolution cards as this Digimon.
《[DigiXros -2] 4 🟦 Digimon cards w/different names and [Ancient Fish]/[Aquabeast]/[Aquatic]/[Mollusk]/[Sea Animal]/[Sea Beast] trait》
Author: Schnivän
`;


// return color based on abbreviations
function get_color(input) {
    if (!input) return undefined;
    let dot = getDot(input);
    if (dot) return dot;
    input = input.toLowerCase().substring(0, 3);
    console.log(11, input);
    const candidate = all_colors.find(x => x.substring(0, 3).toLowerCase() === input);
    if (candidate) return candidate;
    console.log(14, input);
    if (input === "blk") return "Black";
    if (input === "grn") return "Black";
    return undefined;

}

function split_colors(input) {

    if (input.includes("/")) {
        return input.split("/").map(c => c.trim());
    }
    if (input.includes(" or ")) {
        return input.split(" or ").map(c => c.trim());
    }
    return input;
}

// 🔴🔵🟡🟢🟣⚫⚪


function abbr_parse_color(text) {
    if (!text) return "";
    const regex = /[a-zA-Z]{3,}|[🔴🔵🟡🟢🟣⚫⚪]/g;
    const colors = text.match(regex);
    console.log(45, text, colors);
    if (!colors) return "";
    return colors.map(c => get_color(c)).filter(c => c).join("/")
}

export const enterPlainText = (lines) => {
    let json = {
        "name": { "english": "" },
        "color": "",
        "cardType": "Digimon",
        "playCost": "-",
        "dp": "-",
        "evolveCondition": [],
        "cardLv": "",
        "form": "",
        "attribute": "",
        "type": "",
        "rarity": "",

        "specialEvolve": "-",
        "effect": "",
        "evolveEffect": "",
        "linkDP": "-",
        "linkRequirement": "",
        "linkEffect": "",
        "securityEffect": "-",

        "rule": "",
        "digiXros": "",
        "dnaEvolve": "-",
        "burstEvolve": "-",
        "cardNumber": "",
        "author": "",
        "artist": "",
        "imageOptions": {
            background_url: "",
            foreground_url: "", 
            x_pos: 0, y_pos: 0, x_scale: 95, y_scale: 95,
            "ess_x_pos": 37,
            "ess_y_pos": 10,
            "ess_x_end": 74,
            "ess_y_end": 50,
            "fontSize": 90.5,
            "foregroundOnTop": false,
            "cardFrame": true,
            "effectBox": false,
            "addFoil": false,
            "aceFrame": true,
            "coloredFrame": false,
            "outline": true,
            "skipDraw": false

        }

    }

    let m;
    let mode = "main";
    for (let line of lines) {
        if (line.length < 2) continue;
        if (line.startsWith("#")) continue;
        // [ʟᴠ] [ᴛᴀᴍᴇʀ] [ᴏᴘᴛɪᴏɴ]
        //      ʟᴠ.4 — Armored Cat — CS1-18
        console.log(41, line);
        //                            1              2   3          4    5
        if ((m = line.match(/^\s*[Lʟ][ᴠv].(\d+)(.*)/i))) {
            console.log(55, m);
            json.cardLv = "Lv." + (m[1]);

            let fields = line.split(/ [-—] /i);
            console.log(47, fields);
            if (fields[1]) json.name.english = fields[1].trim();
            if (fields[2]) json.cardNumber = fields[2].trim();

            //\s+[-—]\s+(.*)(\s+[-—]\s+(.*)-(\d+))?/i))) {
            console.error(m);
            //            json.name.english = m[2];
            //          json.cardType = "Monster"; // assumed
            //        json.cardNumber = m[4] + "-" + m[5];
            //      json.cardLv = "Lv." + parseInt(m[1]);
        } else if ((m = line.match(/(.*?)\s*[-—]*\s*\[(option|ᴏᴘᴛɪᴏɴ|tamer|ᴛᴀᴍᴇʀ)\]/i))) {
            if (m[2].match(/option|ᴏᴘᴛɪᴏɴ/i)) {
                json.cardType = "Option";
            } else {
                json.cardType = "Tamer";
            }
            if (m[1].trim().length > 2) {
                json.name.english = m[1].trim();
            }
        } else if ((m = line.match(/^\s*(\[Rule.*:.*)/i))) {
            // [Rule] Trait: Has the [Insectoid] type.
            json.rule = m[1];
            // [Champion | Data | Shield] [Yel.]
        } else if ((m = line.match(/^\s*\[(.*?)\|(.*?)\|(.*?)\]( \[(.*)\])?/))) {
            json.form = m[1].trim();
            json.attribute = m[2].trim();
            json.type = m[3].trim();

            json.color = abbr_parse_color(m[4]);
            //  Purple/Red | Lv.6
        } else if ((m = line.match(/^\s*(.*)\s+\|\s+Lv.(\d+)/i))) {
            console.log(99, m);
            json.cardLv = "Lv." + m[2];
            json.color = m[1];
            console.log(102, json);
            // level 3 yellow/purple
        } else if ((m = line.match(/^\s*(level|Lv\.|lvl)\s*(\d+)\s+(.*)/i))) {
            json.cardLv = "Lv." + m[2];
            json.color = m[3];
        } else if ((m = line.match(/^\s*Play cost: (\d+)\s*\|\s*(E|Digi)vol(?:ve|ution):\s*(\d+) from Lv.\s*(\d+)\s*\[(.*)\]/i))) {
            console.log(130, m);
            // Play cost: (6) | Evolution: (3) from Lv.(3) [Yel.]
            // Play Cost: 11 | Digivolve: 4 from Lv.5 [Blk.] [Blu.]

            json.playCost = (m[1]);
            let evo = {}
            evo.level = (m[4]);
            evo.cost = (m[3]);
            evo.color = abbr_parse_color(m[5])
            json.evolveCondition.push(evo);
        } else if ((m = line.match(/^\s*\+?(\d+) DP/))) {
            //      6000 DP
            if (mode === "link")
                json.linkDP = (m[1]);
            else
                json.dp = (m[1]);
        } else if ((m = line.match(/^(Play|Use)?.?cost\s*:\s*(\d+)/i))) {
            json.playCost = (m[2]);
            // only if pure colors
        } else if ((m = line.match(/^\[\S*\]$/i))) {
            json.color = abbr_parse_color(m[1]);
        } else if ((m = line.match(/(.*)\|(.*)\|(.*)/))) {
            json.form = m[1].trim();
            json.attribute = m[2].trim();
            json.type = m[3].trim();
            //            Digivolve: 1 from lvl 2 yellow/purple
            //  Digivolution cost: 5 from purple or red Lv.5
        } else if ((m = line.match(/Digivol(\w*)\s*(cost)?\s*:\s*(\d+) from (.*)/i))) {
            let evo = {}
            evo.cost = (m[3]);
            let from = m[4];
            let n;
            if ((n = from.match(/(.*)(Level|lvl|Lv\.)\s*(\d+)(.*)/i))) {
                evo.level = (n[3]);
                from = n[1] + n[4];
            }
            let colors = split_colors(from);
            for (let c of colors) {
                evo.color = get_color(c);
                json.evolveCondition.push(evo);
                evo = { ...evo }; // make copy

            }
            // [[Digivolve] [Imperialdramon: Dragon Mode]: Cost 2] 
        } else if ((m = line.match(/^.?.?.?(Evolve|Digivolve).{0,3}\s+(.*\d[\w\s]*)/i))) {
            console.log(147, m);
            json.specialEvolve = `[${m[1]}] ${m[2]}`;
        } else if ((m = line.match(/security effect\s*:\s*(.*\w+.*)/i))) {
            console.log(124, m);
            json.securityEffect += m[1] + "\n";
            //     {Digixros -1} [Arresterdramon] x [MetalTyrannomon]
        } else if ((m = line.match(/^.{0,3}(DigiXros -\d+).{0,3}\s+(.*)/i))) {
            json.digiXros = `[${m[1]}] ${m[2]}`;
            //    [Link]: [Appmon] trait. Cost: 1.
        } else if ((m = line.match(/^.{0,3}(Link).?:?\s*(.*trait.*).?\s*:\s*cost.?\s*(\d+)/i))) {
            json.linkRequirement = `[Link] ${m[2]}: Cost ${m[3]}`
            mode = "link";
        } else if ((m = line.match(/Security Effect/))) {
            mode = "security";
        } else if ((m = line.match(/(?:inherited effect|inheritable)\s*:\s*(.*\w+.*)/i))) {
            console.log(124, m);
            json.evolveEffect += m[1] + "\n";

            // translator format            
        } else if ((m = line.match(/(?:inherited effect|inheritable)\s*:\s*(.*\w+.*)/i))) {
            console.log(124, m);
            json.evolveEffect += m[1] + "\n";
        } else if (line.match(/Inherited Effect/i) || line.match(/^-{3,}$/)) {
            mode = "inherited";
            // Type:X for arbitrary Key:Value pairs
        } else if ((m = line.match(/^(.*)\s*:\s*(.*)$/)) && (m[1].toLowerCase() in json)) {
            let [, key, value] = m;
            key = key.toLowerCase();
            if (key in json) {
                json[key] = value;
            }
        } else {
            console.log(69, line, json.name.english);
            // first line assumed to be plain name if no match
            if (!json.name.english) {
                json.name.english = line.trim();
                console.log(69, "after", json.name.english);
            } else if (mode === "inherited") {
                json.evolveEffect += line + "\n";
            } else if (mode === "security") {
                json.securityEffect += line + "\n";
            } else if (mode === "link") {
                json.linkEffect += line + "\n";
            } else {
                json.effect += line + "\n";
            }
        }
    }
    if (json.evolveCondition.length === 0) {
        json.evolveCondition.push({ color: "", cost: "", level: "" });
    }


    return JSON.stringify(json, null, 2);
    //   return JSON.stringify(json);
}



/*
const exports =  { 
    enterPlainText, custom_1, custom_2, custom_3, custom_4, custom_5
 };*/

/*  

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = exports;
  } else {
    export default exports;
  }
  */