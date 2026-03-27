import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Check, Phone, Tag, Sparkles, Gift } from "lucide-react";

const VipPage = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      toast({ title: "Please enter a valid 10-digit phone number.", variant: "destructive" });
      return;
    }
    if (!name.trim()) {
      toast({ title: "Please enter your name.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/sms-leads", { name: name.trim(), phone: digits });
      setIsSubmitted(true);
    } catch (err: any) {
      toast({ title: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const perks = [
    { icon: Tag, text: "Exclusive discounts just for members" },
    { icon: Gift, text: "Special offers on your birthday" },
    { icon: Sparkles, text: "Early access to new menu items" },
    { icon: Phone, text: "Be the first to know about events" },
  ];

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/hero-bg.jpeg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-65" />

      {/* Grain texture overlay for luxury feel */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 w-full max-w-md mx-auto px-5 py-10 flex flex-col items-center">
        {/* Logo */}
        <img
          src="/images/logo.png"
          alt="Francesco's Pizza & Pasta"
          className="w-28 md:w-36 mb-6 drop-shadow-lg"
        />

        {/* Gold rule */}
        <div className="flex items-center gap-3 mb-5 w-full">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#f2c94c] to-transparent opacity-60" />
          <span className="text-[#f2c94c] text-xs tracking-[0.25em] uppercase font-semibold font-sans whitespace-nowrap">
            VIP Insiders
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#f2c94c] to-transparent opacity-60" />
        </div>

        {!isSubmitted ? (
          <>
            {/* Headline */}
            <h1 className="font-display text-4xl md:text-5xl text-white font-bold text-center leading-tight mb-2">
              Get Exclusive<br />
              <span className="text-[#f2c94c]">Deals & Offers</span>
            </h1>
            <p className="text-gray-300 text-center text-sm md:text-base font-sans mt-2 mb-7 max-w-xs leading-relaxed">
              Join our VIP list and receive special discounts, surprise offers, and insider news straight to your phone.
            </p>

            {/* Perks */}
            <div className="grid grid-cols-2 gap-2.5 w-full mb-7">
              {perks.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-start gap-2 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-xl p-3 backdrop-blur-sm"
                >
                  <Icon className="w-4 h-4 text-[#f2c94c] shrink-0 mt-0.5" />
                  <span className="text-white text-xs font-sans leading-snug">{text}</span>
                </div>
              ))}
            </div>

            {/* Form Card */}
            <div className="w-full bg-white bg-opacity-[0.06] backdrop-blur-md border border-white border-opacity-[0.12] rounded-2xl p-6 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-gray-200 text-sm font-sans font-medium tracking-wide">
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="First & Last Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    className="bg-white bg-opacity-10 border-white border-opacity-20 text-white placeholder:text-gray-400 focus:border-[#f2c94c] focus:ring-[#f2c94c] h-12 text-base rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-gray-200 text-sm font-sans font-medium tracking-wide">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    placeholder="(843) 555-0000"
                    value={phone}
                    onChange={handlePhoneChange}
                    required
                    autoComplete="tel"
                    className="bg-white bg-opacity-10 border-white border-opacity-20 text-white placeholder:text-gray-400 focus:border-[#f2c94c] focus:ring-[#f2c94c] h-12 text-base rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-13 py-3.5 mt-1 rounded-xl bg-[#d73a31] hover:bg-[#c73128] active:bg-[#b52a22] text-white font-sans font-bold text-base tracking-wide transition-all duration-200 shadow-lg hover:shadow-red-900/40 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ minHeight: "52px" }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Signing you up...
                    </span>
                  ) : (
                    "JOIN THE VIP LIST"
                  )}
                </button>
              </form>

              {/* Consent */}
              <p className="text-gray-400 text-center text-[11px] font-sans mt-4 leading-relaxed">
                By submitting, you agree to receive SMS marketing messages from Francesco's Pizza & Pasta. Message &amp; data rates may apply. Reply STOP to unsubscribe at any time.
              </p>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="w-full flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-[#d73a31] flex items-center justify-center mb-6 shadow-lg shadow-red-900/50">
              <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-white font-bold mb-3">
              You're In!
            </h1>
            <p className="text-[#f2c94c] font-display text-xl md:text-2xl font-semibold mb-4">
              Welcome to the VIP List
            </p>
            <p className="text-gray-300 font-sans text-sm md:text-base max-w-xs leading-relaxed">
              Get ready for exclusive deals, special offers, and insider news delivered straight to your phone. We can't wait to treat you.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <div className="h-px w-12 bg-[#f2c94c] opacity-40" />
              <span className="text-[#f2c94c] text-xs tracking-widest uppercase font-sans">Francesco's Pizza &amp; Pasta</span>
              <div className="h-px w-12 bg-[#f2c94c] opacity-40" />
            </div>

            <a
              href="/"
              className="mt-8 inline-flex items-center gap-2 text-white font-sans text-sm font-medium border border-white border-opacity-20 rounded-full px-6 py-2.5 hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              View Our Menu
            </a>
          </div>
        )}

        {/* Footer */}
        <p className="text-gray-500 text-xs font-sans mt-8 text-center">
          © {new Date().getFullYear()} Francesco's Pizza &amp; Pasta · Murrells Inlet, SC
        </p>
      </div>
    </div>
  );
};

export default VipPage;
