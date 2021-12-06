module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
    "@storybook/addon-actions"
  ],
  // @note credits https://github.com/storybookjs/storybook/issues/9796#issuecomment-634454267
  webpackFinal: async (webpackConfig, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.
    const { loadCracoConfig } = require('@craco/craco/lib/config');
    const { getCraPaths } = require('@craco/craco/lib/cra');
    const context = {env: process.env.NODE_ENV};
    const cracoConfig = loadCracoConfig(context);
    context.paths = getCraPaths(cracoConfig);
    const {overrideWebpackConfig} = require('@semantic-ui-react/craco-less');
    overrideWebpackConfig({
      context,
      webpackConfig
    });

    const updatedWebpackConfig = {...webpackConfig, node: {
      fs: "empty"
    }};
    // Return the altered config
    return updatedWebpackConfig;
  }
}
