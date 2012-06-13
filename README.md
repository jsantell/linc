linc
====

js execution controller for the browser or node.js

Installation
====
`npm install linc` or include `linc.js` on your page

API
====

`Linc.add( name, [ options ], fn )` Adds a widget with string `name`, optional options `object`, and run function `fn`. Widgets can be scoped by adding period separated namespaces in the name, ex:
  * `validation.signup` Add the validation widget to the signup namespace
  * `validation.signup.signin` Add the validation widget to both signup and signin namespaces

`Linc.run([ options ])` Executes all functions that are unscoped, and takes an optional options object to call specific namespaces, pass in a context, or execute all stored functions (options detailed below).

Widget Options
====
* `once` This widget is only called once during its life.

Run Options
====
* `context` Each widget's associated function is called with `this` as `context`. Defaults to `Linc` in node and `window` on the browser.
* `namespace` Calls all widgets that are within `namespace`, as well as unnamespaced widgets. Can be a namespace string, or an array of strings for multiple namespaces.
* `all` Calls all widgets, namespaced and unscoped.

Examples
====

```javascript

  // Set the default context to be a header div in the browser
  Linc.setDefaults({
    context: $('#content')
  });

  // Adds a validation widget 
  Linc.add( 'validation', function () {
    this.find( 'form.validate' ).validate();
  });

  // Adds a selection toggle widget that can only be called once.
  Linc.add( 'selectParent', { once: true }, function () {
    this.find( 'a.select-parent' ).click(function ( e ) {
      $( this )
        .closest( 'ul' )
          .find( 'selected' ).removeClass( 'selected' )
          .end()
        .end()
        .parent().addClass( 'selected' );
      e.preventDefault();
    });
  });

  // Adds the register widget to the account namespace
  Linc.add( 'register.account', function () {
    this.find( 'form.ajaxSubmit' ).submit(function( e ) {
      $( this ).ajaxSubmit();
      e.preventDefault();
    });
  });

  // Runs all unscoped widgets -- just 'validation' and 'selectParent' in
  // this case, with default scope of the #content element
  Linc.run();

  // Runs all unscoped and widgets in the namespace 'account' --
  // both 'register' and 'validation' functions are executed, since
  // 'selectParent' is only called once, with 'document' as context
  Linc.run({ context: document, namespace: 'account' } );
```

Development
====

Uses jasmine-node for running specs, and coffeescript for source -- run `make` in project root to compile and run specs.
