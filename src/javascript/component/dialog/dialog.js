var dialogTpl = require("./dialog.html");
var maskTpl = require("./mask.html");
var css = require("./dialog.mcss");

var dialog = function(){
    this.dialog = document.createElement('article');
    this.dialog.innerHTML = dialogTpl;
    this.mask = document.createElement('article');
    this.mask.innerHTML = maskTpl;
    this.removeNode = function(){
        this.mask.removeEventListener('click',this.removeNode,false);
        document.body.removeChild(this.mask);
        document.body.removeChild(this.dialog);
    }.bind(this);
}
dialog.prototype.create = function(){
    document.body.appendChild(this.mask);
    document.body.appendChild(this.dialog);
    this.mask.addEventListener('click',this.removeNode,false);
}
dialog.prototype.remove = function(){
    this.mask.addEventListener('click',this.removeNode,false);
}
var dia = new dialog();
module.exports = dia;
