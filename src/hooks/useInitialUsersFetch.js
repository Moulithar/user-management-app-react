import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../features/user/userSlice";

// Fetches the first page of users when authenticated.
export function useInitialUsersFetch() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchUsers(1));
    }
  }, [dispatch, token]);
}
