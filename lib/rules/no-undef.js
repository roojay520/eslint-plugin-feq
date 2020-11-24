/**
 * @fileoverview Rule to flag references to undeclared variables.
 * @author Mark Macdonald
 */

/**
 * @Author: roojay
 * @LastEditors: roojay
 * @Description: Exclude specific prefix variables.
 */

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Checks if the given node is the argument of a typeof operator.
 * @param {ASTNode} node The AST node being checked.
 * @returns {boolean} Whether or not the node is the argument of a typeof operator.
 */
function hasTypeOfOperator(node) {
  const parent = node.parent;

  return parent.type === 'UnaryExpression' && parent.operator === 'typeof';
}

/**
 * Match string start with specific prefixes.
 * @param {string} str match string
 * @param {string} prefix specific prefix
 * @return {boolean}  match result
 */
function prefixSpecMatch(str, prefix) {
  if (typeof prefix !== 'string') return false;
  const specPrefix = prefix.replace(/[\s]{2,}/g, ' ');
  const reg = new RegExp(`^${specPrefix}`);
  return reg.test(str);
}

/**
 * Exclude specific prefix variables.
 * @param {ASTNode} node The AST node being checked.
 * @returns {boolean}
 */
function hasSpecPrefix(node, prefix) {
  const { name } = node;
  if (!prefix || (typeof prefix !== 'string' || Array.isArray(prefix)) ) return false;
  if (Array.isArray(prefix)) {
    return prefix.some(_prefix => prefixSpecMatch(name, prefix));
  }
  return prefixSpecMatch(name, prefix);

}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',

    docs: {
      description: 'disallow the use of undeclared variables unless mentioned in `/*global */` or `/*eslint no-undef: ["error", { "prefix": "" }] */ comments',
      category: 'Variables',
      recommended: true,
      url: 'https://eslint.org/docs/rules/no-undef'
    },

    schema: [
      {
        type: 'object',
        properties: {
          typeof: {
            type: 'boolean',
            default: false
          },
          prefix: {
            type: 'string',
            default: ''
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      undef: '\'{{name}}\' is not defined.'
    }
  },

  create(context) {
    const options = context.options[0];
    const considerTypeOf = options && options.typeof === true || false;
    const specPrefix = options && options.prefix || '';

    return {
      'Program:exit'(/* node */) {
        const globalScope = context.getScope();

        globalScope.through.forEach(ref => {
          const identifier = ref.identifier;

          if ((!considerTypeOf && hasTypeOfOperator(identifier)) || hasSpecPrefix(identifier, specPrefix)) {
            return;
          }

          context.report({
            node: identifier,
            messageId: 'undef',
            data: identifier
          });
        });
      }
    };
  }
};
