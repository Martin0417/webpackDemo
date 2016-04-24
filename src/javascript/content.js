
var inject = function(){
    var tpl = '<div class="title"><span class="photo"></span><a href="javascript:;" onClick="showDialog()">地球破洞</a></div>\
               <div class="img"></div>'
    document.getElementById('cnt').innerHTML = tpl;
    window.showDialog = function(){
        require.ensure(['root/javascript/component/dialog/dialog.js'],function(require){
            var dialog = require('root/javascript/component/dialog/dialog.js');
            dialog.create();
        });
    }
}

module.exports = inject;