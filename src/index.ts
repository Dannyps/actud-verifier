import { unescape } from "he";
import { ACTUD } from "./ACTUD/ACTUD";

"use strict";

window.onload = function () {
  document.getElementsByTagName('body')[0].onkeydown = parseKeyPress;
  let readingInputPane = document.getElementById('readingInputPane');
  readingInputPane.style.visibility = 'hidden';
  
  let buffer = "";
  let charBuffer = "";
  
  function parseKeyPress(e: KeyboardEvent) {
    if (e.key == 'Shift') {
      return;
    }
  
    if (e.key == 'Enter') {
      readingInputPane.style.visibility = 'hidden';
      if (buffer == "") {
        console.log(charBuffer);
        loadQrCode(charBuffer);
        charBuffer = "";
      } else {
        console.log(buffer);
        loadQrCode(buffer);
        buffer = "";
        charBuffer = "";
        debugger;
      }
      buffer = "";
    } else if (e.code == "AltLeft") {
      readingInputPane.style.visibility = 'visible';
      buffer += unescape(`&#${charBuffer};`);
      charBuffer = "";
    } else {
      readingInputPane.style.visibility = 'visible';
      charBuffer += e.key;
    }
  };
};


function loadQrCode(input: string): ACTUD {
  try {
    return new ACTUD(input);
  } catch (e) {
    console.error(e);
  }
};