var DSAnimation = new DsGis.create();
DSAnimation.prototype = {
    map: null,
    animating: false,//是否处于动画状态
    animationLy: null,//动画层
    now: null,//动画开始时间
    geoMarker: null,//运动物体
    coords:[], //传入的线路坐标
    routeCoords: [],//细化后的坐标
    postcomposeEvt: null,//实时渲染事件
    speed: 1,//运行速度
    extentShow:[],
    init: function (options) {
        var me = this;
        $.extend(this, options);
    },
    //创建动画图层
    createAnimationLy: function () {
        var me = this;
        me.geoMarker = new ol.Feature({
            geometry: new ol.geom.Point(me.coords[0]),
        })
        me.animationLy = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: function (feature) {
                return new ol.style.Style({
                    image:new ol.style.Icon({
                        scale:0.3,
                        src: '/src/console/lib/img/policeCar.svg'
                    })
                });
            }
        });
        me.animationLy.getSource().addFeature(me.geoMarker);
        me.map.addLayer(me.animationLy);
    },
    //开始动画
    startAnimation: function () {
        var me = this;
        me.getRouteCoords(me.coords);
        me.map.getView().fit(me.extentShow);
        me.createAnimationLy();
        if (me.animating === true) {
            me.stopAnimation(false);
        }
        me.animating = true;
        me.now = new Date().getTime();
        //绑定postcompose事件，回调函数moveFeature
        me.postcomposeEvt=me.map.on('postcompose', me.moveFeature,me);
        me.map.render();
    },

    //停止动画
    stopAnimation: function (ended) {
        var me = this;
        me.animating = false;
        var coord = ended ? me.routeCoords[me.routeCoords.length - 1] : me.routeCoords[0];
        me.geoMarker.getGeometry().setCoordinates(coord);
        ol.Observable.unByKey(me.postcomposeEvt);
    },

    //移动要素
    moveFeature: function (event) {
        var me = this;
        var vectorContext = event.vectorContext;
        var frameState = event.frameState;
        if (me.animating) {
            var elapsedTime = frameState.time - me.now;
            var index = Math.round(me.speed * elapsedTime / 1000);
            if (index >= me.routeCoords.length) {
                me.stopAnimation(true);
                return;
                //  me.animationLy.getSource().removeFeature(me.geoMarker);
            }
            var currentPoint = new ol.geom.Point(me.routeCoords[index]);
            var feature = new ol.Feature(currentPoint);
            vectorContext.drawFeature(feature, new ol.style.Style({
                image:new ol.style.Icon({
                    scale:0.3,
                    src: '/src/console/lib/img/policeCar.svg'
                })
            }));
        }
        me.map.render();
    },
    //关闭动画，清除动画层
    closeAnimation:function(){
        var me=this;
        ol.Observable.unByKey(me.postcomposeEvt);
        if(me.animationLy!=null){
            me.map.removeLayer(me.animationLy);
            me.animationLy=null;
        }
    },

    //获取精细化坐标点
    getRouteCoords: function (coords) {
        var me = this;
        var start;
        var end;
        if (coords.length < 2) {
            return;
        }
        var routeCoords = [];
        var minx=coords[0][0];
        var miny=coords[0][1];
        var maxx=coords[0][0];
        var maxy=coords[0][1];
        for (var t = 0; t < coords.length; t++) {
            start = coords[t];
            end = coords[t + 1];
            var xdiff = end[0] - start[0];
            var ydiff = end[1] - start[1];
            var c = Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);
            var count = Math.round(c);
            var startx = start[0];
            var starty = start[1];
            var avg_x = xdiff / count;
            var avg_y = ydiff / count;
            routeCoords.push(start);
            for (var i = 0; i < count; i++) {
                startx += avg_x;
                starty += avg_y;
                var val = [startx, starty];
                routeCoords.push(val);
            }
            if(minx>end[0]){
                minx=end[0];
            }
           else if(maxx<end[0]){
                maxx=end[0]
            }
            if(miny>end[1]){
                miny=end[1];
            }
           else if(maxy<end[1]){
                maxy=end[1];
            }
            if (t + 2 === coords.length) {
                routeCoords.push(end);
                me.routeCoords = routeCoords;
                me.extentShow=[];
                me.extentShow.push(minx);
                me.extentShow.push(miny);
                me.extentShow.push(maxx);
                me.extentShow.push(maxy);
                return;
            }
        }
    },

}