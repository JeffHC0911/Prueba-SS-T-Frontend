import { signIn, signUp, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';


async function login(email: string, password: string) {
  const res = await signIn({ username: email, password });
  return {
    isSignedIn: res.isSignedIn,
    nextStep: res.nextStep,
    // No userId ni signInDetails aquí
  };
}

async function register(email: string, password: string, role: string) {
  const res = await signUp({
    username: email,
    password,
    options: {
      userAttributes: {
        email,
        'custom:role': role,
      },
    },
  });
  return res;
}

async function getUser() {
  try {
    const user = await getCurrentUser()
    const session = await fetchAuthSession()

    const payload = session.tokens?.idToken?.payload


    return {
      email: String(payload?.email ?? user.username ?? ''),
      username: String(user.username ?? ''),
      role: String(payload?.['custom:role'] ?? 'cliente')
    }

  } catch {
    return null
  }


}



async function getToken() {
  const session = await fetchAuthSession()
  // Obtienes el idToken raw como cadena para enviar al backend
  const rawToken = session.tokens?.idToken?.toString()
  if (!rawToken) throw new Error('No se pudo obtener token')
  return rawToken
}

async function logout() {
  await signOut();
}

export default { login, register, getUser, logout, getToken };
