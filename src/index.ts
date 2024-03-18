import { unescape } from "he";

"use strict";

window.onload = function () {

  let buffer = "";
  let charBuffer = "";
  document.getElementsByTagName('body')[0].onkeyup = function (e: KeyboardEvent) {
    if (e.key == 'Enter') {
      console.log(buffer);
      buffer = "";
    } else if (e.code == "AltLeft") {
      buffer += unescape(`&#${charBuffer};`);
      charBuffer = "";
    } else {
      charBuffer += e.key;
    }
  };
};