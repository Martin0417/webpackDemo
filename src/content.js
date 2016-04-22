
require('./style.mcss');
var inject = function(){
    document.getElementById('cnt').innerHTML = '<div class="title"><span class="photo"></span><a href="http://www.kaola.com">地球破洞</a></div><div class="img"></div>';
}

module.exports = inject;