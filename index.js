var eejs = require('ep_etherpad-lite/node/eejs')

exports.eejsBlock_editbarMenuRight = function(hook_name, args, cb) {
  if(!args.renderContext.req.url.match(/^\/(p\/r\..{16})/)) {
    args.content = eejs.require('ep_readability/templates/readability_button.ejs') + args.content;
  }
  cb();
};

exports.eejsBlock_scripts = function (hook_name, args, cb) {
  args.content = args.content + "<script src='../static/plugins/ep_readability/static/js/jquery.highlight.js'></script>";
  return cb();
}

/*exports.eejsBlock_styles = function (hook_name, args, cb) {
  args.content = args.content + "<link href='../static/plugins/ep_readability/static/css/jquery.highlight.css' rel='stylesheet'>";
  return cb();
}*/