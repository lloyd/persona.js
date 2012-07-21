window.PersonaJS = (function() {
  return function(options) {
    if (!options) options = {};
    if (!options.logout) options.logout = {};
    if (!options.logout.path) options.logout.path = '/logout';
    if (!options.logout.select) options.logout.select = '.persona_logout';
    if (!options.login) options.login = {};
    if (!options.login.path) options.login.path = '/login';
    if (!options.login.select) options.login.select = '.persona_login';

    if (!navigator.id || !navigator.id.watch) throw "please include include.js from persona.org";

    var watch_options = {};

    var liNode = document.querySelect(options.login.select);
    var loNode = document.querySelect(options.logout.select);
    if (!liNode && !loNode) {
      throw "Persona login disabled.  You must have either a '" +
        options.logout.select + "' or '" + options.logout.select +
        "' class in your DOM";
    } else if (liNode && loNode) {
      throw "Persona login disabled.  You can't have both '" +
        options.logout.select + "' and '" + options.logout.select +
        "' classes in your DOM";
    }
    
    if (liNode) {
      // the user is logged out
      watch_options.loggedInUser = null;
      watch_options.onlogin(function(assertion) {
        // post to options.login.path
      });
    } else {
      // the user is logged in
      watch_options.onlogout(function() {
        window.location = options.logout.path;
      });
    }

    navigator.id.watch(watch_options);

  };
})();
