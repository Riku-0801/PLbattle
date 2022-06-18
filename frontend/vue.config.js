const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  devServer: {
    proxy: "http://localhost:3000",
  },
  transpileDependencies: ["vuetify"],
});

const GoogleFontsPlugin = require("google-fonts-webpack-plugin");

module.exports = {
  entry: "index.js",
  /* ... */
  plugins: [
    new GoogleFontsPlugin({
      fonts: [
        { family: "Source Sans Pro" },
        { family: "Roboto", variants: ["400", "700italic"] },
        { family: "Chakra Petch" },
        /*ここにフォントを追加していく．もちろん上のRobotoとSourse sans proは消してよい*/
      ],
      /* ...options */
    }),
  ],
};
