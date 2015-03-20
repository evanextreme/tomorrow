cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.statusbar/www/statusbar.js",
        "id": "org.apache.cordova.statusbar.statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.statusbar/src/windows/StatusBarProxy.js",
        "id": "org.apache.cordova.statusbar.StatusBarProxy",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.apache.cordova.statusbar": "0.1.10"
}
// BOTTOM OF METADATA
});