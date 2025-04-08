const notificationReducer = (state = { type: "", message: "" }, action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return {
        type: action.payload.type,
        message: action.payload.message,
      };
    default:
      return state;
  }
};

export const notificationChange = (notification) => {
  return {
    type: "SET_NOTIFICATION",
    payload: notification,
  };
};

export default notificationReducer;
