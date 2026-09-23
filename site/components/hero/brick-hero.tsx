"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { BRICKS, WORD, brickColor } from "./bricks";
import type { BrickWorld, ChangeCause } from "./brick-world";
import { playClick } from "./click-sound";
import { usePrefersReducedMotion } from "./use-reduced-motion";

type Phase = "intact" | "broken" | "rebuilt" | "helped";

const total = BRICKS.length;

const loadWorld = () => import("./brick-world");
const loadMatter = () =>
  import("matter-js").then((mod) => (mod as unknown as { default?: typeof mod }).default ?? mod);

function Status({ phase, placed }: { phase: Phase; placed: number }) {
  switch (phase) {
    case "intact":
      return <>Alle {total} brikkene er på plass. Foreløpig.</>;
    case "broken":
      return (
        <>
          {placed} av {total} brikker på plass.
        </>
      );
    case "rebuilt":
      return (
        <>
          Alle {total} på plass, helt på egen hånd. Du virker som en det er fint å jobbe med.{" "}
          <a href="#jobb" className="font-semibold underline decoration-2 underline-offset-4">
            Si hei
          </a>
          .
        </>
      );
    case "helped":
      return <>Alle {total} på plass. Med litt hjelp, men jeg teller det.</>;
  }
}

export function BrickHero() {
  const reduced = usePrefersReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const pieceRefs = useRef<HTMLDivElement[]>([]);
  const worldRef = useRef<BrickWorld | null>(null);
  const loadingRef = useRef<Promise<BrickWorld | null> | null>(null);
  const pointerRef = useRef<{ id: number; x: number; y: number; piece: number } | null>(null);
  const soundRef = useRef(false);
  const helpedRef = useRef(false);

  const [phase, setPhase] = useState<Phase>("intact");
  const [placed, setPlaced] = useState(total);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);

  const onChange = useCallback((count: number, cause: ChangeCause) => {
    if (cause === "break") helpedRef.current = false;
    if (cause === "assist" || cause === "rebuild") helpedRef.current = true;
    setPlaced(count);
    setPhase((prev) => {
      if (count < total) return "broken";
      if (prev === "broken") return helpedRef.current ? "helped" : "rebuilt";
      return prev;
    });
  }, []);

  const ensureWorld = useCallback(() => {
    if (worldRef.current) return Promise.resolve(worldRef.current);
    loadingRef.current ??= Promise.all([loadMatter(), loadWorld()]).then(([M, { BrickWorld }]) => {
      loadingRef.current = null;
      const stage = stageRef.current;
      if (!stage) return null;
      worldRef.current = new BrickWorld(M, stage, pieceRefs.current, BRICKS, {
        onChange,
        onSnap: () => {
          if (soundRef.current) playClick();
        },
      });
      return worldRef.current;
    });
    return loadingRef.current;
  }, [onChange]);

  // Warm up the physics chunk once the page is idle, so the first grab feels instant.
  useEffect(() => {
    if (reduced) return;
    const warm = () => void Promise.all([loadMatter(), loadWorld()]);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(warm, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(warm, 1500);
    return () => clearTimeout(id);
  }, [reduced]);

  // A new width means new brick sizes: start over from the assembled logo.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let width = stage.clientWidth;
    const ro = new ResizeObserver(() => {
      if (Math.abs(stage.clientWidth - width) < 1) return;
      width = stage.clientWidth;
      if (!worldRef.current) return;
      worldRef.current.destroy();
      worldRef.current = null;
      setPlaced(total);
      setPhase("intact");
    });
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (reduced && worldRef.current) {
      worldRef.current.destroy();
      worldRef.current = null;
      setPlaced(total);
      setPhase("intact");
    }
  }, [reduced]);

  useEffect(() => () => worldRef.current?.destroy(), []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || (e.pointerType === "mouse" && e.button !== 0)) return;
    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-piece]");
    if (!el) return;
    e.preventDefault();
    const piece = Number(el.dataset.piece);
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY, piece };
    void ensureWorld().then((world) => {
      const p = pointerRef.current;
      if (!world || !p || p.id !== e.pointerId) return;
      world.grab(p.piece, e.clientX, e.clientY);
      world.move(p.x, p.y);
    });
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = pointerRef.current;
    if (!p || p.id !== e.pointerId) return;
    p.x = e.clientX;
    p.y = e.clientY;
    worldRef.current?.move(e.clientX, e.clientY);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerRef.current?.id !== e.pointerId) return;
    pointerRef.current = null;
    worldRef.current?.release();
  };

  const scramble = () => void ensureWorld().then((w) => w?.scramble());
  const rebuild = () => worldRef.current?.rebuild();
  const placeNext = () => worldRef.current?.placeNext();

  const complete = placed === total;

  return (
    <section id="topp" aria-labelledby="hero-title" className="mx-auto w-full max-w-[1200px] px-2 pt-3 sm:px-4 sm:pt-5">
      <p className="font-mono text-xs tracking-wide text-ink-soft uppercase sm:text-sm">
        Filip Johnsen · frontendutvikler i Oslo
      </p>

      <div className="studs mt-2 rounded-[20px] border-2 border-ink bg-paper-deep/60 px-1 pt-1 sm:mt-3">
        <div className="@container">
          <div
            ref={stageRef}
            className="brick-stage"
            role="img"
            aria-label={`Ordet FILIP, bygd av ${total} brikker`}
            style={{ "--cols": WORD.cols, "--rows": WORD.rows } as React.CSSProperties}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onPointerEnter={reduced ? undefined : () => void ensureWorld()}
          >
            {BRICKS.map((b, i) => (
              <div
                key={i}
                ref={(el) => {
                  if (el) pieceRefs.current[i] = el;
                }}
                data-piece={i}
                data-interactive={!reduced}
                className="brick-piece"
                style={
                  {
                    "--x": b.x,
                    "--y": b.y,
                    "--w": b.w,
                    "--h": b.h,
                    "--i": i,
                    "--brick-color": brickColor(b.color),
                  } as React.CSSProperties
                }
              >
                <div className="brick-face" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:mt-6 lg:grid-cols-12 lg:gap-4">
        <h1
          id="hero-title"
          className="font-display text-5xl leading-[0.95] font-extrabold tracking-tight text-balance sm:text-6xl lg:col-span-6 lg:text-7xl"
        >
          <span className="sr-only">Filip Johnsen: </span>
          {reduced ? "Ferdigbygd, for en gangs skyld." : "Værsågod, knus den."}
        </h1>

        <div className="lg:col-span-6">
          <p className="max-w-[60ch] text-lg leading-relaxed text-pretty text-ink-soft sm:text-xl">
            {reduced ? (
              <>
                Jeg er Filip, og jeg klarer ikke slutte å bygge ting. Navnet over er vanligvis
                en leke du kan knuse og bygge igjen, men du har bedt om mindre bevegelse. Så i
                dag får du den ferdig.
              </>
            ) : (
              <>
                Jeg er Filip, og jeg klarer ikke slutte å bygge ting. Navnet over er laget av{" "}
                {total} brikker. Dra dem løs, eller knus alt på én gang. Får du det sammen igjen,
                antar jeg at du er grei å jobbe med.
              </>
            )}
          </p>

          {!reduced && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={scramble}
                className="rounded-full border-2 border-ink bg-ink px-2.5 py-1 font-semibold text-paper shadow-brick transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-0"
              >
                {complete ? "Knus den" : "Knus igjen"}
              </button>
              <button
                type="button"
                onClick={placeNext}
                disabled={complete}
                className="rounded-full border-2 border-ink bg-paper px-2.5 py-1 font-semibold disabled:opacity-40"
              >
                Legg på én brikke
              </button>
              <button
                type="button"
                onClick={rebuild}
                disabled={complete}
                className="rounded-full border-2 border-ink bg-paper px-2.5 py-1 font-semibold disabled:opacity-40"
              >
                Bygg den igjen
              </button>
              <button
                type="button"
                aria-pressed={sound}
                onClick={() => setSound((s) => !s)}
                className="rounded-full px-1.5 py-1 font-mono text-sm text-ink-soft underline-offset-4 hover:underline"
              >
                Lyd: {sound ? "på" : "av"}
              </button>
            </div>
          )}

          <p aria-live="polite" className="mt-2 min-h-6 text-base text-ink-soft">
            <AnimatePresence mode="wait" initial={false}>
              <m.span
                key={phase}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="inline-block"
              >
                <Status phase={phase} placed={placed} />
              </m.span>
            </AnimatePresence>
          </p>

          <a
            href="#sett"
            className="mt-2 inline-block font-semibold underline decoration-tomato decoration-2 underline-offset-4"
          >
            Hopp til det gode ↓
          </a>
        </div>
      </div>
    </section>
  );
}
