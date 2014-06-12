/**
 * Created by wangxiaottt on 14-5-26.
 */
window.onload = function(){
    var options = {
        preventDefault: true,
        swipe: true,
        swipeMaxTouches: 1,
        swipeMinTouches: 1,
        swipeVelocityX: 0,
        swipeVelocityY: 0
    };
    var hammertime = new Hammer(document.body, options);
    hammertime.on("tap swipeup swipedown swipeleft swiperight", function(ev){
        var _el = document.createElement('p');
        var _ctn = document.getElementsByClassName('m-calendar')[0];
        _el.innerHTML = ev.type;

        _ctn.appendChild(_el);
    });
};

