import SPELLS from 'common/SPELLS';

// Based on SpellData for Hit Combo and Serenity
export const ABILITIES_AFFECTED_BY_DAMAGE_INCREASES = [
  SPELLS.MELEE,
  SPELLS.TIGER_PALM,
  SPELLS.BLACKOUT_KICK,
  SPELLS.FISTS_OF_FURY_CAST,
  SPELLS.FISTS_OF_FURY_DAMAGE,
  SPELLS.RISING_SUN_KICK,
  SPELLS.RISING_SUN_KICK_SECOND,
  SPELLS.SPINNING_CRANE_KICK,
  SPELLS.FLYING_SERPENT_KICK,
  SPELLS.CRACKLING_JADE_LIGHTNING,
  SPELLS.TOUCH_OF_DEATH,
  // talents
  SPELLS.CHI_WAVE_TALENT,
  SPELLS.FIST_OF_THE_WHITE_TIGER_TALENT,
  SPELLS.WHIRLING_DRAGON_PUNCH_TALENT,
  SPELLS.RUSHING_JADE_WIND_TALENT_WINDWALKER,
  SPELLS.CHI_BURST_TALENT,
  SPELLS.EYE_OF_THE_TIGER_TALENT,
  // traits/items
  SPELLS.SUNRISE_TECHNIQUE,
  SPELLS.GLORY_OF_THE_DAWN_HIT,
];

export const ABILITIES_AFFECTED_BY_MASTERY = [
  SPELLS.TIGER_PALM,
  SPELLS.BLACKOUT_KICK,
  SPELLS.FISTS_OF_FURY_CAST,
  SPELLS.RISING_SUN_KICK,
  SPELLS.CHI_WAVE_TALENT,
  SPELLS.FIST_OF_THE_WHITE_TIGER_TALENT,
  SPELLS.SPINNING_CRANE_KICK,
  SPELLS.FLYING_SERPENT_KICK,
  SPELLS.CRACKLING_JADE_LIGHTNING,
  SPELLS.WHIRLING_DRAGON_PUNCH_TALENT,
  SPELLS.TOUCH_OF_DEATH,
  SPELLS.CHI_BURST_TALENT,
  SPELLS.RUSHING_JADE_WIND_TALENT_WINDWALKER,
];

export const CHI_SPENDERS = [
  SPELLS.BLACKOUT_KICK.id,
  SPELLS.RISING_SUN_KICK.id,
  SPELLS.FISTS_OF_FURY_CAST.id,
  SPELLS.SPINNING_CRANE_KICK.id,
  SPELLS.RUSHING_JADE_WIND_TALENT_WINDWALKER.id,
];
