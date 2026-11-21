# Tsujigiri — The Kageura Crossing

A shared-screen murder mystery for two to four players. In a fictional Japanese post town in the autumn of 1752, the headman asks you to examine the death of the town copyist. The four-chapter investigation takes approximately 35–50 minutes, with time to discuss the exhibits together.

[Play on GitHub Pages](https://mycresta.github.io/tsujigiri/)

## At the table

Open the game on one screen. It starts at the Reed Inn, or resumes the team’s saved scene. Select a mark on the artwork to speak to a witness or inspect an object. On narrower screens, swipe or use the side controls to look around.

**Casebook** gathers unlocked evidence for comparison. **Notebook** saves shared observations, and **Make finding** records the team’s answer. Use the spoken narration control to hear objectives, witness dialogue, and story beats. Select **Listen** to replay a single line. Rain has its own switch. Hints are optional. The pause menu holds the field guide, replay, and appearance settings. The night palette follows the device by default.

Press **F** for browser fullscreen, **B** for the casebook, **N** for notes, or **Escape** to close a panel or open the pause menu.

## Run locally

From this directory, run `python3 -m http.server 8000` and open `http://localhost:8000/`. All game code, illustrations, and fonts are included. The site runs as static files and uses relative URLs for GitHub Pages project hosting.

## Publish updates

GitHub Pages serves the root of the `gh-pages` branch. After testing a change on `main`, run `git push origin main main:gh-pages` to update the source and the live game together.

## Credits

The story, map, evidence, interface, and woodblock-inspired illustrations were created for this game. The game includes historical background and links to references. Cormorant Garamond and DM Sans are distributed under the SIL Open Font License. The license texts are included in the fonts directory.

The English voice tracks were synthesized for this game with [Hexgrad’s Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M), an Apache-2.0-licensed model. The recorded clips play directly from GitHub Pages. Kokoro’s Japanese voice training credits include Television Nishinippon Corporation readings from the [Koniwa collection](https://github.com/koniwa/koniwa), licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). See the [model’s training credits](https://huggingface.co/hexgrad/Kokoro-82M#creative-commons-attribution).
