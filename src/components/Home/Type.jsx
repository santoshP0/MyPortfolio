import React, { useMemo } from "react";
import Typewriter from "typewriter-effect";
import { TYPEWRITER_STRINGS } from "../../constants";

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
