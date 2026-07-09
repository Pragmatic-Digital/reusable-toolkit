import type { StorybookConfig } from '@storybook/react-vite';
import type { InlineConfig } from 'vite';
import tailwindcssPlugin from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  async viteFinal(config: InlineConfig) {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '@pragmatic/hooks': path.resolve(__dirname, '../../hooks/src'),
        },
      },
      css: {
        postcss: {
          plugins: [
            tailwindcssPlugin,
            autoprefixer,
          ],
        },
      },
    };
  },
};

export default config;
