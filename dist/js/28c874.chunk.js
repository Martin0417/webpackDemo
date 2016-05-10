webpackJsonp_name_([1],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var dialogTpl = __webpack_require__(4);
	var maskTpl = __webpack_require__(5);
	var css = __webpack_require__(6);
	
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


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = "<iframe class=\"m-dialog m-dialog-ani\" src=\"http://baike.baidu.com/link?url=H68ty9zk_6eRzJR76GqH0vp0gEcJIbzjOp1IoujfcByDdjYGPkOCW7JSzAWJuzJHao7KkHT75EZ_BzZMBOJ_Di9_oxcOobVYjDRfW1tPi0S1zi1kRfpzmhULBDRmMOxW\" ></iframe>";

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = "<div class=\"m-mask\"></div>";

/***/ },
/* 6 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
]);
//# sourceMappingURL=../cheap-module-inline-source-map