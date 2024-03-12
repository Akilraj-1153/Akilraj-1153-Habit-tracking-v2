import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { CategoryScale, LinearScale, BarElement, Chart } from 'chart.js';
import { habitSelector, setShowStatus, toggleHabitStatus } from '../Redux/Reducer/habitReducer';

Chart.register(CategoryScale, LinearScale, BarElement);

const Profile = ({ setIsLoggedIn }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { habits, showStatus } = useSelector(habitSelector);

  useEffect(() => {
    try {
      const loginCredentials = JSON.parse(localStorage.getItem('loginCredentials')) || {};
      const fullNameFromCredentials = loginCredentials.fullName;
      const emailFromCredentials = loginCredentials.email;
      const usernameFromCredentials = loginCredentials.username;
      const profilePictureFromCredentials = loginCredentials.profilePicture;

      setFullName(fullNameFromCredentials);
      setEmail(emailFromCredentials);
      setUsername(usernameFromCredentials);
      setProfilePicture(profilePictureFromCredentials);
    } catch (error) {
      console.error('Error fetching or setting user credentials:', error);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loginCredentials');
    setIsLoggedIn(false);
    navigate('/');
  };

  // Calculate the number of days completed for each habit
  const daysCompletedData = habits.map(habit => habit.completedDays);

  // Bar chart data
  const data = {
    labels: habits.map(habit => habit.name),
    datasets: [
      {
        label: 'Days Completed',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.6)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: daysCompletedData,
      },
    ],
  };

  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <div className='profilecontainer border-2 border-black rounded-3xl h-90vh w-80vw flex flex-row justify-center items-center text-white gap-5 p-8'>
        <div className='w-1/4 h-[90%] text-black'>
          <h2>User Profile</h2>
          <div>
            {profilePicture && (
              <img src={profilePicture} alt='Profile' className='rounded-full h-20 w-20 mb-2' />
            )}
            <strong>Full Name:</strong> {fullName}
          </div>
          <div>
            <strong>Username:</strong> {username}
          </div>
          <div>
            <strong>Email:</strong> {email}
          </div>
          <button onClick={handleLogout} className='bg-blue-500 h-10 w-32 rounded-lg mt-4'>
            Logout
          </button>
        </div>

        <div className='w-3/4 h-full'>
          <div className="chart-container p-4 rounded-3xl" style={{ position: 'relative', height: '70vh', width: '100%' }}>
            <h3 className='text-center text-2xl font-bold text-black'>Habit Tracking Progress:</h3>
            <Bar
              data={data}
              options={{
                maintainAspectRatio: false,
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                        min: 0,
                      },
                    },
                  ],
                  xAxes: [
                    {
                      ticks: {
                        autoSkip: false,
                      },
                    },
                  ],
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
