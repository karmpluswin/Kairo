export const DAYS_OF_WEEK = [
  'Sundays',
  'Mondays',
  'Tuesdays',
  'Wednesdays',
  'Thursdays',
  'Fridays',
  'Saturdays',
];

export const TIME_UNITS = {
  days:    { label: 'd', ms: 1000 * 60 * 60 * 24 },
  hours:   { label: 'h', ms: 1000 * 60 * 60 },
  minutes: { label: 'm', ms: 1000 * 60 },
};

export const ITEMS_PER_PAGE = 24;

/** Popular all-time titles shown first, before current-season anime. */
export const POPULAR_PINNED_MAL_IDS = [
  16498,  // Attack on Titan
  1535,   // Death Note
  40748,  // Jujutsu Kaisen
  38000,  // Demon Slayer: Kimetsu no Yaiba
  5114,   // Fullmetal Alchemist: Brotherhood
  44511,  // Chainsaw Man
  30276,  // One Punch Man
  21459,  // Mob Psycho 100
  34572,  // Black Clover
  37991,  // Dr. Stone
  37521,  // Vinland Saga
  11757,  // Sword Art Online
  23273,  // Haikyuu!!
  1575,   // Code Geass
  9253,   // Steins;Gate
  20507,  // Noragami
  39659,  // Re:Zero
  48569,  // 86
  49458,  // Blue Lock
] as const;
