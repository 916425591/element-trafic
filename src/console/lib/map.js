var dsMap = new DsGis.create();
dsMap.prototype = {
    map: null,
    checkpointLayer: null,
    checkpointSource: null,
    monitorVideoLayer: null,
    monitorVideoSource: null,
    actionStationLayer: null,
    actionStationSource: null,
    policeCarTrackSource: null,
    policeCarTrackLayer: null,
    policeCarTrackAnimation:null,
    init: function (target) {
        this.map = new ol.Map({
            target: target,
            view: new ol.View({
                center: ol.proj.fromLonLat([104.067731, 30.668321]),
                maxZoom: 21,
                zoom: 12,
                projection: 'EPSG:3857'
            })
        });
        var gaodeMapLayer = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'
            })
        });
        this.map.addLayer(gaodeMapLayer);
    },
    loadSourceData: function (url, params, source) {
        $.ajax({
            url: url,
            type: "POST",
            dataType: "JSONP",
            traditional: true,
            jsonp: 'jsonpCallback',
            data: {
                tname: params.tname,
                cql: params.cql,
                attrs: params.attrs
            },
            success: function (result) {
                source.clear();
                var json = new ol.format.GeoJSON(
                    {featureProjection: ol.proj.get('EPSG:3857')}
                );
                var feature = json.readFeatures(result.data);
                source.addFeatures(feature);
            },
            error: function () {
                alert("获取数据失败");
            }
        });
    },
    addActionStationLayer: function (url, params) {
        this.actionStationSource = new ol.source.Vector();
        this.loadSourceData(url, params, this.actionStationSource);
        this.actionStationLayer = new ol.layer.Vector({
            source: this.actionStationSource,
            style: new ol.style.Style({
                image: new ol.style.Icon(({
                    src: "/src/console/lib/img/ds_actionstation.png",
                    scale: 0.2
                }))
            })
        });
        this.map.addLayer(this.actionStationLayer);
    },
    addCheckpointLayer: function (url, params) {
        this.checkpointSource = new ol.source.Vector();
        this.loadSourceData(url, params, this.checkpointSource);
        this.checkpointLayer = new ol.layer.Vector({
            source: this.checkpointSource,
            style: new ol.style.Style({
                image: new ol.style.Icon(({
                    src: "/src/console/lib/img/ds_checkpoint.png",
                    scale: 0.2
                }))
            })
        });
        this.map.addLayer(this.checkpointLayer);
    },
    addMonitorVideoLayer: function (url, params) {
        this.monitorVideoSource = new ol.source.Vector();
        this.loadSourceData(url, params, this.monitorVideoSource);
        this.monitorVideoLayer = new ol.layer.Vector({
            source: this.monitorVideoSource,
            style: new ol.style.Style({
                image: new ol.style.Icon(({
                    src: "/src/console/lib/img/ds_monitorvideo.png",
                    scale: 0.2
                }))
            })
        });
        this.map.addLayer(this.monitorVideoLayer);
    },
    addPliceCarTrackAnimation: function (pliceCarId) {
        var me = this;
        if(me.policeCarTrackSource===null){
            me.policeCarTrackSource = new ol.source.Vector();
            me.policeCarTrackLayer = new ol.layer.Vector({
                source: this.policeCarTrackSource,
                style: new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: '#ff0000',
                        width: 5
                    })
                })
            });
            me.map.addLayer(me.policeCarTrackLayer);
            me.policeCarTrackAnimation = new DSAnimation(
                {
                    map: me.map,
                    speed: 300//运行速度
                });
        }else{
            me.policeCarTrackSource.clear();
            me.policeCarTrackAnimation.closeAnimation();
        }
        var cql = "policecari='" + pliceCarId + "'";
        $.ajax({
            url: "http://10.168.4.222:8080/WebDemo/geocontroller/getTrace",
            type: "POST",
            dataType: "JSONP",
            traditional: true,
            jsonp: 'jsonpCallback',
            data: {
                tname: "ds_plicecarpts",
                cql: cql,
                attrs: ['geom']
            },
            success: function (result) {
                var json = new ol.format.GeoJSON(
                    {featureProjection: ol.proj.get('EPSG:3857')}
                );
                var feature = json.readFeatures(result);
                me.policeCarTrackSource.addFeatures(feature);
                var coords = me.policeCarTrackSource.getFeatures()[0].getGeometry().getCoordinates();
                me.policeCarTrackAnimation.coords=coords;
                me.policeCarTrackAnimation.startAnimation();
            },
            error: function () {
                alert("获取数据失败");
            }
        });
    }

}











