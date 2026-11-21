# Tsujigiri — The Kageura Crossing

A shared-screen murder mystery for two to four players. In a fictional Japanese post town in the autumn of 1752, the headman asks you to examine the death of the town copyist. The four-chapter investigation takes approximately 35–50 minutes, with time to discuss the exhibits together.

[Play on GitHub Pages](https://mycresta.github.io/tsujigiri/)

## At the table

Open the case on one screen and choose **Begin investigation**. The field guide explains how to share the reading, take notes, and submit findings. Hints are optional. Progress and the shared notebook save in the current browser.

## Run locally

From this directory, run `python3 -m http.server 8000` and open `http://localhost:8000/`. All game code, illustrations, and fonts are included. The site runs as static files and uses relative URLs for GitHub Pages project hosting.

## Publish updates

GitHub Pages serves the root of the `gh-pages` branch. After testing a change on `main`, run `git push origin main main:gh-pages` to update the source and the live game together.

## Credits

The story, map, evidence, interface, and woodblock-inspired illustrations were created for this game. The game includes historical background and links to references. Cormorant Garamond, DM Sans, and the Noto Serif JP title glyphs are distributed under the SIL Open Font License. The license texts are included in the fonts directory.
