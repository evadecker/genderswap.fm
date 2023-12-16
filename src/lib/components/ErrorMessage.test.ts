import { render } from '@testing-library/svelte';
import ErrorMessage from './ErrorMessage.svelte';
import { describe, it } from 'vitest';

describe('ErrorMessage', async () => {
  it('should render the error', async ({ expect }) => {
    const { container } = render(ErrorMessage);
    const error = container.querySelector('.error');
    expect(error).toBeDefined();
  });

  it('should display an icon', async ({ expect }) => {
    const { container } = render(ErrorMessage);
    const icon = container.querySelector('svg');
    expect(icon).toBeDefined();
  });

  it('should apply the `banner` class when the prop is set', async ({ expect }) => {
    const { container } = render(ErrorMessage, { props: { error: 'Oops!', banner: true } });
    const error = container.querySelector('.error');
    expect(error?.classList).toContain('banner');
  });
});
