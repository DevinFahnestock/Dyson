
import { GoogleAuthProvider } from "firebase/auth"
import useSignInWithPopup from "./useSignInWithPopup"

const useSignInWithGoogle = () => {
    return useSignInWithPopup(new GoogleAuthProvider())
}

export default useSignInWithGoogle