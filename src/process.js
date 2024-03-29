import { mergeTree, readYaml, toCSSDef, toCSSMap } from './util.js';

export const processFile = (filePath) => {
  const doc = readYaml(filePath);
  return processTokens(doc);
};

/**
 * @typedef TokenResult
 * @type {Object}
 * @property {boolean} isDark
 * @property {boolean} isDef
 * @property {boolean} isMap
 * @property {boolean} duplicate_as_rgb
 * @property {string} css
 * @property {[string, string]} token
 */

/**
 * @arg {object} tokenTree
 * @returns {Array.<TokenResult>}
 */
export const processTokens = (tokenTree) => {
  if (!tokenTree.token) throw "'token' is required for each document and can be set to either 'defs' or 'maps'";
  const isDark = !!tokenTree.dark;
  delete tokenTree.dark;
  const tokenType = tokenTree.token;
  const isDef = tokenType === 'defs';
  const isMap = !isDef;
  delete tokenTree.token;
  const duplicateAsRgb = !!tokenTree.duplicate_as_rgb;
  delete tokenTree.duplicate_as_rgb;
  const merged = mergeTree(tokenTree);
  const tokens = Object.entries(merged).map(token => ({
    token: { name: token[0], value: token[1] },
    isDark,
    isDef,
    isMap,
    css: isDef ? toCSSDef(token, duplicateAsRgb) : toCSSMap(token, duplicateAsRgb)
  }));
  return tokens;
};
