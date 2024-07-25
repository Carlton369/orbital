'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { auth, provider, signInWithPopup, onAuthStateChanged, collection, db, doc, setDoc, query, where, getDocs } from '../firebase';

export const Navbar = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Set up an observer on the Auth object to listen for changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Reference to the users collection
        const usersCollectionRef = collection(db, 'users');
        
        // Query to check if a user with the specified email already exists
        const q = query(usersCollectionRef, where('email', '==', currentUser.email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          // If user does not exist, create a new document
          const userDocRef = doc(usersCollectionRef, currentUser.uid);
          
          // Create the user document
          await setDoc(userDocRef, {
            name: currentUser.displayName,
            email: currentUser.email
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
                src={user.photoURL || '/default-profile.png'} // Fallback to a default image if photoURL is null
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
