import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'; // Import required icons
import GoogleLogo from '@/assets/google.png'; // Import Google logo image
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { motion } from "framer-motion";

// Signup Page Component
export default function Signup(): JSX.Element {
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  // Handle Google Sign-in
  const handleGoogleSignIn = async (): Promise<void> => {
    setIsSigningIn(true);
    setMessage(null);
    setMessageType(null);
    try {
      // Sign in with Google popup
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      console.log('Google Sign-in successful!', user);
      setMessage('Google Sign-in successful! Redirecting...');
      setMessageType('success');
      
      // Redirect the user to the main page after a successful login.
      setTimeout(() => {
        navigate('/homepage'); 
      }, 1500);

    } catch (error) {
      console.error('Google Sign-in failed:', error);
      setMessage('Sign-in failed. Please try again.');
      setMessageType('error');
    } finally {
      setIsSigningIn(false);
    }
  };

   return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a002b] via-[#3a015c] to-[#8e2de2] p-6 font-sans">
      
      {/* Decorative blurred blobs */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-pink-600/30 blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-600/30 blur-3xl"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md min-h-[420px] rounded-2xl bg-[#1c1c1c]/70 backdrop-blur-xl border border-white/10 px-10 py-14 shadow-2xl text-center flex flex-col justify-center"
>
        <h1 className="mb-3 text-4xl font-extrabold bg-gradient-to-r from-[#ff7ee5] to-[#a855f7] bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="mb-8 text-base text-gray-400">
          Capture and organize your thoughts in <span className="text-white font-medium">beautiful notes</span>.
        </p>

        {/* Message Box */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center space-x-2 rounded-lg p-3 text-sm mb-5 justify-center shadow-md ${
              messageType === 'success' ? 'bg-green-600/80 text-white' : 'bg-red-600/80 text-white'
            }`}
          >
            {messageType === 'success' ? (
              <CheckCircle size={18} className="text-white" />
            ) : (
              <XCircle size={18} className="text-white" />
            )}
            <span>{message}</span>
          </motion.div>
        )}

        {/* Google Sign-in Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleGoogleSignIn}
          disabled={isSigningIn}
          className="relative w-full flex items-center justify-center space-x-3 rounded-xl bg-gradient-to-r from-[#c514cb] via-[#dd67c1] to-[#c287c2] py-3 font-medium text-white shadow-lg transition-all duration-200 ease-in-out hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-[#4285F4]/80 focus:ring-offset-2 focus:ring-offset-[#1c1c1c]"
        >
          {isSigningIn ? (
            <Loader2 size={22} className="animate-spin" />
          ) : (
            <>
              <img src={GoogleLogo} alt="Google" className="w-6 h-6" />
              <span className="tracking-wide">Continue with Google</span>
            </>
          )}
        </motion.button>

        {/* Subtle footer */}
        <p className="mt-8 text-xs text-gray-500">
          By signing in, you agree to our{" "}
          <a href="#" className="underline hover:text-gray-300 transition">Terms</a> 
          {" "}and{" "}
          <a href="#" className="underline hover:text-gray-300 transition">Privacy Policy</a>.
        </p>
      </motion.div>
    </div>
  );}
