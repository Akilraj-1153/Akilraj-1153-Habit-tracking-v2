import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DisplayImage } from "../../Data/DisplayImage";

const initialState = {
  habits: [],
  quote: {},
  suggestionSelected: null,
  showStatus: null,
  displayImageUrl: '',
};

export const quoteFetchThunk = createAsyncThunk('quotes', async () => {
  try {
    const [quotesResponse, habitsResponse] = await Promise.all([
      fetch('https://type.fit/api/quotes'),
      fetch('/api/getUserDetails/:username'), // Replace with the correct endpoint
    ]);

    const [quotesData, habitsData] = await Promise.all([
      quotesResponse.json(),
      habitsResponse.json(),
    ]);

    return { quotes: quotesData, habits: habitsData.user.habits };
  } catch (error) {
    console.error('Error fetching quotes and habits:', error);
    throw error;
  }
});

export const setUserHabits = (habits) => ({
  type: 'SET_USER_HABITS',
  payload: habits,
});

const additionalReducer = (state, action) => {
  if (action.type === 'SET_USER_HABITS') {
    state.habits = action.payload;
  }
};

const habitSlice = createSlice({
  name: 'habitTracker',
  initialState,
  reducers: {
    addHabit: (state, action) => {
      state.habits = [...state.habits, action.payload];
      state.showStatus = null;
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
  extraReducers: (builder) => {
    builder.addCase(quoteFetchThunk.fulfilled, (state, action) => {
      const { quotes, habits } = action.payload;

      const index = Math.trunc(Math.random() * quotes.length);
      state.quote = { ...quotes[index] };

      state.habits = habits;

      const displayImageIndex = Math.trunc(Math.random() * DisplayImage.length);
      state.displayImageUrl = DisplayImage[displayImageIndex].url;
    });

    builder.addCase('SET_USER_HABITS', additionalReducer);
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
