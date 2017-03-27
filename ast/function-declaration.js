module.exports = class FunctionDeclaration {
  constructor(id, params, body) {
    this.id = id;
    this.params = params;
    this.body = body;
  }

  analyze(context) {
    const localContext = context.createChildContextForFunctionBody(this);

    // Each parameter will be declared in the function's scope, mixed in
    // with the function's local variables. This is by design.
    this.params.forEach(p => p.analyze(localContext));

    // The function itself will be added to the outer scope, but only AFTER
    // the parameters have been inserted into the inner scope. This is because
    // we don't want to allow the function itself to be called in the default
    // expression of any parameter. Think about it. :)
    context.addVariable(this.id, this);

    // Now we analyze the body with the local context. Note that recursion is
    // allowed, because we've already inserted the function itself into the
    // outer scope, so recursive calls will be properly resolved during the
    // usual "outward moving" scope search. Of course, if you declare a local
    // variable with the same name as the function inside the function, you'll
    // shadow it, which would probably be not a good idea.
    this.body.analyze(localContext);
  }
};
