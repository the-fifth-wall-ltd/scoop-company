'use client';

import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";
import { TICKETS_SOLD_OUT, BOOKING_COMING_SOON } from "@/lib/inventory";

export function HeroSection() {
  const scrollToTickets = () => {
    document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF5F0] via-[#FFE8F0] to-[#FFD5E5]">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#C41E3A] blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-[#F8AFC8] blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-[#F38DB5] blur-2xl"></div>
      </div>

      {/* Floating decorative icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-24 left-[10%] text-4xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>🎄</div>
        <div className="absolute top-32 right-[15%] text-3xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>🍦</div>
        <div className="absolute bottom-32 left-[20%] text-3xl animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}>❄️</div>
        <div className="absolute top-1/3 right-[8%] text-2xl animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4s' }}>⛄</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center md:text-left space-y-6 relative z-20 order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1F1B24] rounded-full border-2 border-[#1F1B24]">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-semibold">{BOOKING_COMING_SOON ? 'NEW DATES COMING SOON' : TICKETS_SOLD_OUT ? 'SOLD OUT' : 'Limited Seats Available'}</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl" style={{ fontWeight: 800, lineHeight: '1.1', color: '#1F1B24' }}>
              Scoop & Sleigh 🎬🍦
            </h1>

            <p className="text-xl md:text-2xl max-w-xl" style={{ color: '#1F1B24', lineHeight: '1.6' }}>
              Family movie nights just got delicious. Choose your ticket and join us for festive films, desserts & good vibes.
            </p>

            {/* Ticket CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={(TICKETS_SOLD_OUT || BOOKING_COMING_SOON) ? undefined : scrollToTickets}
                disabled={TICKETS_SOLD_OUT || BOOKING_COMING_SOON}
                className="w-full sm:w-auto text-base px-6 py-6 rounded-full shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: '#F8AFC8', color: '#1F1B24', fontWeight: 600 }}
              >
                🎟️ Kids — £12 <span className="ml-2 opacity-80">{BOOKING_COMING_SOON ? 'Coming Soon' : TICKETS_SOLD_OUT ? 'Sold Out' : 'Any dessert + any drink'}</span>
              </Button>

              <Button
                onClick={(TICKETS_SOLD_OUT || BOOKING_COMING_SOON) ? undefined : scrollToTickets}
                disabled={TICKETS_SOLD_OUT || BOOKING_COMING_SOON}
                className="w-full sm:w-auto text-base px-6 py-6 rounded-full shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: '#F38DB5', color: 'white', fontWeight: 600 }}
              >
                🎟️ Adults — £12 <span className="ml-2 opacity-90">{BOOKING_COMING_SOON ? 'Coming Soon' : TICKETS_SOLD_OUT ? 'Sold Out' : 'Any dessert + any drink'}</span>
              </Button>
            </div>
          </div>

          {/* Right content - Image */}
          <div className="relative z-10 order-2 md:order-none">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <img
                src="/images/header-image.jpg"
                alt="Pink gelato cone"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>

            {/* Decorative elements around image */}
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-[#C41E3A] opacity-80 blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-[#F38DB5] opacity-80 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
