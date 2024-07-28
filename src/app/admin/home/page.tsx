'use client';
import { useEffect, useState } from 'react';
import { Navbar } from '../../navbar';
import Link from 'next/link';
import { db, collection, getDocs, doc } from '../../../firebase';
import { Timestamp } from 'firebase/firestore';
import '../../../css/page.css';

interface User {
  id: string;
  name: string;
  email: string;
}

interface LoanedGame {
  game: string;
  loan_date: string; // Adjust this according to your actual data
}

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loanedGames, setLoanedGames] = useState<{ [key: string]: LoanedGame[] }>({});

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

    const fetchLoanedGames = async (users: User[]) => {
      try {
        const loanedGamesData: { [key: string]: LoanedGame[] } = {};

        for (const user of users) {
          const userDocRef = doc(db, 'users', user.id);
          const loanedGamesCollection = collection(userDocRef, 'loaned_games');
          const loanedGamesSnapshot = await getDocs(loanedGamesCollection);
          const loanedGamesList = loanedGamesSnapshot.docs.map(doc => {
            const data = doc.data();
            const loanDate = data.loan_date instanceof Timestamp ? data.loan_date.toDate().toLocaleDateString() : data.loan_date;
            return {
              game: data.game,
              loan_date: loanDate,
            };
          });

          loanedGamesData[user.name] = loanedGamesList;
        }

        setLoanedGames(loanedGamesData);
      } catch (error) {
        console.error('Error fetching loaned games:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <div className="wrapper">
        <Navbar />
      </div>
      <Link href='/add_game'>Add a Game</Link>
      <h1>Users</h1>
      {Object.keys(loanedGames).length > 0 ? (
        Object.keys(loanedGames).map(userName => (
          <div key={userName}>
            <h2>{userName}</h2>
            {loanedGames[userName].length > 0 ? (
              <ul>
                {loanedGames[userName].map((game, index) => (
                  <li key={index}>
                    <p>Game: {game.game}</p>
                    <p>Loan Date: {game.loan_date}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No games on loan.</p>
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
