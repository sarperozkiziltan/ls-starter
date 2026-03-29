//@input SceneObject[] selfieSide
//@ui {"widget":"separator"}

//@input SceneObject[] worldSide
//@ui {"widget":"separator"}

//@input Component.AudioComponent[] selfieSideSfx
//@ui {"widget":"separator"}

//@input Component.AudioComponent[] worldSideSfx
//@ui {"widget":"separator"}

"use strict";

const selfieSideOrgVolume = script.selfieSideSfx.map(sfx => sfx.volume)
const worldSideOrgVolume = script.worldSideSfx.map(sfx => sfx.volume)

var frontCam=script.createEvent("CameraFrontEvent");
frontCam.bind(function(){
    
   global.isSelfieOn = true; 
    
   try{
 
   script.selfieSide.forEach(function(tempObj){
    tempObj.enabled=true;     
   }); 
        
   script.worldSide.forEach(function(tempObj){
    tempObj.enabled=false;     
   });
    
   script.selfieSideSfx.forEach(function(sfx,i){
    sfx.volume = selfieSideOrgVolume[i];
    sfx.recordingVolume = selfieSideOrgVolume[i]
   });
        
   script.worldSideSfx.forEach(function(sfx){
    sfx.volume = 0
    sfx.recordingVolume = 0
   }); 
        
   
   }
   catch(e){
    print(e);     
   }     
   
});

var backCam=script.createEvent("CameraBackEvent");
backCam.bind(function(){
    
   global.isSelfieOn = false;
 
   try{

   script.selfieSide.forEach(function(tempObj){
    tempObj.enabled=false;     
   });
        
   script.worldSide.forEach(function(tempObj){
    tempObj.enabled=true;     
   });
    
   script.worldSideSfx.forEach(function(sfx,i){
    sfx.volume = worldSideOrgVolume[i];
    sfx.recordingVolume = worldSideOrgVolume[i];
   });
        
   script.selfieSideSfx.forEach(function(sfx){
    sfx.volume = 0
    sfx.recordingVolume = 0
   }); 
        
   }
   catch(e){
    print(e)     
   } 
});