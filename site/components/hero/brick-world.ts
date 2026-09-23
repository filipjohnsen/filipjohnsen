import type MatterNS from "matter-js";
import { WORD, type BrickSpec } from "./bricks";

type Matter = typeof MatterNS;
type Point = { x: number; y: number };

export type ChangeCause = "drag" | "assist" | "rebuild" | "break";

type Tween = {
  from: Point & { a: number };
  to: Point & { a: number };
  start: number;
  duration: number;
  cause: ChangeCause;
};

type Piece = {
  spec: BrickSpec;
  el: HTMLElement;
  body: MatterNS.Body;
  home: number;
  slot: number | null;
  tween: Tween | null;
};

type Slot = Point & { w: number; h: number; occupant: number | null };

type Options = {
  onChange: (placed: number, cause: ChangeCause) => void;
  onSnap: () => void;
};

const STEP = 1000 / 60;
const MAX_UNIT = 52;

const easeOutBack = (t: number) => {
  const c1 = 1.7;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
};

/** Stage size in brick units: must match `.brick-stage` in globals.css. */
export function stageMetrics(width: number) {
  const u = Math.min(MAX_UNIT, width / 17);
  return { u, width, height: u * 7.5 };
}

/**
 * Owns the Matter.js world for the hero. Pieces are regular DOM elements
 * laid out by CSS at their home slot; the world only writes a transform
 * (offset from home + rotation) while something is moving.
 */
export class BrickWorld {
  private engine: MatterNS.Engine;
  private pieces: Piece[];
  private slots: Slot[];
  private u: number;
  private width: number;
  private height: number;
  private drag: { piece: number; constraint: MatterNS.Constraint; rect: DOMRect } | null = null;
  private frame = 0;
  private last = 0;
  private acc = 0;

  constructor(
    private M: Matter,
    private stage: HTMLElement,
    elements: HTMLElement[],
    specs: BrickSpec[],
    private opts: Options,
  ) {
    const { u, width, height } = stageMetrics(stage.clientWidth);
    this.u = u;
    this.width = width;
    this.height = height;

    const left = width / 2 - (WORD.cols / 2) * u;
    this.slots = specs.map((s) => ({
      x: left + (s.x + s.w / 2) * u,
      y: u + (s.y + s.h / 2) * u,
      w: s.w,
      h: s.h,
      occupant: null,
    }));

    this.engine = M.Engine.create({ enableSleeping: true, positionIterations: 8 });

    this.pieces = specs.map((spec, i) => {
      const slot = this.slots[i];
      const body = M.Bodies.rectangle(slot.x, slot.y, spec.w * u * 0.93, spec.h * u * 0.93, {
        chamfer: { radius: u * 0.1 },
        friction: 0.5,
        frictionStatic: 1,
        restitution: 0.12,
        density: 0.002,
      });
      // Create dynamic first so Matter remembers the real mass for when it is released.
      M.Body.setStatic(body, true);
      slot.occupant = i;
      return { spec, el: elements[i], body, home: i, slot: i, tween: null };
    });

    const t = 200;
    const walls = [
      M.Bodies.rectangle(width / 2, height + t / 2, width * 3, t, { isStatic: true }),
      M.Bodies.rectangle(width / 2, -t / 2, width * 3, t, { isStatic: true }),
      M.Bodies.rectangle(-t / 2, height / 2, t, height * 3, { isStatic: true }),
      M.Bodies.rectangle(width + t / 2, height / 2, t, height * 3, { isStatic: true }),
    ];

    M.Composite.add(this.engine.world, [...this.pieces.map((p) => p.body), ...walls]);
  }

  get total() {
    return this.pieces.length;
  }

  get placed() {
    return this.pieces.filter((p) => p.slot !== null && !p.tween).length;
  }

  toLocal(clientX: number, clientY: number, rect = this.stage.getBoundingClientRect()): Point {
    return {
      x: Math.min(Math.max(clientX - rect.left, 0), this.width),
      y: Math.min(Math.max(clientY - rect.top, 0), this.height),
    };
  }

