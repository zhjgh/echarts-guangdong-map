function randomData(){
    return Math.round(Math.random() * 1100);
}

var mapChart = echarts.init(document.getElementById("map"));
var serverUrl = "https://zhjgh.github.io/echarts-guangdong-map/";
var timeType = "";
var geoCoordMap = {};
var cityData = [{
    "name": "广州",
    "value": randomData()
}, {
    "name": "汕尾",
    "value": randomData()
}, {
    "name": "阳江",
    "value": randomData()
}, {
    "name": "揭阳",
    "value": randomData()
}, {
    "name": "茂名",
    "value": randomData()
}, {
    "name": "江门",
    "value": randomData()
}, {
    "name": "韶关",
    "value": randomData()
}, {
    "name": "惠州",
    "value": randomData()
}, {
    "name": "梅州",
    "value": randomData()
}, {
    "name": "汕头",
    "value": randomData()
}, {
    "name": "深圳",
    "value": randomData()
}, {
    "name": "珠海",
    "value": randomData()
}, {
    "name": "佛山",
    "value": randomData()
}, {
    "name": "肇庆",
    "value": randomData()
}, {
    "name": "湛江",
    "value": randomData()
}, {
    "name": "中山",
    "value": randomData()
}, {
    "name": "河源",
    "value": randomData()
}, {
    "name": "清远",
    "value": randomData()
}, {
    "name": "云浮",
    "value": randomData()
}, {
    "name": "潮州",
    "value": randomData()
}, {
    "name": "东莞",
    "value": randomData()
}];
var GZData = [
    [{
        name: '湛江市',
        value: 20000000
    }, {
        name: '广州市'
    }]
];
var mapSeries = [];

var myitemStyle = {
    color: "red", //颜色
    borderColor: "#FFCC00", //边框颜色
    borderWidth: 5, //柱条的描边宽度，默认不描边。
    borderType: "solid", //柱条的描边类型，默认为实线，支持 'dashed', 'dotted'。
    barBorderRadius: 0, //柱形边框圆角半径，单位px，支持传入数组分别指定柱形4个圆角半径。
    shadowBlur: 10, //图形阴影的模糊大小。
    shadowColor: "#FFCC00", //阴影颜色
    shadowOffsetX: 0, //阴影水平方向上的偏移距离。
    shadowOffsetY: 0, //阴影垂直方向上的偏移距离。
    opacity: 1, //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
};

var Screen = (function (index) {
    index.module = {
        setMapOption: function (mapSeries) {
            return {
                backgroundColor: '#404a59',
                geo: {
                    map: "广东",
                    itemStyle: {
                        normal: {
                            // 普通状态下的样式
                            areaColor: "#323c48",
                            borderColor: "#111",
                            color: "#fff"
                        },
                        emphasis: {
                            // 高亮状态下的样式
                            areaColor: "#2a333d"
                        }
                    }
                },
                layoutCenter: ["50%", "50%"],
                layoutSize: 750,
                tooltip: {
                    trigger: "item"
                },
                dataRange: {
                    show: false,
                    right: '20',
                    bottom: '20',
                    orient: 'vertical', // 'vertical'  'horizontal'
                    textStyle: {
                        color: '#f0ffff',
                        fontSize: 20
                    },
                    splitList: [{
                        start: 0,
                        end: 1000
                    }, {
                        start: 1000,
                        end: 10000
                    }, {
                        start: 10000,
                        end: 10000000
                    }, {
                        start: 10000000
                    }],
                    color: ["#FFCC00", "#FF0000", "#FF9900", "#339933"]
                },
                series: mapSeries
            }
        },
        convertData: function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var dataItem = data[i];
                var fromCoord = geoCoordMap[dataItem[0].name];
                var toCoord = geoCoordMap[dataItem[1].name];
                if (fromCoord && toCoord) {
                    res.push([{
                        coord: fromCoord,
                        value: dataItem[0].value
                    }, {
                        coord: toCoord,
                    }]);
                }
            }
            return res;
        },
        getMapData: function (timeType) {
            let _this = this;

            $.get(serverUrl + 'map/json/guangdong.json', function (data) {

                echarts.registerMap("广东", data);

                data.features.forEach(function (item) {
                    geoCoordMap[item.properties.name] = item.properties.cp;
                });

                cityData = cityData.map((item) => {
                    return {
                        name: item.name + '市',
                        value: item.value
                    }
                });

                [
                    ['广州市', GZData]
                ].forEach(function (item, i) {
                    mapSeries.push({
                        type: 'lines',
                        zlevel: 2,
                        effect: {
                            show: true,
                            period: 4,
                            trailLength: 0,
                            symbol: 'arrow',
                            symbolSize: 5,
                            symbolSize: [15, 20],
                        },
                        lineStyle: {
                            normal: {
                                width: 2,
                                opacity: 1,
                                curveness: 0.2
                            }
                        },
                        data: _this.convertData(item[1])
                    }, {
                            type: 'effectScatter',
                            coordinateSystem: 'geo',
                            zlevel: 2,
                            rippleEffect: {
                                period: 4,
                                brushType: 'stroke',
                                scale: 4
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: 'right',
                                    offset: [5, 0],
                                    formatter: '{b}',
                                    fontSize: '16'
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            symbol: 'circle',
                            symbolSize: 35,
                            data: item[1].map(function (dataItem) {
                                return {
                                    name: dataItem[0].name,
                                    value: geoCoordMap[dataItem[0].name].concat([dataItem[0].value])
                                };
                            }),
                        }, {
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            zlevel: 2,
                            rippleEffect: {
                                period: 4,
                                brushType: 'stroke',
                                scale: 4
                            },
                            symbol: 'pin',
                            symbolSize: 35,
                            itemStyle: {
                                normal: myitemStyle,
                                emphasis: myitemStyle,
                            },
                            data: [{
                                name: item[0],
                                value: geoCoordMap[item[0]].concat([100]),
                            }],
                        });
                });

                mapSeries.push({
                    name: "咨询量",
                    type: "map",
                    mapType: "广东",
                    roam: false,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                textStyle: {
                                    fontSize: 18,
                                    color: "#fff"
                                }
                            }
                        },
                        emphasis: {
                            label: {
                                show: true
                            }
                        }
                    },
                    data: cityData
                })

                mapChart.setOption(_this.setMapOption(mapSeries));
            });
        },
        init: function () {
            this.getMapData();
        }
    }
    return index;
})(window.Screen || {})
Screen.module.init();