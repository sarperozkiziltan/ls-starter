// @input Component.ScriptComponent sfxPlayer

global.getSfx = script.sfxPlayer.get

global.isSelfieOn;

global.delayedDoSomething = function(seconds,onFinish){ 
 if(typeof seconds != 'number'){
  throw('seconds argument must be number type')             
 }
 if(typeof onFinish != 'function'){
  throw('onFinish argument must be function type')                      
 }   
 const delayedCallbackEvent = script.createEvent('DelayedCallbackEvent');
 delayedCallbackEvent.bind(function(){
  onFinish();       
 });
 delayedCallbackEvent.reset(seconds);
    
 return delayedCallbackEvent;   
}

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
}

global.rotateQuat = function(currentRot,angle,axisVector){
 let radian = angle * (Math.PI / 180);
 let rotationToApply = quat.angleAxis(radian, axisVector);   
 let newRotation = rotationToApply.multiply(currentRot);
    
 return newRotation;   
}

global.getAngleOfQuat = function(quatValue, axis){
 let radian = Math.asin(quatValue[axis]) * 2
 let angle = radian / Math.PI * 180;
 return angle;   
}

global.getWAngleOfQuat = function(quatValue){
 return Math.acos(quatValue.w)* 2 / Math.PI * 180     
}

global.rotateVecOnYAxis = function(vec,angle){
 const mult = function(val){
  return val * Math.sqrt(2) / 2       
 }    
 let leftVec = new vec3(mult(vec.x)+mult(vec.z),vec.y,-mult(vec.x)+mult(vec.z))
 let rightVec = new vec3(mult(vec.x)-mult(vec.z),vec.y,mult(vec.x)+mult(vec.z));   
    
 return vec3.lerp(leftVec,rightVec,angle);   
}

global.frameCounter = function(endFrame = 1,callback){
 let counter = 0;   
 const frameCount = script.createEvent('UpdateEvent');
 frameCount.bind(function(){
  if(counter >= endFrame){
   callback();
   script.removeEvent(frameCount);
   return         
  }      
  counter++;       
 });     
}

global.getChidren = function(sceneObject){
 const childrenCount = sceneObject.getChildrenCount();    
 const children = [];
 if(childrenCount <= 0){
  print(`no children found on ${sceneObject.name}`)       
  return       
 }
 for(let i=0; i < childrenCount; i++){
   children.push(sceneObject.getChild(i));
 }
 return children;   
}

//This method is used to provide promises that is resolved after the desired tween is finished playing. It is useful when you want to play a tween and do something after it is done without nesting the code inside the onComplete callback of the tween.
global.playTweenAsync = function(sceneObject, tweenName){
return new Promise((resolve) => {
  //start the tween
  global.tweenManager.startTween(sceneObject, tweenName,()=>{
    resolve();
  });
});
}

//This method is used for creating delays with promises. It is useful when you want to create a delay without nesting the code inside the onComplete callback of a delayed callback event.
global.delayAsync = function(seconds){
  return new Promise((resolve) => {
    global.delayedDoSomething(seconds,()=>{
      resolve();
    });
  });
}

const getTweenScript = function(sceneObject, tweenName){
  const tweenScript = sceneObject.getComponents('Component.ScriptComponent').find(script => script.tweenName === tweenName);
  if(!tweenScript){
    throw(`No tween script with the name ${tweenName} found on ${sceneObject.name}`)
  }
  return tweenScript;
}

global.setAlpha = function(sceneObject, alphaValue){
  const imagePass = sceneObject.getComponent('Component.Image').mainPass;
  imagePass.baseColor = new vec4(imagePass.baseColor.x, imagePass.baseColor.y, imagePass.baseColor.z, alphaValue);
}

class CaptureElement{
    constructor(captureObject){
        this.isCaptureObject = true;
        this.liveSceneObject = captureObject.liveObject;
        this.capturedSceneObject = captureObject.capturedObject;
        this.synced = captureObject.synced;
        if(this.synced){
            this.syncObjectTweens();
        }
    }
    syncObjectTweens(){
        const {liveSceneObject, capturedSceneObject} = this;
        const liveSceneObjectTweens = liveSceneObject.getComponents("Component.ScriptComponent").filter(script => script.tweenObject);
        if(liveSceneObjectTweens.length == 0){
            //No tweens found to sync on this object
            return;
        }
        //Copy tweens from liveSceneObject to capturedSceneObject
        liveSceneObjectTweens.forEach(tweenScript => {
            capturedSceneObject.copyComponent(tweenScript);
        });
    }
    async playCaptureTweenAsync(tweenName){
        const {liveSceneObject, capturedSceneObject, synced} = this;

        if(synced){
            global.playTweenAsync(capturedSceneObject, tweenName);
        }  
        const tweenPromise = global.playTweenAsync(liveSceneObject, tweenName);

        return tweenPromise;
    }
}
global.CaptureElement = CaptureElement;