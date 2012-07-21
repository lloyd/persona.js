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

    var liNode = document.querySelector(options.login.select);
    var loNode = document.querySelector(options.logout.select);
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
      watch_options.onlogin = function(assertion) {
        // create a form, submit it.
        var f = document.createElement('form');
        f.action = options.login.path;
        f.method = "POST";
        var a = document.createElement('input');
        a.type = "hidden";
        a.value = assertion;
        a.name = "assertion";
        f.appendChild(a);
        document.body.appendChild(f);
        f.submit();
      };
      watch_options.onlogout = function() {};
      liNode.onclick = function() { navigator.id.request() };
    } else {
      // the user is logged in
      watch_options.onlogout = function() {
        // create a form, submit it.
        var f = document.createElement('form');
        f.action = options.logout.path;
        f.method = "POST";
        document.body.appendChild(f);
        f.submit();
      };
      watch_options.onlogin = function() {};
      loNode.onclick = function() { navigator.id.logout(); };
    }
    navigator.id.watch(watch_options);
  };
})();
