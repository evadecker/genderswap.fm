import { render } from '@testing-library/svelte';
import Header from './Header.svelte';
import { describe, it } from 'vitest';

describe('Header', async () => {
  it('should render the logo', async ({ expect }) => {
    const { container } = render(Header);
    const logo = container.querySelector('.logo');
    expect(logo).toBeDefined();
  });

  it('should render the "add a cover" button', async ({ expect }) => {
    const { container } = render(Header);
    const button = container.querySelector('a[href="/new"]');
    expect(button).toBeDefined();
  });
});
