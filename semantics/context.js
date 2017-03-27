/*
 * Semantic Analysis Context
 *
 * const Context = require('./semantics/context');
 *
 * A context object holds state for the semantic analysis phase, such as the
 * enclosing function (if any), whether or not we are in a loop, a map of
 * variables defined in this scope, and the parent context.
 */

const FunctionDeclaration = require('../ast/function-declaration');
const Parameter = require('../ast/parameter');

class Context {
  constructor({ parent = null, currentFunction = null, inLoop = false }) {
    this.parent = parent;
    this.variables = Object.create();
    this.currentFunction = currentFunction;
    this.inLoop = inLoop;
  }

  createChildContextForLoop() {
    return new Context({ parent: this, inLoop: true });
  }

  createChildContextForFunctionBody(currentFunction) {
    return new Context({ parent: this, currentFunction });
  }

  createChildContextForBlock() {
    return new Context({ parent: this });
  }

  lookup(id) {
    if (id in this.variables) {
      return this.variables[id];
    } else if (this.parent === null) {
      throw new Error(`Identifier ${id} has not been declared`);
    } else {
      return context.parent.lookup(id);
    }
  }
}

Context.INITIAL = new Context();
Context.INITIAL.variables = {
  print: new FunctionDeclaration('print', [new Parameter('_', null)], null),
  sqrt: new FunctionDeclaration('sqrt', [new Parameter('_', null)], null),
};

module.exports = Context;
