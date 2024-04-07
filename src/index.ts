import './style.css';
import { ACTUD } from "./ACTUD/ACTUD";
import { ACTUD2HTML } from './ACTUD/view/ACTUD.view';
import QRCode from "qrcode";
import $ from "jquery";
import "bootstrap";

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
  loadSupportQrCodes(['%%Restore',
    '$Set#Lang^11',
    '%%ALLTIMSET',
    '%%ALLTIM01',
    '%%ALLTIM02',
    '%%ALLTIM03',
    '%%ALLTIM04',
    '%%ALLTIM05',
    '%%ALLTIM06']);

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

  //actudWrapper.innerHTML = ACTUD2HTML(loadQrCode("A:506810267*B:103904638*C:PT*D:FT*E:N*F:20240206*G:FTR 0100324/14570*H:JJJCR94W-14570*I1:PT*I3:7.15*I4:0.43*N:0.43*O:7.58*Q:o8NL*R:2000", Date.now()));
};


function loadQrCode(input: string, start: number): ACTUD {
  try {
    const actud = new ACTUD(input.trim());
    return actud;
  } catch (e) {
    console.error(e);
  }
};

function loadSupportQrCodes(codes: string[]) {
  let qrCodesWrapper = document.getElementById('qrHelpers');
  codes.forEach(code => {
    let destinationCanvasWrapper = document.createElement('div');
    let destinationCanvas = document.createElement('canvas');
    let descriptionParagraph = document.createElement('p');
    
    $(descriptionParagraph).addClass("centered");

    descriptionParagraph.innerText = code;

    QRCode.toCanvas(destinationCanvas, code, {});

    destinationCanvasWrapper.appendChild(destinationCanvas);
    destinationCanvasWrapper.appendChild(descriptionParagraph);

    qrCodesWrapper.appendChild(destinationCanvasWrapper);
  });
}
