"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Loader2, AlertCircle } from "lucide-react";

interface FAQItem {
  id?: number;
  question: string;
  answer: string;
  display_order?: number;
  is_active?: boolean;
}

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Fetch FAQs from API - public endpoint, no auth required
  const { data: faqData = [], isLoading, error } = useQuery<FAQItem[]>({
    queryKey: ["/api/faqs"],
    queryFn: async () => {
      const response = await fetch('/api/faqs', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to fetch FAQs');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Generate FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      {/* FAQ Schema for Voice Search & SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section
        id="faq"
        className="py-20"
        style={{
          background: 'rgba(192, 57, 43, 0.03)',
          borderTop: '1px solid rgba(192,57,43,0.15)',
          borderBottom: '1px solid rgba(192,57,43,0.15)',
        }}
      >
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="text-center mb-14">
            <p className="section-eyebrow">Have Questions?</p>
            <div className="section-divider"></div>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#f5f0e8]">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-[#888888] text-sm font-light max-w-2xl mx-auto leading-relaxed">
              Got questions about our pizza, delivery, or rewards? We've got answers.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-[#c0392b]" />
                <span className="ml-3 text-[#888888] text-sm font-light">Loading FAQs...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex items-center justify-center py-12 text-[#c0392b]">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="text-sm">Unable to load FAQs. Please try again later.</span>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && faqData.length === 0 && (
              <div className="text-center py-12 text-[#888888]">
                <p className="text-sm font-light">No FAQs available at the moment.</p>
              </div>
            )}

            {/* FAQs List */}
            {!isLoading && !error && faqData.length > 0 && (
              <div className="space-y-0">
                {faqData.map((faq, index) => (
                  <div
                    key={faq.id || index}
                    style={{
                      borderBottom: '1px solid rgba(192,57,43,0.15)',
                    }}
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex justify-between items-center py-5 px-0 text-left transition-colors"
                      aria-expanded={openIndex === index}
                      aria-controls={`faq-answer-${index}`}
                    >
                      <h3 className="font-playfair text-lg font-semibold text-[#f5f0e8] pr-6 leading-snug">
                        {faq.question}
                      </h3>
                      {openIndex === index ? (
                        <ChevronUp className="w-5 h-5 text-[#c0392b] flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#888888] flex-shrink-0" />
                      )}
                    </button>

                    {openIndex === index && (
                      <div
                        id={`faq-answer-${index}`}
                        className="pb-5"
                      >
                        <p className="text-[#888888] text-sm font-light leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-center mt-14">
            <p className="text-[#888888] text-sm font-light mb-5">
              Have more questions? Give us a call.
            </p>
            <a
              href="tel:+18432992700"
              className="inline-block px-8 py-3 text-xs font-bold tracking-widest uppercase text-[#f5f0e8] transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #7a1a14, #c0392b, #e74c3c, #c0392b, #7a1a14)' }}
            >
              Call (843) 299-2700
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQSection;
