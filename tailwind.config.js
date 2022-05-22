module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {

      colors: {
        'dark-blue-gradient': "#020817",
        'dark-blue': '#04000f',
        'gold': '#FFD700'

      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
        'custom': '0px 0px 15px 5px #3B82F6, 0px 0px 25px 10px #3B82F6, 0px 0px 30px 25px #A0A4F6;'
      }
    },
  },
  plugins: [],
}