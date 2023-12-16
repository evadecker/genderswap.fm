import { render } from '@testing-library/svelte';
import Sparkle from './Sparkle.svelte';
import { describe, it } from 'vitest';

describe('Sparkle', async () => {
  it('should render the sparkle svg', async ({ expect }) => {
    const { container } = render(Sparkle);
    const svg = container.querySelector('svg');
    expect(svg).toBeDefined();
  });
});
