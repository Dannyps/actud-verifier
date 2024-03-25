import './style.css';
import { ACTUD } from "./ACTUD/ACTUD";

"use strict";

/**
 * A panel which can be used to show a message while the code is being read.
 */
let readingInputPane: HTMLParagraphElement = document.getElementById('readingInputPane') as HTMLParagraphElement;
let inputElement: HTMLTextAreaElement = document.getElementById("input") as HTMLTextAreaElement;
let actudWrapper: HTMLDivElement = document.getElementById('actud') as HTMLDivElement;
let currentlyLoadedACTUD: ACTUD = null;

window.onload = function () {
  inputElement.onkeydown = (e: KeyboardEvent) => {
    let input = inputElement.value;
    let start: number;
    if (input.length < 2) {
      start = Date.now();
    }

    readingInputPane.style.visibility = "show";
    if (e.code == 'Enter') {
      inputElement.value = "";
      currentlyLoadedACTUD = loadQrCode(input, start);
      actudWrapper.innerHTML = currentlyLoadedACTUD.mustacheOutput;
    }
  };
};


function loadQrCode(input: string, start: number): ACTUD {
  try {
    console.debug(input);
    console.log(`creating ACTUD... Input read in ${Date.now() - start} ms`);
    const actud = new ACTUD(input);
    console.info(actud);
    return actud;
  } catch (e) {
    console.error(e);
  }
};