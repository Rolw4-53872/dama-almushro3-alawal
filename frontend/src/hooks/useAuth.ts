import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@store/index';
import { login, register, logout, fetchCurrentUser } from '@store/slices/authSlice';
import type { LoginRequest, RegisterRequest } from '@types/index';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  return {
    ...auth,
    login: (credentials: LoginRequest) => dispatch(login(credentials)),
    register: (data: RegisterRequest) => dispatch(register(data)),
    logout: () => dispatch(logout()),
    fetchCurrentUser: () => dispatch(fetchCurrentUser()),
  };
};
