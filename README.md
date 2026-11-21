# Tsujigiri — The Kageura Crossing

A shared-screen murder mystery for two to four players. In a fictional Japanese post town in the autumn of 1752, the headman asks you to examine the death of the town copyist. The four-chapter investigation takes approximately 35–50 minutes, with time to discuss the exhibits together.

[Play on GitHub Pages](https://mycresta.github.io/tsujigiri/)

## At the table

Open the game on one screen. At the Reed Inn, the headman explains why he needs you and gives you a first lead. Select **Start investigating** to enter the room. Returning players resume their saved scene. Select **Field guide** in any scene to read the opening story, learn how to play together, or revisit the current assignment.

Select a mark on the artwork to speak to a witness or inspect an object. Each exhibit explains **Why it matters** and **What to look for**. Read or listen through a witness’s final line to complete the interview. On narrower screens, swipe or use the side controls to look around.

Pin two exhibits in the **Casebook** to compare them. Use the **Notebook** for your group’s working theory. When you agree on what the evidence supports, select **Make finding**. You can revise your choices or ask for a hint.

Turn on spoken narration to hear objectives, individually voiced witnesses, and story passages. Select **Listen** to replay a line. The pause menu holds the rain and appearance controls. The night palette follows the device by default.

Press **F** for browser fullscreen, **B** for the casebook, **N** for notes, or **Escape** to close a panel or open the pause menu.

## Run locally

From this directory, run `python3 -m http.server 8000` and open `http://localhost:8000/`. All game code, illustrations, and fonts are included. The site runs as static files and uses relative URLs for GitHub Pages project hosting.

## Publish updates

GitHub Pages serves the root of the `gh-pages` branch. After testing a change on `main`, run `git push origin main main:gh-pages` to update the source and the live game together.

## Credits

The story, map, evidence, interface, and woodblock-inspired illustrations were created for this game. The game includes historical background and links to references. Cormorant Garamond and DM Sans are distributed under the SIL Open Font License. The license texts are included in the fonts directory.

The English voice tracks were synthesized for this game with [Hexgrad’s Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M), an Apache-2.0-licensed model. The recorded clips play directly from GitHub Pages. Kokoro’s Japanese voice training credits include Television Nishinippon Corporation readings from the [Koniwa collection](https://github.com/koniwa/koniwa), licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). See the [model’s training credits](https://huggingface.co/hexgrad/Kokoro-82M#creative-commons-attribution).
