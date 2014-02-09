Array.prototype.removeDuplicates = function () { for (var i = 1; i < this.length; i++) { if (this[i][0] == this[i-1][0]) { this.splice(i,1); } } }
Array.prototype.empty = function () { for (var i = 0; i <= this.length; i++) { this.shift(); } }
String.prototype.trim = function () { return this.replace(/^\s+|\s+$/g, ''); }

function LyteBox() {
        
    this.resizeDuration = 0.15;
    this.resizeWTimerArray = new Array();
    this.resizeWTimerCount = 0;
    this.resizeHTimerArray = new Array();
    this.resizeHTimerCount = 0;
    
    this.showContentTimerArray = new Array();
    this.showContentTimerCount = 0;
    this.overlayTimerArray = new Array();
    this.overlayTimerCount = 0;
    this.imageTimerArray = new Array();
    this.imageTimerCount = 0;
    this.timerIDArray = new Array();
    this.timerIDCount = 0;
    this.imageArray = new Array();
    this.activeImage = null;
    this.slideArray = new Array();
    this.activeSlide = null;
    this.frameArray = new Array();
    this.activeFrame = null;
    
    this.checkFrame();
    
    this.isLyteframe = false;
    
    this.ie = false;
    this.ie7 = (this.ie && window.XMLHttpRequest);        

    this.initialize();
}

LyteBox.prototype.initialize = function() {
    
    this.updateLyteboxItems();
    
    var objBody = this.doc.body;

    if (this.doc.getElementById('lbOverlay')) {
        objBody.removeChild(this.doc.getElementById("lbOverlay"));
        objBody.removeChild(this.doc.getElementById("lbMain"));
    }
    
    var objOverlay = this.doc.createElement("div");

    objOverlay.setAttribute('id', 'lbOverlay');
    if ((this.ie && !this.ie7) || (this.ie7 && this.doc.compatMode == 'BackCompat')) {
        objOverlay.style.position = 'absolute';
    }
    objOverlay.style.display = 'none';

    var objLytebox = this.doc.createElement("div");
    objLytebox.setAttribute('id', 'lbMain');
    objLytebox.style.display = 'none';

    var objOuterContainer = this.doc.createElement("div");
    objOuterContainer.setAttribute('id', 'lbOuterContainer');

    var objNav = this.doc.createElement("div");
    objNav.setAttribute('id', 'lbNav');

    var objIframeContainer = this.doc.createElement("div");
    objIframeContainer.setAttribute('id', 'lbIframeContainer');
    objIframeContainer.style.display = 'none';

    var objIframe = this.doc.createElement("iframe");
    objIframe.setAttribute('id', 'lbIframe');
    objIframe.setAttribute('name', 'lbIframe');
    objIframe.style.display = 'none';

    var objImageContainer = this.doc.createElement("div");
    objImageContainer.setAttribute('id', 'lbImageContainer');

    var objLyteboxImage = this.doc.createElement("img");
    objLyteboxImage.setAttribute('id', 'lbImage');

    var objLoading = this.doc.createElement("div");
    objLoading.setAttribute('id', 'lbLoading');

    var objDetailsContainer = this.doc.createElement("div");
    objDetailsContainer.setAttribute('id', 'lbDetailsContainer');

    var objDetailsData = this.doc.createElement("div");
    objDetailsData.setAttribute('id', 'lbDetailsData');

    var objDetails = this.doc.createElement("div");
    objDetails.setAttribute('id', 'lbDetails');

    var objCaption = this.doc.createElement("span");
    objCaption.setAttribute('id', 'lbCaption');

    var objPrev = this.doc.createElement("a");
    objPrev.setAttribute('id', 'lbPrev');
    objPrev.setAttribute('href', '#');

    var objNext = this.doc.createElement("a");
    objNext.setAttribute('id', 'lbNext');
    objNext.setAttribute('href', '#');

    var objNumberDisplay = this.doc.createElement("span");
    objNumberDisplay.setAttribute('id', 'lbNumberDisplay');

    var objClose = this.doc.createElement("a");
    objClose.setAttribute('id', 'lbClose');
    objClose.setAttribute('href', '#');

    // Insert the elements
    objBody.appendChild(objOverlay);
    objBody.appendChild(objLytebox);
        objLytebox.appendChild(objOuterContainer);
            objOuterContainer.appendChild(objNav);
                objNav.appendChild(objPrev);
                objNav.appendChild(objNext);
                objNav.appendChild(objClose);
            objOuterContainer.appendChild(objIframeContainer);
                objIframeContainer.appendChild(objIframe);
            objOuterContainer.appendChild(objImageContainer);
                objImageContainer.appendChild(objLyteboxImage);
            objOuterContainer.appendChild(objLoading);
        objLytebox.appendChild(objDetailsContainer);
            objDetailsContainer.appendChild(objDetailsData);
                objDetailsData.appendChild(objDetails);
                    objDetails.appendChild(objCaption);
                    objDetails.appendChild(objNumberDisplay);
};

