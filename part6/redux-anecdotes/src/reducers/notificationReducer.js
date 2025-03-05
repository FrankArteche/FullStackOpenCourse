import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
  },
});

export const { setNotification } = notificationSlice.actions;

export const setNotificationAndClear = (notification, seconds) => {
  return async (dispatch) => {
    dispatch(notificationSlice.actions.setNotification(notification));
    setTimeout(() => {
      dispatch(notificationSlice.actions.setNotification(""));
    }, seconds * 1000);
  };
};

export default notificationSlice.reducer;
