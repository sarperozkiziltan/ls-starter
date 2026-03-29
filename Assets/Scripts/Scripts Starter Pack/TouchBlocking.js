// @ui {"widget":"group_start", "label":"Touch Blocking"}
// @ui {"widget":"separator"}
// @input bool enableTouchBlocking
// @ui {"widget":"separator"}
// @ui {"widget":"group_end"}
// @ui {"widget":"group_start", "label":"Exceptions"}
// @ui {"widget":"separator"}
// @input bool TouchTypeSwipe
// @input bool TouchTypeTouch
// @input bool TouchTypeTap
// @input bool TouchTypeDoubleTap
// @input bool TouchTypeScale
// @input bool TouchTypePan
// @input bool TouchTypeNone
// @ui {"widget":"separator"}
// @ui {"widget":"group_end"}

global.touchSystem.touchBlocking = script.enableTouchBlocking;

global.touchSystem.enableTouchBlockingException("TouchTypeDoubleTap", script.TouchTypeDoubleTap);
global.touchSystem.enableTouchBlockingException("TouchTypePan", script.TouchTypePan);
global.touchSystem.enableTouchBlockingException("TouchTypeScale", script.TouchTypeScale);
global.touchSystem.enableTouchBlockingException("TouchTypeSwipe", script.TouchTypeSwipe);
global.touchSystem.enableTouchBlockingException("TouchTypeTap", script.TouchTypeTap);
global.touchSystem.enableTouchBlockingException("TouchTypeTouch", script.TouchTypeTouch);
global.touchSystem.enableTouchBlockingException("TouchTypeNone", script.TouchTypeNone);
