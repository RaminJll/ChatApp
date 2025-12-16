// postcss.config.cjs
module.exports = {
  plugins: {
    // ✅ On référence maintenant le nouveau paquet
    '@tailwindcss/postcss': {}, 
    autoprefixer: {},
  },
}