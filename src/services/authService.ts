import { signIn, signOut, getCurrentUser } from 'aws-amplify/auth';

async function login(email: string, password: string) {
  const res = await signIn({ username: email, password });
  return {
    isSignedIn: res.isSignedIn,
    nextStep: res.nextStep,
    // No userId ni signInDetails aquí
  };
}

async function getUser() {
  try {
    const user = await getCurrentUser();
    return {
      email: user.signInDetails?.loginId ?? user.username ?? '',
      username: user.username,
    };
  } catch {
    return null;
  }
}

async function logout() {
  await signOut();
}

export default { login, getUser, logout };
