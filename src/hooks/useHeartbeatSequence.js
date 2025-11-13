import { useEffect, useMemo, useState } from "react";

const HEARTBEAT_STEPS = 5;
const HEARTBEAT_VISIBLE_STEPS = new Set([0, 2, 4]);

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
