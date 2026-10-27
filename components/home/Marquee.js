"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

const wrap = (min, max, v) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/* A band that drifts on its own and speeds up (or reverses) with the
   velocity of the page scroll. */
function Row({ items, baseVelocity, outline }) {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * f;
    baseX.set(baseX.get() + move);
  });

  return (
    <div className={`hm-mq__row${outline ? " is-outline" : ""}`}>
      <motion.div className="hm-mq__track" style={{ x }}>
        {[0, 1, 2, 3].map((pass) => (
          <span className="hm-mq__set" key={pass}>
            {items.map((word) => (
              <span className="hm-mq__item" key={`${pass}-${word}`}>
                {word}
                <img src="/assets/logo-icon.png" alt="" />
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="hm-mq" aria-hidden="true">
      <Row items={["Empathy", "Dignity", "Small acts that add up", "Show up"]} baseVelocity={-2.2} />
      <Row items={["Women’s empowerment", "Safe spaces", "Environment", "Community"]} baseVelocity={2.2} outline />
    </div>
  );
}
