'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HazardCard {
  id: string;
  title: string;
  image: string;
  dos: string[];
  donts: string[];
}

const CAROUSEL_CARDS: HazardCard[] = [
  {
    id: 'upi',
    title: 'UPI Fraud',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
    dos: [
      'Verify beneficiary name before entering transaction details.',
      'Remember: UPI PIN is required ONLY to send money, NEVER to receive.',
      'Check transaction status directly inside official banking app.'
    ],
    donts: [
      'Never enter your UPI PIN upon receiving SMS or collect requests.',
      'Never scan QR codes sent by unknown buyers on OLX or social media.'
    ]
  },
  {
    id: 'digital_arrest',
    title: 'Digital Arrest',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
    dos: [
      'Understand Indian Police/CBI NEVER arrest anyone over Skype/WhatsApp.',
      'Verify suspicious calls at your nearest local police station.',
      'Report coercive video calls to 1930 Helpline immediately.'
    ],
    donts: [
      'Never transfer money to "clearance accounts" or "RBI verification accounts".',
      'Never isolate yourself or stay on video call under threats.'
    ]
  },
  {
    id: 'kyc',
    title: 'KYC Scam',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=600&q=80',
    dos: [
      'Perform KYC updates only at official bank branches or verified apps.',
      'Cross-check SMS warnings regarding account block with official helpline.',
      'Report suspicious SMS links to 1930 Cyber Cell immediately.'
    ],
    donts: [
      'Never click links in SMS claiming "Your YONO / SBI account is blocked".',
      'Never download unknown .APK files (e.g. sbi-update.apk) sent via WhatsApp.'
    ]
  },
  {
    id: 'investment',
    title: 'Investment Scam',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80',
    dos: [
      'Verify SEBI registration status of stock brokers and advisors.',
      'Invest only through recognized stock exchanges (NSE/BSE).',
      'Conduct independent research before depositing money.'
    ],
    donts: [
      'Never trust promises of guaranteed 300%-500% returns in short periods.',
      'Never deposit money into personal bank accounts for stock trading.'
    ]
  },
  {
    id: 'qr',
    title: 'QR Code Scam',
    image: 'https://images.unsplash.com/photo-1595079672139-cee25825daf3?auto=format&fit=crop&w=600&q=80',
    dos: [
      'Remember scanning QR codes is required ONLY to pay money.',
      'Verify merchant name on app screen after scanning.',
      'Refuse QR code payment demands from unknown online buyers.'
    ],
    donts: [
      'Never scan QR codes to receive advance payments or refunds.',
      'Never enter UPI PIN after scanning a QR code sent by a buyer.'
    ]
  },
  {
    id: 'otp',
    title: 'OTP Fraud',
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=600&q=80',
    dos: [
      'Keep One-Time Passwords (OTP) strictly confidential.',
      'Read the full SMS text before entering any OTP to verify amount.',
      'Report suspicious OTP requests to bank customer care.'
    ],
    donts: [
      'Never share OTP with anyone over phone call, SMS, or WhatsApp.',
      'Never read out OTP to caller claiming to be bank executive.'
    ]
  }
];

export default function DosAndDonts() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto sliding every 4 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CAROUSEL_CARDS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + CAROUSEL_CARDS.length) % CAROUSEL_CARDS.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) handleNext();
    if (diff < -50) handlePrev();
    touchStartX.current = null;
  };

  // Get 4 visible cards for desktop viewport
  const visibleCards = [];
  for (let i = 0; i < 4; i++) {
    const cardIndex = (currentIndex + i) % CAROUSEL_CARDS.length;
    visibleCards.push(CAROUSEL_CARDS[cardIndex]);
  }

  return (
    <section id="dos-donts" className="py-12 bg-slate-50 border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Heading (NDMA Government Blue Heading Style) */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900 tracking-tight">
          Do's & Don'ts
        </h2>

        {/* Carousel Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Card Grid (4 equal height cards on desktop matching Screenshot 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {visibleCards.map((card, idx) => (
              <div
                key={`${card.id}-${idx}`}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-md"
              >
                {/* Top Image + Gradient Title Strip (Screenshot 2 Match) */}
                <div className="relative h-44 w-full bg-slate-800 shrink-0">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                  <div className="absolute bottom-3 left-0 right-0 text-center px-3">
                    <h3 className="text-base font-extrabold text-white tracking-wide shadow-sm">
                      {card.title}
                    </h3>
                  </div>
                </div>

                {/* White Body Panel (Screenshot 2 Green Check / Red Cross Match) */}
                <div className="p-4 space-y-3 flex-grow flex flex-col justify-between text-xs">
                  
                  {/* DO'S List */}
                  <div className="space-y-2.5">
                    {card.dos.map((item, dIdx) => (
                      <div key={dIdx} className="flex items-start space-x-2 text-slate-800 leading-snug">
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span className="font-normal">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Dotted Separator (Screenshot 2 Match) */}
                  <div className="border-t border-dashed border-slate-300 my-2" />

                  {/* DON'TS List */}
                  <div className="space-y-2.5">
                    {card.donts.map((item, dnIdx) => (
                      <div key={dnIdx} className="flex items-start space-x-2 text-slate-800 leading-snug">
                        <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                          ✕
                        </span>
                        <span className="font-normal">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Right: View More + Link (Screenshot 2 Match) */}
                  <div className="pt-2 text-right">
                    <a
                      href="#resources"
                      className="text-xs font-bold text-slate-900 hover:text-blue-700 transition-colors"
                    >
                      View More +
                    </a>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Bottom Center Carousel Navigation Circular Arrows (Screenshot 2 Match) */}
          <div className="flex items-center justify-center space-x-3 pt-6">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center shadow-sm transition-colors"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center shadow-sm transition-colors"
              aria-label="Next Slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
