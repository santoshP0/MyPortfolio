const purgecss = require('@fullhuman/postcss-purgecss').default;

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: [
    isProd && purgecss({
      content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx}',
      ],
      defaultExtractor: (content) => content.match(/[^<>'"`\s\.\:]+/g) || [],
      safelist: [
        // Global tokens and small utility classes
        'accent', 'purple',
        // Animation/status classes used dynamically
        /^tx-/, /^fps-meter/,
        // App layout + animation entrance
        /^App/, /^anime-layout/, /^anime-section/,
        // Feature scopes
        /^hero-/, /^lore-/, /^skill-/, /^project-/, /^quest-/, /^resume-/, /^section-nav/, /^preloader/,
      ],
    }),
  ].filter(Boolean),
};
