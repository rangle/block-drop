import { ImageDictionary } from './interfaces';
import { loadImages, createDrawContext } from './initialization';
import { programConfigDict } from './configuration';
import { drawLoop } from './render';

main();

function main() {
  try {
    const imageDict: ImageDictionary = {};
    loadImages(imageDict)
      .then(() => {
        const context = createDrawContext(programConfigDict, imageDict);
        drawLoop(context);
      })
      .catch((e: Error) => {
        throw e;
      });
  } catch (err) {
    console.log(err);
    window.document.body.appendChild(error(err.message));
  }
}

function error(message: string) {
  const err = window.document.createElement('div');
  err.innerHTML = message;

  return err;
}

// Returns a random integer from 0 to range - 1.
// function randomInt(range: number) {
//   return Math.floor(Math.random() * range);
// }
