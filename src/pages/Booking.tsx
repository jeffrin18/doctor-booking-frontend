import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { useBooking } from '../context/BookingContext';
import { ArrowLeft, Clock, Calendar, CheckCircle, XCircle } from 'lucide-react';

interface Slot {
  id: number;
  start_time: string;
  total_seats: number;
  booked_seats: number;
}

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedDoctor } = useBooking();
  
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    setLoading(true);
    apiClient.get(`/doctors/${id}/slots`)
      .then(res => {
        setSlots(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleBook = async (slotId: number) => {
    // Generate a random User ID for demo purposes
    const userId = 1; 

    setBookingStatus(null);
    try {
      const res = await apiClient.post('/bookings/book', {
        userId: userId,
        slotId: slotId
      });

      if (res.data.status === 'SUCCESS') {
        setBookingStatus({ msg: 'Booking Confirmed! Your appointment is set.', type: 'success' });
        // Update the UI immediately
        setSlots(prev => prev.map(s => 
          s.id === slotId ? {...s, booked_seats: s.booked_seats + 1} : s
        ));
      }
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        setBookingStatus({ msg: 'Sorry! That slot was just taken.', type: 'error' });
        // Refresh data to show it's full
        window.location.reload(); 
      } else {
        setBookingStatus({ msg: 'Booking Failed. Please try again.', type: 'error' });
      }
    }
  };

  if (loading) return <div className="p-10 text-center">Loading available times...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/')}
        style={{ 
          background: 'none', border: 'none', color: '#666', 
          display: 'flex', alignItems: 'center', gap: '5px', 
          cursor: 'pointer', marginBottom: '20px', fontSize: '1rem' 
        }}
      >
        <ArrowLeft size={20} /> Back to Doctor List
      </button>

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#111827' }}>Book an Appointment</h2>
        <p style={{ color: '#6b7280', marginTop: '5px' }}>
          with <span style={{ fontWeight: 'bold', color: '#059669' }}>{selectedDoctor?.name || 'Doctor'}</span>
        </p>
      </div>
      
      {/* Success/Error Message Banner */}
      {bookingStatus && (
        <div style={{ 
          padding: '12px', borderRadius: '8px', marginBottom: '20px',
          background: bookingStatus.type === 'success' ? '#ecfdf5' : '#fef2f2',
          color: bookingStatus.type === 'success' ? '#065f46' : '#991b1b',
          border: `1px solid ${bookingStatus.type === 'success' ? '#34d399' : '#f87171'}`,
          display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          {bookingStatus.type === 'success' ? <CheckCircle size={20}/> : <XCircle size={20}/>}
          <strong>{bookingStatus.msg}</strong>
        </div>
      )}

      {/* Handling the Empty State - CRITICAL FOR STANDING OUT */}
      {slots.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f9fafb', borderRadius: '10px' }}>
          <Calendar size={40} color="#9ca3af" style={{ marginBottom: '10px' }}/>
          <p style={{ color: '#6b7280' }}>No appointments available for this doctor right now.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {slots.map(slot => {
              const isFull = slot.booked_seats >= slot.total_seats;
              const startTime = new Date(slot.start_time);
              const dateStr = startTime.toLocaleDateString();
              const timeStr = startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
              
              return (
                <div key={slot.id} className="card" style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  borderLeft: isFull ? '4px solid #ef4444' : '4px solid #10b981'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: '#f3f4f6', padding: '10px', borderRadius: '50%' }}>
                      <Clock size={20} color="#4b5563"/>
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{timeStr}</div>
                      <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{dateStr}</div>
                      <div style={{ fontSize: '0.9rem', color: isFull ? '#ef4444' : '#059669', fontWeight: 500 }}>
                        {isFull ? 'Sold Out' : `${slot.total_seats - slot.booked_seats} seats available`}
                      </div>
                    </div>
                  </div>

                  <button 
                    disabled={isFull}
                    onClick={() => handleBook(slot.id)}
                    style={{ 
                      background: isFull ? '#e5e7eb' : '#10b981',
                      color: isFull ? '#9ca3af' : 'white',
                      cursor: isFull ? 'not-allowed' : 'pointer',
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 'bold'
                    }}
                  >
                    {isFull ? 'Full' : 'Book Now'}
                  </button>
                </div>
              );
          })}
        </div>
      )}
    </div>
  );
};

export default Booking;