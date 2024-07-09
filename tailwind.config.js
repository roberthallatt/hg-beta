// https://uicolors.app/create

module.exports = {
  content: ["./src/**/*.{html,js,css,scss,twig}"],
  theme: {
    screens: {
      tablet: '640px',
      laptop: '1024px',
      desktop: '1280px',
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
  },
  plugins: [],
}