// -----JS CODE-----
//@ui {"widget":"label", "label":"Choosen an option for adding sfx's"}
//@input int addingType{"widget":"combobox", "values":[{"label":"Add into an array one by one", "value":0}, {"label":"use a parent object", "value":1}]}
//@ui {"widget":"separator"}
// @input Component.AudioComponent[] sfxs {"showIf":"addingType" , "showIfValue":"0"}
// @input SceneObject sfxParent {"showIf":"addingType" , "showIfValue":"1"}
//@ui {"widget":"separator"}
// @input bool debug

"use strict";

let sfxArray = new Array();

//this function gets the correct sfx by it's name
let get = function(id){
 if(sfxArray.length === 0){
  print("There are no sfx found!!")
  print("Check the Sfx Player Script to add sfxs")
  return      
 }   
 let matchingIdCounter = 0;
 let indexOfChoosenSfx = null;
    
 sfxArray.forEach(function(sfx,i){     
  //a sfx found by that id         
  if(sfx.getSceneObject().name.includes(id)){
   matchingIdCounter++;
   indexOfChoosenSfx = i;         
  }      
 });
    
 //return the sfx by checking the matchingIdCounter conditions   
 if(matchingIdCounter == 1){
        
  if(script.debug){
   print("sfx found by that id: " + sfxArray[indexOfChoosenSfx].getSceneObject().name)               
  }            
  return sfxArray[indexOfChoosenSfx];
        
  }else if(matchingIdCounter > 1){
   print("!!There are MULTIPLE sfx's that match with this id please enter the desired sfx's full name!!");
   return null;      
        
  }else{
   print("!!There are NO sfx found by that id please enter the desired sfx's correct name!!")             
   return null;       
        
  }
    
}
script.get = get;

let getSfxsByParent = function(){
    
 if(!script.sfxParent){
  print("Add a parent for the SFX(s) !!");     
  return;      
 }
    
 const childrenCount = script.sfxParent.getChildrenCount();
    
 for(let i = 0; i<childrenCount; i++ ) {
  let currentChild = script.sfxParent.getChild(i);
  if(currentChild.getComponent("Component.AudioComponent")){
   sfxArray.push(currentChild.getComponent("Component.AudioComponent"));
  }     
 }   
 return sfxArray;  
}
sfxArray = script.addingType == 0 ? script.sfxs : getSfxsByParent(script.sfxParent);



