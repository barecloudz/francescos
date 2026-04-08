'use client';

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Utensils,
  Phone,
  Check,
  CheckCircle,
  Star,
  Package
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CateringFormData {
  eventType: string;
  customEventType?: string;
  serviceType: string;
  eventAddress?: string;
  eventDate?: string;
  eventTime?: string;
  specialDeliveryInstructions?: string;
  guestCount: string;
  customGuestCount?: number;
  viewPackages: string;
  selectedPackage?: string;
  menuStyle: string;
  dietaryRestrictions: string[];
  budgetRange: string;
  additionalServices: string[];
  specialRequests: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  preferredContact: string;
  bestTimeToCall: string;
}

/* ─── Shared style tokens ─── */
const darkCard = "bg-[#111111] border border-t-2 border-t-[#c0392b]" as const;
const cardBorder = "border-[rgba(192,57,43,0.2)]" as const;
const labelCls = "text-[#888888] text-xs tracking-widest uppercase" as const;
const inputCls =
  "bg-[#111] border-[rgba(192,57,43,0.3)] text-[#f5f0e8] placeholder:text-[#555] focus:border-[#c0392b] focus:ring-[#c0392b]" as const;
const primaryBtn =
  "rounded-none px-8 text-[#f5f0e8] font-semibold tracking-wide border-0" as const;
const primaryBtnStyle = {
  background: "linear-gradient(135deg, #7a1a14, #c0392b, #e74c3c, #c0392b, #7a1a14)",
} as const;
const outlineBtn =
  "rounded-none border border-[#c0392b] bg-transparent text-[#c0392b] hover:bg-[rgba(192,57,43,0.08)]" as const;

/* Unselected option button */
const optionBase =
  "border border-[rgba(192,57,43,0.2)] bg-[#111] transition-all hover:border-[#c0392b] hover:bg-[rgba(192,57,43,0.06)]" as const;
/* Selected option button */
const optionSelected =
  "border border-[#c0392b] bg-[rgba(192,57,43,0.08)]" as const;