  grab(index: number, clientX: number, clientY: number) {
    const { M } = this;
    this.release();
    const piece = this.pieces[index];
    const rect = this.stage.getBoundingClientRect();
    const p = this.toLocal(clientX, clientY, rect);

    const wasPlaced = piece.slot !== null && !piece.tween;
    this.free(piece);
    if (wasPlaced) this.opts.onChange(this.placed, "drag");
    this.wakeAll();

    const { body } = piece;
    const constraint = M.Constraint.create({
      pointA: p,
      bodyB: body,
      pointB: { x: p.x - body.position.x, y: p.y - body.position.y },
      stiffness: 0.2,
      damping: 0.08,
      length: 0,
    });
    M.Composite.add(this.engine.world, constraint);
    this.drag = { piece: index, constraint, rect };
    piece.el.dataset.grabbed = "true";
    this.start();
  }

  move(clientX: number, clientY: number) {
    if (!this.drag) return;
    this.drag.constraint.pointA = this.toLocal(clientX, clientY, this.drag.rect);
    this.M.Sleeping.set(this.pieces[this.drag.piece].body, false);
  }

  release() {
    if (!this.drag) return;
    const { M } = this;
    const piece = this.pieces[this.drag.piece];
    M.Composite.remove(this.engine.world, this.drag.constraint);
    delete piece.el.dataset.grabbed;
    const index = this.drag.piece;
    this.drag = null;

    const v = piece.body.velocity;
    const speed = Math.hypot(v.x, v.y);
    const max = this.u * 0.5;
    if (speed > max) M.Body.setVelocity(piece.body, { x: (v.x / speed) * max, y: (v.y / speed) * max });

    this.trySnap(index);
    this.start();
  }

  /** Break everything loose with a little burst from the middle. */
  scramble() {
    const { M, u } = this;
    this.release();
    const k = u / MAX_UNIT;
    for (const piece of this.pieces) {
      this.free(piece);
      const fromCenter = (piece.body.position.x - this.width / 2) / this.width;
      M.Body.setVelocity(piece.body, {
        x: (fromCenter * 16 + (Math.random() - 0.5) * 6) * k,
        y: -(4 + Math.random() * 9) * k,
      });
      M.Body.setAngularVelocity(piece.body, (Math.random() - 0.5) * 0.35);
    }
    this.wakeAll();
    this.opts.onChange(0, "break");
    this.start();
  }

  /** Send every piece back to its own slot, one after another. */
  rebuild() {
    this.release();
    for (const slot of this.slots) slot.occupant = null;
    for (const piece of this.pieces) {
      piece.slot = null;
      piece.tween = null;
    }
    this.pieces.forEach((piece, i) => this.tweenTo(i, piece.home, i * 35, 480, "rebuild"));
    this.start();
  }

  /** Put one loose piece into the first empty slot. Returns false if nothing fits. */
  placeNext() {
    for (let s = 0; s < this.slots.length; s++) {
      const slot = this.slots[s];
      if (slot.occupant !== null) continue;
      const loose = (i: number) => {
        const p = this.pieces[i];
        return p.slot === null && this.drag?.piece !== i;
      };
      let candidate = loose(s) ? s : -1;
      if (candidate < 0) {
        candidate = this.pieces.findIndex((p, i) => loose(i) && this.fits(p.spec, slot) !== null);
      }
      if (candidate < 0) continue;
      this.tweenTo(candidate, s, 0, 420, "assist");
      this.start();
      return true;
    }
    return false;
  }

  destroy() {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    for (const p of this.pieces) {
      p.el.style.transform = "";
      delete p.el.dataset.grabbed;
    }
    this.M.Engine.clear(this.engine);
  }

