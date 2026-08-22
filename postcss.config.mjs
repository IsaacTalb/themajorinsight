import tailwindPostcss from "./tailwind-postcss.mjs";
import autoprefixer from "autoprefixer";

const config = {
  plugins: [tailwindPostcss(), autoprefixer()]
};

export default config;
