// Built-in colorways. Colors are assigned per zone so a preset applies across
// every layout without per-layout key-ID mappings (see applyPreset in
// useColorway.js). Alpha + number share one accent; the remaining zones share
// the other, matching the two-color table in V2.md section 6.
const presets = [
  {
    name: 'WoB',
    caseColor: '#111111',
    caseFinish: 'matte',
    zones: {
      alpha: '#ffffff',
      number: '#ffffff',
      modifier: '#ffffff',
      function: '#ffffff',
      arrow: '#ffffff',
      navigation: '#ffffff',
      numpad: '#ffffff',
    },
  },
  {
    name: 'BoW',
    caseColor: '#f0f0f0',
    caseFinish: 'matte',
    zones: {
      alpha: '#111111',
      number: '#111111',
      modifier: '#111111',
      function: '#111111',
      arrow: '#111111',
      navigation: '#111111',
      numpad: '#111111',
    },
  },
  {
    name: 'Miami',
    caseColor: '#ffffff',
    caseFinish: 'matte',
    zones: {
      alpha: '#f637a8',
      number: '#f637a8',
      modifier: '#1fcecb',
      function: '#1fcecb',
      arrow: '#1fcecb',
      navigation: '#1fcecb',
      numpad: '#1fcecb',
    },
  },
  {
    name: 'Nord',
    caseColor: '#2e3440',
    caseFinish: 'matte',
    zones: {
      alpha: '#eceff4',
      number: '#eceff4',
      modifier: '#88c0d0',
      function: '#88c0d0',
      arrow: '#88c0d0',
      navigation: '#88c0d0',
      numpad: '#88c0d0',
    },
  },
  {
    name: 'Dracula',
    caseColor: '#282a36',
    caseFinish: 'matte',
    zones: {
      alpha: '#f8f8f2',
      number: '#f8f8f2',
      modifier: '#bd93f9',
      function: '#bd93f9',
      arrow: '#bd93f9',
      navigation: '#bd93f9',
      numpad: '#bd93f9',
    },
  },
  {
    name: 'Solarized',
    caseColor: '#002b36',
    caseFinish: 'matte',
    zones: {
      alpha: '#657b83',
      number: '#657b83',
      modifier: '#268bd2',
      function: '#268bd2',
      arrow: '#268bd2',
      navigation: '#268bd2',
      numpad: '#268bd2',
    },
  },
  {
    name: 'Olivia',
    caseColor: '#1a1a1a',
    caseFinish: 'matte',
    zones: {
      alpha: '#f2d0a9',
      number: '#f2d0a9',
      modifier: '#b56576',
      function: '#b56576',
      arrow: '#b56576',
      navigation: '#b56576',
      numpad: '#b56576',
    },
  },
  {
    name: 'Cyber',
    caseColor: '#0a0a0a',
    caseFinish: 'matte',
    zones: {
      alpha: '#00ff9f',
      number: '#00ff9f',
      modifier: '#ff003c',
      function: '#ff003c',
      arrow: '#ff003c',
      navigation: '#ff003c',
      numpad: '#ff003c',
    },
  },
];

export default presets;
