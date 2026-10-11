/** Closest-position voicing of three pitch classes relative to the previous chord. */
export function voice(pcs: number[], prev: number[] | null): number[] {
  if (!prev) {
    const v = [pcs[0]];
    let x = pcs[1];
    while (x <= v[0]) x += 12;
    v.push(x);
    x = pcs[2];
    while (x <= v[1]) x += 12;
    v.push(x);
    return v;
  }
  let best: number[] | null = null;
  let bestCost = Infinity;
  for (const a of [pcs[0], pcs[0] + 12])
    for (const b of [pcs[1], pcs[1] + 12])
      for (const c of [pcs[2], pcs[2] + 12]) {
        const v = [a, b, c].sort((x, y) => x - y);
        if (v[2] - v[0] > 12 || v[2] > 22) continue;
        const cost = v.reduce((s, x, i) => s + Math.abs(x - prev[i]), 0);
        if (cost < bestCost) {
          bestCost = cost;
          best = v;
        }
      }
  return best ?? voice(pcs, null);
}
