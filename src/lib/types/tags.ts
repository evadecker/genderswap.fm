import type { Enums } from './types';

type Tag = {
  label: string;
  description: string;
  slug: string;
};

export const TAGS: Record<Enums<'tags'>, Tag> = {
  acousticness_up: {
    label: 'more acoustic',
    description: 'These covers are stripped down versions of the original.',
    slug: 'more-acoustic'
  },
  acousticness_down: {
    label: 'less acoustic',
    description: 'These covers take an acoustic song somewhere new.',
    slug: 'less-acoustic'
  },
  danceability_up: {
    label: 'more danceable',
    description:
      'A stable rhythm and a strong beat make these covers more dance-friendly than the original.',
    slug: 'more-danceable'
  },
  danceability_down: {
    label: 'less danceable',
    description: "Where'd the beat go? These covers find beauty in irregularity.",
    slug: 'less-danceable'
  },
  duration_up: {
    label: 'longer',
    description: 'These covers are at least a minute longer than the original.',
    slug: 'longer'
  },
  duration_down: {
    label: 'shorter',
    description: 'These covers are at least a minute shorter than the original.',
    slug: 'shorter'
  },
  energy_up: {
    label: 'more energetic',
    description: 'These covers bring home the intensity. Loud, fast, fun.',
    slug: 'more-energetic'
  },
  energy_down: {
    label: 'less energetic',
    description: 'Less intense than the original—these are covers to relax with.',
    slug: 'less-energetic'
  },
  instrumentalness_up: {
    label: 'more instrumental',
    description: 'Who needs lyrics? These covers are instrument-forward with little-to-no vocals.',
    slug: 'more-instrumental'
  },
  instrumentalness_down: {
    label: 'less instrumental',
    description: 'These covers take an instrumental-heavy original and embellish it with vocals.',
    slug: 'less-instrumental'
  },
  key_change: {
    label: 'different key',
    description: 'These covers are in a different key than the original.',
    slug: 'different-key'
  },
  tempo_up: {
    label: 'faster',
    description: 'These covers are at least 40 BPM faster than the original.',
    slug: 'faster'
  },
  tempo_down: {
    label: 'slower',
    description: 'These covers are at least 40 BPM slower than the original.',
    slug: 'slower'
  },
  time_signature_change: {
    label: 'time signature change',
    description: 'These covers are in a different time signature than the original.',
    slug: 'time-signature-change'
  },
  transition_ftm: {
    label: 'FTM',
    description: 'Boys cover girls.',
    slug: 'ftm'
  },
  transition_mtf: {
    label: 'MTF',
    description: 'Girls cover boys.',
    slug: 'mtf'
  },
  transition_ftf: {
    label: 'FTF',
    description: "Girls cover girls, but that doesn't mean the gender is the same.",
    slug: 'ftf'
  },
  transition_mtm: {
    label: 'MTM',
    description: "Boys cover boys, but that doesn't mean the gender is the same.",
    slug: 'mtm'
  },
  valence_up: {
    label: 'happier',
    description: 'These covers are happier and more cheerful than the original.',
    slug: 'happier'
  },
  valence_down: {
    label: 'sadder',
    description: 'These covers are sadder and more melancholy than the original.',
    slug: 'sadder'
  },
  years_apart_10: {
    label: '10+ years apart',
    description: 'These covers were released between 10 and 20 years after the original.',
    slug: '10-years-apart'
  },
  years_apart_20: {
    label: '20+ years apart',
    description: 'These covers were released between 20 and 30 years after the original.',
    slug: '20-years-apart'
  },
  years_apart_30: {
    label: '30+ years apart',
    description: 'These covers were released between 30 and 40 years after the original.',
    slug: '30-years-apart'
  },
  years_apart_40: {
    label: '40+ years apart',
    description: 'These covers were released between 40 and 50 years after the original.',
    slug: '40-years-apart'
  },
  years_apart_50: {
    label: '50+ years apart',
    description: 'These covers were released over 50 years after the original.',
    slug: '50-years-apart'
  }
};
