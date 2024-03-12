import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {
  habitSelector,
  setShowStatus,
  toggleHabitStatus,
  setUserHabits,
} from '../Redux/Reducer/habitReducer';
import WeekStatus from './WeekStatus';
import { toast } from 'react-toastify';

const CalculateDayOfWeek = (date) => {
  var days = new Array();
  for (var i = 6; i >= 0; i--) {
    days[6 - i] = new Date(date.getFullYear(), date.getMonth(), date.getDate() - i).toString();
    days[6 - i] = `${days[6 - i].slice(0, 4)}, ${days[6 - i].slice(4, 15)}`;
  }
  return days;
};

const HabitStatus = () => {
  const dispatch = useDispatch();
  const { habits, showStatus } = useSelector(habitSelector);
  const weekDays = CalculateDayOfWeek(new Date());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/getUserDetails'); // Adjust the API endpoint accordingly

        if (response.data.success) {
          dispatch(setUserHabits(response.data.user.habits));
        } else {
          console.error('Failed to fetch user details:', response.data.error);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserData();
  }, [dispatch]);

  const handleCloseClick = (e) => {
    e.preventDefault();
    dispatch(setShowStatus(null));
  };

  const toggleStatus = (dayIndex, status) => {
    const habitIndex = habits.findIndex((habit) => habit === showStatus);
    dispatch(toggleHabitStatus({ habitIndex, dayIndex, status }));
    if (status) {
      toast.success(`${showStatus.name} done on ${weekDays[dayIndex]}`);
    }
  };

  const saveUserDetails = async () => {
    try {
      setIsSaving(true);

      const response = await axios.post('http://localhost:3000/api/saveUserDetails', {
        username: 'YourUsername',
        habits: habits.map((habit) => ({
          name: habit.name,
          completedDays: habit.completedDays,
          createdOn: habit.createdOn,
          url: habit.url,
          weekStatus: habit.weekStatus,
        })),
      });

      if (response.data.success) {
        console.log('User details saved successfully:', response.data.user);
        toast.success('User details saved successfully!');
      } else {
        console.error('Failed to save user details:', response.data.error);
        toast.error('Failed to save user details');
      }
    } catch (error) {
      console.error('Error saving user details:', error);
      toast.error('Error saving user details');
    } finally {
      setIsSaving(false);
    }
  };

  const restoreUserData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/getUserDetails'); // Adjust the API endpoint accordingly

      if (response.data.success) {
        dispatch(setUserHabits(response.data.user.habits));
        toast.success('User data restored successfully!');
      } else {
        console.error('Failed to restore user data:', response.data.error);
        toast.error('Failed to restore user data');
      }
    } catch (error) {
      console.error('Error restoring user data:', error);
      toast.error('Error restoring user data');
    }
  };


  return (
    <div className="w-full md:w-2/3 h-full ml-1 flex flex-col p-1">
      <nav className="w-full p-1">
        <div className="flex gap-2">
          <div>
            <NavLink to="/homepage" className="flex gap-2">
              <button className="bg-indigo-400 hover:bg-indigo-500 float-right p-1 rounded text-white">
                New Habit
              </button>
            </NavLink>
          </div>
          <div>
            <button
              onClick={saveUserDetails}
              className={`bg-indigo-400 hover:bg-indigo-500 float-right p-1 rounded text-white ${
                isSaving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Save
            </button>
          </div>
          // <div>
          //   <button
          //     onClick={restoreUserData}
          //     className="bg-green-400 hover:bg-green-500 float-right p-1 rounded text-white"
          //   >
          //     Restore My Data
          //   </button>
          // </div>
        </div>
      </nav>
      <div className="w-full h-full mt-1 p-1 rounded flex flex-col bg-fixed overflow-scroll">
        <div className="hidden md:block w-full">
          {!showStatus ? (
            <h1 className="text-center text-2xl text-indigo-600 font-semibold">
              {habits.length !== 0
                ? 'Select habit from list to know your weekly status'
                : 'Add some habits to see your progress'}
            </h1>
          ) : null}
        </div>
        <div className="hidden md:block w-full">
          {showStatus ? (
            <WeekStatus
              handleCloseClick={handleCloseClick}
              showStatus={showStatus}
              weekDays={weekDays}
              toggleStatus={toggleStatus}
            />
          ) : null}
        </div>
        <div className="block md:hidden w-full h-full">
          {habits.length === 0 ? (
            <div className="w-full text-2xl text-center font-semibold text-indigo-600">
              'Nothing in Your List'
            </div>
          ) : (
            habits.map((habit, i) => (
              <WeekStatus
                key={i}
                habitIndex={i}
                handleCloseClick={handleCloseClick}
                showStatus={habit}
                weekDays={weekDays}
                toggleStatus={toggleStatus}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitStatus;
