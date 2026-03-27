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

  // Grand opening: April 15, 2026 at 9:00 AM EST
  const targetDate = new Date("2026-04-15T09:00:00-05:00").getTime();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setIsExpired(true);
        return;
      }

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

  if (isExpired) {
    return null;
  }

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div
        className="bg-black border-2 border-red-900 rounded p-2 md:p-3 min-w-[50px] md:min-w-[70px]"
        style={{
          boxShadow: "inset 0 0 20px rgba(220, 38, 38, 0.3)"
        }}
      >
        <span
          className="text-3xl md:text-5xl font-bold font-mono"
          style={{
            color: "#ff0000",
            textShadow: "0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #cc0000"
          }}
        >
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] md:text-xs text-red-400 mt-1 uppercase tracking-widest font-bold">{label}</span>
    </div>
  );

  return (
    <section className="bg-black py-6 md:py-8 border-y-4 border-red-600">
      {/* Pulsing red glow animation */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 30px rgba(220, 38, 38, 0.6), inset 0 0 30px rgba(220, 38, 38, 0.1); }
          50% { box-shadow: 0 0 50px rgba(220, 38, 38, 0.9), inset 0 0 40px rgba(220, 38, 38, 0.2); }
        }
        @keyframes text-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2
            className="text-2xl md:text-4xl font-black text-white mb-1 uppercase tracking-wider"
            style={{
              textShadow: "0 0 10px rgba(255,255,255,0.5)",
              animation: "text-pulse 2s ease-in-out infinite"
            }}
          >
            Grand Opening
          </h2>
          <p className="text-red-500 text-base md:text-lg mb-4 font-bold tracking-wide">
            APRIL 15, 2026
          </p>

          {/* Urgent countdown display */}
          <div className="flex justify-center">
            <div
              className="rounded-lg p-1 inline-block"
              style={{
                background: "linear-gradient(180deg, #7f1d1d 0%, #450a0a 50%, #7f1d1d 100%)",
                animation: "pulse-glow 2s ease-in-out infinite"
              }}
            >
              <div className="bg-black rounded-md py-4 md:py-5 px-3 md:px-6">
                <div className="flex justify-center items-center gap-1 md:gap-3">
                  <TimeBlock value={timeLeft.days} label="Days" />
                  <span
                    className="text-2xl md:text-4xl font-bold mt-[-16px]"
                    style={{ color: "#ff0000", textShadow: "0 0 10px #ff0000" }}
                  >:</span>
                  <TimeBlock value={timeLeft.hours} label="Hours" />
                  <span
                    className="text-2xl md:text-4xl font-bold mt-[-16px]"
                    style={{ color: "#ff0000", textShadow: "0 0 10px #ff0000" }}
                  >:</span>
                  <TimeBlock value={timeLeft.minutes} label="Mins" />
                  <span
                    className="text-2xl md:text-4xl font-bold mt-[-16px]"
                    style={{ color: "#ff0000", textShadow: "0 0 10px #ff0000" }}
                  >:</span>
                  <TimeBlock value={timeLeft.seconds} label="Secs" />
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-400 mt-4 text-xs md:text-sm uppercase tracking-wider">
            Be the first to taste authentic NY style pizza in Murrells Inlet
          </p>
        </div>
      </div>
    </section>
  );
};

export default GrandOpeningCountdown;
