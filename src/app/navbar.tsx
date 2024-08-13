'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { auth, provider, signInWithPopup, onAuthStateChanged, collection, db, doc, setDoc, query, where, getDocs } from '../firebase';

export const Navbar = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // check user auth state
    const unsubscribe = onAuthStateChanged(auth, async (curr_user) => {
      if (curr_user) {
        setUser(curr_user);

        // refs users collec
        const users_collec = collection(db, 'users');
        
        // check if user log in before
        const q = query(users_collec, where('email', '==', curr_user.email));
        const q_snap = await getDocs(q);

        if (q_snap.empty) {
          // If user does not exist, create a new document
          const user_doc = doc(users_collec, curr_user.uid);
          
          // Create the user document
          await setDoc(user_doc, {
            name: curr_user.displayName,
            email: curr_user.email
          });

        }
      } else {
        setUser(null);
      }
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
            <Link href={`/profile?userId=${user.uid}`}>
              <img
                src={user.photoURL || '/default-profile.png'} //default img if no user photo found
                alt="Profile"
                style={{ width: '50px', borderRadius: '50%' }}
              />
            </Link>
          </div>
        ) : (
          <div>
            <button onClick={handleSignIn}> Log in </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
