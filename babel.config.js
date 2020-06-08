module.exports = function (api) {
  api.cache(true);
  const presets = ["@babel/preset-env", "@babel/preset-react"];
  const plugins = ["@babel/plugin-proposal-optional-chaining", "@babel/plugin-proposal-nullish-coalescing-operator", "source-map-support", "@babel/plugin-transform-react-jsx", "@babel/plugin-proposal-export-default-from"];
  return { presets, plugins };
};