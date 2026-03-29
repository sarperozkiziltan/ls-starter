/*
@typedef captureObject
@property {SceneObject} liveObject
@property {SceneObject} capturedObject
@property {boolean} synced = true
*/

//@input captureObject cta

const {playTweenAsync, delayAsync, CaptureElement} = global;

let captureCta;

const onStart = script.createEvent('OnStartEvent')
onStart.bind(function(){
    captureCta = new CaptureElement(script.cta);
});

const onTap = script.createEvent('TapEvent');
onTap.bind(function(){
    script.removeEvent(onTap);
    captureCta.playCaptureTweenAsync('scale')
});