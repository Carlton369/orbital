'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {useState,useEffect} from 'react'
import { auth, provider, signInWithPopup, signOut, onAuthStateChanged, User } from '../firebase';



export const Navbar = () => {
  const [user, setUser] = useState< User | null>(null);

  useEffect(() => {
    // Set up an observer on the Auth object to listen for changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className='navbar'>
      <div className='left'>
        <Image 
          src='/images/nusbg.png'
          width={100}
          height={100}
          alt=""
        />
        <div className='leftHome'>
          <Link href='/' className='returnHome'>onBoard</Link>
        </div>
      </div>
      <div className='right'>
        {user ? (
          <div>
            <Link href = '/profile'>
            <img
              src={user.photoURL || '/default-profile.png'} // Fallback to a default image if photoURL is null
              alt="Profile"
              style={{ width: '50px', borderRadius: '50%' }}
            />
            </Link>
          </div>
        ) : (
          <div>
            <button onClick={handleSignIn}>Log in</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;