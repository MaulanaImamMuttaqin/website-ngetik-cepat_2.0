import { initReactQueryAuth } from 'react-query-auth';
import { storage } from '../../utils/storage';
import { getUserProfile, loginwithUsernameAndPassword, registerWithEmailAndPassword, User } from './auth-api';
import parseJWT from '../../utils/parseJWT';


export async function handleUserResponse(data: any) {
  let user = parseJWT(data.access)
  console.log(data)
  console.log(user)
  storage.setToken(data);
  return user;
}

async function loadUser() {
  let user = null;

  if (storage.getToken()) {
    const data = await getUserProfile();
    user = data;
  }
  return user;
}


async function loginFn(data: any) {
  const response = await loginwithUsernameAndPassword(data);
  const user = await handleUserResponse(response.data);
  return user;
}

async function registerFn(data: any) {
  const response = await registerWithEmailAndPassword(data);
  const user = await handleUserResponse(response.data);
  return user;
}

async function logoutFn() {
  // await storage.clearToken();
}

const authConfig = {
  loadUser,
  loginFn,
  registerFn,
  logoutFn
};


const { AuthProvider, useAuth } = initReactQueryAuth<User>(authConfig);

export { AuthProvider, useAuth };