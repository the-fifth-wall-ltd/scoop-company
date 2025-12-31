import { kv } from '@vercel/kv';

// Event night configuration type
export interface EventNight {
  key: string;
  displayName: string;
  value: string;
  movie: string;
  date: string; // ISO format: '2025-12-20T17:00:00'
  adultOnly?: boolean;
}

// Event nights configuration
export const EVENT_NIGHTS: readonly EventNight[] = [
  {
    key: '11-nov',
    displayName: '🏙️ Tue 11 Nov - Home Alone 2 - 5:00PM',
    value: 'Tuesday 11 Nov — 5:00pm',
    movie: 'Home Alone 2',
    date: '2025-11-11T17:00:00'
  },
  {
    key: '18-nov',
    displayName: '💚 Tue 18 Nov - Grinch - 5:00PM',
    value: 'Tuesday 18 Nov — 5:00pm',
    movie: 'Grinch',
    date: '2025-11-18T17:00:00'
  },
  {
    key: '19-nov',
    displayName: '🎁 Wed 19 Nov - Arthur Christmas - 5:00PM',
    value: 'Wednesday 19 Nov — 5:00pm',
    movie: 'Arthur Christmas',
    date: '2025-11-19T17:00:00'
  },
  {
    key: '26-nov',
    displayName: '🎄 Wed 26 Nov - The Holiday - 6:30PM - ADULTS ONLY',
    value: 'Wednesday 26 Nov — 6:30pm arrival (6:45pm start)',
    movie: 'The Holiday',
    date: '2025-11-26T18:30:00',
    adultOnly: true
  },
  {
    key: '27-nov',
    displayName: '🧝‍♂️ Thu 27 Nov - Elf - 6:30PM - ADULTS ONLY',
    value: 'Thursday 27 Nov — 6:30pm arrival (6:45pm start)',
    movie: 'Elf',
    date: '2025-11-27T18:30:00',
    adultOnly: true
  },
  {
    key: '5-dec',
    displayName: '🎅 Fri 5 Dec - Christmas Chronicles - 5:45PM',
    value: 'Friday 5 Dec — 5:45pm',
    movie: 'Christmas Chronicles',
    date: '2025-12-05T17:45:00'
  },
  {
    key: '12-dec',
    displayName: '🧣 Fri 12 Dec - The Santa Clause - 5:45PM',
    value: 'Friday 12 Dec — 5:45pm',
    movie: 'The Santa Clause',
    date: '2025-12-12T17:45:00'
  },
  {
    key: '16-dec',
    displayName: '💚 Tue 16 Dec - Cartoon Grinch - 5:00PM',
    value: 'Tuesday 16 Dec — 5:00pm',
    movie: 'Cartoon Grinch',
    date: '2025-12-16T17:00:00'
  },
  {
    key: '18-dec',
    displayName: '🏠 Thu 18 Dec - Home Alone - 5:00PM',
    value: 'Thursday 18 Dec — 5:00pm',
    movie: 'Home Alone',
    date: '2025-12-18T17:00:00'
  },
  {
    key: '20-dec',
    displayName: '🧝‍♂️ Sat 20 Dec - Elf - 5:45PM',
    value: 'Saturday 20 Dec — 5:45pm',
    movie: 'Elf',
    date: '2025-12-20T17:45:00'
  },
  {
    key: '21-dec',
    displayName: '🏠 Sun 21 Dec - Home Alone - 5:45PM',
    value: 'Sunday 21 Dec — 5:45pm',
    movie: 'Home Alone',
    date: '2025-12-21T17:45:00'
  },
  {
    key: '22-dec',
    displayName: '🏙️ Mon 22 Dec - Home Alone 2 - 5:00PM',
    value: 'Monday 22 Dec — 5:00pm',
    movie: 'Home Alone 2',
    date: '2025-12-22T17:00:00'
  },
  {
    key: '23-dec',
    displayName: '🚂 Tue 23 Dec - Polar Express - 5:00PM',
    value: 'Tuesday 23 Dec — 5:00pm',
    movie: 'Polar Express',
    date: '2025-12-23T17:00:00'
  },
  {
    key: '2-jan',
    displayName: '⭐ Fri 2 Jan - FAN FAVOURITE - (SEE IG TO VOTE) - 5:20PM',
    value: 'Friday 2 Jan — 5:00pm arrival (5:20pm start)',
    movie: 'FAN FAVOURITE - (SEE IG TO VOTE)',
    date: '2026-01-02T17:00:00'
  },
];

