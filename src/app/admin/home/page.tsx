'use client'
import { useEffect, useState } from 'react';
import { Navbar } from '../../navbar';
import Link from 'next/link';
import { db, collection, getDocs } from '../../../firebase';
import '../../../css/page.css';

interface User {
  id: string;
  name: string;
  email: string;
}

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);

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
      } catch (error) {
        console.error('Error fetching users:', error);
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
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;