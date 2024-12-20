import './style.css';
import { ACTUD } from "./ACTUD/ACTUD";
import { ACTUD2HTML } from './ACTUD/view/ACTUD.view';
import bwipjs from "bwip-js";

import 'bootstrap/dist/css/bootstrap.min.css';
import '@popperjs/core/dist/cjs/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';

"use strict";

/**
 * A panel which can be used to show a message while the code is being read.
 */
let readingInputPane: HTMLParagraphElement = document.getElementById('readingInputPane') as HTMLParagraphElement;
let inputElement: HTMLTextAreaElement = document.getElementById("input") as HTMLTextAreaElement;
let actudWrapper: HTMLDivElement = document.getElementById('actud') as HTMLDivElement;
let currentlyLoadedACTUD: ACTUD | null = null;

window.onload = function () {

  let start: number;
  loadSupportQrCodes([
    '%%Batt',
    '%%Restore',
    '$Set#Lang^11',
    '%%ALLTIMSET',
    '%%ALLTIM01',
    '%%ALLTIM02',
    '%%ALLTIM03',
    '%%ALLTIM04',
    '%%ALLTIM05',
    '%%ALLTIM06']);

  inputElement.onkeydown = (e: KeyboardEvent) => {
    inputElement.value = inputElement.value.trim();
    let input = inputElement.value;

    if (input.length < 3) {
      start = Date.now();
    }

    readingInputPane.style.visibility = "show";

    if (e.code == 'Enter' && input.length > 16) {
      inputElement.value = "";
      currentlyLoadedACTUD = loadQrCode(input, start);
      actudWrapper.innerHTML = ACTUD2HTML(currentlyLoadedACTUD);
    }
  };

  actudWrapper.innerHTML = ACTUD2HTML(loadQrCode("A:506810267*B:103904638*C:PT*D:FT*E:N*F:20240206*G:FTR 0100324/14570*H:JJJCR94W-14570*I1:PT*I3:7.15*I4:0.43*N:0.43*O:7.58*Q:o8NL*R:2000", Date.now()));
  // A:504661264*B:262131323*C:PT*D:FS*E:N*F:20240323*G:FS990/156201*H:JFBNXNVT-156201*I1:PT*I5:5.37*I6:0.70*I7:1.15*I8:0.27*N:0.97*O:7.49*Q:hmwH*R:71
};


function loadQrCode(input: string, start: number): ACTUD | null {
  try {
    console.log(input);
    const actud = new ACTUD(input.trim(), {
      ignoreErrors: true
    });
    return actud;
  } catch (e) {
    console.error(e);
    return null;
  }
};

function loadSupportQrCodes(codes: string[]) {
  let qrCodesWrapper = document.getElementById('qrHelpers')!;
  codes.forEach(code => {
    let destinationCanvasWrapper = document.createElement('div');
    let destinationCanvas = document.createElement('canvas');
    let descriptionParagraph = document.createElement('p');

    descriptionParagraph.classList.add("centered");

    descriptionParagraph.innerText = code;

    bwipjs.toCanvas(destinationCanvas, { text: code, bcid: 'pdf417compact' });

    destinationCanvasWrapper.appendChild(destinationCanvas);
    destinationCanvasWrapper.appendChild(descriptionParagraph);

    qrCodesWrapper.appendChild(destinationCanvasWrapper);
  });
}
