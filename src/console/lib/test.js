var myOL = new DsGis.create();
myOL.prototype = {
    defaults: {
        baseMapType: '',
        mapContainer: '',
        controlNames: [],
        center: [13527333.08024803, 3651187.0797928306],
        zoom: 10,
        maxZoom: 18,
        minZoom: 3,
        projection: null,

    },
    map: undefined,
    layers: {
        baseLayer: undefined,//底图动态切换
        drawTempLayer: undefined,//临时绘制图层
        PoliceLayer: undefined, //警员图层
        AlarmLayer: undefined,//警情图层
        AlarmConPoliceLayer: undefined,//警情警员连接层
    },
    interactions: {
        draw: undefined,
    },
    myMeasure: null,
    toolTip: null,
    websocket: null, //后台推送
    //初始化对象
    init: function (options) {
        var me = this;
        $.extend(this.defaults, options);
        me.configBaseLayer();
        me.loadMap();
    },
    //加载地图
    loadMap: function () {
        var me = this;
        me.map = new ol.Map({
            controls: me.defaults.controlNames.length == 0 ? new ol.control.defaults() : me.loadControls(),
            target: me.defaults.mapContainer,
            layers: [me.layers.baseLayer],
            view: new ol.View({
                center: me.defaults.center,
                zoom: me.defaults.zoom,
                maxZoom: me.defaults.maxZoom,
                minZoom: me.defaults.minZoom,
                projection: me.defaults.projection,
            }),
        });
        //	me.loadTempDataLayers();
        //me.loadWFSlayer();
        //me.loadGeoJsonFileLayer();
      //  me.loadAlaryLayer();
    },
    //配置底图
    configBaseLayer: function () {
        var me = this;
        switch (me.defaults.baseMapType) {
            case 'baidu':
                proj4.defs('BD-09', "+proj=merc +a=6378206 +b=6356584.314245179 +lat_ts=0.0 +lon_0=0.0 +x_0=0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs");
                //获得BD-09投影
                me.defaults.projection = ol.proj.get("BD-09");
                //    var p_bd=[121.516786,31.314017];//在百度坐标拾取系统钟获得的百度经纬
                // var t=proj4('EPSG:4326','BD-09',p_bd)//投影转换给百度XY坐标
                var resolutions = [];
                for (var i = 0; i < 19; i++) {
                    resolutions[i] = Math.pow(2, 18 - i);
                }
                var tilegrid = new ol.tilegrid.TileGrid({
                    origin: [0, 0],
                    resolutions: resolutions
                });
                var baidu_source = new ol.source.TileImage({
                    //  projection: projection,
                    tileGrid: tilegrid,
                    tileUrlFunction: function (tileCoord, pixelRatio, proj) {
                        if (!tileCoord) {
                            return "";
                        }
                        var z = tileCoord[0];
                        var x = tileCoord[1];
                        var y = tileCoord[2];

                        if (x < 0) {
                            x = "M" + (-x);
                        }
                        if (y < 0) {
                            y = "M" + (-y);
                        }
                        return "http://online3.map.bdimg.com/onlinelabel/?qt=tile&x=" + x + "&y=" + y + "&z=" + z + "&styles=pl&udt=20151021&scaler=1&p=1";
                    }
                });
                me.layers.baseLayer = baiduLayer = new ol.layer.Tile({
                    source: baidu_source
                });
                return;
            case 'gaode':
                me.defaults.projection = ol.proj.get("EPSG:3857");
                me.layers.baseLayer = gaodeMapLayer = new ol.layer.Tile({
                    source: new ol.source.XYZ({
                        //url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
                        url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
                    })
                });
                return;
            case 'tianditu':
                break;
            case 'zidingyi':
                break;
        }
        ;
    },

    test:function(){
        var me = this;
      var c=  me.map.getSize();
      alert(c);

    }


}











