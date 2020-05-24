/* eslint-disable @typescript-eslint/no-var-requires */
const yaml = require('js-yaml');

module.exports.default = function(yamlFile) {
  return `export default ${JSON.stringify(yaml.safeLoad(yamlFile))}`;
};