LyteBox.prototype.updateLyteboxItems = function() {        
        var anchors = (this.isFrame) ? window.parent.frames[window.name].document.getElementsByTagName('a') : document.getElementsByTagName('a');
        for (var i = 0; i < anchors.length; i++) {
                var anchor = anchors[i];
                var relAttribute = String(anchor.getAttribute('rel'));
                if (anchor.getAttribute('href')) {
                        if (relAttribute.toLowerCase().match('lytebox')) {
                                anchor.onclick = function () { myLytebox.start(this, false, false); return false; }
                        } else if (relAttribute.toLowerCase().match('lyteshow')) {
                                anchor.onclick = function () { myLytebox.start(this, true, false); return false; }
                        } else if (relAttribute.toLowerCase().match('lyteframe')) {
                                anchor.onclick = function () { myLytebox.start(this, false, true); return false; }
                        }
                }
        }
};

LyteBox.prototype.start = function(imageLink, doSlide, doFrame) {
        if (this.ie && !this.ie7) {        this.toggleSelects('hide');        }
        this.isLyteframe = (doFrame ? true : false);
        var pageSize        = this.getPageSize();
        var objOverlay        = this.doc.getElementById('lbOverlay');
        var objBody                = this.doc.getElementsByTagName("body").item(0);
        objOverlay.style.height = pageSize[1] + "px";
        objOverlay.style.display = '';
        this.appear('lbOverlay', 100);
        var anchors = (this.isFrame) ? window.parent.frames[window.name].document.getElementsByTagName('a') : document.getElementsByTagName('a');
        if (this.isLyteframe) {
                this.frameArray = [];
                this.frameNum = 0;
                if ((imageLink.getAttribute('rel') == 'lyteframe')) {
                        var rev = imageLink.getAttribute('rev');
                        this.frameArray.push(new Array(imageLink.getAttribute('href'), imageLink.getAttribute('title'), (rev == null || rev == '' ? 'width: 400px; height: 400px; scrolling: auto;' : rev)));
                } else {
                        if (imageLink.getAttribute('rel').indexOf('lyteframe') != -1) {
                                for (var i = 0; i < anchors.length; i++) {
                                        var anchor = anchors[i];
                                        if (anchor.getAttribute('href') && (anchor.getAttribute('rel') == imageLink.getAttribute('rel'))) {
                                                var rev = anchor.getAttribute('rev');
                                                this.frameArray.push(new Array(anchor.getAttribute('href'), anchor.getAttribute('title'), (rev == null || rev == '' ? 'width: 400px; height: 400px; scrolling: auto;' : rev)));
                                        }
                                }
                                this.frameArray.removeDuplicates();
                                while(this.frameArray[this.frameNum][0] != imageLink.getAttribute('href')) { this.frameNum++; }
                        }
                }
        } else {
                this.imageArray = [];
                this.imageNum = 0;
                this.slideArray = [];
                this.slideNum = 0;
                if ((imageLink.getAttribute('rel') == 'lytebox')) {
                        this.imageArray.push(new Array(imageLink.getAttribute('href'), imageLink.getAttribute('title')));
                } else {
                        if (imageLink.getAttribute('rel').indexOf('lytebox') != -1) {
                                for (var i = 0; i < anchors.length; i++) {
                                        var anchor = anchors[i];
                                        if (anchor.getAttribute('href') && (anchor.getAttribute('rel') == imageLink.getAttribute('rel'))) {
                                                this.imageArray.push(new Array(anchor.getAttribute('href'), anchor.getAttribute('title')));
                                        }
                                }
                                this.imageArray.removeDuplicates();
                                while(this.imageArray[this.imageNum][0] != imageLink.getAttribute('href')) { this.imageNum++; }
                        }
                        if (imageLink.getAttribute('rel').indexOf('lyteshow') != -1) {
                                for (var i = 0; i < anchors.length; i++) {
                                        var anchor = anchors[i];
                                        if (anchor.getAttribute('href') && (anchor.getAttribute('rel') == imageLink.getAttribute('rel'))) {
                                                this.slideArray.push(new Array(anchor.getAttribute('href'), anchor.getAttribute('title')));
                                        }
                                }
                                this.slideArray.removeDuplicates();
                                while(this.slideArray[this.slideNum][0] != imageLink.getAttribute('href')) { this.slideNum++; }
                        }
                }
        }
        var object = this.doc.getElementById('lbMain');
                object.style.top = (this.getPageScroll() + (pageSize[3] / 15)) + "px";
                object.style.display = '';
        this.doc.getElementById('lbOverlay').onclick = function() { myLytebox.end(); return false; }
        this.doc.getElementById('lbMain').onclick = function(e) {
                var e = e;
                if (!e) {
                        if (window.parent.frames[window.name] && (parent.document.getElementsByTagName('frameset').length <= 0)) {
                                e = window.parent.window.event;
                        } else {
                                e = window.event;
                        }
                }
                var id = (e.target ? e.target.id : e.srcElement.id);
                if (id == 'lbMain') { myLytebox.end(); return false; }
        }
        this.doc.getElementById('lbClose').onclick = function() { myLytebox.end(); return false; }
        if (this.isLyteframe) {
                this.changeContent(this.frameNum);
        } else {
                this.changeContent(this.imageNum);
        }
};
LyteBox.prototype.changeContent = function(imageNum) {
        this.activeImage = this.activeSlide = this.activeFrame = imageNum;
        this.doc.getElementById('lbOuterContainer').style.border = 'none';
        this.doc.getElementById('lbLoading').style.display = '';
        this.doc.getElementById('lbImage').style.display = 'none';
        this.doc.getElementById('lbIframe').style.display = 'none';
        this.doc.getElementById('lbPrev').style.display = 'none';
        this.doc.getElementById('lbNext').style.display = 'none';
        this.doc.getElementById('lbIframeContainer').style.display = 'none';
        this.doc.getElementById('lbNumberDisplay').style.display = 'none';
        if (this.isLyteframe) {
                var iframe = myLytebox.doc.getElementById('lbIframe');
                var styles = this.frameArray[this.activeFrame][2];
                var aStyles = styles.split(';');
                for (var i = 0; i < aStyles.length; i++) {
                        if (aStyles[i].indexOf('width:') >= 0) {
                                var w = aStyles[i].replace('width:', '');
                                iframe.width = w.trim();
                        } else if (aStyles[i].indexOf('height:') >= 0) {
                                var h = aStyles[i].replace('height:', '');
                                iframe.height = h.trim();
                        } else if (aStyles[i].indexOf('scrolling:') >= 0) {
                                var s = aStyles[i].replace('scrolling:', '');
                                iframe.scrolling = s.trim();
                        }
                }
                this.resizeContainer(parseInt(iframe.width), parseInt(iframe.height));
        } else {
                imgPreloader = new Image();
                imgPreloader.onload = function() {
                        var imageWidth = imgPreloader.width;
                        var imageHeight = imgPreloader.height;
                        // Resize
                        var pagesize = myLytebox.getPageSize();
                        var x = pagesize[2] - 150;
                        var y = pagesize[3] - 150;
                        if (imageWidth > x) {
                                imageHeight = Math.round(imageHeight * (x / imageWidth));
                                imageWidth = x;
                                if (imageHeight > y) {
                                        imageWidth = Math.round(imageWidth * (y / imageHeight));
                                        imageHeight = y;
                                }
                        } else if (imageHeight > y) {
                                imageWidth = Math.round(imageWidth * (y / imageHeight));
                                imageHeight = y;
                                if (imageWidth > x) {
                                        imageHeight = Math.round(imageHeight * (x / imageWidth));
                                        imageWidth = x;
                                }
                        }

                        var lbImage = myLytebox.doc.getElementById('lbImage')
                        lbImage.src = myLytebox.imageArray[myLytebox.activeImage][0];
                        lbImage.width = imageWidth;
                        lbImage.height = imageHeight;
                        myLytebox.resizeContainer(imageWidth, imageHeight);
                        imgPreloader.onload = function() {};
                }
                imgPreloader.src = this.imageArray[this.activeImage][0];
        }
};
LyteBox.prototype.resizeContainer = function(imgWidth, imgHeight) {
        this.wCur = this.doc.getElementById('lbOuterContainer').offsetWidth;
        this.hCur = this.doc.getElementById('lbOuterContainer').offsetHeight;
        this.xScale = (imgWidth / this.wCur) * 100;
        this.yScale = (imgHeight / this.hCur) * 100;
        var wDiff = this.wCur - imgWidth;
        var hDiff = this.hCur - imgHeight;
        if (!(hDiff == 0)) {
                this.hDone = false;
                this.resizeH('lbOuterContainer', this.hCur, imgHeight + this.doc.getElementById('lbNav').offsetHeight, this.getPixelRate(this.hCur, imgHeight));
        } else {
                this.hDone = true;
        }
        if (!(wDiff == 0)) {
                this.wDone = false;
                this.resizeW('lbOuterContainer', this.wCur, imgWidth, this.getPixelRate(this.wCur, imgWidth));
        } else {
                this.wDone = true;
        }
        if ((hDiff == 0) && (wDiff == 0)) {
                if (this.ie){ this.pause(250); } else { this.pause(100); }
        }
        this.showContent();
};
LyteBox.prototype.showContent = function() {
        if (this.wDone && this.hDone) {
                for (var i = 0; i < this.showContentTimerCount; i++) { window.clearTimeout(this.showContentTimerArray[i]); }
                this.doc.getElementById('lbLoading').style.display = 'none';
                if (this.isLyteframe) {
                        this.doc.getElementById('lbIframe').style.display = '';
                        this.appear('lbIframe', 100);
                } else {
                        this.doc.getElementById('lbImage').style.display = '';
                        this.appear('lbImage', 100);
                        this.preloadNeighborImages();
                }

                // Hide prev button if it's the first photo
                if(this.activeImage == 0 || this.activeFrame == 0) this.doc.getElementById('lbPrev').style.display = 'none';
                // Hide next button it it's the last photo
                if(this.activeImage == this.imageArray.length - 1 || this.activeFrame == this.frameArray.length - 1) this.doc.getElementById('lbNext').style.display = 'none';
                this.doc.getElementById('lbClose').style.display = '';
                this.doc.getElementById('lbDetails').style.display = '';

                this.doc.getElementById('lbImageContainer').style.display = (this.isLyteframe ? 'none' : '');
                this.doc.getElementById('lbIframeContainer').style.display = (this.isLyteframe ? '' : 'none');
                try {
                        this.doc.getElementById('lbIframe').src = this.frameArray[this.activeFrame][0];
                } catch(e) { }
        } else {
                this.showContentTimerArray[this.showContentTimerCount++] = setTimeout("myLytebox.showContent()", 200);
        }
};

