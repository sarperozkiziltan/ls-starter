// Global Properties & Functions
//
// Template-owned helper library. Everything declared here is attached to `global`,
// so it is available from any script in the project without a reference.
// This script should sit near the top of the Scene Hierarchy so the helpers exist
// before other scripts start using them.

// @input Component.ScriptComponent sfxPlayer

// ---------------------------------------------------------------------------
// Shared properties
// ---------------------------------------------------------------------------

/**
 * Getter for sound effects, taken from the SFX player script.
 * @type {function}
 */
global.getSfx = script.sfxPlayer.get;

/**
 * Tracks whether the front (selfie) camera is currently active.
 * Left undefined here on purpose — whichever script owns camera state sets it.
 * @type {boolean|undefined}
 */
global.isSelfieOn;

// ---------------------------------------------------------------------------
// Timing
// ---------------------------------------------------------------------------

/**
 * Runs a callback after a delay.
 *
 * The returned event is handed back so the caller can cancel or restart the
 * delay (e.g. `event.reset(newSeconds)` or `script.removeEvent(event)`).
 *
 * @param {number} seconds - How long to wait before firing.
 * @param {function} onFinish - Called once the delay has elapsed.
 * @returns {DelayedCallbackEvent} The scheduled event.
 */
global.delayedDoSomething = function (seconds, onFinish) {
  if (typeof seconds != 'number') {
    throw ('seconds argument must be number type');
  }
  if (typeof onFinish != 'function') {
    throw ('onFinish argument must be function type');
  }

  const delayedCallbackEvent = script.createEvent('DelayedCallbackEvent');
  delayedCallbackEvent.bind(function () {
    onFinish();
  });
  delayedCallbackEvent.reset(seconds);

  return delayedCallbackEvent;
};

/**
 * Waits a number of frames, then runs a callback once.
 *
 * Useful when something has to happen after the scene has settled — for example
 * reading a transform that is only correct after the first frame has rendered.
 * The update event removes itself after firing.
 *
 * @param {number} [endFrame=1] - How many frames to wait.
 * @param {function} callback - Called once the frame count is reached.
 */
global.frameCounter = function (endFrame = 1, callback) {
  let counter = 0;

  const frameCount = script.createEvent('UpdateEvent');
  frameCount.bind(function () {
    if (counter >= endFrame) {
      callback();
      script.removeEvent(frameCount);
      return;
    }
    counter++;
  });
};

// ---------------------------------------------------------------------------
// Async helpers
//
// These wrap callback-based APIs in promises so sequences can be written flat
// with `await` instead of nesting inside onComplete callbacks.
// ---------------------------------------------------------------------------

/**
 * Plays a tween and resolves once it has finished.
 *
 * @param {SceneObject} sceneObject - Object holding the tween script.
 * @param {string} tweenName - Name of the tween to play.
 * @returns {Promise<void>} Resolves when the tween completes.
 *
 * @example
 * await global.playTweenAsync(panel, 'fadeIn');
 */
global.playTweenAsync = function (sceneObject, tweenName) {
  return new Promise((resolve) => {
    global.tweenManager.startTween(sceneObject, tweenName, () => {
      resolve();
    });
  });
};

/**
 * Awaitable delay — the promise version of `global.delayedDoSomething`.
 *
 * @param {number} seconds - How long to wait.
 * @returns {Promise<void>} Resolves once the delay has elapsed.
 *
 * @example
 * await global.delayAsync(0.5);
 */
global.delayAsync = function (seconds) {
  return new Promise((resolve) => {
    global.delayedDoSomething(seconds, () => {
      resolve();
    });
  });
};

// ---------------------------------------------------------------------------
// Scene graph
// ---------------------------------------------------------------------------

/**
 * Collects the direct children of a scene object into an array.
 *
 * Returns undefined (and logs) when the object has no children, so check the
 * result before iterating.
 *
 * @param {SceneObject} sceneObject - Parent to read.
 * @returns {SceneObject[]|undefined} The children, or undefined if there are none.
 */
global.getChildren = function (sceneObject) {
  const childrenCount = sceneObject.getChildrenCount();
  const children = [];

  if (childrenCount <= 0) {
    print(`no children found on ${sceneObject.name}`);
    return;
  }

  for (let i = 0; i < childrenCount; i++) {
    children.push(sceneObject.getChild(i));
  }

  return children;
};

