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
] as const;