// Update the caption and image count
LyteBox.prototype.updateDetails = function() {
        var object = this.doc.getElementById('lbCaption');
        var sTitle = (this.isLyteframe ? this.frameArray[this.activeFrame][1] : this.imageArray[this.activeImage][1]);
        object.style.display = '';
        object.innerHTML = (sTitle == null ? '' : sTitle);
        this.updateNav();
        this.doc.getElementById('lbDetailsContainer').style.display = '';
        object = this.doc.getElementById('lbNumberDisplay');
        if (this.imageArray.length > 1 && !this.isLyteframe) {
                object.style.display = '';
                object.innerHTML = eval(this.activeImage + 1) + " of " + this.imageArray.length;
        } else if (this.frameArray.length > 1 && this.isLyteframe) {
                object.style.display = '';
                object.innerHTML = eval(this.activeFrame + 1) + " of " + this.frameArray.length;
        }
        this.appear('lbDetailsContainer', 100);
};

LyteBox.prototype.updateNav = function() {
        if (this.isLyteframe) {
                if(this.activeFrame != 0) {
                        var object = this.doc.getElementById('lbPrev');
                                object.style.display = '';
                                object.onclick = function() {
                                        myLytebox.changeContent(myLytebox.activeFrame - 1); return false;
                                }
                }
                if(this.activeFrame != (this.frameArray.length - 1)) {
                        var object = this.doc.getElementById('lbNext');
                                object.style.display = '';
                                object.onclick = function() {
                                        myLytebox.changeContent(myLytebox.activeFrame + 1); return false;
                                }
                }
        } else {
                if(this.activeImage != 0) {
                        var object = this.doc.getElementById('lbPrev');
                                object.style.display = '';
                                object.onclick = function() {
                                        myLytebox.changeContent(myLytebox.activeImage - 1); return false;
                                }
                }
                if(this.activeImage != (this.imageArray.length - 1)) {
                        var object = this.doc.getElementById('lbNext');
                                object.style.display = '';
                                object.onclick = function() {
                                        myLytebox.changeContent(myLytebox.activeImage + 1); return false;
                                }
                }
        }
        this.enableKeyboardNav();
};
LyteBox.prototype.enableKeyboardNav = function() { document.onkeydown = this.keyboardAction; };
LyteBox.prototype.disableKeyboardNav = function() { document.onkeydown = ''; };
LyteBox.prototype.keyboardAction = function(e) {
        var keycode = key = escape = null;
        keycode        = (e == null) ? event.keyCode : e.which;
        key                = String.fromCharCode(keycode).toLowerCase();
        escape = (e == null) ? 27 : e.DOM_VK_ESCAPE;
        if ((key == 'x') || (key == 'c') || (keycode == escape)) {
                myLytebox.end();
        } else if ((key == 'p') || (keycode == 37)) {
                if (myLytebox.isLyteframe) {
                        if(myLytebox.activeFrame != 0) {
                                myLytebox.disableKeyboardNav();
                                myLytebox.changeContent(myLytebox.activeFrame - 1);
                        }
                } else {
                        if(myLytebox.activeImage != 0) {
                                myLytebox.disableKeyboardNav();
                                myLytebox.changeContent(myLytebox.activeImage - 1);
                        }
                }
        } else if ((key == 'n') || (keycode == 39)) {
                if (myLytebox.isLyteframe) {
                        if(myLytebox.activeFrame != (myLytebox.frameArray.length - 1)) {
                                myLytebox.disableKeyboardNav();
                                myLytebox.changeContent(myLytebox.activeFrame + 1);
                        }
                } else {
                        if(myLytebox.activeImage != (myLytebox.imageArray.length - 1)) {
                                myLytebox.disableKeyboardNav();
                                myLytebox.changeContent(myLytebox.activeImage + 1);
                        }
                }
        }
};
LyteBox.prototype.preloadNeighborImages = function() {
        if ((this.imageArray.length - 1) > this.activeImage) {
                preloadNextImage = new Image();
                preloadNextImage.src = this.imageArray[this.activeImage + 1][0];
        }
        if(this.activeImage > 0) {
                preloadPrevImage = new Image();
                preloadPrevImage.src = this.imageArray[this.activeImage - 1][0];
        }
};
LyteBox.prototype.end = function(caller) {
        this.disableKeyboardNav();
        this.doc.getElementById('lbMain').style.display = 'none';
        this.fade('lbOverlay', 0);
        this.toggleSelects('visible');
        if (this.isLyteframe) {
                 this.initialize();
        }
};
LyteBox.prototype.checkFrame = function() {
        if (window.parent.frames[window.name] && (parent.document.getElementsByTagName('frameset').length <= 0)) {
                this.isFrame = true;
                this.lytebox = "window.parent." + window.name + ".myLytebox";
                this.doc = parent.document;
        } else {
                this.isFrame = false;
                this.lytebox = "myLytebox";
                this.doc = document;
        }
};
LyteBox.prototype.getPixelRate = function(cur, img) {
        var diff = (img > cur) ? img - cur : cur - img;
        if (diff >= 0 && diff <= 100) { return 10; }
        if (diff > 100 && diff <= 200) { return 15; }
        if (diff > 200 && diff <= 300) { return 20; }
        if (diff > 300 && diff <= 400) { return 25; }
        if (diff > 400 && diff <= 500) { return 30; }
        if (diff > 500 && diff <= 600) { return 35; }
        if (diff > 600 && diff <= 700) { return 40; }
        if (diff > 700) { return 45; }
};
LyteBox.prototype.appear = function(id, opacity) {
        var object = this.doc.getElementById(id).style;
        object.opacity = (opacity / 100);
        object.MozOpacity = (opacity / 100);
        object.KhtmlOpacity = (opacity / 100);
        object.filter = "alpha(opacity=" + (opacity + 10) + ")";
        if (opacity == 100 && (id == 'lbImage' || id == 'lbIframe')) {
                try { object.removeAttribute("filter"); } catch(e) {}        /* Fix added for IE Alpha Opacity Filter bug. */
                this.updateDetails();
        } else if (opacity >= 100 && id == 'lbOverlay') {
                for (var i = 0; i < this.overlayTimerCount; i++) { window.clearTimeout(this.overlayTimerArray[i]); }
                return;
        } else if (opacity >= 100 && id == 'lbDetailsContainer') {
                try { object.removeAttribute("filter"); } catch(e) {}        /* Fix added for IE Alpha Opacity Filter bug. */
                for (var i = 0; i < this.imageTimerCount; i++) { window.clearTimeout(this.imageTimerArray[i]); }
                this.doc.getElementById('lbOverlay').style.height = this.getPageSize()[1] + "px";
        } else {
                if (id == 'lbOverlay') {
                        this.overlayTimerArray[this.overlayTimerCount++] = setTimeout("myLytebox.appear('" + id + "', " + (opacity+20) + ")", 1);
                } else {
                        this.imageTimerArray[this.imageTimerCount++] = setTimeout("myLytebox.appear('" + id + "', " + (opacity+10) + ")", 1);
                }
        }
};
LyteBox.prototype.fade = function(id, opacity) {
        var object = this.doc.getElementById(id).style;
        object.opacity = (opacity / 100);
        object.MozOpacity = (opacity / 100);
        object.KhtmlOpacity = (opacity / 100);
        object.filter = "alpha(opacity=" + opacity + ")";
        if (opacity <= 0) {
                try {
                        object.display = 'none';
                } catch(err) { }
        } else if (id == 'lbOverlay') {
                this.overlayTimerArray[this.overlayTimerCount++] = setTimeout("myLytebox.fade('" + id + "', " + (opacity-20) + ")", 1);
        } else {
                this.timerIDArray[this.timerIDCount++] = setTimeout("myLytebox.fade('" + id + "', " + (opacity-10) + ")", 1);
        }
};
LyteBox.prototype.resizeW = function(id, curW, maxW, pixelrate, speed) {
        if (!this.hDone) {
                this.resizeWTimerArray[this.resizeWTimerCount++] = setTimeout("myLytebox.resizeW('" + id + "', " + curW + ", " + maxW + ", " + pixelrate + ")", 100);
                return;
        }
        var object = this.doc.getElementById(id);
        var timer = speed ? speed : (this.resizeDuration/2);
        var newW = maxW;
        object.style.width = (newW) + "px";
        if (newW < maxW) {
                newW += (newW + pixelrate >= maxW) ? (maxW - newW) : pixelrate;
        } else if (newW > maxW) {
                newW -= (newW - pixelrate <= maxW) ? (newW - maxW) : pixelrate;
        }
        this.resizeWTimerArray[this.resizeWTimerCount++] = setTimeout("myLytebox.resizeW('" + id + "', " + newW + ", " + maxW + ", " + pixelrate + ", " + (timer+0.02) + ")", timer+0.02);
        if (parseInt(object.style.width) == maxW) {
                this.wDone = true;
                for (var i = 0; i < this.resizeWTimerCount; i++) { window.clearTimeout(this.resizeWTimerArray[i]); }
        }
};
LyteBox.prototype.resizeH = function(id, curH, maxH, pixelrate, speed) {
        var timer = speed ? speed : (this.resizeDuration/2);
        var object = this.doc.getElementById(id);
        var newH = maxH;
        object.style.height = (newH) + "px";
        if (newH < maxH) {
                newH += (newH + pixelrate >= maxH) ? (maxH - newH) : pixelrate;
        } else if (newH > maxH) {
                newH -= (newH - pixelrate <= maxH) ? (newH - maxH) : pixelrate;
        }
        this.resizeHTimerArray[this.resizeHTimerCount++] = setTimeout("myLytebox.resizeH('" + id + "', " + newH + ", " + maxH + ", " + pixelrate + ", " + (timer+.02) + ")", timer+.02);
        if (parseInt(object.style.height) == maxH) {
                this.hDone = true;
                for (var i = 0; i < this.resizeHTimerCount; i++) { window.clearTimeout(this.resizeHTimerArray[i]); }
        }
};
LyteBox.prototype.getPageScroll = function() {
        if (self.pageYOffset) {
                return this.isFrame ? parent.pageYOffset : self.pageYOffset;
        } else if (this.doc.documentElement && this.doc.documentElement.scrollTop){
                return this.doc.documentElement.scrollTop;
        } else if (document.body) {
                return this.doc.body.scrollTop;
        }
};
LyteBox.prototype.getPageSize = function() {        
        var xScroll, yScroll, windowWidth, windowHeight;
        if (window.innerHeight && window.scrollMaxY) {
                xScroll = this.doc.scrollWidth;
                yScroll = (this.isFrame ? parent.innerHeight : self.innerHeight) + (this.isFrame ? parent.scrollMaxY : self.scrollMaxY);
        } else if (this.doc.body.scrollHeight > this.doc.body.offsetHeight){
                xScroll = this.doc.body.scrollWidth;
                yScroll = this.doc.body.scrollHeight;
        } else {
                xScroll = this.doc.getElementsByTagName("html").item(0).offsetWidth;
                yScroll = this.doc.getElementsByTagName("html").item(0).offsetHeight;
                xScroll = (xScroll < this.doc.body.offsetWidth) ? this.doc.body.offsetWidth : xScroll;
                yScroll = (yScroll < this.doc.body.offsetHeight) ? this.doc.body.offsetHeight : yScroll;
        }
        if (self.innerHeight) {
                windowWidth = (this.isFrame) ? parent.innerWidth : self.innerWidth;
                windowHeight = (this.isFrame) ? parent.innerHeight : self.innerHeight;
        } else if (document.documentElement && document.documentElement.clientHeight) {
                windowWidth = this.doc.documentElement.clientWidth;
                windowHeight = this.doc.documentElement.clientHeight;
        } else if (document.body) {
                windowWidth = this.doc.getElementsByTagName("html").item(0).clientWidth;
                windowHeight = this.doc.getElementsByTagName("html").item(0).clientHeight;
                windowWidth = (windowWidth == 0) ? this.doc.body.clientWidth : windowWidth;
                windowHeight = (windowHeight == 0) ? this.doc.body.clientHeight : windowHeight;
        }
        var pageHeight = (yScroll < windowHeight) ? windowHeight : yScroll;
        var pageWidth = (xScroll < windowWidth) ? windowWidth : xScroll;
        return new Array(pageWidth, pageHeight, windowWidth, windowHeight);
};
LyteBox.prototype.toggleFlash = function(state) {
        var objects = this.doc.getElementsByTagName("object");
        for (var i = 0; i < objects.length; i++) {
                objects[i].style.visibility = (state == "hide") ? 'hidden' : 'visible';
        }
        var embeds = this.doc.getElementsByTagName("embed");
        for (var i = 0; i < embeds.length; i++) {
                embeds[i].style.visibility = (state == "hide") ? 'hidden' : 'visible';
        }
        if (this.isFrame) {
                for (var i = 0; i < parent.frames.length; i++) {
                        try {
                                objects = parent.frames[i].window.document.getElementsByTagName("object");
                                for (var j = 0; j < objects.length; j++) {
                                        objects[j].style.visibility = (state == "hide") ? 'hidden' : 'visible';
                                }
                        } catch(e) { }
                        try {
                                embeds = parent.frames[i].window.document.getElementsByTagName("embed");
                                for (var j = 0; j < embeds.length; j++) {
                                        embeds[j].style.visibility = (state == "hide") ? 'hidden' : 'visible';
                                }
                        } catch(e) { }
                }
        }
};
LyteBox.prototype.toggleSelects = function(state) {
        var selects = this.doc.getElementsByTagName("select");
        for (var i = 0; i < selects.length; i++ ) {
                selects[i].style.visibility = (state == "hide") ? 'hidden' : 'visible';
        }
        if (this.isFrame) {
                for (var i = 0; i < parent.frames.length; i++) {
                        try {
                                selects = parent.frames[i].window.document.getElementsByTagName("select");
                                for (var j = 0; j < selects.length; j++) {
                                        selects[j].style.visibility = (state == "hide") ? 'hidden' : 'visible';
                                }
                        } catch(e) { }
                }
        }
};
LyteBox.prototype.pause = function(numberMillis) {
        var now = new Date();
        var exitTime = now.getTime() + numberMillis;
        while (true) {
                now = new Date();
                if (now.getTime() > exitTime) { return; }
        }
};
if (window.addEventListener) {
        window.addEventListener("load",initLytebox,false);
} else if (window.attachEvent) {
        window.attachEvent("onload",initLytebox);
} else {
        window.onload = function() {initLytebox();}
}
function initLytebox() { myLytebox = new LyteBox(); }