/**
 * Finds the tween script on an object by its tween name.
 *
 * An object can carry several tween scripts, so this picks the one whose
 * `tweenName` matches. Throws when nothing matches, since a missing tween is
 * almost always a wiring mistake rather than a valid state.
 *
 * @param {SceneObject} sceneObject - Object holding the tween scripts.
 * @param {string} tweenName - Name of the tween to look for.
 * @returns {ScriptComponent} The matching tween script.
 */
global.getTweenScript = function (sceneObject, tweenName) {
  const tweenScript = sceneObject.getComponents('Component.ScriptComponent').find(script => script.tweenName === tweenName);

  if (!tweenScript) {
    throw (`No tween script with the name ${tweenName} found on ${sceneObject.name}`);
  }

  return tweenScript;
};

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

/**
 * Sets the alpha of a screen image through its material's baseColor.
 *
 * RGB is preserved; only the alpha channel changes. `baseColor` hands back a
 * copy, so the whole vec4 is reassigned rather than writing to `.a` in place.
 *
 * Note: the material is shared unless it was cloned, so this affects every
 * image using it.
 *
 * @param {SceneObject} sceneObject - Object carrying the Image component.
 * @param {number} alpha - Target alpha, 0 to 1.
 */
global.setAlpha = function (sceneObject, alpha) {
  const image = sceneObject.getComponent('Component.Image');

  if (!image) {
    throw (`No Image component found on ${sceneObject.name}`);
  }

  const baseColor = image.mainPass.baseColor;
  image.mainPass.baseColor = new vec4(baseColor.r, baseColor.g, baseColor.b, alpha);
};

// ---------------------------------------------------------------------------
// Math
// ---------------------------------------------------------------------------

/**
 * Rotates a quaternion around an axis by an angle in degrees.
 *
 * Takes degrees for convenience and converts to radians internally, since the
 * runtime API works in radians.
 *
 * @param {quat} currentRot - Rotation to start from.
 * @param {number} angle - Angle to rotate by, in degrees.
 * @param {vec3} axisVector - Axis to rotate around.
 * @returns {quat} The rotated quaternion.
 */
global.rotateQuat = function (currentRot, angle, axisVector) {
  let radian = angle * (Math.PI / 180);
  let rotationToApply = quat.angleAxis(radian, axisVector);
  let newRotation = rotationToApply.multiply(currentRot);

  return newRotation;
};

/**
 * Reads the rotation around a single axis of a quaternion, in degrees.
 *
 * @param {quat} quatValue - Quaternion to read.
 * @param {string} axis - Component to read: 'x', 'y' or 'z'.
 * @returns {number} The angle in degrees.
 */
global.getAngleOfQuat = function (quatValue, axis) {
  let radian = Math.asin(quatValue[axis]) * 2;
  let angle = radian / Math.PI * 180;

  return angle;
};

/**
 * Reads the total rotation angle of a quaternion from its w component, in degrees.
 *
 * @param {quat} quatValue - Quaternion to read.
 * @returns {number} The angle in degrees.
 */
global.getWAngleOfQuat = function (quatValue) {
  return Math.acos(quatValue.w) * 2 / Math.PI * 180;
};

/**
 * Interpolates a vector between its 45° left and 45° right rotations on the Y axis.
 *
 * `angle` is a 0–1 blend factor, not a degree value: 0 gives the left vector,
 * 1 gives the right one, 0.5 gives the original.
 *
 * @param {vec3} vec - Vector to rotate.
 * @param {number} angle - Blend factor between the left and right vectors, 0 to 1.
 * @returns {vec3} The blended vector.
 */
global.rotateVecOnYAxis = function (vec, angle) {
  // Scale by cos(45°) / sin(45°) — the shared factor in a 45° Y-axis rotation.
  const mult = function (val) {
    return val * Math.sqrt(2) / 2;
  };

  let leftVec = new vec3(mult(vec.x) + mult(vec.z), vec.y, -mult(vec.x) + mult(vec.z));
  let rightVec = new vec3(mult(vec.x) - mult(vec.z), vec.y, mult(vec.x) + mult(vec.z));

  return vec3.lerp(leftVec, rightVec, angle);
};

// ---------------------------------------------------------------------------
// Arrays
// ---------------------------------------------------------------------------

/**
 * Shuffles an array in place using the Fisher–Yates algorithm.
 *
 * Mutates the array it is given and returns nothing — pass a copy if the
 * original order still matters.
 *
 * @param {Array} array - Array to shuffle.
 */
global.shuffle = function (array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
};
