import { enterPlainText, custom_1, custom_2, custom_3, custom_4, custom_5, custom_6, custom_7, custom_8 } from './plaintext';
const customs = [custom_1, custom_2, custom_3, custom_4, custom_5, custom_6, custom_7 ];

console.log = () => {}
console.error = () => {}

function getObj() {
    let ret = [];
    for (const custom of customs) {
        const _json = enterPlainText(custom.split("\n"));
        const json = JSON.parse(_json);
        ret.push(json);
    }
    // uncomment this line to get the output
   //console.log('let answer = ['); console.dir(ret, { depth: null} ); console.log(';');
    return ret;
}

let answer = [
  {
    name: { english: 'ScrapBacomon' },
    color: 'Green',
    cardType: 'Digimon',
    playCost: '3',
    dp: '1000',
    evolveCondition: [ { level: '2', cost: '0', color: 'Green' } ],
    cardLv: 'Lv.3',
    form: 'Rookie',
    attribute: 'Data',
    type: 'Mutant/ʟᴍᴡ',
    rarity: '',
    specialEvolve: '-',
    effect: '[On Play] Reveal the top 3 cards of your deck. Add 1 card with the [Mutant] traut and 1 card with the [ʟᴍᴡ] trait among them to the hand. Return the rest to the bottom of the deck.\n',
    evolveEffect: '[All Turns] [Once Per Turn] When 1 other Digimon digivolves, <Draw 1>.\n',
    linkDP: '-',
    linkRequirement: '',
    linkEffect: '',
    securityEffect: '-',
    rule: '[Rule] Trait: Has the [Free] type.',
    digiXros: '',
    dnaEvolve: '-',
    burstEvolve: '-',
    cardNumber: '',
    author: '',
    artist: '',
    imageOptions: {
      background_url: '',
      foreground_url: '',
      x_pos: 0,
      y_pos: 0,
      x_scale: 95,
      y_scale: 95,
      ess_x_pos: 37,
      ess_y_pos: 10,
      ess_x_end: 74,
      ess_y_end: 50,
      fontSize: 90.5,
      foregroundOnTop: false,
      cardFrame: true,
      effectBox: false,
      addFoil: false,
      aceFrame: true,
      outline: true,
      skipDraw: false
    }
  },
  {
    name: { english: 'Imperialdramon: Fighter Mode' },
    color: 'Purple/Red',
    cardType: 'Digimon',
    playCost: '13',
    dp: '13000',
    evolveCondition: [
      { cost: '5', level: '5', color: 'Purple' },
      { cost: '5', level: '5', color: 'Red' }
    ],
    cardLv: 'Lv.6',
    form: 'Mega',
    attribute: 'Virus',
    type: 'Ancient Dragonkin',
    rarity: '',
    specialEvolve: '[Digivolve] [Imperialdramon: Dragon Mode]: Cost 2',
    effect: '<Security A. +1> <Piercing>\n' +
      "[When Digivolving] By returning 1 Multicolor Digimon card from this Digimon's digivolution cards to the hand, return all digivolution cards of 1 of your opponent's Digimon with as high or lower level as returned card to the bottom of the deck. Then, delete it.\n" +
      "[Your Turn] This Digimon doesn't activate [Security] effects of the cards it checks.\n",
    evolveEffect: '',
    linkDP: '-',
    linkRequirement: '',
    linkEffect: '',
    securityEffect: '-',
    rule: '',
    digiXros: '',
    dnaEvolve: '-',
    burstEvolve: '-',
    cardNumber: '',
    author: '',
    artist: '',
    imageOptions: {
      background_url: '',
      foreground_url: '',
      x_pos: 0,
      y_pos: 0,
      x_scale: 95,
      y_scale: 95,
      ess_x_pos: 37,
      ess_y_pos: 10,
      ess_x_end: 74,
      ess_y_end: 50,
      fontSize: 90.5,
      foregroundOnTop: false,
      cardFrame: true,
      effectBox: false,
      addFoil: false,
      aceFrame: true,
      outline: true,
      skipDraw: false
    }
  },
  {
    name: { english: 'Patamon' },
    color: 'yellow/purple',
    cardType: 'Digimon',
    playCost: '3',
    dp: '1000',
    evolveCondition: [
      { cost: '1', level: '2', color: 'Yellow' },
      { cost: '1', level: '2', color: 'Purple' }
    ],
    cardLv: 'Lv.3',
    form: 'Rookie',
    attribute: 'Data',
    type: 'Mammal',
    rarity: '',
    specialEvolve: '[Digivolve] [Tokomon]: Cost 0',
    effect: '[On Play] Reveal the top 3 cards of your deck. Add 1 card with the [Mythical Beast] trait and 1 card with the [LIBERATOR] trait among them to the hand. Return the rest to the bottom of the deck. \n',
    evolveEffect: "[On Deletion] You may place 1 card from either player's trash face down in the battle area.\n",
    linkDP: '-',
    linkRequirement: '',
    linkEffect: '',
    securityEffect: '-',
    rule: '[Rule] Trait: Also has [Mythical Beast] Type.',
    digiXros: '',
    dnaEvolve: '-',
    burstEvolve: '-',
    cardNumber: '',
    author: '',
    artist: '',
    imageOptions: {
      background_url: '',
      foreground_url: '',
      x_pos: 0,
      y_pos: 0,
      x_scale: 95,
      y_scale: 95,
      ess_x_pos: 37,
      ess_y_pos: 10,
      ess_x_end: 74,
      ess_y_end: 50,
      fontSize: 90.5,
      foregroundOnTop: false,
      cardFrame: true,
      effectBox: false,
      addFoil: false,
      aceFrame: true,
      outline: true,
      skipDraw: false
    }
  },
  {
    name: { english: 'Steal!!!!' },
    color: '',
    cardType: 'Option',
    playCost: '3',
    dp: '-',
    evolveCondition: [ { color: '', cost: '', level: '' } ],
    cardLv: '',
    form: '',
    attribute: '',
    type: '',
    rarity: '',
    specialEvolve: '-',
    effect: '     [Main] <Draw 1> for every Tamer your opponent has in play.\n',
    evolveEffect: '',
    linkDP: '-',
    linkRequirement: '',
    linkEffect: '',
    securityEffect: '-[Security] <Draw 1>, then add this card to the hand.\n',
    rule: '',
    digiXros: '',
    dnaEvolve: '-',
    burstEvolve: '-',
    cardNumber: '',
    author: '',
    artist: '',
    imageOptions: {
      background_url: '',
      foreground_url: '',
      x_pos: 0,
      y_pos: 0,
      x_scale: 95,
      y_scale: 95,
      ess_x_pos: 37,
      ess_y_pos: 10,
      ess_x_end: 74,
      ess_y_end: 50,
      fontSize: 90.5,
      foregroundOnTop: false,
      cardFrame: true,
      effectBox: false,
      addFoil: false,
      aceFrame: true,
      outline: true,
      skipDraw: false
    }
  },
  {
    name: { english: 'Arresterdramon X MetalTyrannomon' },
    color: '',
    cardType: 'Digimon',
    playCost: '8',
    dp: '7000',
    evolveCondition: [
      { cost: '4', level: '4', color: 'Black' },
      { cost: '4', level: '4', color: 'Purple' }
    ],
    cardLv: 'Lv.5',
    form: '',
    attribute: 'Virus',
    type: 'Enhancement/Dragonkin/Cyborg',
    rarity: '',
    specialEvolve: '[Digivolve] from Lv.4 w/<Save> in text: 3 cost',
    effect: '<Blocker>\n' +
      `[On Play][When Digivolving] Until the end of your opponent's turn, 1 of their Digimon gains "[Start of Main] Forced attack." If digixrossed with 2 materials, <De-Digivolve 1> 1 of their Digimon.\n`,
    evolveEffect: "[Opponent's Turn] This Digimon with <Save> in its text gains <Reboot>.\n",
    linkDP: '-',
    linkRequirement: '',
    linkEffect: '',
    securityEffect: '-',
    rule: '',
    digiXros: '[Digixros -1] [Arresterdramon] x [MetalTyrannomon]',
    dnaEvolve: '-',
    burstEvolve: '-',
    cardNumber: '',
    author: 'MuqRei',
    artist: '',
    imageOptions: {
      background_url: '',
      foreground_url: '',
      x_pos: 0,
      y_pos: 0,
      x_scale: 95,
      y_scale: 95,
      ess_x_pos: 37,
      ess_y_pos: 10,
      ess_x_end: 74,
      ess_y_end: 50,
      fontSize: 90.5,
      foregroundOnTop: false,
      cardFrame: true,
      effectBox: false,
      addFoil: false,
      aceFrame: true,
      outline: true,
      skipDraw: false
    }
  },
  {
    name: { english: 'Kentaurosmon (X Antibody)' },
    color: 'Yellow/Blue',
    cardType: 'Digimon',
    playCost: '12',
    dp: '12000',
    evolveCondition: [
      { cost: '4', level: '5', color: 'Yellow' },
      { cost: '4', level: '5', color: 'Blue' }
    ],
    cardLv: 'Lv.6',
    form: 'Mega',
    attribute: 'Vaccine',
    type: 'Holy Warrior/X Antibody/Royal Knight',
    rarity: '',
    specialEvolve: '[Digivolve] [Kentaurosmon]: Cost 1',
    effect: "[When Digivolving] [When Attacking] (Once Per Turn) By trashing your top security card, 1 of your opponent's Digimon gets -10000 DP until the end of their turn. Then, until the end of their turn, 1 of their Digimon or Tamers can't suspend.\n" +
      "[All Turns] (Once Per Turn) When an effect would trash your security stack, If there're 6 or fewer security cards and [Kentaurosmon] or [X Antibody] is in this Digimon's digivolution cards, you may trash your opponent's top security card and place 1 yellow card from your hand as your top security card instead.\n",
    evolveEffect: '',
    linkDP: '-',
    linkRequirement: '',
    linkEffect: '',
    securityEffect: '-',
    rule: '',
    digiXros: '',
    dnaEvolve: '-',
    burstEvolve: '-',
    cardNumber: '',
    author: 'Vansjoo',
    artist: '',
    imageOptions: {
      background_url: '',
      foreground_url: '',
      x_pos: 0,
      y_pos: 0,
      x_scale: 95,
      y_scale: 95,
      ess_x_pos: 37,
      ess_y_pos: 10,
      ess_x_end: 74,
      ess_y_end: 50,
      fontSize: 90.5,
      foregroundOnTop: false,
      cardFrame: true,
      effectBox: false,
      addFoil: false,
      aceFrame: true,
      outline: true,
      skipDraw: false
    }
  },
  {
    name: { english: 'Roleplaymon' },
    color: 'Yellow/Black',
    cardType: 'Digimon',
    playCost: '3',
    dp: '2000',
    evolveCondition: [ { level: '2', cost: '1', color: 'Yellow/Black' } ],
    cardLv: 'Lv.3',
    form: 'Stnd./Appmon',
    attribute: 'Game',
    type: 'Ropure/7CA',
    rarity: '',
    specialEvolve: '-',
    effect: '[On Play] Reveal the top 4 cards of your deck. Add 1 Digimon with the [7CA] trait to your hand. Return the rest to the bottom of the deck.\n',
    evolveEffect: '',
    linkDP: '2000',
    linkRequirement: '[Link] [Appmon] trait: Cost 1',
    linkEffect: "[When Attacking] [Once Per Turn] 1 of your opponent's Digimon gets -2000 DP for the turn.\n",
    securityEffect: '-',
    rule: '',
    digiXros: '',
    dnaEvolve: '-',
    burstEvolve: '-',
    cardNumber: '',
    author: 'shawndamarbledcat',
    artist: '',
    imageOptions: {
      background_url: '',
      foreground_url: '',
      x_pos: 0,
      y_pos: 0,
      x_scale: 95,
      y_scale: 95,
      ess_x_pos: 37,
      ess_y_pos: 10,
      ess_x_end: 74,
      ess_y_end: 50,
      fontSize: 90.5,
      foregroundOnTop: false,
      cardFrame: true,
      effectBox: false,
      addFoil: false,
      aceFrame: true,
      outline: true,
      skipDraw: false
    }
  }
];