  private free(piece: Piece) {
    if (piece.tween) piece.tween = null;
    if (piece.slot !== null) {
      this.slots[piece.slot].occupant = null;
      piece.slot = null;
    }
    if (piece.body.isStatic) this.M.Body.setStatic(piece.body, false);
  }

  private wakeAll() {
    for (const p of this.pieces) this.M.Sleeping.set(p.body, false);
  }

  /** Returns the angle offset needed to fit a piece in a slot, or null. */
  private fits(spec: BrickSpec, slot: Slot): number | null {
    if (spec.w === slot.w && spec.h === slot.h) return 0;
    if (spec.w === slot.h && spec.h === slot.w) return Math.PI / 2;
    return null;
  }

  private trySnap(index: number) {
    const piece = this.pieces[index];
    const { position } = piece.body;
    let best = -1;
    let bestDist = this.u * 0.75;
    this.slots.forEach((slot, s) => {
      if (slot.occupant !== null || this.fits(piece.spec, slot) === null) return;
      const d = Math.hypot(slot.x - position.x, slot.y - position.y);
      if (d < bestDist) {
        best = s;
        bestDist = d;
      }
    });
    if (best >= 0) this.tweenTo(index, best, 0, 220, "drag");
  }

  private tweenTo(index: number, s: number, delay: number, duration: number, cause: ChangeCause) {
    const piece = this.pieces[index];
    const slot = this.slots[s];
    const offset = this.fits(piece.spec, slot) ?? 0;
    const square = piece.spec.w === piece.spec.h;
    const step = square ? Math.PI / 2 : Math.PI;
    const { position, angle } = piece.body;
    const toA = Math.round((angle - offset) / step) * step + offset;

    if (piece.slot !== null) this.slots[piece.slot].occupant = null;
    piece.slot = s;
    slot.occupant = index;
    if (!piece.body.isStatic) this.M.Body.setStatic(piece.body, true);
    piece.tween = {
      from: { x: position.x, y: position.y, a: angle },
      to: { x: slot.x, y: slot.y, a: toA },
      start: performance.now() + delay,
      duration,
      cause,
    };
  }

  private start() {
    if (this.frame) return;
    this.last = performance.now();
    this.acc = 0;
    this.frame = requestAnimationFrame(this.tick);
  }

  private tick = (now: number) => {
    const { M } = this;
    this.acc += Math.min(now - this.last, 100);
    this.last = now;

    let tweening = false;
    for (const piece of this.pieces) {
      const tw = piece.tween;
      if (!tw) continue;
      tweening = true;
      const t = Math.min(Math.max((now - tw.start) / tw.duration, 0), 1);
      const e = easeOutBack(t);
      M.Body.setPosition(piece.body, {
        x: tw.from.x + (tw.to.x - tw.from.x) * e,
        y: tw.from.y + (tw.to.y - tw.from.y) * e,
      });
      M.Body.setAngle(piece.body, tw.from.a + (tw.to.a - tw.from.a) * e);
      if (t >= 1) {
        piece.tween = null;
        this.opts.onSnap();
        this.opts.onChange(this.placed, tw.cause);
      }
    }

    let steps = 0;
    while (this.acc >= STEP && steps < 4) {
      M.Engine.update(this.engine, STEP);
      this.acc -= STEP;
      steps++;
    }
    if (steps === 4) this.acc = 0;

    this.render();

    const settled = this.pieces.every((p) => p.body.isStatic || p.body.isSleeping);
    if (!this.drag && !tweening && settled) {
      this.frame = 0;
      return;
    }
    this.frame = requestAnimationFrame(this.tick);
  };

  private render() {
    for (const piece of this.pieces) {
      const home = this.slots[piece.home];
      const { position, angle } = piece.body;
      const dx = position.x - home.x;
      const dy = position.y - home.y;
      piece.el.style.transform =
        Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01 && Math.abs(angle) < 0.0001
          ? ""
          : `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) rotate(${angle.toFixed(4)}rad)`;
    }
  }
}
