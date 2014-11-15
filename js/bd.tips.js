/*
 *  地推弹框提示
 *  @author damon
 *  @email  zhangyinfei@baidu.com
 *  @date 2014-10-02
 *
 */
$.widget("bd.tips",{
options: {
    'attrKey' : null,
    'content' : null,
    'left'    : 0,
    'top'     : 0,
    'direct'  : 'down',
    'smartyDirect' : false,//是否自动选择位置
    /*class|id name*/
    'arrowClass'      : 'tipArrow',
    /*style class*/
    'css'     : {},
    'zindex'  : '1000',
    'backgroundColor' : '#FFF',
    'position'        : 'absolute',
    'border'          : '1px solid #CCC'
},
$Html:null,
realDirect:null,
$element: null,
offsetX:0,
offsetY:0,
iTarWidth: 0,
iTarHeight: 0,
//初始化
_create: function (){
    this._ready();
},
_ready: function(){
    var that  = this;
    var $this = that.$element = $(this.element);

    that._getContent();

    $this.mouseenter(function(e){
        var offsetX  = that.offsetX = $(this).offset().left;
        var offsetY  = that.offsetY = $(this).offset().top;
        that.iWidth  = $(this).width();
        that.iHeight = $(this).height();
        var $Html    = that._generateHtml(that.options.content);
        $Html        = that._setPos($Html);
    }).mouseout(function(){
        that.$Html.remove();
    });
},
_getContent: function(){
    if (this.options.content == null) {
        this.options.content = this.$element.attr(this.options.attrKey);
    };
},
//方向
_generateHtml: function(sMsg){
    var css = $.extend({},{
        'border' : this.options.border
    },this.options.css);
    var $body  = $("<div>"+sMsg+"</div>").css(css).appendTo($('body'));

    var direct = '';
    this.realDirect = direct = this._getSmartyDirect($body);

    var arrowTop = '';
    switch(direct) {
        case 'down':
            arrowTop = '-1px';
            break;
        case 'up':
            arrowTop = '0px';
            break;
    }
    var arrowClass = this.options.arrowClass + '-' + direct;
    var $arrow = $('<div class="'+arrowClass+'"></div>').css({
            'position' : 'relative',
            'top'      : arrowTop
    });
    switch(direct) {
        case 'down':
            this.$Html    = $('<div></div>').append($body).append($arrow);
            break;
        case 'up':
            this.$Html    = $('<div></div>').append($arrow).append($body);
            break;
        default:
            this.$Html    = $('<div></div>').append($body).append($arrow);
            break;
    }
    this.$Html.css({
        'position'        : this.options.position,
        'z-index'         : this.options.zindex,
        'background-color': this.options.backgroundColor
    }).appendTo('body');
    $arrow.css('width',this.$Html.width());
    return this.$Html;
},
_setPos: function($Html){
    var iWidth  = $Html.width();
    var iHeight = $Html.height();
    var left    = this.offsetX - iWidth/2 + this.iWidth/2;
    var top     = this.offsetY;

    $Html.css({
        'left'  : left + this.options.left,
        'top'   : this._getTopByDirect($Html, this.realDirect)//this.offsetY - iHeight + this.options.top
    });
    return $Html;
},
_getSmartyDirect:function($Html){
    if (this.options.smartyDirect == false) {
        return this.options.direct;
    };
    var iWidth  = $Html.width();
    var iHeight = $Html.height();
    var left    = this.offsetX - iWidth/2 + this.iWidth/2;
    var top     = this.offsetY;

    var direct = this.options.direct,
        windowBottom = $(window).height() + $(window).scrollTop() - top,
        windowTop = top - $(window).scrollTop();
    if (this.options.direct == 'up') {
        if (windowBottom < iHeight && windowTop >= iHeight) {
            direct = 'down';
        };
    }else if(this.options.direct == 'down'){
        if (windowTop < iHeight && windowBottom >= iHeight) {
            direct = 'up';
        };
    };
    return direct;
},
_getTopByDirect: function($Html, direct){
    var iWidth  = $Html.width();
    var iHeight = $Html.height();
    var tarHeight = this.$element.height();
    var left    = this.offsetX - iWidth/2 + this.iWidth/2;
    var top     = this.offsetY;

    var setTop=0;

    switch(direct) {
        case 'down':
            setTop = this.offsetY - iHeight + this.options.top;
            break;
        case 'up':
            setTop = this.offsetY +tarHeight + this.options.top;
            break;
        default:
            setTop = this.offsetY - iHeight + this.options.top;
            break;
    }
    return setTop;
}
});
