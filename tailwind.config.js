module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
  },
  purge: [
    "./**/*.html",
    "./**/*.md",
    "./_assets/**/*.js",
  ],
  theme: {
    extend: {
      zIndex: {
        "-1": "-1",
      },
    },
  },
  variants: {},
  plugins: [
    require("@tailwindcss/custom-forms"),
  ],
};
