'use client';
import { useState, useEffect } from 'react';
import { auth, signOut, onAuthStateChanged, collection, db, doc, getDoc , getDocs} from '../../firebase';
import { Navbar } from '../navbar'; // Adjust the import path as necessary
import Link from 'next/link';
import { Timestamp } from 'firebase/firestore';
import '../../css/page.css';

export default function LoginLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [loanedItems, setLoanedItems] = useState<any[]>([]);

  useEffect(() => {
    // Set up an observer on the Auth object to listen for changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Fetch the user's document to get their name
        await fetchUserDetails(user.uid);
      }
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  const fetchUserDetails = async (userId: string) => {
    try {
      // Reference to the user's document
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const userName = userData.name;

        // Fetch loaned items
        await fetchLoanedItems(userId, userName);
      } else {
        console.log('No such user document!');
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchLoanedItems = async (userId: string, userName: string) => {
    try {
      // Reference to the loaned_games subcollection of the user
      const loanedCollectionRef = collection(doc(db, 'users', userId), 'loaned_games');
      const loanedSnapshot = await getDocs(loanedCollectionRef);
      const loanedList = loanedSnapshot.docs.map(doc => {
        const data = doc.data();
        const date = data.loan_date instanceof Timestamp ? data.loan_date.toDate().toLocaleDateString() : data.loan_date;
        return {
          ...data,
          date,
        };
      });
      setLoanedItems(loanedList);
    } catch (error) {
      console.error("Error fetching loaned items:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setLoanedItems([]); // Clear loaned items on sign out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className='wrapper'>
      <Navbar />

      {user ? (
        <div>
          <h1>Welcome, {user.displayName}</h1>

          <h2>Games on loan</h2>
          {loanedItems.length > 0 ? (
            <ul>
              {loanedItems.map((item, index) => (
                <li key={index}>
                  <p>Game: {item.game}</p>
                  <p>Date: {item.date}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No games on loan.</p>
          )}

          <button onClick={handleSignOut}>Sign Out</button>
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