const CateringContent = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<CateringFormData>({
    eventType: "",
    serviceType: "",
    guestCount: "",
    viewPackages: "",
    menuStyle: "",
    dietaryRestrictions: [],
    budgetRange: "",
    additionalServices: [],
    specialRequests: "",
    fullName: "",
    phoneNumber: "",
    email: "",
    preferredContact: "",
    bestTimeToCall: "",
  });

  const totalSteps = 6;
  const progressPercentage = (currentStep / totalSteps) * 100;
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentStep]);

  const eventTypeOptions = [
    { id: "corporate",   label: "Corporate Meeting/Lunch" },
    { id: "wedding",     label: "Wedding Reception" },
    { id: "birthday",    label: "Birthday Celebration" },
    { id: "family",      label: "Family Reunion" },
    { id: "holiday",     label: "Holiday Party" },
    { id: "graduation",  label: "Graduation Event" },
    { id: "memorial",    label: "Memorial Service" },
    { id: "community",   label: "Community Gathering" },
    { id: "other",       label: "Other" },
  ];

  const guestCountOptions = [
    { id: "10-25",   label: "10–25 people" },
    { id: "26-50",   label: "26–50 people" },
    { id: "51-100",  label: "51–100 people" },
    { id: "101-200", label: "101–200 people" },
    { id: "200+",    label: "200+ people" },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/catering-inquiry", formData);
      setIsSubmitted(true);
      toast({
        title: "Inquiry Submitted!",
        description: "We'll contact you within 24 hours to discuss your catering needs.",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof CateringFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === "eventType" && currentStep === 1 && value !== "other") {
      setTimeout(() => setCurrentStep(2), 500);
    } else if (field === "guestCount" && currentStep === 3 && value !== "200+") {
      setTimeout(() => setCurrentStep(4), 500);
    }
  };

  /* ── Success state ── */
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div
          className={`max-w-md w-full mx-auto text-center ${darkCard} ${cardBorder} p-10`}
        >
          <div className="mx-auto w-16 h-16 bg-[rgba(192,57,43,0.12)] flex items-center justify-center mb-6 border border-[#c0392b]">
            <Check className="w-8 h-8 text-[#c0392b]" />
          </div>
          <h2 className="font-playfair text-3xl text-[#f5f0e8] mb-4">Thank You!</h2>
          <p className="text-[#888888] mb-6">
            Your catering inquiry has been submitted. Our catering specialist will contact
            you within 24 hours to discuss your event details and provide a custom quote.
          </p>
          <div className="space-y-1 text-sm text-[#888888] mb-8">
            <p>We&apos;ll call you at {formData.phoneNumber}</p>
            <p>Confirmation email sent to {formData.email}</p>
            <p>Reference ID: CT-{Date.now()}</p>
          </div>
          <Button
            onClick={() => (window.location.href = "/")}
            className={primaryBtn}
            style={primaryBtnStyle}
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* ── Header ── */}
      <div className="border-b border-[rgba(192,57,43,0.2)] bg-[#0a0a0a]">
        <div className="container mx-auto px-4 py-8 pt-24 md:pt-20">
          <div className="text-center mb-8">
            <h1 className="font-playfair text-4xl text-[#f5f0e8] mb-2">Catering Services</h1>
            <p className="text-[#888888] text-xl">Let us make your next event delicious.</p>
            <div className="mt-4 inline-flex items-center gap-2 bg-[#111] border border-[rgba(192,57,43,0.4)] text-[#cccccc] px-4 py-2 text-sm font-medium">
              <Clock className="w-4 h-4 text-[#c0392b]" />
              Please submit catering orders at least 24 hours in advance
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#888888]">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-[#888888]">{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress
              value={progressPercentage}
              className="h-1 bg-[#222]"
              style={{ ["--progress-background" as string]: "#c0392b" }}
            />
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto scroll-mt-16" ref={cardRef}>

          {/* ─── Step 1: Event Type ─── */}
          {currentStep === 1 && (
            <div className={`${darkCard} ${cardBorder} p-8`}>
              <h2 className="font-playfair text-center text-2xl text-[#f5f0e8] flex items-center justify-center gap-2 mb-8">
                <Utensils className="w-6 h-6 text-[#c0392b]" />
                What type of event are you planning?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {eventTypeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => updateFormData("eventType", option.id)}
                    className={`p-6 transition-all text-left ${
                      formData.eventType === option.id ? optionSelected : optionBase
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-[#c0392b] text-2xl mb-3 leading-none">◆</div>
                      <div className="font-medium text-[#f5f0e8]">{option.label}</div>
                    </div>
                  </button>
                ))}
              </div>

              {formData.eventType === "other" && (
                <div className="mt-6">
                  <Label htmlFor="customEventType" className={labelCls}>
                    Please specify your event type
                  </Label>
                  <Input
                    id="customEventType"
                    value={formData.customEventType || ""}
                    onChange={(e) => updateFormData("customEventType", e.target.value)}
                    placeholder="Enter your event type..."
                    className={`mt-2 ${inputCls}`}
                  />
                </div>
              )}

              <div className="flex justify-end mt-8">
                <Button
                  onClick={handleNext}
                  disabled={!formData.eventType}
                  className={primaryBtn}
                  style={primaryBtnStyle}
                >
                  Next <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ─── Step 2: Service Type ─── */}
          {currentStep === 2 && (
            <div className={`${darkCard} ${cardBorder} p-8`}>
              <h2 className="font-playfair text-center text-2xl text-[#f5f0e8] flex items-center justify-center gap-2 mb-8">
                <MapPin className="w-6 h-6 text-[#c0392b]" />
                How would you like your catering delivered?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => updateFormData("serviceType", "pickup")}
                  className={`p-6 text-left transition-all ${
                    formData.serviceType === "pickup" ? optionSelected : optionBase
                  }`}
                >
                  <div className="text-[#c0392b] text-2xl mb-3 leading-none">◆</div>
                  <h3 className="font-semibold text-lg text-[#f5f0e8] mb-2">Pickup Catering</h3>
                  <p className="text-[#888888]">I&apos;ll collect the order from your location</p>
                </button>

                <button
                  onClick={() => updateFormData("serviceType", "delivery")}
                  className={`p-6 text-left transition-all ${
                    formData.serviceType === "delivery" ? optionSelected : optionBase
                  }`}
                >
                  <div className="text-[#c0392b] text-2xl mb-3 leading-none">◆</div>
                  <h3 className="font-semibold text-lg text-[#f5f0e8] mb-2">Delivery &amp; Setup</h3>
                  <p className="text-[#888888]">Deliver and set up at my event location</p>
                </button>
              </div>

              {formData.serviceType === "delivery" && (
                <div className="mt-8 p-6 bg-[#0d0d0d] border border-[rgba(192,57,43,0.15)]">
                  <h4 className="font-playfair text-[#f5f0e8] mb-4">Delivery Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="eventAddress" className={labelCls}>Event Address *</Label>
                      <Textarea
                        id="eventAddress"
                        value={formData.eventAddress || ""}
                        onChange={(e) => updateFormData("eventAddress", e.target.value)}
                        placeholder="Full event address..."
                        className={`mt-2 ${inputCls}`}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="eventDate" className={labelCls}>Event Date *</Label>
                        <Input
                          id="eventDate"
                          type="date"
                          value={formData.eventDate || ""}
                          onChange={(e) => updateFormData("eventDate", e.target.value)}
                          className={`mt-2 ${inputCls}`}
                        />
                      </div>
                      <div>
                        <Label htmlFor="eventTime" className={labelCls}>Event Time *</Label>
                        <Input
                          id="eventTime"
                          type="time"
                          value={formData.eventTime || ""}
                          onChange={(e) => updateFormData("eventTime", e.target.value)}
                          className={`mt-2 ${inputCls}`}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="deliveryInstructions" className={labelCls}>
                      Special Delivery Instructions
                    </Label>
                    <Textarea
                      id="deliveryInstructions"
                      value={formData.specialDeliveryInstructions || ""}
                      onChange={(e) => updateFormData("specialDeliveryInstructions", e.target.value)}
                      placeholder="Parking instructions, access codes, setup preferences..."
                      className={`mt-2 ${inputCls}`}
                      rows={2}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <Button className={outlineBtn} onClick={handleBack}>
                  <ChevronLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={
                    !formData.serviceType ||
                    (formData.serviceType === "delivery" &&
                      (!formData.eventAddress || !formData.eventDate || !formData.eventTime))
                  }
                  className={primaryBtn}
                  style={primaryBtnStyle}
                >
                  Next <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ─── Step 3: Guest Count ─── */}
          {currentStep === 3 && (
            <div className={`${darkCard} ${cardBorder} p-8`}>
              <h2 className="font-playfair text-center text-2xl text-[#f5f0e8] flex items-center justify-center gap-2 mb-8">
                <Users className="w-6 h-6 text-[#c0392b]" />
                How many people will you be serving?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {guestCountOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => updateFormData("guestCount", option.id)}
                    className={`p-6 transition-all ${
                      formData.guestCount === option.id ? optionSelected : optionBase
                    }`}
                  >
                    <div className="text-center">
                      <Users className="w-8 h-8 mx-auto mb-3 text-[#c0392b]" />
                      <div className="font-medium text-[#f5f0e8]">{option.label}</div>
                    </div>
                  </button>
                ))}
              </div>

              {formData.guestCount === "200+" && (
                <div className="mt-6">
                  <Label htmlFor="customGuestCount" className={labelCls}>
                    Please specify the number of guests
                  </Label>
                  <Input
                    id="customGuestCount"
                    type="number"
                    value={formData.customGuestCount || ""}
                    onChange={(e) => updateFormData("customGuestCount", parseInt(e.target.value))}
                    placeholder="Enter number of guests..."
                    className={`mt-2 ${inputCls}`}
                    min="201"
                  />
                </div>
              )}

              <div className="flex justify-between mt-8">
                <Button className={outlineBtn} onClick={handleBack}>
                  <ChevronLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!formData.guestCount}
                  className={primaryBtn}
                  style={primaryBtnStyle}
                >
                  Next <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ─── Step 4a: View Packages prompt ─── */}
          {currentStep === 4 && !formData.viewPackages && (
            <div className={`${darkCard} ${cardBorder} p-8`}>
              <h2 className="font-playfair text-center text-2xl text-[#f5f0e8] flex items-center justify-center gap-2 mb-2">
                <Package className="w-6 h-6 text-[#c0392b]" />
                Would you like to view our catering packages?
              </h2>
              <p className="text-center text-[#888888] mb-8">
                Based on serving{" "}
                {formData.guestCount === "200+"
                  ? `${formData.customGuestCount || "200+"}`
                  : formData.guestCount}{" "}
                people
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => updateFormData("viewPackages", "yes")}
                  className={`p-6 text-left transition-all ${optionBase}`}
                >
                  <div className="text-center">
                    <div className="text-[#c0392b] text-2xl mb-3 leading-none">◆</div>
                    <h3 className="font-semibold text-lg text-[#f5f0e8] mb-2">Yes, show me packages</h3>
                    <p className="text-[#888888] text-sm">
                      View our pre-designed catering packages with recommended items for your group size
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    updateFormData("viewPackages", "no");
                    setTimeout(() => setCurrentStep(5), 300);
                  }}
                  className={`p-6 text-left transition-all ${optionBase}`}
                >
                  <div className="text-center">
                    <div className="text-[#c0392b] text-2xl mb-3 leading-none">◆</div>
                    <h3 className="font-semibold text-lg text-[#f5f0e8] mb-2">No, I&apos;ll customize my order</h3>
                    <p className="text-[#888888] text-sm">Skip packages and tell us exactly what you need</p>
                  </div>
                </button>
              </div>

              <div className="flex justify-start mt-8">
                <Button className={outlineBtn} onClick={handleBack}>
                  <ChevronLeft className="mr-2 w-4 h-4" /> Back
                </Button>
              </div>
            </div>
          )}

          {/* ─── Step 4b: Package Selection ─── */}
          {currentStep === 4 && formData.viewPackages === "yes" && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="font-playfair text-3xl text-[#f5f0e8] mb-2">Choose Your Catering Package</h2>
                <p className="text-[#888888]">
                  Perfect for{" "}
                  {formData.guestCount === "200+"
                    ? `${formData.customGuestCount || "200+"}`
                    : formData.guestCount}{" "}
                  guests
                </p>
              </div>

              {/* Pizza Party Package */}
              <div
                className={`cursor-pointer transition-all ${
                  formData.selectedPackage === "pizza_party"
                    ? `bg-[#111] border-2 border-[#c0392b] border-t-[#c0392b]`
                    : `bg-[#111] border border-[rgba(192,57,43,0.2)] hover:border-[#c0392b]`
                }`}
                onClick={() => updateFormData("selectedPackage", "pizza_party")}
              >
                <div className="bg-[#0d0d0d] border-b border-[rgba(192,57,43,0.15)] px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs tracking-widest uppercase text-[#888888] border border-[rgba(192,57,43,0.3)] px-2 py-0.5 mb-2 inline-block">
                        Basic
                      </span>
                      <h3 className="font-playfair text-2xl text-[#f5f0e8]">Pizza Party Package</h3>
                      <p className="text-[#888888] mt-1">Classic pizza party favorites</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#888888] uppercase tracking-widest">Starting at</p>
                      <p className="text-3xl font-bold text-[#c0392b]">
                        ${formData.guestCount === "10-25" ? "150" :
                          formData.guestCount === "26-50" ? "275" :
                          formData.guestCount === "51-100" ? "500" :
                          formData.guestCount === "101-200" ? "950" : "1,800"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-[#f5f0e8] mb-2 flex items-center gap-2">
                        <span className="text-[#c0392b]">◆</span> What&apos;s Included:
                      </h4>
                      <ul className="space-y-1 text-sm text-[#cccccc]">
                        <li>Assorted NY Style Pizzas (Cheese, Pepperoni, Specialty)</li>
                        <li>Garden Salad (Half Tray)</li>
                        <li>French Fries (Half Tray)</li>
                        <li>Plates, napkins &amp; utensils</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#f5f0e8] mb-2 flex items-center gap-2">
                        <span className="text-[#c0392b]">◆</span> Serving Size:
                      </h4>
                      <ul className="space-y-1 text-sm text-[#cccccc]">
                        <li>10-25 guests: 4 Large Pizzas</li>
                        <li>26-50 guests: 8 Large Pizzas</li>
                        <li>51-100 guests: 15 Large Pizzas</li>
                        <li>100+ guests: Custom quantity</li>
                      </ul>
                    </div>
                  </div>
                  {formData.selectedPackage === "pizza_party" && (
                    <div className="mt-4 p-3 bg-[rgba(192,57,43,0.08)] border border-[#c0392b] text-center">
                      <CheckCircle className="w-5 h-5 text-[#c0392b] inline mr-2" />
                      <span className="text-[#f5f0e8] font-medium">Package Selected</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Italian Feast Package */}
              <div
                className={`cursor-pointer transition-all ${
                  formData.selectedPackage === "italian_feast"
                    ? `bg-[#111] border-2 border-[#c0392b]`
                    : `bg-[#111] border border-[rgba(192,57,43,0.2)] hover:border-[#c0392b]`
                }`}
                onClick={() => updateFormData("selectedPackage", "italian_feast")}
              >
                <div className="bg-[#0d0d0d] border-b border-[rgba(192,57,43,0.15)] px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs tracking-widest uppercase text-[#c0392b] border border-[#c0392b] px-2 py-0.5 mb-2 inline-block">
                        Most Popular
                      </span>
                      <h3 className="font-playfair text-2xl text-[#f5f0e8]">Italian Feast Package</h3>
                      <p className="text-[#888888] mt-1">A complete Italian dining experience</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#888888] uppercase tracking-widest">Starting at</p>
                      <p className="text-3xl font-bold text-[#c0392b]">
                        ${formData.guestCount === "10-25" ? "295" :
                          formData.guestCount === "26-50" ? "525" :
                          formData.guestCount === "51-100" ? "975" :
                          formData.guestCount === "101-200" ? "1,850" : "3,500"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-[#f5f0e8] mb-2 flex items-center gap-2">
                        <span className="text-[#c0392b]">◆</span> What&apos;s Included:
                      </h4>
                      <ul className="space-y-1 text-sm text-[#cccccc]">
                        <li>Assorted NY Style Pizzas</li>
                        <li>Choice of Pasta (Baked Ziti, Alla Vodka, or Primavera)</li>
                        <li>Wings or Mozzarella Sticks</li>
                        <li>Caesar Salad &amp; Garden Salad</li>
                        <li>Garlic Knots</li>
                        <li>Plates, napkins &amp; utensils</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#f5f0e8] mb-2 flex items-center gap-2">
                        <span className="text-[#c0392b]">◆</span> Popular Add-ons:
                      </h4>
                      <ul className="space-y-1 text-sm text-[#cccccc]">
                        <li>Fried Calamari (+$75-115)</li>
                        <li>Meatballs (+$70-115)</li>
                        <li>Chicken Parmigiana (+$75-130)</li>
                        <li>Antipasto Salad (+$75-115)</li>
                      </ul>
                    </div>
                  </div>
                  {formData.selectedPackage === "italian_feast" && (
                    <div className="mt-4 p-3 bg-[rgba(192,57,43,0.08)] border border-[#c0392b] text-center">
                      <CheckCircle className="w-5 h-5 text-[#c0392b] inline mr-2" />
                      <span className="text-[#f5f0e8] font-medium">Package Selected</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Premium Full Service Package */}
              <div
                className={`cursor-pointer transition-all ${
                  formData.selectedPackage === "full_service"
                    ? `bg-[#111] border-2 border-[#c0392b]`
                    : `bg-[#111] border border-[rgba(192,57,43,0.2)] hover:border-[#c0392b]`
                }`}
                onClick={() => updateFormData("selectedPackage", "full_service")}
              >
                <div className="bg-[#0d0d0d] border-b border-[rgba(192,57,43,0.15)] px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs tracking-widest uppercase text-[#888888] border border-[rgba(192,57,43,0.3)] px-2 py-0.5 mb-2 inline-block">
                        Premium
                      </span>
                      <h3 className="font-playfair text-2xl text-[#f5f0e8]">Full Service Package</h3>
                      <p className="text-[#888888] mt-1">The ultimate catering experience</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#888888] uppercase tracking-widest">Starting at</p>
                      <p className="text-3xl font-bold text-[#c0392b]">
                        ${formData.guestCount === "10-25" ? "495" :
                          formData.guestCount === "26-50" ? "895" :
                          formData.guestCount === "51-100" ? "1,650" :
                          formData.guestCount === "101-200" ? "3,100" : "5,800"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-[#f5f0e8] mb-2 flex items-center gap-2">
                        <span className="text-[#c0392b]">◆</span> What&apos;s Included:
                      </h4>
                      <ul className="space-y-1 text-sm text-[#cccccc]">
                        <li>Assorted NY Style Pizzas</li>
                        <li>Two Pasta Selections</li>
                        <li>Chicken Parmigiana or Marsala</li>
                        <li>Eggplant Parmigiana</li>
                        <li>Wings &amp; Fried Calamari</li>
                        <li>Meatballs</li>
                        <li>Caesar, Garden &amp; Antipasto Salads</li>
                        <li>Garlic Knots &amp; Bread</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#f5f0e8] mb-2 flex items-center gap-2">
                        <span className="text-[#c0392b]">◆</span> Premium Extras:
                      </h4>
                      <ul className="space-y-1 text-sm text-[#cccccc]">
                        <li>Sausage &amp; Peppers</li>
                        <li>Eggplant Rollatini</li>
                        <li>Dessert Tray</li>
                        <li>Premium plates &amp; serving ware</li>
                        <li>Dedicated catering coordinator</li>
                      </ul>
                    </div>
                  </div>
                  {formData.selectedPackage === "full_service" && (
                    <div className="mt-4 p-3 bg-[rgba(192,57,43,0.08)] border border-[#c0392b] text-center">
                      <CheckCircle className="w-5 h-5 text-[#c0392b] inline mr-2" />
                      <span className="text-[#f5f0e8] font-medium">Package Selected</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Build Your Own Package */}
              <div
                className={`cursor-pointer transition-all ${
                  formData.selectedPackage === "custom"
                    ? `bg-[#111] border-2 border-[#c0392b]`
                    : `bg-[#111] border border-[rgba(192,57,43,0.2)] hover:border-[#c0392b]`
                }`}
                onClick={() => updateFormData("selectedPackage", "custom")}
              >
                <div className="bg-[#0d0d0d] border-b border-[rgba(192,57,43,0.15)] px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs tracking-widest uppercase text-[#888888] border border-[rgba(192,57,43,0.3)] px-2 py-0.5 mb-2 inline-block">
                        Flexible
                      </span>
                      <h3 className="font-playfair text-2xl text-[#f5f0e8]">Build Your Own Package</h3>
                      <p className="text-[#888888] mt-1">Mix and match from our full catering menu</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#888888] uppercase tracking-widest">Price varies</p>
                      <p className="text-2xl font-bold text-[#c0392b]">Custom Quote</p>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4">
                  <p className="text-[#cccccc] mb-4">
                    Want something specific? Choose exactly what you need from our full catering menu:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                    {[
                      { label: "Appetizers" },
                      { label: "Pasta" },
                      { label: "Chicken" },
                      { label: "Eggplant" },
                      { label: "Salads" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="bg-[#0d0d0d] border border-[rgba(192,57,43,0.2)] p-2 text-center text-[#cccccc]"
                      >
                        <span className="block text-[#c0392b] text-base mb-1">◆</span>
                        {item.label}
                      </div>
                    ))}
                  </div>
                  {formData.selectedPackage === "custom" && (
                    <div className="mt-4 p-3 bg-[rgba(192,57,43,0.08)] border border-[#c0392b] text-center">
                      <CheckCircle className="w-5 h-5 text-[#c0392b] inline mr-2" />
                      <span className="text-[#f5f0e8] font-medium">We&apos;ll help you customize!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-6">
                <Button className={outlineBtn} onClick={() => updateFormData("viewPackages", "")}>
                  <ChevronLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!formData.selectedPackage}
                  className={primaryBtn}
                  style={primaryBtnStyle}
                >
                  Continue with{" "}
                  {formData.selectedPackage === "pizza_party"
                    ? "Pizza Party"
                    : formData.selectedPackage === "italian_feast"
                    ? "Italian Feast"
                    : formData.selectedPackage === "full_service"
                    ? "Full Service"
                    : formData.selectedPackage === "custom"
                    ? "Custom"
                    : "Package"}
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ─── Step 5: Additional Details ─── */}
          {currentStep === 5 && (
            <div className={`${darkCard} ${cardBorder} p-8`}>
              <h2 className="font-playfair text-center text-2xl text-[#f5f0e8] flex items-center justify-center gap-2 mb-8">
                <Star className="w-6 h-6 text-[#c0392b]" />
                Tell us more about your catering needs
              </h2>

              <div className="space-y-6">
                {/* Menu Style */}
                <div>
                  <Label htmlFor="menuStyle" className={labelCls}>Preferred Menu Style *</Label>
                  <Select
                    value={formData.menuStyle}
                    onValueChange={(value) => updateFormData("menuStyle", value)}
                  >
                    <SelectTrigger className={`mt-2 ${inputCls}`}>
                      <SelectValue placeholder="Select menu style..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border border-[rgba(192,57,43,0.3)] text-[#f5f0e8]">
                      <SelectItem value="buffet">Buffet Style</SelectItem>
                      <SelectItem value="plated">Plated Meals</SelectItem>
                      <SelectItem value="appetizers">Appetizers Only</SelectItem>
                      <SelectItem value="family-style">Family Style</SelectItem>
                      <SelectItem value="full-service">Full Service</SelectItem>
                      <SelectItem value="custom">Custom Menu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dietary Restrictions */}
                <div>
                  <Label className={labelCls}>Dietary Restrictions / Allergies</Label>
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["Vegetarian", "Vegan", "Gluten-free", "Nut allergies", "Dairy-free", "Kosher"].map(
                      (restriction) => (
                        <div key={restriction} className="flex items-center space-x-2">
                          <Checkbox
                            id={restriction}
                            checked={formData.dietaryRestrictions.includes(restriction)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateFormData("dietaryRestrictions", [
                                  ...formData.dietaryRestrictions,
                                  restriction,
                                ]);
                              } else {
                                updateFormData(
                                  "dietaryRestrictions",
                                  formData.dietaryRestrictions.filter((r) => r !== restriction)
                                );
                              }
                            }}
                            className="border-[rgba(192,57,43,0.4)] data-[state=checked]:bg-[#c0392b] data-[state=checked]:border-[#c0392b]"
                          />
                          <Label htmlFor={restriction} className="text-sm text-[#cccccc]">
                            {restriction}
                          </Label>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Budget Range */}
                <div>
                  <Label htmlFor="budgetRange" className={labelCls}>Budget Range</Label>
                  <Select
                    value={formData.budgetRange}
                    onValueChange={(value) => updateFormData("budgetRange", value)}
                  >
                    <SelectTrigger className={`mt-2 ${inputCls}`}>
                      <SelectValue placeholder="Select budget range..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border border-[rgba(192,57,43,0.3)] text-[#f5f0e8]">
                      <SelectItem value="under-500">Under $500</SelectItem>
                      <SelectItem value="500-1000">$500 – $1,000</SelectItem>
                      <SelectItem value="1000-2500">$1,000 – $2,500</SelectItem>
                      <SelectItem value="2500-5000">$2,500 – $5,000</SelectItem>
                      <SelectItem value="over-5000">Over $5,000</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Additional Services */}
                <div>
                  <Label className={labelCls}>Additional Services Needed</Label>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {["Tables & chairs", "Linens", "Serving staff", "Cleanup service", "Decorations", "Bar service"].map(
                      (service) => (
                        <div key={service} className="flex items-center space-x-2">
                          <Checkbox
                            id={service}
                            checked={formData.additionalServices.includes(service)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateFormData("additionalServices", [
                                  ...formData.additionalServices,
                                  service,
                                ]);
                              } else {
                                updateFormData(
                                  "additionalServices",
                                  formData.additionalServices.filter((s) => s !== service)
                                );
                              }
                            }}
                            className="border-[rgba(192,57,43,0.4)] data-[state=checked]:bg-[#c0392b] data-[state=checked]:border-[#c0392b]"
                          />
                          <Label htmlFor={service} className="text-sm text-[#cccccc]">
                            {service}
                          </Label>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <Label htmlFor="specialRequests" className={labelCls}>Special Requests</Label>
                  <Textarea
                    id="specialRequests"
                    value={formData.specialRequests}
                    onChange={(e) => updateFormData("specialRequests", e.target.value)}
                    placeholder="Any special menu items, themes, or other requirements..."
                    className={`mt-2 ${inputCls}`}
                    rows={4}
                  />
                </div>

                <div className="flex justify-between mt-8">
                  <Button className={outlineBtn} onClick={handleBack}>
                    <ChevronLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!formData.menuStyle}
                    className={primaryBtn}
                    style={primaryBtnStyle}
                  >
                    Next <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Step 6: Contact Information ─── */}
          {currentStep === 6 && (
            <div className={`${darkCard} ${cardBorder} p-8`}>
              <h2 className="font-playfair text-center text-2xl text-[#f5f0e8] flex items-center justify-center gap-2 mb-8">
                <Phone className="w-6 h-6 text-[#c0392b]" />
                How can we reach you about your catering inquiry?
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName" className={labelCls}>Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => updateFormData("fullName", e.target.value)}
                      placeholder="Your full name..."
                      className={`mt-2 ${inputCls}`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber" className={labelCls}>Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                      placeholder="(555) 123-4567"
                      className={`mt-2 ${inputCls}`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className={labelCls}>Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      placeholder="your@email.com"
                      className={`mt-2 ${inputCls}`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="preferredContact" className={labelCls}>Preferred Contact Method</Label>
                    <Select
                      value={formData.preferredContact}
                      onValueChange={(value) => updateFormData("preferredContact", value)}
                    >
                      <SelectTrigger className={`mt-2 ${inputCls}`}>
                        <SelectValue placeholder="Select preference..." />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111] border border-[rgba(192,57,43,0.3)] text-[#f5f0e8]">
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="text">Text Message</SelectItem>
                        <SelectItem value="any">Any Method</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="bestTimeToCall" className={labelCls}>Best Time to Call</Label>
                  <Select
                    value={formData.bestTimeToCall}
                    onValueChange={(value) => updateFormData("bestTimeToCall", value)}
                  >
                    <SelectTrigger className={`mt-2 ${inputCls}`}>
                      <SelectValue placeholder="Select best time..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border border-[rgba(192,57,43,0.3)] text-[#f5f0e8]">
                      <SelectItem value="morning">Morning (9AM – 12PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12PM – 5PM)</SelectItem>
                      <SelectItem value="evening">Evening (5PM – 8PM)</SelectItem>
                      <SelectItem value="anytime">Anytime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Order Summary */}
                <div className="p-6 bg-[#0d0d0d] border border-[rgba(192,57,43,0.15)]">
                  <h4 className="font-playfair text-[#f5f0e8] mb-4">Order Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#cccccc]">
                    <div>
                      <span className="text-[#888888] uppercase tracking-widest text-xs">Event Type: </span>
                      {formData.eventType === "other"
                        ? formData.customEventType
                        : eventTypeOptions.find((o) => o.id === formData.eventType)?.label}
                    </div>
                    <div>
                      <span className="text-[#888888] uppercase tracking-widest text-xs">Service: </span>
                      {formData.serviceType === "pickup" ? "Pickup" : "Delivery & Setup"}
                    </div>
                    <div>
                      <span className="text-[#888888] uppercase tracking-widest text-xs">Guests: </span>
                      {formData.guestCount === "200+"
                        ? `${formData.customGuestCount} people`
                        : guestCountOptions.find((o) => o.id === formData.guestCount)?.label}
                    </div>
                    <div>
                      <span className="text-[#888888] uppercase tracking-widest text-xs">Menu Style: </span>
                      {formData.menuStyle}
                    </div>
                    {formData.selectedPackage && (
                      <div>
                        <span className="text-[#888888] uppercase tracking-widest text-xs">Package: </span>
                        {formData.selectedPackage === "pizza_party"
                          ? "Pizza Party"
                          : formData.selectedPackage === "italian_feast"
                          ? "Italian Feast"
                          : formData.selectedPackage === "full_service"
                          ? "Full Service"
                          : formData.selectedPackage === "custom"
                          ? "Custom Package"
                          : formData.selectedPackage}
                      </div>
                    )}
                    {formData.eventDate && (
                      <div>
                        <span className="text-[#888888] uppercase tracking-widest text-xs">Event Date: </span>
                        {new Date(formData.eventDate).toLocaleDateString()}
                      </div>
                    )}
                    {formData.eventTime && (
                      <div>
                        <span className="text-[#888888] uppercase tracking-widest text-xs">Event Time: </span>
                        {formData.eventTime}
                      </div>
                    )}
                  </div>
                </div>

                {/* What happens next */}
                <div className="bg-[#0d0d0d] border border-[rgba(192,57,43,0.2)] p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#c0392b] mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-[#f5f0e8]">What happens next?</h4>
                      <p className="text-[#888888] text-sm mt-1">
                        Our catering specialist will contact you within 24 hours to discuss menu
                        options, finalize details, and provide a custom quote for your event.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button className={outlineBtn} onClick={handleBack}>
                    <ChevronLeft className="mr-2 w-4 h-4" /> Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      !formData.fullName || !formData.phoneNumber || !formData.email || isSubmitting
                    }
                    className={primaryBtn}
                    style={primaryBtnStyle}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                  </Button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CateringContent;
