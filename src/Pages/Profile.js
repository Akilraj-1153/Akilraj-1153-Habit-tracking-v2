// Profile.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { CategoryScale, LinearScale, BarElement, Chart } from 'chart.js';

// Import other necessary components, hooks, and styles as needed

Chart.register(CategoryScale, LinearScale, BarElement);



const Profile = ({ setIsLoggedIn }) => {
  const [userDetails, setUserDetails] = useState({});
  const navigate = useNavigate();

  // Assuming habitSelector and other necessary selectors are correctly defined in the Redux slice
  const habitSelector = useSelector((state) => state.habit);
  const { habits, showStatus } = habitSelector || {}; // Ensure habits and showStatus are defined

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const loginCredentials = JSON.parse(localStorage.getItem('loginCredentials')) || {};
        const username = loginCredentials.username;
        const password = loginCredentials.password;

        if (username && password) {
          console.log('Fetching user details...');

          const response = await fetch(`http://localhost:3000/api/getUserDetails/${username}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            console.error(`Error fetching user details: ${response.statusText}`);
            throw new Error(`Error fetching user details: ${response.statusText}`);
          }

          console.log('User details successfully fetched.');

          const data = await response.json();

          if (data.success) {
            console.log('User details:', data.user);
            setUserDetails(data.user);
          } else {
            console.error('Error fetching user details:', data.error);
          }
        } else {
          console.error('Username or password not found.');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loginCredentials');
    setIsLoggedIn(false);
    navigate('/');
  };

  // Check if habits is defined before destructuring
  const daysCompletedData = habits ? habits.map((habit) => habit.completedDays) : [];

  // Bar chart data
  const data = {
    labels: habits ? habits.map((habit) => habit.name) : [],
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

  // Extract user details from state
  const { profilePicture, fullName, username, email } = userDetails || {};

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
