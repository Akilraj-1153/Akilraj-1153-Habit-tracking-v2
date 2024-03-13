// File: 'yourComponentFile.js' (replace with the actual file name)

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { habitSelector, setShowStatus, toggleHabitStatus,quoteFetchThunk } from '../Redux/Reducer/habitReducer';
import WeekStatus from './WeekStatus';
import { toast } from 'react-toastify';
import { saveUserHabits } from '../Data/Connection';

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
  const { habits, showStatus, username } = useSelector(habitSelector);
  const weekDays = CalculateDayOfWeek(new Date());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Fetch user details, including the username
    dispatch(quoteFetchThunk());
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

  const handleSaveClick = async () => {
    try {
      setIsSaving(true);
  
      const success = await saveUserHabits(username, habits);
  
      if (success) {
        // Update habits in local state to reflect changes (optional)
        // setHabits(habits); // Assuming habits state exists
  
        toast.success('Habits saved successfully!');
      } else {
        throw new Error('Failed to save habits');
      }
    } catch (error) {
      console.error('Error saving habits:', error);
      toast.error('Failed to save habits. Please try again.');
    } finally {
      setIsSaving(false);
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
              className="bg-indigo-400 hover:bg-indigo-500 float-right p-1 rounded text-white"
              onClick={handleSaveClick}
              disabled={isSaving}
            >
              Save
            </button>
          </div>
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
