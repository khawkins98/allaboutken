var Handlebars = require('handlebars');
/**
 * compileBlogPostForRSS: pass a blog post and break out just the body.
 * @param {mixed}  source  - Template text
 * @param {object} options - Handlebars object.
 * @returns Rendered post
 */
module.exports = function(source, options) {
  // console.log('split: ', String(options), options)
  var compiled = options.fn(source)[1];

  // keep text only after title
  // compiled = String(compiled).split("# {{title}}")[1] || compiled;
  // compiled = String(compiled).split("{{title}}</h1>")[1] || compiled;

  // keep text before footer
  compiled = String(compiled).split("{{> footer}}")[0] || compiled;

  // remove any {{markdown}}s
  var re = /{{#?\/?markdown}}/gi;
  compiled = compiled.replace(re, '');

  // once we have our template, generate the content
  var theTemplate = Handlebars.compile(compiled);
  compiled = theTemplate(options.fn(source)[2]);

  return compiled;

}
