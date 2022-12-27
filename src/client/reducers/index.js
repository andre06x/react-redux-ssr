import { combineReducers } from "redux";
import usersReducers from "./usersReducers";
import authReducer from "./authReducer";
import adminsReducer from "./adminsReducer";

export default combineReducers({
  users: usersReducers,
  auth: authReducer,
  admins: adminsReducer,
});
