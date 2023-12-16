import { render } from '@testing-library/svelte';
import NewCoverIcon from './NewCoverIcon.svelte';
import { describe, it } from 'vitest';

describe('NewCoverIcon', async () => {
  it('should render the new cover icon svg', async ({ expect }) => {
    const { container } = render(NewCoverIcon);
    const svg = container.querySelector('svg');
    expect(svg).toBeDefined();
  });
});
