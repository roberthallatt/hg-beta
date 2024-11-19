// https://uicolors.app/create

const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ["./src/**/*.{html,js,css,scss,twig}"],
  theme: {
    screens: {
      '2xs': { min: '300px' },
      xs: { max: '575px' }, // Mobile (iPhone 3 - iPhone XS Max).
      sm: { min: '576px', max: '897px' }, // Mobile (matches max: iPhone 11 Pro Max landscape @ 896px).
      md: { min: '898px', max: '1199px' }, // Tablet (matches max: iPad Pro @ 1112px).
      lg: { min: '1200px' }, // Desktop smallest.
      xl: { min: '1259px' }, // Desktop wide.
      '2xl': { min: '1359px' } // Desktop widescreen.
    },
    listStyleType: {
      none: 'none',
      disc: 'disc',
      decimal: 'decimal',
      square: 'square',
      roman: 'upper-roman',
    },
    container: {
      center: true,
    },
    colors: {
      'blue': {
        50: '#e1eaf3',
        100: '#c3d5e7',
        200: '#81a8cf',
        300: '#5a98c7',
        400: '#2e78b7',
        500: '#116FB7',
        600: '#105da1',
        700: '#0d4a81',
        800: '#0a3761',
        900: '#072641',
      },
      'red': {
        '50': '#fff1f2',
        '100': '#ffdfe2',
        '200': '#ffc4ca',
        '300': '#ff9ba5',
        '400': '#ff6272',
        '500': '#ff3146',
        '600': '#f11128',
        '700': '#c70a1d',
        '800': '#a70d1c',
        '900': '#8a121e',
        '950': '#4c030a',
    },
    'gray': {
        '50': '#f9f7f7',
        '100': '#f1efef',
        '200': '#e6e2e3',
        '300': '#d4cdce',
        '400': '#c4babc',
        '500': '#a19295',
        '600': '#89797c',
        '700': '#716467',
        '800': '#5f5557',
        '900': '#524a4c',
        '950': '#2a2526',
    },
    'yellow': {
      '50': '#fffcea',
      '100': '#fff3c5',
      '200': '#ffe685',
      '300': '#ffd346',
      '400': '#ffbe1b',
      '500': '#ff9c04',
      '600': '#e27300',
      '700': '#bb4e02',
      '800': '#983c08',
      '900': '#7c310b',
      '950': '#481700',
    },
    'white': '#ffffff',
    'black': '#000000',
    },
    fontFamily: {
      inter: ['Inter', 'sans-serif']
    },
    extend: {
      backgroundImage: theme => ({
        'gradient-to-45': 
            'linear-gradient(45deg, #ffed4a, #ff3860)',
        'gradient-to-135': 
            'linear-gradient(135deg, #ffed4a, #ff3860)',
      })
    },
    textShadow: {
      DEFAULT: '0 2px 4px var(--tw-shadow-color)',
      sm: '0 2px 2px var(--tw-shadow-color)',
      lg: '0 4px 10px var(--tw-shadow-color)',
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
    require('tailwindcss-debug-screens'),
    plugin(function ({ matchUtilities, addComponents, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      );
      addComponents({
        '.donate-button': {
          textShadow: '1px 1px 0px #353935,2px 3px 0px #00000040',
        },
        '.donate-sidenav': {
          textShadow: '1px 1px 0px #fff,2px 3px 0px #00000040',
        },
      });
    }),
  ],
}

// text shadow reference - https://purecode.ai/blogs/tailwind-text-shadow