import { createContext, useContext, useState, type ReactNode } from 'react';
interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

interface Slot {
  id: number;
  doctor_id: number;
  start_time: string;
  end_time: string;
  total_seats: number;
  booked_seats: number;
}

interface BookingContextType {
  selectedDoctor: Doctor | null;
  setSelectedDoctor: (doctor: Doctor | null) => void;
  selectedSlot: Slot | null;
  setSelectedSlot: (slot: Slot | null) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
}

// Create the Context
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Create the Provider (Wraps the whole app)
export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  return (
    <BookingContext.Provider
      value={{
        selectedDoctor,
        setSelectedDoctor,
        selectedSlot,
        setSelectedSlot,
        userEmail,
        setUserEmail,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

// Custom Hook to use the context easily
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};