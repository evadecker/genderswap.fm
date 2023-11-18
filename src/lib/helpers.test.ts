import { describe, it, expect } from 'vitest';
import {
  getMaxCharacterHelpText,
  getReadableTitle,
  removeSongExtraText,
  slugify,
  slugifyCover,
  smartquotes
} from './helpers';

describe('maxCharacterHelpText', () => {
  it('should display default value', () => {
    expect(getMaxCharacterHelpText('', 160)).toBe('160 characters max');
  });

  it('should display multiple characters left', () => {
    expect(getMaxCharacterHelpText('hello', 160)).toBe('155 characters left');
  });

  it('should display singular character left', () => {
    expect(getMaxCharacterHelpText('a'.repeat(159), 160)).toBe('1 character left');
  });

  it('should display 0 characters left', () => {
    expect(getMaxCharacterHelpText('a'.repeat(160), 160)).toBe('0 characters left');
  });

  it('should display multiple characters over limit', () => {
    expect(getMaxCharacterHelpText('a'.repeat(180), 160)).toBe('20 characters over limit');
  });

  it('should display singular character over limit', () => {
    expect(getMaxCharacterHelpText('a'.repeat(161), 160)).toBe('1 character over limit');
  });
});

describe('getReadableTitle', () => {
  it('should format title correctly', () => {
    expect(
      getReadableTitle({
        originalName: 'Smells Like Teen Spirit',
        originalArtists: ['Nirvana'],
        coverArtists: ['Patti Smith']
      })
    ).toBe('Patti Smith’s cover of Smells Like Teen Spirit by Nirvana');
  });

  it('should convert three dots to an ellipsis', () => {
    expect(
      getReadableTitle({
        originalName: '...Baby One More Time',
        originalArtists: ['Britney Spears'],
        coverArtists: ['Travis']
      })
    ).toBe('Travis’s cover of …Baby One More Time by Britney Spears');
  });

  it('should convert straight quotes to curly quotes', () => {
    expect(
      getReadableTitle({
        originalName: 'Sonata No. 8 in C Minor, Op. 13 "Pathétique": II. Adagio cantabile',
        originalArtists: ['Ludwig van Beethoven'],
        coverArtists: ['Jun Fukamachi']
      })
    ).toBe(
      'Jun Fukamachi’s cover of Sonata No. 8 in C Minor, Op. 13 “Pathétique”: II. Adagio cantabile by Ludwig van Beethoven'
    );
  });
});

describe('removeSongExtraText', () => {
  it('should remove ending parenthetical phrases from songs', () => {
    expect(removeSongExtraText('Crazy in Love (feat. Jay-Z)')).toBe('Crazy in Love');
  });

  it('should not remove starting parenthetical phrases from songs', () => {
    expect(removeSongExtraText("(I Can't Get No) Satisfaction")).toBe(
      "(I Can't Get No) Satisfaction"
    );
  });

  it('should remove everything after " - "', () => {
    expect(removeSongExtraText("Can't Get You out of My Head - Live at KEXP")).toBe(
      "Can't Get You out of My Head"
    );
  });
});

describe('slugify', () => {
  it('should remove diacritics', () => {
    expect(slugify('Le "Ça ira"')).toBe('le-ca-ira');
  });

  it('should trim space', () => {
    expect(slugify(' Flowers ')).toBe('flowers');
  });

  it('should remove punctuation', () => {
    expect(slugify('Life on Mars?')).toBe('life-on-mars');
    expect(slugify('Take Me Home, Country Roads')).toBe('take-me-home-country-roads');
    expect(slugify("(I Can't Get No) Satisfaction")).toBe('i-cant-get-no-satisfaction');
    expect(slugify('That! Feels Good!')).toBe('that-feels-good');
    expect(slugify('S.O.S')).toBe('sos');
    expect(slugify('S.O.S. [Double Fisted Power Slam Version]')).toBe(
      'sos-double-fisted-power-slam-version'
    );
    expect(slugify('!@#$%^&*()_+=[]{}|;:",.<>?`~')).toBe('');
  });

  it('should replace forward slashes with hyphens', () => {
    expect(slugify('Turn, Turn, Turn! / To Everything There Is A Season')).toBe(
      'turn-turn-turn-to-everything-there-is-a-season'
    );
  });

  it('should replace spaces with hyphens', () => {
    expect(slugify('a b c')).toBe('a-b-c');
  });

  it('should remove consecutive hyphens', () => {
    expect(slugify('Smooth Operator - Single Version')).toBe('smooth-operator-single-version');
  });

  it('should convert to lowercase', () => {
    expect(slugify('THE ORDER OF THE SPIRITUAL VIRGIN')).toBe('the-order-of-the-spiritual-virgin');
  });
});

describe('slugifyCover', () => {
  it('should slugify cover correctly', () => {
    expect(slugifyCover('Smells Like Teen Spirit', 'Patti Smith')).toBe(
      'smells-like-teen-spirit-patti-smith'
    );
  });

  it('should not include extra song text', () => {
    expect(slugifyCover('Crazy in Love (feat. Jay-Z)', 'Beyoncé')).toBe('crazy-in-love-beyonce');
  });
});

describe('smartquotes', () => {
  it('should convert straight doublequotes to curly doublequotes', () => {
    expect(smartquotes('Sonata No. 8 in C Minor, Op. 13 "Pathétique": II. Adagio cantabile')).toBe(
      'Sonata No. 8 in C Minor, Op. 13 “Pathétique”: II. Adagio cantabile'
    );
  });

  it('should convert straight singlequotes to curly singlequotes', () => {
    expect(smartquotes("I Can't Get No (Satisfaction)")).toBe('I Can’t Get No (Satisfaction)');
  });

  it('should convert two hypens to an em dash', () => {
    expect(smartquotes('The Power of Love--Remastered')).toBe('The Power of Love—Remastered');
  });

  it('should convert three dots to an ellipsis', () => {
    expect(smartquotes('...Baby One More Time')).toBe('…Baby One More Time');
  });
});
