/*
 *  弹框插件
 *  @author damon
 *  @email  zhangyinfei@baidu.com
 *  @date 2014-09-01
 *
 */
$.widget("bd.dtdlg",{
//配置参数
options :　{
    //BASIC
    title          : '提示框',
    //框内容
    bodyHtml       : null,
    //btn文案
    confirmTxt     : '确定',
    confirming     : '操作中，请稍后...',
    cancelTxt      : '取消',
    //内容文字对方方式:left,center,right
    msgAlign       : null,
    draggable      : false,
    //dlg框的样式设置,可以设置宽高等
    style          : {},
    //确定和取消方向,默认先确定后取消
    confirmCancel  : true,
    //出现和退出时普通show(),hide()动画样式的时间
    showHideTime   : 0,

    //显示是否要滑动动画
    animate        : null,
    //如果有滑动动画，是否要弹跳
    isBound        : true,
    //0原来的方向,1原地隐藏，2：反方向
    closeDirect    : 2,
    animateTop     : 1000,
    animateTime    : 300,

    //建议不要设置，如果设置，则框直接距离顶部距离而非居中
    top            : null,
    //接口函数
    openHandler    : [],
    openAfterHandler: [],
    successHandler : [],
    closeHandler   : [],
    /************END**************/

    /***********默认参数，非必要不需要修改**********/
    bodyClass      : 'dlg',
    className      : ' ',
    z_index        : 300,
    dlgbodyClass   : 'dlg-body',
    confirmClass   : 'dlg-confirm',
    cancelClass    : 'dlg-cancel',
    closeClass     : "close",
    shadeClass     : "shade",
    tail           : true,
    headerClass    : 'dlg-header',
    headerBgClass  : 'dlg-header-bg',
    tailContainerClass : 'dlg-tail-body',

    animateJianJu  : 20,
    //是否绑定ENTER健关闭窗口
    listenEnter    : true
},
//internel
ele        : null,
shade      : null,
allEle     : null,
dialog     : null,
confirmBtn : null,
cancelBtn  : null,
//初始化
_create: function() {
    this._ready();
    this.allEle.hide(this.options.showHideTime);
    if (this.allEle.hasClass("hidden")) {
        this.allEle.removeClass("hidden");
    }
},
_ready : function (){
    var that = this;
    var _this = this.element;
        that.ele = _this;
    var $this = $(_this);
    that._generateShade(_this);//生成遮罩层
    that._generateHtml(_this);//生成html弹框
    if ($this.attr('id') == undefined ) {
        $this.attr('id','bddlt_'+parseInt(Math.random()*1000000));
    };
    this.allEle = $("#"+_this.attr("id")).add($("."+that.options.shadeClass));//框加遮罩层
    if (that.options.draggable && typeof($.fn.draggable) != 'undefined') {
        _this.find('.'+this.options.headerClass)
             .add(_this.find('.'+this.options.headerBgClass))
             .css('cursor','move');
        $("#"+_this.attr("id")).draggable();
    };
    //绑定事件
    if (this.options.listenEnter) {
        $(window).keyup(function(e){
            var code = e.which || e.code;
            if (code == 27) that.close();
        });
    };
},
_show:function(){
    var that = $(this.element);
    var new_dlg = $("#"+that.attr("id"));
    new_dlg.css(this.options.style);
    var left_top = this._getCenterXY(new_dlg.width(),new_dlg.height());

    var jianju = this.options.animateJianJu,
        time   = this.options.animateTime;
        ele    = this.ele;
        isBound= this.options.isBound;
    if (this.options.animate == 'top') {

        left_top['opacity'] = 1;
        $(ele).css({'display':'block','opacity':0});
        left_top['top'] += this.options.animateTop;
        if (isBound) {
            left_top['top'] += jianju;
            //连环动画效果
            $(this.ele).animate(left_top,time,'swing',function(){
                left_top['top'] -= 2*jianju;
                $(ele).animate(left_top,time/3,'swing',function(){
                    left_top['top'] += jianju;
                    $(ele).animate(left_top,time/3);
                });
            });
        }else{
            $(this.ele).animate(left_top,time);
        };

        this.shade.removeClass("none").show(this.options.showHideTime);

    }else if(this.options.animate == 'left'){
        left_top['opacity'] = 1;
        $(this.ele).css({'display':'block','opacity':0});

        left_top['left'] += this.options.animateTop;
        if (isBound) {
            left_top['left'] += jianju;
            //连环动画效果
            $(this.ele).animate(left_top,time,'swing',function(){
                left_top['left'] -= 2*jianju;
                $(ele).animate(left_top,time/3,'swing',function(){
                    left_top['left'] += jianju;
                    $(ele).animate(left_top,time/3);
                });
            });
        }else{
            $(this.ele).animate(left_top,this.options.animateTime);
        };

        this.shade.removeClass("none").show(this.options.showHideTime);
    }else{
        this._rePos();
        this.allEle.removeClass('none').show(this.options.showHideTime);
    };

    $('.'+this.options.shadeClass).css('height',this._getHeight() + 'px');
},
//打开认证框
open : function (){
    if(typeof(this.options.openHandler) === 'function') this.options.openHandler(this.element);
    this._show();
    $("body").css('overflow-x','hidden');
    if(typeof(this.options.openAfterHandler) === 'function') {
        this.options.openAfterHandler(this.element);
    }
},
//控制button
disabled: function(){
   this.confirmBtn.text(this.options.confirming);
},
enable: function(){
   this.confirmBtn.text(this.options.confirmTxt);
},
//关闭认证框
close: function (all){
    var _this = this.element;
    var $ret = true;
    if(typeof(this.options.closeHandler) === 'function'){
       $ret = this.options.closeHandler(this.element);
    }
    $obj = this.ele;

    var left_top     = this._getCenterXY($obj.width(), $obj.height()),
        ele          = this.ele,
        closeDirect  = this.options.closeDirect,
        animateTop   = this.options.animateTop,
        animateTime  = this.options.animateTime,
        showHideTime = this.options.showHideTime;

    if (this.options.animate == 'top') {
        left_top['top'] += closeDirect * animateTop;

        left_top['opacity'] = 0;
        $(ele).animate(left_top,animateTime,'swing',function(){
            left_top['top'] -= (closeDirect+1) * animateTop;
            $(ele).css(left_top);
        });
        this.shade.removeClass("none").hide(showHideTime);
    }else if(this.options.animate == 'left'){
        left_top['left'] += closeDirect * animateTop;

        left_top['opacity'] = 0;
        $(ele).animate(left_top,animateTime,'swing',function(){
            left_top['left'] -= (closeDirect+1) * animateTop;
            $(ele).css(left_top);
        });
        this.shade.removeClass("none").hide(showHideTime);
    }else{
        this.ele.removeClass('none').hide(showHideTime);
    };

    if ($ret != 'step') {
        this.shade.hide(this.options.showHideTime);
    };
    $("body").css('overflow-x','auto');
},
//生成HTML弹框
_generateHtml: function (that) {
    var html = "<div class='"+this.options.headerClass+"'><h3>"+this.options.title+"</h3><a href='javascript:void(0);' title='关闭' hidefocus='true' class='"+this.options.closeClass+"'></a></div>";

    if(this.options.hasTop) html ="<div class='"+this.options.headerBgClass+"'></div>" + html;

    var tail_html = '';
    or_html = null === this.options.bodyHtml ? that.html() : this.options.bodyHtml;

    if (this.options.tail) { var tail_html = this._generateTail(); };

    that.addClass("dlg")
        .addClass(this.options.className)
        .css("z-index",this.options.z_index+100)
        .empty()
        .append(html)
        .append("<div class='"+this.options.dlgbodyClass+"'>"+or_html+"</div>")
        .append(tail_html)
        .append("<div class='dlg-tail'></div>")
        .appendTo($("body"));
    if (this.options.msgAlign != null) {
        that.find('.'+this.options.dlgbodyClass).css('text-align',this.options.msgAlign);
    };

    //that.remove();
    //绑定下colse事件
    var plugin = this;
    $("#"+that.attr("id")).find("."+plugin.options.closeClass).click(function (){
        plugin.close();
    })
    //设置居中
    var new_dlg = $("#"+that.attr("id"));
    new_dlg.css(this.options.style);
    new_dlg.css(this._getCenterXY(new_dlg.width(),new_dlg.height()));
    var plugin = this;
    $(window).resize(function(){
        plugin._rePos();
    });
},
//生成尾部
_generateTail: function(){
   var that = this;
   if (that.options.confirmTxt) {
       this.confirmBtn = $('<a></a>').addClass(this.options.confirmClass)
                                     .text(this.options.confirmTxt);
   };
   if (that.options.cancelTxt) {
       this.cancelBtn = $('<a></a>').addClass(this.options.cancelClass)
                                    .text(this.options.cancelTxt);
       this.cancelBtn.click(function(){//绑定取消事件
            that.close();
       });
   };
   if (typeof(that.options.successHandler) === 'function') {
       this.confirmBtn.click(function(){
           that.disabled();
           var ss = that.options.successHandler(that.element);
           if(ss===true){
           //if(that.options.successHandler(that.element) === true){
               that.close();
           }else{
               that.enable();
           };//执行外部函数
       });
   };
   if (this.options.confirmCancel) {
       var $one = this.confirmBtn;
       var $two = this.cancelBtn;
   }else{
       var $one = this.cancelBtn;
       var $two = this.confirmBtn;
   };
   return $("<div></div>")
          .addClass(this.options.tailContainerClass)
          .append($one)
          .append($two);
},
//生成遮罩层
_generateShade : function (){
    //如果有遮罩层，那就直接用一个
    var obj = null;
    if ($("."+this.options.shadeClass).length > 0) {
        obj = $("."+this.options.shadeClass);
    }else {
        obj = $("<div class='"+this.options.shadeClass + "'></div>")
    };
    this.shade = obj.css({
        "position":"absolute",
        "width": $(document).width() + "px",
        "height": this._getHeight() + 'px',
        "top": 0,
        "left": 0,
        "z-index" : 300,
        "background-color" : "#000",
        "opacity": 0.4
    }).appendTo($("body"));
},
_getHeight: function(){
    return $(document).height() + 80;
},
//当窗口改变时，调整元素的left和top值和遮罩层的大小
_rePos : function (){
    var _this   = this.element;
    var new_dlg = $("#"+_this.attr("id"));
    new_dlg.css(this._getCenterXY(new_dlg.width(),new_dlg.height(),false));//框的大小
    this._generateShade();
},
//w,h分别是外围的宽度和高度
_getCenterXY : function (w,h,auto) {
    var w_w = $(window).width();
    if (this.options.top !== null) {
        ret_top = this.options.top;
    }else{
        var w_h     = $(window).height();
        var s_top   = $(window).scrollTop();
        var ret_top = (w_h-h)/2 < 0 ? 0 : (w_h-h)/2;
        ret_top     += s_top;
    };
    var left = (w_w-w)/2;
    if (typeof(auto) == 'undefined' || auto) {
        if (this.options.animate == 'top') {
            ret_top -= this.options.animateTop;
        }else if (this.options.animate == 'left') {
            left    -= this.options.animateTop;
        };
    }
    return { "left":left,"top":ret_top };
}
});

