import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { useBooking } from '../context/BookingContext';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

const Home = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setSelectedDoctor } = useBooking();

  useEffect(() => {
    apiClient.get('/doctors')
      .then(res => {
        setDoctors(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching doctors:', err);
        setLoading(false);
      });
  }, []);

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    navigate(`/booking/${doctor.id}`);
  };

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Loading Doctors...</div>;

  return (
    <div>
      <h1 style={{ textAlign: 'center', color: '#059669' }}>🏥 Doctor Appointment System</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>Select a specialist to book your slot</p>
      
      <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
        {doctors.map(doctor => (
          <div key={doctor.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{doctor.name}</h2>
              <span style={{ 
                background: '#e0f2f1', color: '#00695c', 
                padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem' 
              }}>
                {doctor.specialization}
              </span>
            </div>
            <button onClick={() => handleSelectDoctor(doctor)}>
              View Slots →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;