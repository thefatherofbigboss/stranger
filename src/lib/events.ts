import { createServerClient } from './supabaseClient';

// Database Event interface matching the database schema
export interface Event {
    id: string;
    city: 'pune' | 'mumbai' | 'delhi' | 'bangalore';
    event_name: string;
    start_date: string; // ISO date string
    end_date: string; // ISO date string
    start_time: string; // HH:MM:SS format
    end_time: string; // HH:MM:SS format
    available_seats: number;
    booked_spots: number;
    regular_price: number;
    discounted_price: number | null;
    discount_rate: number | null;
    full_address: string;
    short_address: string;
    category: string;
    sub_category: string | null;
    image_url: string | null;
    event_type: 'online' | 'in-person';
    status: 'live' | 'closed' | 'cancelled';
    created_at: string;
    updated_at: string;
}

// PaymentDetail interface (renamed from Booking)
export interface PaymentDetail {
    id: string;
    event_id: string;
    user_id: string | null;
    guest_email: string | null;
    guest_phone: string | null;
    spots_booked: number;
    amount_paid: number;
    payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
    razorpay_order_id: string | null;
    razorpay_payment_id: string | null;
    created_at: string;
    updated_at: string;
}

// Keep Booking as alias for backward compatibility
export type Booking = PaymentDetail;

// Event status suggestion based on dates and capacity
export function calculateEventStatus(event: Event): 'live' | 'closed' | 'cancelled' {
    // If manually set to cancelled, keep it
    if (event.status === 'cancelled') {
        return 'cancelled';
    }

    const now = new Date();
    const endDate = new Date(`${event.end_date}T${event.end_time}`);
    
    // If event has passed, suggest closed
    if (endDate < now) {
        return 'closed';
    }
    
    // If fully booked, suggest closed
    if (event.booked_spots >= event.available_seats) {
        return 'closed';
    }
    
    // Otherwise, suggest live
    return 'live';
}

// Format event for display (helper functions)
export function formatEventPrice(event: Event): string {
    if (event.regular_price === 0) {
        return 'Free';
    }
    
    if (event.discounted_price && event.discounted_price < event.regular_price) {
        return `₹${event.discounted_price.toFixed(0)}`;
    }
    
    return `₹${event.regular_price.toFixed(0)}`;
}

export function formatEventDate(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
    };
    
    if (startDate === endDate) {
        return start.toLocaleDateString('en-IN', options);
    }
    
    return `${start.toLocaleDateString('en-IN', options)} - ${end.toLocaleDateString('en-IN', options)}`;
}

export function formatEventTime(startTime: string, endTime: string): string {
    const formatTime = (timeStr: string): string => {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };
    
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

export function getSpotsLabel(event: Event): string {
    const remaining = event.available_seats - event.booked_spots;
    
    if (remaining === 0) {
        return 'Sold Out';
    }
    
    if (remaining <= 3) {
        return 'Few Left';
    }
    
    if (remaining <= event.available_seats * 0.2) {
        return 'Filling Fast';
    }
    
    if (remaining <= event.available_seats * 0.5) {
        return 'Limited Spots';
    }
    
    return 'Open';
}

// Database query functions
export async function getEventsByCity(city: string): Promise<Event[]> {
    const supabase = createServerClient();
    
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('city', city.toLowerCase())
        .eq('status', 'live')
        .order('start_date', { ascending: true })
        .order('start_time', { ascending: true });
    
    if (error) {
        console.error('Error fetching events by city:', error);
        return [];
    }
    
    return data || [];
}

export async function getAllLiveEvents(): Promise<Event[]> {
    const supabase = createServerClient();
    
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'live')
        .order('start_date', { ascending: true })
        .order('start_time', { ascending: true });
    
    if (error) {
        console.error('Error fetching all live events:', error);
        return [];
    }
    
    return data || [];
}

export async function getEventById(id: string): Promise<Event | null> {
    const supabase = createServerClient();
    
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) {
        console.error('Error fetching event by id:', error);
        return null;
    }
    
    return data;
}

export async function createBooking(bookingData: {
    event_id: string;
    user_id?: string | null;
    guest_email?: string | null;
    guest_phone?: string | null;
    spots_booked: number;
    amount_paid: number;
    payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
    razorpay_order_id?: string | null;
    razorpay_payment_id?: string | null;
}): Promise<PaymentDetail | null> {
    const supabase = createServerClient();
    
    const { data, error } = await supabase
        .from('payment_details')
        .insert({
            event_id: bookingData.event_id,
            user_id: bookingData.user_id || null,
            guest_email: bookingData.guest_email || null,
            guest_phone: bookingData.guest_phone || null,
            spots_booked: bookingData.spots_booked,
            amount_paid: bookingData.amount_paid,
            payment_status: bookingData.payment_status || 'pending',
            razorpay_order_id: bookingData.razorpay_order_id || null,
            razorpay_payment_id: bookingData.razorpay_payment_id || null,
        })
        .select()
        .single();
    
    if (error) {
        console.error('Error creating payment detail:', error);
        return null;
    }
    
    // NOTE: Do NOT increment booked_spots here
    // Seats will be incremented only after successful payment verification via webhook
    // This prevents race conditions and ensures payment is confirmed before booking seats
    
    return data;
}
