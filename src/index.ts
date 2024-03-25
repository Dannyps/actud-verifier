import './style.css';
import { ACTUD } from "./ACTUD/ACTUD";
import { ACTUD2HTML } from './ACTUD/view/ACTUD.view';

"use strict";

/**
 * A panel which can be used to show a message while the code is being read.
 */
let readingInputPane: HTMLParagraphElement = document.getElementById('readingInputPane') as HTMLParagraphElement;
let inputElement: HTMLTextAreaElement = document.getElementById("input") as HTMLTextAreaElement;
let actudWrapper: HTMLDivElement = document.getElementById('actud') as HTMLDivElement;
let currentlyLoadedACTUD: ACTUD = null;

window.onload = function () {
  
  let start: number;

  inputElement.onkeydown = (e: KeyboardEvent) => {
    let input = inputElement.value;
    
    if (input.length < 3) {
      start = Date.now();
    }

    readingInputPane.style.visibility = "show";
    if (e.code == 'Enter') {
      inputElement.value = "";
      currentlyLoadedACTUD = loadQrCode(input, start);
      actudWrapper.innerHTML = ACTUD2HTML(currentlyLoadedACTUD);
    }
  };
};


function loadQrCode(input: string, start: number): ACTUD {
  try {
    console.log(`creating ACTUD... Input read in ${Date.now() - start} ms`);
    const actud = new ACTUD(input.trim());
    return actud;
  } catch (e) {
    console.error(e);
  }
};