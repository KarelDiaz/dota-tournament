module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {

    extend: {
      minHeight: {
        '24': '6rem',
      },
      minWidth: {
        '24': '6rem',
      },
      width: {
        '1/10': '10%',
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ['disabled', 'active'],
    }
  },
  plugins: [],
}
