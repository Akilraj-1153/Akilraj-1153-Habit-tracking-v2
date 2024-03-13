import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DisplayImage } from "../../Data/DisplayImage";

const initialState = {
  habits: [],
  quote: {},
  suggestionSelected: null,
  showStatus: null,
  displayImageUrl: '',
};

// export const quoteFetchThunk = createAsyncThunk('quotes', async () => {
//   try {
//     const [quotesResponse, habitsResponse] = await Promise.all([
//       fetch('https://type.fit/api/quotes'),
//       fetch('/api/getUserDetails/:username'),
//     ]);

//     const [quotesData, habitsData] = await Promise.all([
//       quotesResponse.json(),
//       habitsResponse.json(),
//     ]);

//     return { quotes: quotesData, habits: habitsData.user.habits };
//   } catch (error) {
//     console.error('Error fetching quotes and habits:', error);
//     throw error;
//   }
// });

export const quoteFetchThunk = createAsyncThunk('quotes', async () => {
  try {
    const [quotesResponse, userDetailsResponse] = await Promise.all([
      fetch('https://type.fit/api/quotes'),
      fetch('/api/getUserDetails/:username'), // Update the endpoint with the correct route
    ]);

    const [quotesData, userDetailsData] = await Promise.all([
      quotesResponse.json(),
      userDetailsResponse.json(),
    ]);

    const username = userDetailsData.user.username;

    return { quotes: quotesData, habits: userDetailsData.user.habits, username };
  } catch (error) {
    console.error('Error fetching quotes and habits:', error);
    throw error;
  }
});


const habitSlice = createSlice({
  name: 'habitTracker',
  initialState,
  reducers: {
    addHabit: (state, action) => {
      state.habits = [...state.habits, action.payload];
      state.showStatus = null;
    },
    extraReducers: (builder) => {
      builder.addCase(quoteFetchThunk.fulfilled, (state, action) => {
        state.username = action.payload.username;
        state.habits = action.payload.habits;
      });
    },
    setSuggestionSelected: (state, action) => {
      state.suggestionSelected = action.payload;
    },
    setShowStatus: (state, action) => {
      state.showStatus = action.payload;
    },
    toggleHabitStatus: (state, action) => {
      const { habitIndex, dayIndex, status } = action.payload;

      if (state.showStatus === null) {
        state.showStatus = state.habits[habitIndex];
      }

      if (status) {
        if (state.showStatus.weekStatus[dayIndex]) {
          return;
        }
        state.showStatus.completedDays++;
      } else if (status === false) {
        if (state.showStatus.weekStatus[dayIndex] === false) {
          return;
        } else if (state.showStatus.weekStatus[dayIndex]) {
          state.showStatus.completedDays--;
        }
      } else {
        if (state.showStatus.weekStatus[dayIndex] === null) {
          return;
        } else if (state.showStatus.weekStatus[dayIndex]) {
          state.showStatus.completedDays--;
        }
      }

      state.showStatus.weekStatus[dayIndex] = status;
      const newHabits = state.habits.filter((habit) => habit.id !== state.showStatus.id);
      state.habits = newHabits;
      state.habits = [...state.habits, state.showStatus];
    },
    deleteHabit: (state, action) => {
      const habitIdToDelete = action.payload;

      state.habits = state.habits.filter((habit) => habit.id !== habitIdToDelete);

      if (state.showStatus && state.showStatus.id === habitIdToDelete) {
        state.showStatus = null;
      }
    },
  },
});

export const habitReducer = habitSlice.reducer;

export const {
  addHabit,
  setSuggestionSelected,
  setShowStatus,
  toggleHabitStatus,
  deleteHabit,
} = habitSlice.actions;

export const habitSelector = (state) => state.habitReducer;