/*
 *  弹框
 *  @author damon
 *  @email  zhangyinfei@baidu.com
 *  @date 2014-09-01
 *
 */
$.extend({
    /*
     * 弹框提示
     * @param id    弹框的ID
     * @param title 框的抬头
     * @param msg   弹框内容
     * @param openHandler 弹框前初始化数据处理
     * @param successHandler 弹框确认需要处理的事件
     */
    alert: function(msg,title,id,openHandler,successHandler,closeHandler,option){
        if (typeof(title) == 'undefined' || title == null) title = '提示';
        if (typeof(id) == 'undefined' || id == null) id = 'Dlg_'+parseInt(Math.random()*100000000);
        if ($("#"+id).length > 0) { $('#'+id).remove(); };
        $div = $('<div />').attr('id',id);
        $div.appendTo($('body'));
        var options = $.extend({},{
            'title'         : title,
            'hasTop'        : true,
            'bodyHtml'      : msg,
            'tail'          : true,
            'openHandler'   : openHandler,
            'successHandler': successHandler,
            'closeHandler'  : closeHandler
        }, option);
        $div.dtdlg(options);
        $div.dtdlg('open');
        return $div;
    },
    /*
     * 弹框提示
     * @param id    弹框的ID
     * @param title 框的抬头
     * @param msg   弹框内容
     * @param openHandler 弹框前初始化数据处理
     * @param successHandler 弹框确认需要处理的事件
     */
    error: function(msg,title,id,openHandler,successHandler,closeHandler,option){
        if (typeof(title) == 'undefined' || title == null) title = '错误';
        if (typeof(id) == 'undefined' || id == null) id = 'Dlg_Err'+parseInt(Math.random()*100000000);
        if ($('#'+id).length == 0) {
            $div = $('<div />').attr('id',id);
            $div.appendTo($('body'));
        }else{
            $div = $('#'+id);
        };
        msg = '<font color=red>'+msg+'</font>';
        var options = $.extend({},{
            'title'         : title,
            'hasTop'        : true,
            'bodyHtml'      : msg,
            'tail'          : true,
            'openHandler'   : openHandler,
            'successHandler': successHandler,
            'closeHandler'  : closeHandler
        }, option);
        $div.dtdlg(options);
        $div.dtdlg('open');
        return $div;
    }

});