export const MAX_KID_TICKETS = 20;
export const MAX_ADULT_TICKETS = 15;
export const RESERVATION_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

// Global sold out flag - set to true to disable all ticket sales
export const TICKETS_SOLD_OUT = false;

// Flag to hide booking while planning new dates - shows "Coming Soon" message
export const BOOKING_COMING_SOON = true;

// Global sold out flag for Yule Logs - set to true to disable all Yule Log orders
export const YULE_LOGS_SOLD_OUT = true;

// Types
export interface InventoryData {
  kid_tickets_sold: number;
  adult_tickets_sold: number;
}

export interface ReservationData {
  kidTickets: number;
  adultTickets: number;
  nightKey: string;
  createdAt: number;
  sessionId: string;
}

export interface Availability {
  nightKey: string;
  displayName: string;
  value: string;
  kidTicketsRemaining: number;
  adultTicketsRemaining: number;
  isSoldOut: boolean;
  adultOnly?: boolean;
}

// Helper to get night key from display value
export function getNightKeyFromValue(value: string): string | null {
  const night = EVENT_NIGHTS.find(n => n.value === value);
  return night ? night.key : null;
}

// Helper to get upcoming event nights (filters out past events and same-day events after 3pm)
export function getUpcomingEventNights(): EventNight[] {
  const now = new Date();
  return EVENT_NIGHTS.filter(night => {
    const eventDate = new Date(night.date);

    // If event has already started, exclude it
    if (eventDate <= now) return false;

    // If same day and past 3pm, exclude it (to avoid last-minute booking chaos)
    const isSameDay = eventDate.toDateString() === now.toDateString();
    const isPast3pm = now.getHours() >= 15;

    if (isSameDay && isPast3pm) return false;

    return true;
  });
}

// Helper to get night display info from key
export function getNightFromKey(key: string) {
  return EVENT_NIGHTS.find(n => n.key === key);
}

// Get current inventory for a specific night
export async function getInventory(nightKey: string): Promise<InventoryData> {
  const key = `inventory:${nightKey}`;
  const data = await kv.get<InventoryData>(key);

  if (!data) {
    // If not found, return zero (uninitialized)
    return {
      kid_tickets_sold: 0,
      adult_tickets_sold: 0,
    };
  }

  return data;
}

// Get availability for a specific night
export async function getAvailability(nightKey: string): Promise<Availability> {
  const nightInfo = getNightFromKey(nightKey);
  if (!nightInfo) {
    throw new Error(`Invalid night key: ${nightKey}`);
  }

  const inventory = await getInventory(nightKey);

  // Get active reservations for this night
  const reservations = await getActiveReservations(nightKey);
  const reservedKids = reservations.reduce((sum, r) => sum + r.kidTickets, 0);
  const reservedAdults = reservations.reduce((sum, r) => sum + r.adultTickets, 0);

  const kidTicketsRemaining = MAX_KID_TICKETS - inventory.kid_tickets_sold - reservedKids;
  const adultTicketsRemaining = MAX_ADULT_TICKETS - inventory.adult_tickets_sold - reservedAdults;

  return {
    nightKey,
    displayName: nightInfo.displayName,
    value: nightInfo.value,
    kidTicketsRemaining: Math.max(0, kidTicketsRemaining),
    adultTicketsRemaining: Math.max(0, adultTicketsRemaining),
    isSoldOut: nightInfo.adultOnly ? adultTicketsRemaining <= 0 : kidTicketsRemaining <= 0,
    adultOnly: nightInfo.adultOnly,
  };
}

// Get availability for all upcoming nights (filters out past events)
export async function getAllAvailability(): Promise<Availability[]> {
  const upcomingNights = getUpcomingEventNights();
  const availabilities = await Promise.all(
    upcomingNights.map(night => getAvailability(night.key))
  );
  return availabilities;
}

// Get active reservations for a night
async function getActiveReservations(nightKey: string): Promise<ReservationData[]> {
  const pattern = `reservation:*:${nightKey}`;
  const keys = await kv.keys(pattern);

  const now = Date.now();
  const activeReservations: ReservationData[] = [];

  for (const key of keys) {
    const reservation = await kv.get<ReservationData>(key);
    if (reservation && (now - reservation.createdAt) < RESERVATION_TIMEOUT_MS) {
      activeReservations.push(reservation);
    }
  }

  return activeReservations;
}

