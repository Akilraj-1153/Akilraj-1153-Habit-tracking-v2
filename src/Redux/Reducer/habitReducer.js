// redux toolkit functions to create slice and async thunk
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// list of image url's to render new image on home screen every time the page re-renders
import { DisplayImage } from "../../Data/DisplayImage";

// initial state of redux state
const initialState = {
  // list of all the habits selected by a user
  habits: [],
  // to show a new quote on the home screen
  quote: {},
  // to know whether the user clicked on any habit in the suggestion list on the home screen
  suggestionSelected: null,
  // to show the status of a habit on the "Your habits" page
  showStatus: null,
  // image URL to show an image on the home page
  displayImageUrl: '',
};

// fetching the list of quotes to show on the screen
export const quoteFetchThunk = createAsyncThunk(
  'quotes',
  async () => {
    // fetching the quote
    const response = await fetch('https://type.fit/api/quotes');
    const data = await response.json();
    // passing data to extraReducer
    return data;
  }
);

// Add the setUserHabits action creator outside createSlice
export const setUserHabits = (habits) => ({
  type: 'SET_USER_HABITS',
  payload: habits,
});

// Create a separate reducer for the additional action
const additionalReducer = (state, action) => {
  if (action.type === 'SET_USER_HABITS') {
    state.habits = action.payload;
  }
};

// creating Slice to create reducer and extraReducer
const habitSlice = createSlice({
  // name
  name: 'habitTracker',
  // initial State of Slice
  initialState,
  // list of reducers
  reducers: {
    // add a new habit to the Habits array
    addHabit: (state, action) => {
      state.habits = [...state.habits, action.payload];
      state.showStatus = null;
    },
    /* if the user clicks on a habit suggestion, add it inside the value of the variable so that 
       later it can be added in the input tag of the "ADD HABIT" section */
    setSuggestionSelected: (state, action) => {
      // store the habit
      state.suggestionSelected = action.payload;
    },
    // to show stats of a habit when the user clicks on a habit from his selected habit list
    setShowStatus: (state, action) => {
      // store the habit
      state.showStatus = action.payload;
    },
    // toggle the status of a habit on a specific day
    //  done, not done, pending 
    toggleHabitStatus: (state, action) => {
      // getting values passed in the function 
      // habitIndex = index of habit 
      // dayIndex = index of the day
      // status = status of the habit {true = done, false = not done, null = pending}
      const { habitIndex, dayIndex, status } = action.payload;

      // this function works in case of "screen below medium width"
      // if showStatus doesn't have the current clicked habit then store the habit from the habit list
      if (state.showStatus === null) {
        state.showStatus = state.habits[habitIndex];
      }

      // if the passed status is true, set habit as done
      if (status) {
        // if already done then return
        if (state.showStatus.weekStatus[dayIndex]) {
          return;
        }
        // increase the number of days on which the task is done
        state.showStatus.completedDays++;
      }
      // if the passed status is false, set habit as not done
      else if (status === false) {
        // if already not done, return
        if (state.showStatus.weekStatus[dayIndex] === false) {
          return;
        }
        // if the task was previously done
        else if (state.showStatus.weekStatus[dayIndex]) {
          // decrease the number of task done days
          state.showStatus.completedDays--;
        }
      }
      // if passed status is null, set as pending habit
      else {
        // if already pending return
        if (state.showStatus.weekStatus[dayIndex] === null) {
          return;
        }
        // if the previous status was done
        else if (state.showStatus.weekStatus[dayIndex]) {
          // decrease the number of task done days
          state.showStatus.completedDays--;
        }
      }

      // set the status of the task as passed in the function
      state.showStatus.weekStatus[dayIndex] = status;
      // update the habits array { remove the old value of habit }
      const newHabits = state.habits.filter((habit) => habit.id !== state.showStatus.id);
      state.habits = newHabits;
      // append the changed status task in the new habit list
      state.habits = [...state.habits, state.showStatus];
    },
  },
  // extraReducer
  extraReducers: (builder) => {
    // when quote fetching is completed by the above async thunk function
    builder.addCase(quoteFetchThunk.fulfilled, (state, action) => {
      // get the array of all the fetched quotes
      const data = [...action.payload];
      // getting index randomly to show a random quote on each page render
      const index = Math.trunc(Math.random() * 12);
      // store the random quote in the quote object
      state.quote = { ...data[index] };
      // also store the image URL from DisplayImage array randomly
      state.displayImageUrl = DisplayImage[index].url;
    });
    // Apply the additional reducer for SET_USER_HABITS
    builder.addCase('SET_USER_HABITS', additionalReducer);
  },
});

// export the habitReducer to create the store and accessing the state
export const habitReducer = habitSlice.reducer;

// exporting all the actions to use
export const { addHabit, setSuggestionSelected,
  setShowStatus, toggleHabitStatus } = habitSlice.actions;

// exporting habitReducer's state to use state outside  
export const habitSelector = (state) => state.habitReducer;
