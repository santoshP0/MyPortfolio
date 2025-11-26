import React, { useMemo } from "react";
import Typewriter from "typewriter-effect";
import { TYPEWRITER_STRINGS } from "../../constants";

/**
 * @component
 * @description Renders a "typewriter" effect component that cycles through a series of predefined strings.
 * It utilizes the `typewriter-effect` library to create an engaging, animated text effect.
 * The strings for the typewriter are sourced from the `TYPEWRITER_STRINGS` constant.
 * The animation is configured to auto-start and loop continuously.
 * @returns {JSX.Element} The `Typewriter` component with the specified options.
 */
function Type() {
  const typewriterOptions = useMemo(
    () => ({
      strings: TYPEWRITER_STRINGS,
      autoStart: true,
      loop: true,
      deleteSpeed: 50,
    }),
    []
  );

  return (
    <Typewriter options={typewriterOptions} />
  );
}

export default Type;