// Test cases we haven't added yet
let extra = 
{
  "name": {
    "english": "Type: Enhancement/Dragonkin/Cyborg"
  },
  "color": "",
  "cardType": "Digimon",
  "playCost": "8",
  "dp": "7000",
  "cardLv": "Lv.5",
  "form": "",
  "attribute": "",
  "type": "",
  "rarity": "",
  "specialEvolve": "{Digivolve from Lv.4 w/<Save> in text: 3",
  "evolveCondition": [
    {
      "cost": "4",
      "level": "4",
      "color": "black"
    },
    {
      "cost": "4",
      "level": "4",
      "color": "purple"
    }
  ],
  "effect": "Attribute: Virus\nLevel: Perfect\n<Blocker>\n[On Play][When Digivolving] Until the end of your opponent's turn, 1 of their Digimon gains \"[Start of Main] Forced attack.\" If digixrossed with 2 materials, <De-Digivolve 1> 1 of their Digimon.\n{Digixros -1} [Arresterdramon] x [MetalTyrannomon]\nInheritable: [Opponent's Turn] This Digimon with <Save> in its text gains <Reboot>.\nAuthor: MuqRei\n",
  "evolveEffect": "",
  "securityEffect": "-",
  "rule": "",
  "digiXros": "",
  "dnaEvolve": "-",
  "burstEvolve": "-",
  "cardNumber": "",
  "imageOptions": {
    "url": "",
    "x_pos": 0,
    "y_pos": 0,
    "x_scale": 95,
    "y_scale": 95,
    "ess_x_pos": 37,
    "ess_y_pos": 10,
    "ess_x_end": 74,
    "ess_y_end": 50,
    "fontSize": 90.5
  }
};


// Correct the test function
test('getObj function', () => {
    expect(getObj()).toEqual(answer); 
  });

