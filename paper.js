(() => {
  'use strict';

  const seam = 350;
  const turns = [83, 149, 215];
  const scrap = { directions: ['OUT', 'IN', 'IN'], fibre: 1 };
  const maxGap = 98;
  let nextId = 0;
  const seals = {
    Willow: '<path d="M15 36 Q16 19 29 7 M19 24 Q12 16 7 19 M21 18 Q26 12 34 14 M24 13 Q21 7 16 9 M21 18 Q14 11 10 14 M18 26 Q24 20 31 21"/><path d="M8 18 Q7 27 4 28 M11 15 Q10 23 8 24 M16 9 Q16 15 14 18 M33 14 Q33 22 30 24 M30 21 Q29 28 26 30"/>',
    Shell: '<path d="M17 33 Q3 25 5 19 Q4 14 9 13 Q10 7 15 9 Q20 3 23 8 Q30 5 31 12 Q38 13 36 19 Q40 23 24 33 Z M17 33 L16 37 H26 L24 33 M20 31 9 15 M20 31 15 11 M21 31 22 10 M22 31 29 13 M23 31 34 18"/>',
    Crane: '<path d="M5 28 Q15 22 19 15 Q19 8 26 9 Q32 9 29 15 L27 19 Q30 23 35 20 Q34 29 23 27 L17 27 L10 33 Z"/><path d="M27 11 L39 12 L29 14 M14 27 Q22 24 24 18 M19 28 L18 35 M24 28 L24 36 M14 36 L19 35 M21 37 L25 36"/>',
    Fan: '<path d="M20 35 L3 17 Q18 -1 37 17 Z M20 33 L9 13 M20 33 14 10 M20 33 20 9 M20 33 26 10 M20 33 32 14 M7 20 Q20 7 33 20"/>'
  };

  // OUT is positive on the recovered left half and negative on the register's right half.
  // Shared small-scale fibres roughen matching contours identically along their length.
  function edgePoints(directions, left) {
    const points = [];
    for (let y = 33; y <= 265; y += 2) {
      const fringe = Math.sin(y * 1.57) * 1.05 + Math.sin(y * .39) * .63;
      let x = seam + fringe;
      turns.forEach((center, i) => {
        const profile = Math.max(0, 1 - Math.abs(y - center) / 30);
        const side = directions[i] === 'OUT' ? 1 : -1;
        x += (left ? side : -side) * profile * 32;
      });
      points.push([Number(x.toFixed(2)), y]);
    }
    return points;
  }

  function piecePath(points, left) {
    const outside = left
      ? 'L93 263 l-3 -47 1 -62 -1 -60 2 -59 42 -2 37 2 66 -3 55 2 Z'
      : 'L598 265 l12 -2 -1 -52 2 -67 -2 -58 1 -54 -65 2 -55 -2 -42 2 -57 -2 Z';
    return 'M' + points.map(p => p.join(' ')).join(' L') + ' ' + outside;
  }

  function paperFace(id, info, left) {
    const points = edgePoints(info.directions, left);
    const shape = piecePath(points, left);
    const x = left ? 114 : 583;
    const y = turns[info.fibre];
    const clip = id + (left ? '-left' : '-right');
    const emblem = left ? '' : '<g transform="translate(510 162) rotate(-7)">' +
      '<rect x="-3" y="-3" width="45" height="45" rx="3" fill="none" stroke="currentColor" stroke-width="2.5"/>' +
      '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8">' +
      seals[info.name] + '</g></g>';
    const outline = 'M' + points.map(p => p.join(' ')).join(' L');
    const face = '<g class="pt-face pt-' + (left ? 'scrap' : 'counter') + '">' +
      '<defs><clipPath id="' + clip + '"><path d="' + shape + '"/></clipPath></defs>' +
      '<path class="pt-sheet" d="' + shape + '" fill="' + (left ? '#e8dcba' : '#ddcda6') + '"/>' +
      '<g clip-path="url(#' + clip + ')"><rect x="83" y="30" width="545" height="245" fill="url(#' + id + '-fibres)"/>' +
      '<path d="M80 ' + (y + 3) + ' Q162 ' + (y - 6) + ' 227 ' + (y + 1) + ' T350 ' + y +
      ' T481 ' + (y + 2) + ' T621 ' + (y - 3) + '" fill="none" stroke="#355e70" stroke-width="3.3"/>' +
      '<path d="M80 ' + (y + 1) + ' Q162 ' + (y - 6) + ' 227 ' + (y + 1) + ' T350 ' + y +
      ' T481 ' + (y + 2) + ' T621 ' + (y - 3) + '" fill="none" stroke="#718c91" stroke-width=".8"/>' +
      '<g color="#994d3b" opacity=".82">' + emblem + '</g></g>' +
      '<ellipse cx="' + x + '" cy="55" rx="5.4" ry="6.1" fill="#37382f" stroke="#b9a780" stroke-width="2"/>' +
      '<path d="M' + (x - 4) + ' 52 l-2 -3 m9 5 3 -2" stroke="#877c61" fill="none"/></g>';
    // Redraw both edges on top so an overlap cannot conceal a mismatch.
    const trace = '<path class="pt-edge pt-' + (left ? 'scrap' : 'counter') + '" d="' + outline +
      '" fill="none" stroke="' + (left ? '#49463a' : '#855e42') + '" stroke-width="1.5"/>';
    return { face, trace };
  }

  function drawing(id, candidate) {
    const a = paperFace(id, scrap, true);
    const b = paperFace(id, candidate, false);
    return '<defs><pattern id="' + id + '-fibres" width="41" height="31" patternUnits="userSpaceOnUse">' +
      '<path d="m2 5 7 -1 m11 13 4 1 m5 -7 6 -2 m3 17 -4 0 m-27 -5 4 -1 m12 7 4 -1" fill="none" stroke="#867351" opacity=".35" stroke-width=".75"/>' +
      '<path d="m6 16 9 1 m11 -11 8 -1 m-18 21 9 1" fill="none" stroke="#fff8df" opacity=".65" stroke-width="1"/></pattern></defs>' +
      a.face + b.face + a.trace + b.trace;
  }

  window.mountPaperTool = function mountPaperTool(container) {
    if (!container || container.querySelector('.pt-tool')) return;
    const register = window.CASEFILE.acts.flatMap(act => act.items).find(item => item.id === 'counterfoils');
    if (!register) return;
    const candidates = register.table.rows.map(([name, edge, fibre]) => ({
      name, edge, directions: edge.split('·').map(s => s.trim()), fibre: /bottom/i.test(fibre) ? 2 : /top/i.test(fibre) ? 0 : 1
    }));
    const id = 'pt-' + ++nextId;
    container.innerHTML = '<section class="pt-tool" aria-labelledby="' + id + '-title">' +
      '<h3 id="' + id + '-title">Fit the torn paper</h3><p class="pt-help">Choose a counterfoil, the half kept by the pay desk. Drag the papers together or use the button. Look for a continuous edge and a blue fibre that runs across the join.</p>' +
      '<div class="pt-controls"><label>Counterfoil <select></select></label><button type="button" class="g-secondary pt-toggle">Bring edges together</button></div>' +
      '<div class="pt-tray"><svg viewBox="0 0 700 295" aria-hidden="true" focusable="false"></svg></div>' +
      '<div class="pt-labels" aria-hidden="true"><span>Recovered slip</span><span class="pt-desk-label"></span></div>' +
      '<p class="pt-status" aria-live="polite"></p>' +
      '<details class="pt-descriptions"><summary>Read the edge descriptions</summary><p>On the recovered slip the turns go out, in, then in, reading down from the knot hole. The blue fibre crosses the middle turn.</p><p class="pt-candidate"></p></details></section>';
    const select = container.querySelector('select');
    const svg = container.querySelector('svg');
    const button = container.querySelector('.pt-toggle');
    const status = container.querySelector('.pt-status');
    const caption = container.querySelector('.pt-candidate');
    candidates.forEach(({name}) => select.add(new Option(name, name)));
    let selected;
    let gap = maxGap;
    let drag = null;

    function position(value) {
      gap = Math.max(0, Math.min(maxGap, value));
      svg.style.setProperty('--pt-left', -gap / 2 + 'px');
      svg.style.setProperty('--pt-right', gap / 2 + 'px');
      button.textContent = gap < 1 ? 'Separate edges' : 'Bring edges together';
    }

    function describe() {
      const state = gap < 1 ? 'Edges together.' : gap === maxGap ? 'Papers apart.' : 'Papers partly separated.';
      status.textContent = 'Recovered slip and ' + selected.name + ' counterfoil. ' + state;
    }

    function display() {
      selected = candidates[select.selectedIndex];
      container.querySelector('.pt-desk-label').textContent = 'Pay desk · ' + selected.name;
      svg.innerHTML = drawing(id, selected);
      const which = ['top', 'middle', 'bottom'][selected.fibre];
      caption.textContent = selected.name + ' has the following turns from the top. ' + selected.directions.join(' · ').toLowerCase() + '. The blue fibre crosses the ' + which + ' turn.';
      position(gap);
      describe();
    }

    select.addEventListener('change', display);
    button.addEventListener('click', () => {
      position(gap < 1 ? maxGap : 0);
      describe();
    });
    svg.addEventListener('pointerdown', event => {
      if (event.button !== 0 || !event.target.closest('.pt-face, .pt-edge')) return;
      const sign = event.target.closest('.pt-scrap') ? -1 : 1;
      drag = { id: event.pointerId, start: event.clientX, gap, sign };
      svg.setPointerCapture(event.pointerId);
      svg.classList.add('pt-dragging');
    });
    svg.addEventListener('pointermove', event => {
      if (!drag || event.pointerId !== drag.id) return;
      const scale = 700 / svg.getBoundingClientRect().width;
      position(drag.gap + (event.clientX - drag.start) * scale * 2 * drag.sign);
    });
    function release(event) {
      if (!drag || event.pointerId !== drag.id) return;
      drag = null;
      svg.classList.remove('pt-dragging');
      if (gap < 5) position(0);
      describe();
    }
    svg.addEventListener('pointerup', release);
    svg.addEventListener('lostpointercapture', release);
    display();
  };
})();
