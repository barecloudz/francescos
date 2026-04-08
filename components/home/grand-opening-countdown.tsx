"use client";

import React, { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const GrandOpeningCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  const targetDate = new Date("2026-04-15T09:00:00-05:00").getTime();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference <= 0) { setIsExpired(true); return; }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) return null;

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div
        style={{
          background: '#111111',
          border: '1px solid rgba(192,57,43,0.3)',
          borderTop: '2px solid #c0392b',
          padding: '1rem 1.5rem',
          minWidth: '72px',
          textAlign: 'center',
        }}
      >
        <span
          className="font-playfair font-bold"
          style={{ fontSize: '2.25rem', color: '#f5f0e8', lineHeight: 1 }}
        >
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span
        style={{
          fontSize: '0.6rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#888888',
          marginTop: '0.5rem',
        }}
      >
        {label}
      </span>
    </div>
  );

  return (
    <section
      style={{
        background: '#0a0a0a',
        borderTop: '1px solid rgba(192,57,43,0.2)',
        borderBottom: '1px solid rgba(192,57,43,0.2)',
        padding: '3rem 1rem',
      }}
    >
      <div className="container mx-auto px-4 text-center">
        <p className="section-eyebrow mb-0">Now Open</p>
        <div className="section-divider"></div>
        <h2
          className="font-playfair font-bold"
          style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: '#f5f0e8', marginBottom: '0.5rem' }}
        >
          Grand Opening
        </h2>
        <p
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: '#c0392b',
            marginBottom: '2.5rem',
          }}
        >
          April 15, 2026
        </p>

        <div className="flex justify-center items-start gap-4 md:gap-6">
          <TimeBlock value={timeLeft.days} label="Days" />
          <span className="font-playfair text-3xl text-[#c0392b] mt-3">·</span>
          <TimeBlock value={timeLeft.hours} label="Hours" />
          <span className="font-playfair text-3xl text-[#c0392b] mt-3">·</span>
          <TimeBlock value={timeLeft.minutes} label="Minutes" />
          <span className="font-playfair text-3xl text-[#c0392b] mt-3">·</span>
          <TimeBlock value={timeLeft.seconds} label="Seconds" />
        </div>

        <p
          style={{
            marginTop: '2.5rem',
            fontSize: '0.7rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#555555',
          }}
        >
          Be the first to taste authentic NY style pizza in Murrells Inlet
        </p>
      </div>
    </section>
  );
};

export default GrandOpeningCountdown;
