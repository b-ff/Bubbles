/*
 *  Bubbles JS
 *  @author: networmx128bit;
 *  @date: 18-09-2013;
 *  
 *  More about:
 *  https://github.com/networmx128bit
 *  http://n-worm.ru
 */


function Bubbles(container) {

  // If we recieve DOM container for our bubbles
  if (typeof container == "object" && container.hasOwnProperty("style")) {
    // Store it in settings object
    this.container = container;
  }

  // Create empty bubble prototypes colletion
  this.bubbles = new Array();

}


// Creates new bubble and shows it
Bubbles.prototype.addBubble = function(top, left, text, directions) {

  // Validate all parameters
  var bTop = (typeof top == "undefined" && parseInt(top) == NaN) ? 0 : (typeof top == "number") ? top : parseInt(top);
  var bLeft = (typeof left == "undefined" && parseInt(left) == NaN) ? 0 : (typeof left == "number") ? left : parseInt(left);
  var bText = (typeof text == "undefined") ? "Undefined text" : text;
  var bDirections = (typeof directions == "undefined") ? ['top', 'left'] : directions;

  // Choose parent element dependently from our settings
  var parent = (this.hasOwnProperty("container")) ? this.container : document.getElementsByTagName("body")[0];

  // Create DIV element
  var newBubble = document.createElement("div");

  // Set element properties
  newBubble.className = "bubble " + bDirections.join(' ');
  newBubble.style.top = bTop + "px";
  newBubble.style.left = bLeft + "px";
  newBubble.style.opacity = 0;
  newBubble.innerHTML = bText;
  newBubble.id = "b" + this.bubbles.length;

  // Add element to the parent node
  parent.appendChild(newBubble);

  // Get new DOM element into variable for a better code look
  var bubbleElement = document.getElementById("b" + this.bubbles.length);

  // If element founded
  if (bubbleElement != null) {

    // Add bubble removing event by click
    this.addEvent(bubbleElement, "click", this.removeBubble);

    // Store bubble options into object
    this.bubbles[this.bubbles.length] = {
      top: bTop,
      left: bLeft,
      directions: bDirections,
      text: bText,
      fadeIn: setInterval(this.showBubble, 1)
    }

    // Return DOM element for ability to use next functions in chain
    return bubbleElement;
  
  // If element is not found
  } else {

    return false;

  }

}


// Removes bubble
Bubbles.prototype.removeBubble = function() {
  if (Bubbles.killing) { return false; }

  var bubbleElement = this;
  var bubbleID = parseInt(this.id.replace("b",""));
  var bubblePrototype = Bubbles.bubbles[bubbleID];

  if (bubblePrototype.fadeIn) { clearInterval(bubblePrototype.fadeIn); }

  Bubbles.killing = {
    bubbleID: bubbleID,
    intervalID: setInterval(Bubbles.hideBubble, 1)
  }
}


// Slowly shows bubble
Bubbles.prototype.showBubble = function() {
  var bubble = document.getElementById("b" + (Bubbles.bubbles.length - 1));
  var bubblePrototype = Bubbles.bubbles[Bubbles.bubbles.length - 1];

  var showProgress = parseFloat(bubble.style.opacity);
  if (bubble.className.match("left") && bubble.className.match("left") == null) { bubble.style.left = Math.round(showProgress * bubblePrototype.left) + "px"; }
  if (bubble.className.match("top")) { bubble.style.top = Math.round(showProgress * bubblePrototype.top) + "px"; }
  bubble.style.opacity = showProgress + 0.02;

  if (showProgress > 1) {
    clearInterval(bubblePrototype.fadeIn);
    delete(bubblePrototype.fadeIn);
  } 
}


// Slowly hides bubble
Bubbles.prototype.hideBubble = function() {
  var bubble = document.getElementById("b" + Bubbles.killing.bubbleID);
  var bubblePrototype = Bubbles.bubbles[Bubbles.killing.bubbleID];

  var showProgress = parseFloat(bubble.style.opacity);
  if (bubble.className.match("left") && bubble.className.match("left") == null) { bubble.style.left = Math.round(showProgress * bubblePrototype.left) + "px"; }
  if (bubble.className.match("top")) { bubble.style.top = Math.round(showProgress * bubblePrototype.top) + "px"; }
  bubble.style.opacity = showProgress - 0.02;
  
  if (showProgress <= 0.02) {
    bubble.parentNode.removeChild(bubble);
    clearInterval(Bubbles.killing.intervalID);
    delete(Bubbles.bubbles[Bubbles.killing.bubbleID])
    delete(Bubbles.killing);
  }   
}


// add event cross browser
Bubbles.prototype.addEvent = function(elem, event, fn) {
    if (elem.addEventListener) {
        elem.addEventListener(event, fn, false);
    } else {
        elem.attachEvent("on" + event, function() {
            // set the this pointer same as addEventListener when fn is called
            return(fn.call(elem, window.event));   
        });
    }
}