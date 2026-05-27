import { 
    signInWithPopup,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile
} from "firebase/auth";

import { auth, googleProvider } from "./firebaseConfig";

export const loginComGoogle = async () => {
  await signInWithPopup(auth, googleProvider);
};



export const loginComEmail = async (email, senha) => {
  const result = await signInWithEmailAndPassword(auth, email, senha);

  return result.user;
};


export const cadastrarComEmail = async (email, senha, nomeCompleto) => {
  const result = await createUserWithEmailAndPassword(auth, email, senha);
  
  await updateProfile(result.user, {
    displayName: nomeCompleto
  });

  await result.user.reload();


  return auth.currentUser;
};