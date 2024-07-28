'use client';
import { useEffect, useState } from 'react';
import { Navbar } from '../../navbar';
import Link from 'next/link';
import { db, collection, getDocs, doc, updateDoc, getDoc, deleteDoc } from '../../../firebase';
import { Timestamp } from 'firebase/firestore';
import '../../../css/page.css';

interface User {
  id: string;
  name: string;
  email: string;
}

interface LoanedGame {
  id: string;
  game: string;
  loan_date: string;
  isAvailable: boolean;
}

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loanedGamesAvailable, setLoanedGamesAvailable] = useState<{ [key: string]: LoanedGame[] }>({});
  const [loanedGamesUnavailable, setLoanedGamesUnavailable] = useState<{ [key: string]: LoanedGame[] }>({});

  const fetchLoanedGames = async (users: User[]) => {
    try {
      const loanedGamesAvailableData: { [key: string]: LoanedGame[] } = {};
      const loanedGamesUnavailableData: { [key: string]: LoanedGame[] } = {};

      for (const user of users) {
        const userDocRef = doc(db, 'users', user.id);
        const loanedGamesCollection = collection(userDocRef, 'loaned_games');
        const loanedGamesSnapshot = await getDocs(loanedGamesCollection);
        const loanedGamesList = loanedGamesSnapshot.docs.map(doc => {
          const data = doc.data();
          const loanDate = data.loan_date instanceof Timestamp ? data.loan_date.toDate().toLocaleDateString() : data.loan_date;
          return {
            id: doc.id,
            game: data.game,
            loan_date: loanDate,
            isAvailable: data.isAvailable,
          };
        });

        loanedGamesAvailableData[user.name] = loanedGamesList.filter(game => game.isAvailable);
        loanedGamesUnavailableData[user.name] = loanedGamesList.filter(game => !game.isAvailable);
      }

      setLoanedGamesAvailable(loanedGamesAvailableData);
      setLoanedGamesUnavailable(loanedGamesUnavailableData);
    } catch (error) {
      console.error('Error fetching loaned games:', error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as User[];
        setUsers(usersList);

        // Fetch loaned games for each user
        await fetchLoanedGames(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const updateGameAvailability = async (userId: string, loanedGameId: string, isAvailable: boolean) => {
    try {
      // Update game in catalogue collection
      const catalogueGameDocRef = doc(db, 'catalogue', loanedGameId);
      const catalogueGameDocSnapshot = await getDoc(catalogueGameDocRef);
      if (catalogueGameDocSnapshot.exists()) {
        await updateDoc(catalogueGameDocRef, { isAvailable });
      }

      // Remove loaned game from user's loaned_games collection if setting as available
      if (isAvailable) {
        const userDocRef = doc(db, 'users', userId);
        const loanedGameDocRef = doc(userDocRef, 'loaned_games', loanedGameId);
        await deleteDoc(loanedGameDocRef);
      } else {
        // Update loaned game in user's loaned_games collection
        const userDocRef = doc(db, 'users', userId);
        const loanedGameDocRef = doc(userDocRef, 'loaned_games', loanedGameId);
        await updateDoc(loanedGameDocRef, { isAvailable });
      }

      // Refresh the loaned games data
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
      await fetchLoanedGames(usersList);
    } catch (error) {
      console.error('Error updating game availability:', error);
    }
  };

  return (
    <div>
      <div className="wrapper">
        <Navbar />
      </div>
      <Link href='/add_game'>Add a Game</Link>
      <h1>Users</h1>
      {Object.keys(loanedGamesAvailable).length > 0 || Object.keys(loanedGamesUnavailable).length > 0 ? (
        users.map(user => (
          <div key={user.id}>
            <h2>{user.name} ({user.email})</h2>
            <h3>Active Loan Requests</h3>
            {loanedGamesAvailable[user.name] && loanedGamesAvailable[user.name].length > 0 ? (
              <ul>
                {loanedGamesAvailable[user.name].map((game, index) => (
                  <li key={index}>
                    <p>Game: {game.game}</p>
                    <p>Loan Date: {game.loan_date}</p>
                    <button onClick={() => updateGameAvailability(user.id, game.id, false)}> Approve Rent </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No available games on loan.</p>
            )}
            <h3>Games on Loan</h3>
            {loanedGamesUnavailable[user.name] && loanedGamesUnavailable[user.name].length > 0 ? (
              <ul>
                {loanedGamesUnavailable[user.name].map((game, index) => (
                  <li key={index}>
                    <p>Game: {game.game}</p>
                    <p>Loan Date: {game.loan_date}</p>
                    <button onClick={() => updateGameAvailability(user.id, game.id, true)}> Confirm Return </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No unavailable games on loan.</p>
            )}
          </div>
        ))
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default Page;
