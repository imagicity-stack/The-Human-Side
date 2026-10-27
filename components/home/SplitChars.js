/* Splits a string into masked characters for GSAP to lift into place.
   Screen readers get the plain string from the parent's aria-label. */
export default function SplitChars({ text, className = "ch" }) {
  return text.split("").map((c, i) =>
    c === " " ? (
      <span className="sp" key={i} aria-hidden="true">{" "}</span>
    ) : (
      <span className={className} key={i} aria-hidden="true">
        <span>{c}</span>
      </span>
    )
  );
}
