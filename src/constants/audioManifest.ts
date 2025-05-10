// Audio manifest for all available sounds in the app
// Category: 'ambient' | 'music' | 'UI'

export type AudioCategory = 'ambient' | 'music' | 'UI';

export interface AudioFile {
  id: string; // unique key
  name: string; // display name
  category: AudioCategory;
  path: string; // relative to project root
}

export const audioManifest: AudioFile[] = [
  // Ambient
  { id: 'horror2', name: 'Horror 2', category: 'ambient', path: './assets/audio/ambient/horror2.wav' },
  { id: 'futuree', name: 'Futuree', category: 'ambient', path: './assets/audio/ambient/futuree.wav' },
  { id: 'horror', name: 'Horror', category: 'ambient', path: './assets/audio/ambient/horror.wav' },
  { id: 'light_rain', name: 'Light Rain', category: 'ambient', path: './assets/audio/ambient/light_rain.wav' },
  { id: 'your_mission', name: 'Your Mission', category: 'ambient', path: './assets/audio/ambient/your_mission.wav' },
  { id: 'park_day', name: 'Park Day', category: 'ambient', path: './assets/audio/ambient/park_day.wav' },
  { id: 'soothing', name: 'Soothing', category: 'ambient', path: './assets/audio/ambient/soothing.mp3' },
  { id: 'horro3', name: 'Horror 3', category: 'ambient', path: './assets/audio/ambient/horro3.wav' },
  { id: 'the_office', name: 'The Office', category: 'ambient', path: './assets/audio/ambient/the_office.wav' },
  { id: 'beach_day', name: 'Beach Day', category: 'ambient', path: './assets/audio/ambient/beach_day.wav' },
  { id: 'birds', name: 'Birds', category: 'ambient', path: './assets/audio/ambient/birds.wav' },
  { id: 'silence', name: 'Silence', category: 'ambient', path: './assets/audio/ambient/silence.mp3' },
  { id: 'waves', name: 'Waves', category: 'ambient', path: './assets/audio/ambient/waves.mp3' },
  // { id: 'rain', name: 'Rain', category: 'ambient', path: './assets/audio/ambient/rain.mp3' },

  // Music
  { id: 'ate_bit', name: '8-Bit', category: 'music', path: './assets/audio/music/ate-bit.wav' },
  { id: 'acutal_techno', name: 'Actual Techno', category: 'music', path: './assets/audio/music/acutal_techno.wav' },
  { id: 'sapced_outer', name: 'Spaced Outer', category: 'music', path: './assets/audio/music/sapced_outer.wav' },
  { id: 'techo_tune', name: 'Techno Tune', category: 'music', path: './assets/audio/music/techo_tune.wav' },
  { id: 'wonky_tune', name: 'Wonky Tune', category: 'music', path: './assets/audio/music/wonky_tune.wav' },

  // UI
  { id: 'back_button', name: 'Back Button', category: 'UI', path: './assets/audio/UI/back_button.wav' },
  { id: 'alert', name: 'Alert', category: 'UI', path: './assets/audio/UI/alert.wav' },
  { id: 'settings_open', name: 'Settings Open', category: 'UI', path: './assets/audio/UI/settings_open.wav' },
  { id: 'select_3', name: 'Select 3', category: 'UI', path: './assets/audio/UI/select_3.wav' },
  { id: 'select_2', name: 'Select 2', category: 'UI', path: './assets/audio/UI/select_2.wav' },
  { id: 'settings_menu', name: 'Settings Menu', category: 'UI', path: './assets/audio/UI/settings_menu.wav' },
  { id: 'select', name: 'Select', category: 'UI', path: './assets/audio/UI/select.wav' },
  { id: 'generic_win', name: 'Generic Win', category: 'UI', path: './assets/audio/UI/generic_win.wav' },
  { id: 'coin_win', name: 'Coin Win', category: 'UI', path: './assets/audio/UI/coin-win.wav' },
  { id: 'money_bag_drop', name: 'Money Bag Drop', category: 'UI', path: './assets/audio/UI/money_bag_drop.wav' },
  { id: 'coin', name: 'Coin', category: 'UI', path: './assets/audio/UI/coin.wav' },
  { id: 'select_drip', name: 'Select Drip', category: 'UI', path: './assets/audio/UI/select_drip.wav' },
  { id: 'zen_tablet_break', name: 'Zen Tablet Break', category: 'UI', path: './assets/audio/UI/zen_tablet_break.wav' },
  { id: 'loading_screen', name: 'Loading Screen', category: 'UI', path: './assets/audio/UI/loading_screen.wav' },
  { id: 'shop_music', name: 'Shop Music', category: 'UI', path: './assets/audio/UI/shop_music.wav' },
  { id: 'level_up', name: 'Level Up', category: 'UI', path: './assets/audio/UI/level_up.wav' },
  { id: 'pop', name: 'Pop', category: 'UI', path: './assets/audio/UI/pop.wav' },
]; 