const defaultTheme = require('tailwindcss/defaultTheme')
const { tailwindExtractor } = require("tailwindcss/lib/lib/purgeUnusedStyles");
const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: "class",
  purge: {
    content: ["./src/**/*.html", "./src/**/*.svelte"],
    options: {
      defaultExtractor: (content) => [
        // This is an internal Tailwind function that we're not supposed to be allowed to use
        // So if this stops working, please open an issue at
        // https://github.com/babichjacob/sapper-postcss-template/issues
        // rather than bothering Tailwind Labs about it
        ...tailwindExtractor(content),
        // Match Svelte class: directives (https://github.com/tailwindlabs/tailwindcss/discussions/1731)
        ...[...content.matchAll(/(?:class:)*([\w\d-/:%.]+)/gm)].map(
          ([_match, group, ..._rest]) => group
        ),
      ],
      keyframes: true,
    },
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        gray: colors.trueGray,
      },
      textColor: {
        'primary': 'var(--text-primary)',
        'full': 'var(--text-full)',
        'muted': 'var(--text-muted)',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
