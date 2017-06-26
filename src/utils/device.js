var THREE = require('../lib/three');
var MobileDetect = require('../lib/mobile-detect');
var dolly = new THREE.Object3D();
var controls = new THREE.VRControls(dolly);

/**
 * Determine if a headset is connected by checking if the orientation is available.
 */
function checkHeadsetConnected () {
  var orientation;
  var vrDisplay = controls.getVRDisplay();

  // If `isConnected` is available, just use that.
  if (vrDisplay && 'isConnected' in vrDisplay) { return vrDisplay.isConnected; }

  controls.update();
  orientation = dolly.quaternion;
  if (orientation._x !== 0 || orientation._y !== 0 || orientation._z !== 0) {
    return true;
  }
  return false;
}
module.exports.checkHeadsetConnected = checkHeadsetConnected;

/**
 * Check for positional tracking.
 */
function checkHasPositionalTracking () {
  var vrDisplay = controls.getVRDisplay();
  if (isMobile() || isGearVR()) { return false; }
  return vrDisplay && vrDisplay.capabilities.hasPosition;
}
module.exports.checkHasPositionalTracking = checkHasPositionalTracking;

/**
 * Checks if browser is mobile.
 * @return {Boolean} True if mobile browser detected.
 */
var isMobile = (function () {
  var _isMobile = false;
  var md = new MobileDetect(window.navigator.userAgent);
  _isMobile = md.mobile() ? true : false;

  return function () { return _isMobile; };
})();
module.exports.isMobile = isMobile;

/**
 *  Detect tablet devices.
 *  @param {string} mockUserAgent - Allow passing a mock user agent for testing.
 */
function isTablet (mockUserAgent) {
  var md = new MobileDetect(window.navigator.userAgent);
  return md.tablet() ? true : false;
}
module.exports.isTablet = isTablet;

function isIOS () {
  return /iPad|iPhone|iPod/.test(window.navigator.platform);
}
module.exports.isIOS = isIOS;

function isGearVR () {
  return /SamsungBrowser.+Mobile VR/i.test(window.navigator.userAgent);
}
module.exports.isGearVR = isGearVR;

/**
 * Checks mobile device orientation.
 * @return {Boolean} True if landscape orientation.
 */
module.exports.isLandscape = function () {
  return window.orientation === 90 || window.orientation === -90;
};

/**
 * Check if device is iOS and older than version 10.
 */
module.exports.isIOSOlderThan10 = function (userAgent) {
  return /(iphone|ipod|ipad).*os.(7|8|9)/i.test(userAgent);
};

/**
 * Check if running in a browser or spoofed browser (bundler).
 * We need to check a node api that isn't mocked on either side.
 * `require` and `module.exports` are mocked in browser by bundlers.
 * `window` is mocked in node.
 * `process` is also mocked by browserify, but has custom properties.
 */
module.exports.isBrowserEnvironment = !!(!process || process.browser);

/**
 * Check if running in node on the server.
 */
module.exports.isNodeEnvironment = !module.exports.isBrowserEnvironment;
