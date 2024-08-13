'use client';
import { useState, useEffect } from 'react';
import { auth, signOut, onAuthStateChanged, collection, db, doc, getDoc , getDocs} from '../../firebase';
import { Navbar } from '../navbar'; // Adjust the import path as necessary
import { Timestamp } from 'firebase/firestore';
import '../../css/page.css';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loanedItems, setLoanedItems] = useState<any[]>([]);

  useEffect(() => {
    // checks if user is auth'ed
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // fetch user document
        await fetchUserDetails(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserDetails = async (userId: string) => {
    try {
      //ref to user doc
      const user_doc = doc(db, 'users', userId);
      const user_doc_snap = await getDoc(user_doc);

      if (user_doc_snap.exists()) {
        const user_data = user_doc_snap.data();
        const username = user_data.name;

        // Fetch loaned items
        await fetchLoanedItems(userId, username);
      } else {
        console.log('No such user document!');
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchLoanedItems = async (userId: string, userName: string) => {
    try {
      // check if user got loan
      const loan_collec = collection(doc(db, 'users', userId), 'loaned_games');
      const loaned_snap = await getDocs(loan_collec);
      const loaned_list = loaned_snap.docs.map(doc => {
        const data = doc.data();
        const date = data.loan_date instanceof Timestamp ? data.loan_date.toDate().toLocaleDateString() : data.loan_date;
        return {
          ...data,
          date,
        };
      });
      setLoanedItems(loaned_list);
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
    </div>
  );
 }

 export default Profile;