// Reserve tickets (called before Stripe checkout)
export async function reserveTickets(
  nightKey: string,
  kidTickets: number,
  adultTickets: number,
  sessionId: string
): Promise<{ success: boolean; error?: string }> {
  // Check if this is an adult-only event
  const nightInfo = getNightFromKey(nightKey);
  const isAdultOnly = nightInfo?.adultOnly === true;

  // Check if booking is being made too late (same day after 3pm)
  if (nightInfo) {
    const now = new Date();
    const eventDate = new Date(nightInfo.date);
    const isSameDay = eventDate.toDateString() === now.toDateString();
    const isPast3pm = now.getHours() >= 15;

    if (isSameDay && isPast3pm) {
      return { success: false, error: 'Bookings for same-day films close at 3pm' };
    }
  }

  // Validate inputs
  if (!isAdultOnly && kidTickets < 1) {
    return { success: false, error: 'Must book at least 1 kid ticket' };
  }

  if (!isAdultOnly && adultTickets > 0 && kidTickets < 1) {
    return { success: false, error: 'Must have at least 1 kid ticket to book adult tickets' };
  }

  if (isAdultOnly && kidTickets > 0) {
    return { success: false, error: 'This is an adults-only event. Kid tickets are not available.' };
  }

  if (isAdultOnly && adultTickets < 1) {
    return { success: false, error: 'Must book at least 1 adult ticket' };
  }

  if (kidTickets > 8 || adultTickets > 8) {
    return { success: false, error: 'Maximum 8 tickets per type' };
  }

  // Check availability
  const availability = await getAvailability(nightKey);

  if (availability.kidTicketsRemaining < kidTickets) {
    return {
      success: false,
      error: `Only ${availability.kidTicketsRemaining} kid ticket(s) remaining for this night`
    };
  }

  if (availability.adultTicketsRemaining < adultTickets) {
    return {
      success: false,
      error: `Only ${availability.adultTicketsRemaining} adult ticket(s) remaining for this night`
    };
  }

  // Create reservation
  const reservation: ReservationData = {
    kidTickets,
    adultTickets,
    nightKey,
    createdAt: Date.now(),
    sessionId,
  };

  const reservationKey = `reservation:${sessionId}:${nightKey}`;

  // Store reservation with 35-minute expiry (slightly longer than timeout for safety)
  await kv.set(reservationKey, reservation, {
    ex: Math.ceil(RESERVATION_TIMEOUT_MS / 1000) + 300 // +5 minutes buffer
  });

  return { success: true };
}

// Confirm booking (called after successful Stripe payment)
export async function confirmBooking(
  nightKey: string,
  kidTickets: number,
  adultTickets: number,
  sessionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current inventory
    const inventory = await getInventory(nightKey);

    // Update inventory
    const newInventory: InventoryData = {
      kid_tickets_sold: inventory.kid_tickets_sold + kidTickets,
      adult_tickets_sold: inventory.adult_tickets_sold + adultTickets,
    };

    // Save updated inventory
    const inventoryKey = `inventory:${nightKey}`;
    await kv.set(inventoryKey, newInventory);

    // Remove reservation
    const reservationKey = `reservation:${sessionId}:${nightKey}`;
    await kv.del(reservationKey);

    return { success: true };
  } catch (error) {
    console.error('Error confirming booking:', error);
    return { success: false, error: 'Failed to confirm booking' };
  }
}

// Release reservation (called when checkout is cancelled or expired)
export async function releaseReservation(sessionId: string, nightKey?: string): Promise<void> {
  if (nightKey) {
    const reservationKey = `reservation:${sessionId}:${nightKey}`;
    await kv.del(reservationKey);
  } else {
    // If no night key provided, try to find and delete all reservations for this session
    const pattern = `reservation:${sessionId}:*`;
    const keys = await kv.keys(pattern);
    for (const key of keys) {
      await kv.del(key);
    }
  }
}

// Clean up expired reservations (should be called periodically)
export async function cleanupExpiredReservations(): Promise<number> {
  const pattern = 'reservation:*';
  const keys = await kv.keys(pattern);

  const now = Date.now();
  let cleanedCount = 0;

  for (const key of keys) {
    const reservation = await kv.get<ReservationData>(key);
    if (reservation && (now - reservation.createdAt) >= RESERVATION_TIMEOUT_MS) {
      await kv.del(key);
      cleanedCount++;
    }
  }

  return cleanedCount;
}

// Initialize inventory for all nights (admin use only)
export async function initializeInventory(): Promise<void> {
  for (const night of EVENT_NIGHTS) {
    const key = `inventory:${night.key}`;
    // Always overwrite to ensure fresh start for new dates
    await kv.set(key, {
      kid_tickets_sold: 0,
      adult_tickets_sold: 0,
    });
  }
}
