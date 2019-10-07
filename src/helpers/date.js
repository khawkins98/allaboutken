module.exports = function(options) {
  // options.fn(this) = Handelbars content between {{#date}} HERE {{/date}}
  var d = new Date(options.fn(this));
  var curr_date = d.getDate();
  var curr_month = d.getMonth() + 1; //Months are zero based
  var curr_year = d.getFullYear();
  var date = curr_year + '.' + curr_month + "." + curr_date;
  // var date = '<strong>' + options.fn(this) + '</strong>';
  return date;
}
