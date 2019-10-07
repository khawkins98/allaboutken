// invoke foundation
$(document).foundation();


// prevent errors for console.log
if (typeof console == "undefined" || typeof console.log == "undefined") {
  var console = { log: function() {} };
  window.console = { log: function() {} };
}

var hasStorage = false;
// check if local sotrage is avail
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type) {
  try {
    var storage = window[type],
    x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch(e) {
    return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      (storage.length !== 0);
  }
}

// load anything saved last time...
function loadMemoryFromStorage() {
  hasStorage = true;
//   localStorage.setItem('colorSetting', '#a4509b');
// Note: It's recommended to use the Web Storage API (setItem, getItem, removeItem, key, length) to prevent the pitfalls associated with using plain objects as key-value stores.
}

// dialogue
function dialogue(options) {
  // we could just use jquery's extend, but... i didn't
  function extend() {
    for (var i = 1; i < arguments.length; i++) {
      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) {
          arguments[0][key] = arguments[i][key];
        }
      }
    }
    return arguments[0];
  }

  var defaults = {
    indent: '     '
  }

  this.settings = extend({}, defaults, options);

  this.init();
}

dialogue.prototype.init = function() {
  var settings = this.settings,
      indent = settings.indent;

  function localStorageCheck() {
    var textToReturn = indent + '----------------------------------------------------\n';
    if (storageAvailable('localStorage')) {
      loadMemoryFromStorage();
      textToReturn += (indent+'  p.s. 😊 your browser has a memory!\n'
        +indent+indent+'  That\'s great news as it means we can continue this conversation next time.');
    } else {
      textToReturn += (indent+'  p.s. 😞 your browser doesn\'t have a memory or you\'ve turned it off.\n'
        +indent+indent+'  We can still have a nice chat, I just won\'t be able to pickup on it after you leave.');
    }
    textToReturn += '\n' + indent + '----------------------------------------------------';

    return textToReturn;
  }

  function chatTopics() {
    var textToReturn = '';
        if (getStorage('name')) textToReturn += indent+'Good to see you again '+getStorage('name')+'.\n\n';
        textToReturn += indent+'Here\'s what we can talk about.\n';
        if (!getStorage('name')) textToReturn += indent+'- Type `introductions` and we can share names.\n';
        textToReturn += indent+'- Type `newsletter` and I can keep you updated.\n';
        textToReturn += indent+'- Type `contact` and I\'ll let you know how you can get in touch.\n';
        textToReturn += indent+'- Type `introductions` and we can share names.\n';
        textToReturn += indent+'- Type `introductions` and we can share names.\n';

    return textToReturn;
  }



  console.log(''+
  '\n%c                    --------------------------------- '+
  '\n                    |                               | '+
  '\n                    |   Thanks for having a         | '+
  '\n                    |   look around.                | '+
  '\n                    |                               | '+
  '\n                    |   Viewer beware, this site    | '+
  '\n                    |   is mostly a playground, and | '+
  '\n        %cHELLO!%c      |   may break at any time!      | '+
  '\n     %c(^ _ ^)%c        |                               | '+
  '\n                    --------------------------------- '+
  '\n                      '+
  '\n                      '+
  '\n%c'+indent+'You can ask me questions if you like.'+
  '\n                      '+
  // '\n   Here are some ideas:                   '+
  '\n                      '+
  // '\n     questions.name                 '+
  // '\n                      '+
  // '\n                      '+
  '\n                      '+
  '\n'+localStorageCheck()+
  '\n                      '+
  '\n                      '+
  '\n                      '+
  '\n'+chatTopics()+
  '\n                      '+
  '\n                      ',
  'color:#7759c3', 'color:#2970ad', 'color: #7759c3', 'color:#2970ad', 'color: #7759c3', 'color:#2970ad');


  //var questions = new Object();
  //questions['name'] = 'Ken Hawkins';

  // to do: save values to local storage

} // ./dialogue


var letsChat = new dialogue({}); // bootstrap dialogue

function saveStorage(key,value) {
  if (hasStorage) {
    localStorage.setItem(key, value);
  }
}
function getStorage(key) {
  if (hasStorage) {
    return localStorage.getItem(key);
  }
}

// list of chat topics
var introductions = function(response) {
  console.log('Hi ' + response);
  saveStorage('name',response);

  return ' ';
};
var intro = introductions;

introductions.toString = function() {
  this(prompt("Hi, I'm Ken.\n\nWhat's your name?"));
  return ' ';
};

var newsletter = function(response) {
  console.log('Ok '+getStorage('name')+', got your email as ' + response +
  '\n By the way, my email is khawkins98@gmail.com');
  saveStorage('email',response);
  storeData(response,getStorage('name'));

  return ' ';
};
newsletter.toString = function() {
  this(prompt("What's your email?"));
  return ' ';
};

var contact = function() {
  console.log('Sure thing '+getStorage('name')+', here is where you can get a hold of me:' +
  '\n   - khawkins98@gmail.com'+
  '\n   - twitter.com/khawkins98'+
  '\n   - Camrbidge, UK'+
  '');

  return ' ';
};
contact.toString = function() { this(); return ' '; };



// store data in a google sheet
// https://script.google.com/a/ebi.ac.uk/macros/d/M4nJQQJopc7Sk2Vuu6WjLgObdzJVj2GNi/edit?uiv=2&mid=ACjPJvFwokR9rstSWxb7kwsQysmKmTDwMv9ofF1Bp0Irz9eXUlEiTEmEc3i0VuflCsTjDfP04L9qVtlxqo0X6EuIBKF_SAeLvu8hNBXSZMvbbxkSZkCKvxtwWmLYxy-fDT7DccX_Lrt0OuM
// https://docs.google.com/spreadsheets/d/1svgjZ6nXKRI9sqZ40MIf3TkWKoCUkAkfOm59Nvl3XwA/edit#gid=0
function storeData(email,name) {
  var data = { 'name': name, 'email': email, 7: 'c' };

  var url = "https://script.google.com/macros/s/AKfycbwOSk4dHvOaQ9eM8LvELG0BcASMDx_IaF0TffSaPXI1mD7doc0Q/exec";
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  // xhr.withCredentials = true;
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
  //    console.log( xhr.status, xhr.statusText )
  //    console.log(xhr.responseText);
      return;
  };
  // url encode form data for sending as post data
  var encoded = Object.keys(data).map(function(k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
  }).join('&')
  xhr.send(encoded);
}
