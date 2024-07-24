'use client'
import {useState,useEffect} from 'react'
import { auth, signOut, onAuthStateChanged } from '../../firebase';
import {Navbar} from '../navbar'; // Adjust the import path as necessary
import Link from 'next/link'

export default function LoginLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  
    useEffect(() => {
        // Set up an observer on the Auth object to listen for changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
        });
    
        // Clean up the subscription on unmount
        return () => unsubscribe();
      }, []);
    
  const [user, setUser] = useState<any>(null);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className='wrapper'>
      <Navbar/>

      {user ? (
        <div>
          <h1>Welcome, {user.displayName}</h1>
          {user.photoURL && <img src={user.photoURL} alt={user.displayName} style={{ width: '50px', borderRadius: '50%' }} />}
          <p>Email: {user.email}</p>


          <h2> Games on loan </h2>
          
          <Link href = '../'>
          <button onClick={handleSignOut}>Sign Out</button>
          </Link>
        </div>
      ) : (
        <div>
          <h1>Please Sign In</h1>
          
        </div>
      )}
      {children}
    </div>
  );
}