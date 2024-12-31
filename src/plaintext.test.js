import { enterPlainText, custom_1, custom_2, custom_3, custom_4, custom_5 } from './plaintext';
const customs = [custom_1, custom_2, custom_3, custom_4, custom_5 ];

console.log = () => {}
console.error = () => {}

function getObj() {
    let ret = [];
    for (const custom of customs) {
        const _json = enterPlainText(custom.split("\n"));
        const json = JSON.parse(_json);
        ret.push(json);
    }
  //  console.dir(ret, { depth: null} );
    return ret;
}

let answer =  [
  {
    name: { english: 'ScrapBacomon' },
    artist: '',
    author: '',
    color: 'Green',
    cardType: 'Digimon',
    playCost: '3',
    dp: '1000',
    cardLv: 'Lv.3',
    form: 'Rookie',
    attribute: 'Data',
    type: 'Mutant/ʟᴍᴡ',
    rarity: '',
    specialEvolve: '-',
    evolveCondition: [ { level: '2', cost: '0', color: 'Green' } ],
    effect: '[On Play] Reveal the top 3 cards of your deck. Add 1 card with the [Mutant] traut and 1 card with the [ʟᴍᴡ] trait among them to the hand. Return the rest to the bottom of the deck.\n',
    evolveEffect: '[All Turns] [Once Per Turn] When 1 other Digimon digivolves, <Draw 1>.\n',
    securityEffect: '-',
    rule: '[Rule] Trait: Has the [Free] type.',
    digiXros: '',
    dnaEvolve: '-',
    burstEvolve: '-',
    cardNumber: '',
    imageOptions: {
      url: '',
      x_pos: 0,
      y_pos: 0,
      x_scale: 95,
      y_scale: 95,
      ess_x_pos: 37,
      ess_y_pos: 10,
      ess_x_end: 74,
      ess_y_end: 50,
      fontSize: 90.5
    }
  },
  {
    name: { english: 'Imperialdramon: Fighter Mode' },
    artist: '',
    author: '',
    color: 'Purple/Red',
    cardType: 'Digimon',
    playCost: '13',
    dp: '13000',
    cardLv: 'Lv.6',
    form: 'Mega',
    attribute: 'Virus',
    type: 'Ancient Dragonkin',
    rarity: '',
    specialEvolve: '[Digivolve] [Imperialdramon: Dragon Mode]: Cost 2',
    evolveCondition: [
      { cost: '5', level: '5', color: 'purple' },
      { cost: '5', level: '5', color: 'red' }
    ],
    effect: '<Security A. +1> <Piercing>\n' +
      "[When Digivolving] By returning 1 Multicolor Digimon card from this Digimon's digivolution cards to the hand, return all digivolution cards of 1 of your opponent's Digimon with as high or lower level as returned card to the bottom of the deck. Then, delete it.\n" +
      "[Your Turn] This Digimon doesn't activate [Security] effects of the cards it checks.\n",
    evolveEffect: '',
    securityEffect: '-',
    rule: '',
    digiXros: '',
    dnaEvolve: '-',
    burstEvolve: '-',
    cardNumber: '',
    imageOptions: {
      url: '',
      x_pos: 0,
      y_pos: 0,
      x_scale: 95,
      y_scale: 95,
      ess_x_pos: 37,
      ess_y_pos: 10,
      ess_x_end: 74,
      ess_y_end: 50,
      fontSize: 90.5
    }
  },
  {
    name: { english: 'Patamon' },
    artist: '',
    author: '',
    color: 'yellow/purple',
    cardType: 'Digimon',
    playCost: '3',
    dp: '1000',
    cardLv: 'Lv.3',
    form: 'Rookie',
    attribute: 'Data',
    type: 'Mammal',
    rarity: '',
    specialEvolve: '[Digivolve] [Tokomon]: Cost 0',
    evolveCondition: [
      { cost: '1', level: '2', color: 'yellow' },
      { cost: '1', level: '2', color: 'purple' }
    ],
    effect: '[On Play] Reveal the top 3 cards of your deck. Add 1 card with the [Mythical Beast] trait and 1 card with the [LIBERATOR] trait among them to the hand. Return the rest to the bottom of the deck. \n',
    evolveEffect: "[On Deletion] You may place 1 card from either player's trash face down in the battle area.\n",
    securityEffect: '-',
    rule: '[Rule] Trait: Also has [Mythical Beast] Type.',
    digiXros: '',
    dnaEvolve: '-',
    burstEvolve: '-',
    cardNumber: '',
    imageOptions: {
      url: '',
      x_pos: 0,
      y_pos: 0,
      x_scale: 95,
      y_scale: 95,
      ess_x_pos: 37,
      ess_y_pos: 10,
      ess_x_end: 74,
      ess_y_end: 50,
      fontSize: 90.5
    }
  },
  {
    name: { english: 'Steal!!!!' },
    artist: '',
    author: '',
    color: '',
    cardType: 'Option',
    playCost: '3',
    dp: '-',
    cardLv: '',
    form: '',
    attribute: '',
    type: '',
    rarity: '',
    specialEvolve: '-',
    evolveCondition: [ { color: '', cost: '', level: '' } ],
    effect: '     [Main] <Draw 1> for every Tamer your opponent has in play.\n',
    evolveEffect: '',
    securityEffect: '-[Security] <Draw 1>, then add this card to the hand.\n',
    rule: '',
    digiXros: '',
    dnaEvolve: '-',
    burstEvolve: '-',
    cardNumber: '',
    imageOptions: {
      url: '',
      x_pos: 0,
      y_pos: 0,
      x_scale: 95,
      y_scale: 95,
      ess_x_pos: 37,
      ess_y_pos: 10,
      ess_x_end: 74,
      ess_y_end: 50,
      fontSize: 90.5
    }
  },
  {
    name: { english: 'Arresterdramon X MetalTyrannomon' },
    artist: '',
    author: '',
    color: '',
    cardType: 'Digimon',
    playCost: '8',
    dp: '7000',
    cardLv: 'Lv.5',
    form: '',
    attribute: '',
    type: '',
    rarity: '',
    specialEvolve: '[Digivolve] from Lv.4 w/<Save> in text: 3 cost',
    evolveCondition: [
      { cost: '4', level: '4', color: '⚫' },
      { cost: '4', level: '4', color: '🟣' }
    ],
    effect: '<Blocker>\n' +
      `[On Play][When Digivolving] Until the end of your opponent's turn, 1 of their Digimon gains "[Start of Main] Forced attack." If digixrossed with 2 materials, <De-Digivolve 1> 1 of their Digimon.\n`,
    evolveEffect: "[Opponent's Turn] This Digimon with <Save> in its text gains <Reboot>.\n",
    securityEffect: '-',
    rule: '',
    digiXros: '[Digixros -1] [Arresterdramon] x [MetalTyrannomon]',
    dnaEvolve: '-',
    burstEvolve: '-',
    cardNumber: '',
    author: '',
    artist: '',
    imageOptions: {
      url: '',
      x_pos: 0,
      y_pos: 0,
      x_scale: 95,
      y_scale: 95,
      ess_x_pos: 37,
      ess_y_pos: 10,
      ess_x_end: 74,
      ess_y_end: 50,
      fontSize: 90.5
    }
  }
]

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
      "color": "⚫"
    },
    {
      "cost": "4",
      "level": "4",
      "color": "🟣"
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

