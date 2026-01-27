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

  // Grand opening: March 11, 2026 at 11:00 AM EST
  const targetDate = new Date("2026-03-11T11:00:00-05:00").getTime();

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
      <div className="bg-black rounded-lg p-3 md:p-4 min-w-[60px] md:min-w-[80px]">
        <span className="text-3xl md:text-5xl font-bold text-[#d73a31] font-mono">
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs md:text-sm text-gray-300 mt-2 uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <section className="bg-black py-2 md:py-3">
      <div className="container mx-auto px-4">
        {/* Glossy red border wrapper */}
        <div
          className="p-[3px] rounded-xl"
          style={{
            background: "linear-gradient(135deg, #ff6b6b 0%, #d73a31 25%, #8b0000 50%, #d73a31 75%, #ff6b6b 100%)",
            boxShadow: "0 0 20px rgba(215, 58, 49, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
          }}
        >
          <div className="bg-black rounded-xl py-6 md:py-10 px-4">
            <div className="text-center">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
                GRAND OPENING
              </h2>
              <p className="text-[#f2c94c] text-lg md:text-xl mb-6">
                March 11, 2026
              </p>

              <div className="flex justify-center items-center gap-3 md:gap-6">
                <TimeBlock value={timeLeft.days} label="Days" />
                <span className="text-3xl md:text-5xl font-bold text-[#d73a31] mt-[-20px]">:</span>
                <TimeBlock value={timeLeft.hours} label="Hours" />
                <span className="text-3xl md:text-5xl font-bold text-[#d73a31] mt-[-20px]">:</span>
                <TimeBlock value={timeLeft.minutes} label="Minutes" />
                <span className="text-3xl md:text-5xl font-bold text-[#d73a31] mt-[-20px]">:</span>
                <TimeBlock value={timeLeft.seconds} label="Seconds" />
              </div>

              <p className="text-gray-400 mt-6 text-sm md:text-base">
                Be the first to taste authentic NY style pizza in Myrtle Beach!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GrandOpeningCountdown;
