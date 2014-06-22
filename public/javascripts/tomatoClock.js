function Carousel(element)
{
    var self = this;
    element = $(element);

    var container = $(".m-daylst", element);
    var content = $("#content");
    var panes = $(".pane", element);

    var pane_width = 0;
    var pane_count = panes.length;

    var current_pane = 0;


    /**
     * initial
     */
    this.init = function() {
        setPaneDimensions();
        $(window).on("load resize orientationchange", function() {
            setPaneDimensions();
        });
        $.handlebars({
            templatePath: '/tpl',
            templateExtension: 'hbs'
        });


        panes.each(function() {
            $(this).render('calendar');
        });

        $(document.body).on('onRenderHbs', function(ev){
            var tables = $('.m-calendar table');
            var height = container.height();

            tables.each(function(){
                $(this).css({height:height,visibility:'visible'});
            });
        })
    };


    /**
     * set the pane dimensions and scale the container
     */
    function setPaneDimensions() {
        pane_width = element.width();
        panes.each(function() {
            $(this).width(pane_width);
        });
        container.width(pane_width*pane_count);
    };


    /**
     * show pane by index
     */
    this.showPane = function(index, animate) {
        // between the bounds
        index = Math.max(0, Math.min(index, pane_count-1));
        current_pane = index;

        var offset = -((100/pane_count)*current_pane);
        setContainerOffset(offset, animate);
    };


    function setContainerOffset(percent, animate) {
        container.removeClass("animate");

        if(animate) {
            container.addClass("animate");
        }

        if(Modernizr.csstransforms3d) {
            container.css("transform", "translate3d("+ percent +"%,0,0) scale3d(1,1,1)");
        }
        else if(Modernizr.csstransforms) {
            container.css("transform", "translate("+ percent +"%,0)");
        }
        else {
            var px = ((pane_width*pane_count) / 100) * percent;
            container.css("left", px+"px");
        }
    }

    this.next = function() { return this.showPane(current_pane+1, true); };
    this.prev = function() { return this.showPane(current_pane-1, true); };


    function handleHammer(ev) {
        // disable browser scrolling
        ev.gesture.preventDefault();

        switch(ev.type) {
            case 'dragright':
            case 'dragleft':
                // stick to the finger
                var pane_offset = -(100/pane_count)*current_pane;
                var drag_offset = ((100/pane_width)*ev.gesture.deltaX) / pane_count;

                // slow down at the first and last pane
                if((current_pane == 0 && ev.gesture.direction == "right") ||
                    (current_pane == pane_count-1 && ev.gesture.direction == "left")) {
                    drag_offset *= .4;
                }

                setContainerOffset(drag_offset + pane_offset);
                break;

            case 'swipeleft':
                self.next();
                ev.gesture.stopDetect();
                break;

            case 'swiperight':
                self.prev();
                ev.gesture.stopDetect();
                break;

            case 'release':
                // more then 50% moved, navigate
                if(Math.abs(ev.gesture.deltaX) > pane_width/2) {
                    if(ev.gesture.direction == 'right') {
                        self.prev();
                    } else {
                        self.next();
                    }
                }
                else {
                    self.showPane(current_pane, true);
                }
                break;
            case 'tap':
                var el = $(ev.srcElement);
                var yIndex = $(ev.srcElement).closest('tr').data('y');
                var table = $(ev.srcElement).closest('table');
                if(yIndex != undefined){
                    element.css('height','14%');
                    content.css('height','76%');
                    table.addClass('animate');
                    table.css('marginTop',-(table.height()/6*yIndex)+'px');
                }
                break;
            case 'swipedown':
                element.css('height', '70%');
                content.css('height','20%');
                $('table').css('marginTop','0px');
                break;
        }
    }

    new Hammer(document.body, {
        dragLockToAxis: true,
        swipe: true,
        swipeMaxTouches: 1,
        swipeMinTouches: 1,
        swipeVelocityX: 0.2,
        swipeVelocityY: 0.2}).on("release dragleft dragright swipeleft swiperight tap swipedown", handleHammer);
}


function getMockCalanderData(){
    var _data = [
        [
            {date:1,hasData:true},
            {date:2,hasData:true},
            {date:3,hasData:true},
            {date:4,hasData:true},
            {date:5,hasData:true},
            {date:6,hasData:true},
            {date:7,hasData:false},
            {date:8,hasData:true},
            {date:9,hasData:true},
            {date:10,hasData:true},
            {date:11,hasData:true},
            {date:12,hasData:true},
            {date:13,hasData:true},
            {date:14,hasData:true},
            {date:15,hasData:true},
            {date:16,hasData:true},
            {date:17,hasData:true},
            {date:18,hasData:true},
            {date:19,hasData:false},
            {date:20,hasData:true},
            {date:22,hasData:true},
            {date:23,hasData:true},
            {date:24,hasData:true},
            {date:25,hasData:true},
            {date:26,hasData:true},
            {date:27,hasData:true},
            {date:28,hasData:true},
            {date:29,hasData:true},
            {date:30,hasData:true}
        ],
        [
            {date:1,hasData:true},
            {date:2,hasData:true},
            {date:3,hasData:true},
            {date:4,hasData:true},
            {date:5,hasData:true},
            {date:6,hasData:true},
            {date:7,hasData:false},
            {date:8,hasData:true},
            {date:9,hasData:true},
            {date:10,hasData:true},
            {date:11,hasData:true},
            {date:12,hasData:true},
            {date:13,hasData:true},
            {date:14,hasData:true},
            {date:15,hasData:false},
            {date:16,hasData:true},
            {date:17,hasData:true},
            {date:18,hasData:true},
            {date:19,hasData:false},
            {date:20,hasData:true},
            {date:22,hasData:true},
            {date:23,hasData:true},
            {date:24,hasData:true},
            {date:25,hasData:true},
            {date:26,hasData:true},
            {date:27,hasData:true},
            {date:28,hasData:true},
            {date:29,hasData:true},
            {date:30,hasData:true},
            {date:31,hasData:true}
        ]
    ]
}

var carousel = new Carousel(".m-calendar");
carousel.init();

