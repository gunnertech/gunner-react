module.exports = function (api) {
  api.cache(true);
  const presets = ["@babel/preset-env", "@babel/preset-react"];
  const plugins = ["@babel/plugin-proposal-optional-chaining", "@babel/plugin-proposal-nullish-coalescing-operator", "@babel/plugin-transform-react-jsx", "@babel/plugin-proposal-export-default-from"];
  //"source-map-support",
  return { presets, plugins };
};

// "babel-plugin-source-map-support": "^2.1.1",
//     "source-map-support": "^0.5.19",
// "fs": "0.0.1-security",
//     "path": "^0.12.7"