(function () {
'use strict';

var app_id = "DemoAppId01082013GAL";
var app_code = "AJKnXv84fjrb0KIHawS0Tg";
var host = "cit.datalens.api.here.com";
var queries = {"query":{"fileName":"./query.json","dataset":"57b42548635b42cab517d62db91ee954","id":"4bfc00d93ec34336a2da780261ecbf3a"}};

const {query} = queries;

// Initialize communication with the platform, to access your own data, change the values below
// https://developer.here.com/documentation/geovisualization/topics/getting-credentials.html

// We recommend you use the CIT environment. Find more details on our platforms below
// https://developer.here.com/documentation/map-tile/common/request-cit-environment-rest.html

const platform = new H.service.Platform({
    app_id,
    app_code,
    useCIT: Boolean(host.match('cit')),
    useHTTPS: true
});

//initialize a map
const pixelRatio = devicePixelRatio > 1 ? 2 : 1;
const defaultLayers = platform.createDefaultLayers({tileSize: 256 * pixelRatio});
const map = new H.Map(
    document.getElementsByClassName('dl-map')[0],
    defaultLayers.normal.map,
    {pixelRatio}
);
window.addEventListener('resize', function() {
    map.getViewPort().resize();
});

//make the map interactive
new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
let ui = H.ui.UI.createDefault(map, defaultLayers);
ui.removeControl('mapsettings');

//instantiate Geovisualization service
const service = platform.configure(new H.datalens.Service());

map.setCenter(new H.geo.Point(40.769832, -73.974726));
map.setZoom(13, false);

const provider = new H.datalens.QueryTileProvider(
    service, {
        queryId: query.id,
        tileParamNames: {
            x: 'x',
            y: 'y',
            z: 'z'
        }
    }
);

const queryProvider = new H.datalens.QueryTileProvider(
    service,
    {
        queryId: query.id,
        tileParamNames: {x: 'x', y: 'y', z: 'z'}
    }
);

const providerColors = {
    '1': '#23a38f',
    '2': '#ffd480',
    '3': '#ff5346',
    '4': '#0092b3'
};

/**
 * @param {H.clustering.INoisePoint} noisePoint
 * @returns {H.datalens.Icon}
 */
function getNoisePointStyle(noisePoint) {
    const provider = noisePoint.getData().provider;
    return H.datalens.ObjectLayer.createIcon(
        [
            'svg',
            {
                viewBox: '-20 -20 40 40'
            },
            [
                'circle',
                {
                    r: 6,
                    fill: providerColors[provider],
                    stroke: '#000000'
                }
            ]
        ], {size: 25 * pixelRatio}
    );
}

/**
 * @param {H.clustering.ICluster} cluster
 * @param {number} zoom
 * @returns {H.datalens.Icon}
 */
function getClusterStyle(cluster) {
    const providers =  getClusterProviders(cluster);
    let startAngle = 0;
    const chunkAngle = 2 * Math.PI / cluster.getWeight();
    let endAngle = 0;
    const svg = ['svg',
    {
        viewBox: '-20 -20 40 40'
    }];
    svg.push(
        //inner circle
        [
            'circle',
            {
                r: 14
            }
        ],
        //label
        [
            'text',
            {
                x: 0,
                y: 5,
                fontFamily: 'sans-serif',
                fontWeight: 100,
                fontSize: 15,
                textAnchor: 'middle',
                fill: 'white'
            },
            String(cluster.getWeight())
        ]
    );

    // Outer circle represents different antennas.
    // Number of slices represents the the number of different providers
    for (let provider in providers)  {
        // slice is just one element of a cluster and
        // providers obj has providers and count of a provider in cluster
        endAngle = endAngle + chunkAngle * providers[provider];
        svg.push([
            'path',
            {
                d: d3.arc()({
                    innerRadius: 14,
                    outerRadius: 19,
                    startAngle: startAngle,
                    endAngle: endAngle
                }),
                fill: providerColors[provider] ,
                fillOpacity: 0.7,
                stroke: 'rgba(0, 0, 0, 0.3)'
            }]
        );
        startAngle = endAngle;
    }
    return H.datalens.ObjectLayer.createIcon(
        svg, {size: 50 * pixelRatio}
    );
}

/**
 * @param {H.clustering.ICluster} cluster
 * @returns {Object.<string, number>} number of antennas by provider
 */
function getClusterProviders(cluster) {
    const providers = {};
    cluster.forEachDataPoint(function(p) {
        const provider = p.getData().provider;
        if (!providers[provider]) {
            providers[provider] = 1;
        } else {
            providers[provider] += 1;
        }
    });
    return providers;
}

const layer = new H.datalens.ObjectLayer(
    queryProvider,
    {
        clustering: {
            rowToDataPoint: function({lat, lon}) {
                return new H.clustering.DataPoint(
                    lat, lon, 1
                );
            },
            options: function(zoom) {
                return {
                    strategy: H.clustering.Provider.Strategy.DYNAMICGRID,
                    eps: 50,
                    //after zoom 16 show do not cluster
                    minWeight: zoom < 16 ? 2 : Infinity
                };
            }
        },
        //accepts data row and returns map object
        rowToMapObject: function(cluster) {
            return new H.map.Marker(
                cluster.getPosition()
            );
        },
        rowToStyle: function(cluster, zoom) {
            let icon;
            if (cluster.isCluster()) {
                //cluster of antennas
                icon = getClusterStyle(cluster, zoom);
            } else {
                //noise point
                icon = getNoisePointStyle(cluster, zoom);
            }
            return {icon: icon};
        }
    }
);

//put layers on the map
map.addLayer(layer);

//init legend panel
const panel = new Panel('Antennae');
const multiselect = new Multiselect(['2G', '3G', '4G'].reduce(
    (values, v) => {
        values[v] = v;
        return values;
    }, {}
));
const epsLabel = new Label();
const multiselectLabel = new Label();
const colorLegendLabel = new Label();
const colorLegend = new ColorLegend(
    v => providerColors[Math.floor(v * 4) + 1]
);
ui.addControl('panel', panel);
panel.addChild(multiselectLabel);
panel.addChild(multiselect);
panel.addChild(colorLegendLabel);
panel.addChild(colorLegend);
multiselectLabel.setHTML(`Technology`);
multiselect.addEventListener('change', () => {
    queryProvider.setQueryParams({technology_filter: multiselect.getValue()});
    queryProvider.reload();
});
colorLegendLabel.setHTML(`Providers`);
colorLegend.setLabels(Object.keys(providerColors).map(
    provider => `<div style="width: 40px;">${provider}</div>`
));

}());
