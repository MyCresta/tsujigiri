(() => {
  'use strict';

  const houses = [
    ['Lamp House', 'west', 0], ['Paper Loft', 'east', 0],
    ['Relay Office', 'west', 1], ['Indigo Yard', 'east', 1],
    ['Reed Inn', 'west', 2], ['Rice Store', 'east', 2]
  ];
  const roads = [
    [0, 1, 'Reed Ferry'], [2, 3, 'Red Bridge'], [4, 5, 'Willow Footway'],
    [0, 2], [2, 4], [1, 3], [3, 5]
  ];
  const routesByCase = new WeakMap();
  const connects = ([a, b], start, end) =>
    (a === start && b === end) || (b === start && a === end);

  window.mountRouteTool = function mountRouteTool(container, caseState = window) {
    if (!container || container.querySelector('.rt-tool')) return;
    if (!routesByCase.has(caseState)) routesByCase.set(caseState, []);
    const scratchRoute = routesByCase.get(caseState);
    const root = document.createElement('section');
    root.className = 'rt-tool';
    root.setAttribute('aria-label', 'Trace a route');
    root.innerHTML = `
      <p class="rt-instruction">Select a house to start. Select a house joined to it by one road to add a stretch. Use Undo to try a different turn.</p>
      <div class="rt-map" role="group" aria-label="Kageura road map">
        <img class="rt-print" src="assets/evidence/map.webp" width="1400" height="900" alt="Road plan with three river crossings. The table below lists the houses on each bank.">
        <div class="rt-banks" aria-hidden="true"><span>West bank</span><span>East bank</span></div>
      </div>
      <div class="rt-ledger">
        <div class="rt-reading" role="status" aria-live="polite" aria-atomic="true">
          <strong class="rt-count"></strong>
          <span class="rt-path"></span>
        </div>
        <div class="rt-actions"><button type="button" class="rt-undo">Undo</button><button type="button" class="rt-clear">Clear</button></div>
      </div>
      <p class="rt-use">Compare your trial route with the folded slip. When they agree, take the destination back to the drawer list.</p>`;
    container.append(root);
    const board = root.querySelector('.rt-map');
    const undo = root.querySelector('.rt-undo');
    const clear = root.querySelector('.rt-clear');
    const count = root.querySelector('.rt-count');
    const path = root.querySelector('.rt-path');
    const edges = roads.map(([a, , crossing]) => {
      const line = document.createElement('span');
      line.setAttribute('aria-hidden', 'true');
      const [, bank, row] = houses[a];
      line.className = 'rt-road rt-row-' + row + (crossing ? ' rt-across' : ' rt-along rt-' + bank);
      board.append(line);
      if (crossing) {
        const label = document.createElement('span');
        label.className = 'rt-crossing rt-row-' + row;
        label.textContent = crossing;
        label.setAttribute('aria-hidden', 'true');
        board.append(label);
      }
      return line;
    });

    const buttons = houses.map(([name, bank, row], index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'rt-node rt-' + bank + ' rt-row-' + row;
      button.setAttribute('aria-label', name);
      const label = document.createElement('span');
      label.textContent = name;
      button.append(label);
      board.append(button);
      button.addEventListener('click', () => {
        if (button.getAttribute('aria-disabled') === 'true') {
          const last = houses[scratchRoute.at(-1)][0];
          path.textContent = 'From ' + last + ', choose a house one road away, or undo your last move.';
          return;
        }
        scratchRoute.push(index);
        update();
      });
      return button;
    });

    function update() {
      const current = scratchRoute.at(-1);
      const steps = Math.max(scratchRoute.length - 1, 0);
      const traced = new Set();
      for (let i = 1; i < scratchRoute.length; i++) {
        traced.add(roads.findIndex(road => connects(road, scratchRoute[i - 1], scratchRoute[i])));
      }
      edges.forEach((line, i) => line.classList.toggle('rt-traced', traced.has(i)));
      buttons.forEach((button, index) => {
        const reachable = current === undefined || roads.some(road => connects(road, current, index));
        button.setAttribute('aria-disabled', String(!reachable));
        if (current === index) button.setAttribute('aria-current', 'location');
        else button.removeAttribute('aria-current');
        button.classList.toggle('rt-visited', scratchRoute.includes(index));
      });
      undo.disabled = clear.disabled = !scratchRoute.length;
      count.textContent = steps + (steps === 1 ? ' stretch' : ' stretches');
      path.textContent = scratchRoute.length ? scratchRoute.map(i => houses[i][0]).join(' → ') : 'No route traced.';
    }
    undo.addEventListener('click', () => { scratchRoute.pop(); update(); });
    clear.addEventListener('click', () => { scratchRoute.length = 0; update(); });
    update();
  };
})();
