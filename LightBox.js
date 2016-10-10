;
(function($) {
    var LightBox = function() {
        var self = this;

        this.popupMask = $('<div id="light-mask"></div>');
        this.popupWin = $('<div id="light-popup">');

        this.bodyNode = $(document.body);

        this.renderDOM();
        this.picViewArea = this.popupWin.find("div.light-pic-view");
        this.popupPic = this.popupWin.find("img.light-images");
        this.picCaptionArea = this.popupWin.find("div.light-pic-caption");
        this.nextBtn = this.popupWin.find("span.light-btn-next");
        this.prevBtn = this.popupWin.find("span.light-btn-prev");
        this.captionText = this.popupWin.find("p.light-pic-desc");
        this.currentIndex = this.popupWin.find("span.light-of-index");
        this.closeBtn = this.popupWin.find("span.light-caption-close");

        this.groupName = null;
        this.groupData = [];
        this.bodyNode.delegate(".js-lightbox,*[data-role=lightbox]", "click", function(e) {
            e.stopPropagation();
            var currentGroupName = $(this).attr("data-group");
            if (currentGroupName != self.groupName) {
                self.groupName = currentGroupName;
                self.getGroup();
            }
            self.initPopup($(this));
        });
        this.popupMask.click(function(){
            $(this).fadeOut();
            self.popupWin.fadeOut();
        })
        this.closeBtn.click(function(){
            self.popupMask.fadeOut();
            self.popupWin.fadeOut();
        })
        this.nextBtn.hover(function(){
            if(!$(this).hasClass("disabled")&&self.groupData.length>1){
                $(this).addClass("light-btn-next-show");
            }
        },function(){
            if(!$(this).hasClass("disabled")&&self.groupData.length>1){
                $(this).removeClass("light-btn-next-show");
            }
        }).click(function(e){
            if(!$(this).hasClass("disabled")){
                e.stopPropagation();
                self.goto("next");
            }
        })
        this.prevBtn.hover(function(){
            if(!$(this).hasClass("disabled")&&self.groupData.length>1){
                $(this).addClass("light-btn-prev-show");
            }
        },function(){
            if(!$(this).hasClass("disabled")&&self.groupData.length>1){
                $(this).removeClass("light-btn-prev-show");
            }
        }).click(function(e){
            if(!$(this).hasClass("disabled")){
                e.stopPropagation();
                self.goto("prev");
            }
        })
    };
    LightBox.prototype = {
        goto: function(dir){
            if(dir==="next"){
                this.index++;
                if(this.index>=this.groupData.length-1){
                    this.nextBtn.addClass("disabled").removeClass("light-btn-next-show");
                }
                if(this.index!=0){
                    this.prevBtn.removeClass("disabled");
                }
                var src = this.groupData[this.index].src;
                this.loadPicSize(src);
            }else if(dir==="prev"){
                alert("2");
            }
        },
        initPopup: function(curentObj) {
            var self = this,
                sourceSrc = curentObj.attr("data-source"),
                curentId = curentObj.attr("data-id");

            this.showMaskAndPopup(sourceSrc, curentId);
        },
        showMaskAndPopup: function(sourceSrc, curentId) {
            self = this;
            self.popupPic.css({width:"auto",height:"auto"});
            this.popupPic.hide();
            this.picCaptionArea.hide();
            this.popupMask.fadeIn();
            var winWidth = $(window).width();
            var winHeight = $(window).height();
            this.picViewArea.css({ width: winWidth / 2, height: winHeight / 2 });
            this.popupWin.fadeIn();
            var viewHeight = winHeight / 2 + 10;
            this.popupWin.css({ width: winWidth / 2 + 10, height: viewHeight, marginLeft: -(winWidth / 2 + 10) / 2, top: -viewHeight }).animate({ top: (winHeight - viewHeight) / 2 }, function() {
            	self.loadPicSize(sourceSrc);
            });
            this.index = this.getIndexOf(curentId);
            var groupDataLength = this.groupData.length;
            if(groupDataLength>1){
            	// this.nextBtn
            	if(this.index === 0){
            		this.prevBtn.addClass("disabled");
            		this.nextBtn.removeClass("disabled");
            	}else if(this.index === groupDataLength-1){
            		this.nextBtn.addClass("disabled");
            		this.prevBtn.removeClass(disabled);
            	}else{
            		this.nextBtn.removeClass("disabled");
            		this.prevBtn.removeClass("disabled");
            	}
            }
        },
        loadPicSize: function(sourceSrc){
        	this.preLoadImg(sourceSrc,function(){
        		self.popupPic.attr("src",sourceSrc);
        		var picWidth = self.popupPic.width(),
        		picHeight = self.popupPic.height();
        		self.changePic(picWidth,picHeight);
        	});
        },
        changePic:function(width,height){
        	var self = this,
        	winWidth = $(window).width(),
        	winHeight = $(window).height();
        	var scale = Math.min(winWidth/(width+10),winHeight/(height+10),1);
        	width = width*scale;
        	height = height*scale;
        	this.picViewArea.animate({
        		width:width-10,
        		height:height-10
        	});
        	this.popupWin.animate({
        		width:width,
        		height:height,
        		marginLeft:-(width/2),
        		top:(winHeight-height)/2
        	},function(){
        		self.popupPic.css({
        			width:width-10,
        			height:height-10
        		}).fadeIn();
        		self.picCaptionArea.fadeIn();
        	});
        	this.captionText.text(this.groupData[this.index].caption);
        	this.currentIndex.text("当前索引："+(this.index+1)+" of "+this.groupData.length);
        },
        preLoadImg: function(sourceSrc,callback){
        	var img = new Image();
        	if(!!window.ActiveXObject){
        		img.onreadystatechange = function(){
        			if(this.readyState == "complete"){
        				callback();
        			}
        		};
        	}else{
        		img.onload = function(){
        			callback();
        		};
        	}
        	img.src=sourceSrc;
        },
        getIndexOf: function(curentId){
        	var index = 0;
        	$(this.groupData).each(function(i){
        		index = i;
        		if(this.id === curentId){
        			return false;
        		}
        	});
        	return index;
        },
        getGroup: function() {
            var self = this;
            var groupList = this.bodyNode.find("*[data-group=" + this.groupName + "]");
            self.groupData.length = 0;
            groupList.each(function() {
                self.groupData.push({
                    src: $(this).attr("data-source"),
                    id: $(this).attr("data-id"),
                    caption: $(this).attr("data-caption"),
                });
            });
        },
        renderDOM: function() {
            var strDOM = '<div class="light-pic-view">' +
                '<span class="light-btn-prev light-btn"></span>' +
                '<img class="light-images" src="images/pic.jpg">' +
                '<span class="light-btn-next light-btn"></span>' +
                '</div>' +
                '<div class="light-pic-caption">' +
                '<div class="light-caption-area">' +
                '<p class="light-pic-desc"></p>' +
                '<span class="light-of-index">当前索引：0 of 0</span>' +
                '</div>' +
                '<span class="light-caption-close"></span>' +
                '</div>';

            this.popupWin.html(strDOM);
            this.bodyNode.append(this.popupMask);
            this.bodyNode.append(this.popupWin);
        }
    };
    window["LightBox"] = LightBox;
})(jQuery);
