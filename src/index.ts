import './style.css';
import { ACTUD } from "./ACTUD/ACTUD";
import { ACTUD2HTML } from './ACTUD/view/ACTUD.view';
import bwipjs from "bwip-js";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@popperjs/core/dist/cjs/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import { LineBreakTransformer } from './ACTUD/LineBreakTransformer';

"use strict";

/**
 * A panel which can be used to show a message while the code is being read.
 */
let actudWrapper = document.getElementById('actud') as HTMLDivElement;
let newActudWrapper = document.getElementById('new-actud') as HTMLDivElement;
let newActudQRWrapper = document.getElementById('new-actud-qr') as HTMLDivElement;
let errorWrapper = document.getElementById('error-wrapper') as HTMLDivElement;
let useSerialPortButton = document.getElementById("serialPortActivator") as HTMLButtonElement;

window.onload = async function () {

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

  if ("serial" in navigator) {

    navigator.serial.addEventListener("connect", (event) => {
      useSerialPortButton.disabled = false;
    });

    navigator.serial.addEventListener("disconnect", (event) => {
      useSerialPortButton.disabled = true;
    });

    let noSerialPortsFound = (await navigator.serial.getPorts()).length === 0;
    if (noSerialPortsFound) {
      alert("No serial ports found. Please connect a serial device and try again.");
      useSerialPortButton.disabled = noSerialPortsFound;
    }else{
      useSerialPortButton.disabled = false;
    }

  } else {
    useSerialPortButton.disabled = true;
    alert("Serial port is not supported in this browser or you're not accessing this app in a secure context (either localhost or HTTPS).");
  }


  useSerialPortButton.onclick = (async _ => {
    if ("serial" in navigator) {
      console.log("The Web Serial API is supported.");
      const port = await navigator.serial.requestPort();


      try {
        await port.open({ baudRate: 9600 });
      } catch (error) {
        alert("Could not open the selected serial port. Maybe it is already in use. See the console for more information.");
        console.error(error);
        return;
      }
      try {

        const textDecoder = new TextDecoderStream();
        port.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable.pipeThrough(new TransformStream(new LineBreakTransformer())).getReader();
        // Listen to data coming from the serial device.
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            // Allow the serial port to be closed later.
            reader.releaseLock();
            break;
          }
          try {

            let actud = loadQrCode(value, Date.now());
            actudWrapper.innerHTML = ACTUD2HTML(actud);

            if (actud && actud.body.BuyerVatNumber == undefined || actud?.body.BuyerVatNumber == "") {
              actud.body.BuyerVatNumber = "999999990";
            }
            if (actud && actud.body.Vat3 == undefined || actud?.body.Vat3 == 0) {
              actud.body.Vat3 = actud.body.TaxPayable.toString();
            }

            actud!.regenerateRaw();
            newActudWrapper.innerHTML = ACTUD2HTML(actud);

            let destinationCanvasWrapper = document.createElement('div');
            let destinationCanvas = document.createElement('canvas');
            bwipjs.toCanvas(destinationCanvas, { text: actud!.regeneratedInput, bcid: 'qrcode' });
            destinationCanvasWrapper.appendChild(destinationCanvas);
            newActudQRWrapper.textContent = '';
            newActudQRWrapper.appendChild(destinationCanvasWrapper);
          } catch (error) {
            errorWrapper.appendChild(document.createElement('p')).innerText = error.message;
            errorWrapper.appendChild(document.createElement('p')).innerHTML = `<pre>${value}</pre>`;
          }
        }
      } catch (error) {
        console.error(error);
      }


    } else console.warn("The Web Serial API is not supported.");
  });
};


function loadQrCode(input: string, start: number): ACTUD | null {
  input = input.replace("\x00", "");
  const actud = new ACTUD(input.trim(), {
    ignoreErrors: false
  });
  return actud;
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

