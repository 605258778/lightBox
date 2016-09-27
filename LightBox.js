;(function($){
	var LightBox = function(){
		var self = this;

		this.popupMask = $('<div id="light-mask"></div>');
		this.popupWin = $('<div id="light-popup">');

		this.bodyNode = $(document.body);

		this.renderDOM();
	};
	LightBox.prototype ={

		renderDOM: function(){
			var strDOM = '<div class="light-pic-view">'+
							'<span class="light-btn-prev light-btn"><</span>'+
							'<img class="light-images" src="images/pic.jpg">'+
							'<span class="light-btn-next light-btn">></span>'+
						'</div>'+
						'<div class="light-pic-caption">'+
							'<div class="light-caption-area">'+
								'<p class="light-pic-desc"></p>'+
								'<span class="light-of-index">当前索引：0 of 0</span>'+
							'</div>'+
							'<span class="light-caption-close"></span>'+
						'</div>';

						this.popupWin.html(strDOM);
						this.bodyNode.append(this.popupMask);
						this.bodyNode.append(this.popupWin);
		}
	};
	window["LightBox"] = LightBox;
})(jQuery);