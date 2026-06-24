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
  34572,  // Black Clover
  49596,  // Tomodachi Game
  11757,  // Sword Art Online
  50273,  // Sousou no Frieren
  52034,  // Oshi no Ko
  57334,  // Dandadan
  47917,  // Bocchi the Rock
  52299,  // Solo Leveling
  32182,  // Mob 100
  54112,  // Zom 100
  // 48583,  // Spy x Family
  // 50739,  // Hell's Paradise
  // 51009,  // Vinland Saga Season 2
  // 39535,  // Mushoku Tensei
  // 35849,  // Violet Evergarden
  // 9253,   // Steins;Gate
  // 32281,  // Kimi no Na wa (Your Name)
  // 28851,  // Koe no Katachi (A Silent Voice)
] as const;
