import { useEffect, useMemo, useState } from "react";

const HEARTBEAT_STEPS = 5;
const HEARTBEAT_VISIBLE_STEPS = new Set([0, 2, 4]);

/**
 * @function useHeartbeatSequence
 * @description A custom React hook that creates a stateful value that cycles through a
 * list of options with a "heartbeat" animation effect. The value appears and
 * disappears at a set interval, creating a pulsing effect.
 *
 * @param {Array<string>} options - An array of strings to cycle through.
 * @param {string} [fallbackValue] - A default value to use if the options array is empty.
 * @returns {{value: string, visible: boolean, animate: boolean}} An object containing:
 * - `value`: The current string from the sequence.
 * - `visible`: A boolean indicating whether the value should be visible, used for the heartbeat effect.
 * - `animate`: A boolean indicating if the animation is active (i.e., if there are items to cycle through).
 */
export function useHeartbeatSequence(options, fallbackValue) {
  const sequence = useMemo(() => {
    if (options && options.length) {
      return options.filter(Boolean);
    }
    return fallbackValue ? [fallbackValue] : [];
  }, [options, fallbackValue]);

  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setIndex(0);
    setStep(0);
  }, [sequence]);

  useEffect(() => {
    if (!sequence.length) {
      return undefined;
    }
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % HEARTBEAT_STEPS);
    }, 300);
    return () => clearInterval(interval);
  }, [sequence.length]);

  useEffect(() => {
    if (!sequence.length) {
      return;
    }
    if (step === HEARTBEAT_STEPS - 1) {
      setIndex((prev) => (prev + 1) % sequence.length);
    }
  }, [step, sequence.length]);

  const visible = sequence.length ? HEARTBEAT_VISIBLE_STEPS.has(step) : true;
  const value = sequence.length ? sequence[index % sequence.length] : fallbackValue ?? "";
  const animate = sequence.length > 0;

  return { value, visible, animate };
}

export default useHeartbeatSequence;
