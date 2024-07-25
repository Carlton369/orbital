'use client'
import { useEffect, useState } from 'react';
import { auth, db, doc, getDoc, onAuthStateChanged, collection, setDoc, Timestamp , query, where, getDocs} from '../../firebase';
import { useParams } from 'next/navigation';
import { Navbar } from '../navbar';
import ImageDisplay from '../../components/display_image';
import '../../css/page.css';

interface CatalogueItem {
  id: string;
  genre: string;
  name: string;
  complexity: string;
  mechanics: string;
  duration: string;
  players: string;
  geeklink: string;
  isAvailable: boolean;
  img_path: string;
}

const store_loan_info = async (userId: string, loan_date: any, game: string) => {
  try {
    // Reference to the user's document
    const userDocRef = doc(db, 'users', userId);
    
    // Reference to the loaned_games subcollection of the user
    const loanedCollectionRef = collection(userDocRef, 'loaned_games');
    
    // Query to check if the game is already in the user's loaned_games collection
    const q = query(loanedCollectionRef, where('game', '==', game));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // If a document with the same game name already exists, throw an error
      alert('You have already submitted a loan request for this game');
    }

    else {
    // Create a new document in the loaned_games subcollection
    const newLoanedDocRef = doc(loanedCollectionRef);
    await setDoc(newLoanedDocRef, { loan_date, game });
    alert('Thank you for submitting your loan request!');
    }

  } catch (error) {
    alert("error loaning game")
  }
};

const CatalogueItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState<CatalogueItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // Fetch item from DB
  useEffect(() => {
    const fetchItem = async (itemId: string) => {
      const docRef = doc(db, 'catalogue', itemId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setItem({ id: docSnap.id, ...docSnap.data() } as CatalogueItem);
      } else {
        console.log('No such document!');
      }
      setLoading(false);
    };

    if (id) {
      fetchItem(id);
    }
  }, [id]);

  // Fetch user state
  useEffect(() => {
    // Set up an observer on the Auth object to listen for changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!item) {
    return <p>No item found</p>;
  }

  const handleRent = async () => {
    if (user) {
      const curr_time = Timestamp.now().toDate().toLocaleDateString();
      try {
        await store_loan_info(user.uid, curr_time, item.name);
      } catch (error) {
        alert('An error occurred while processing your request.');
      }
    } else {
      alert('Please login!');
    }
  };

  return (
    <div className="page">
      <div className="wrapper">
        <Navbar />
      </div>

      <div className="content">
        <div className="page_left">
          <h1>{item.name}</h1>
          <ImageDisplay
            imagePath={`Game_pic/${item.img_path}`}
            style={{ width: '800px', height: 'auto' }} // Apply specific styles here
          />
        </div>

        <div className="page_right">
          <p>Genre: {item.genre}</p>
          <p>Complexity: {item.complexity}</p>
          <p>Mechanics: {item.mechanics}</p>
          <p>Duration: {item.duration}</p>
          <p>Players: {item.players}</p>
          <p>More info:
            <a href={item.geeklink} 
               target="_blank" 
               rel="noopener noreferrer" 
               style={{ marginLeft: '5px' }}> 
              {item.geeklink} 
            </a> 
          </p>
          <p>Available: {item.isAvailable ? 'Yes' : 'No'}</p>
          <button onClick={handleRent}>Rent</button>
        </div>
      </div>

      <style jsx>{`
        .page {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .wrapper {
          flex: 0 0 auto;
        }

        .content {
          flex: 1;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: flex-start;
          padding: 20px;
        }

        .page_left {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .page_left h1 {
          margin-bottom: 20px;
        }

        .page_right {
          flex: 1;
          margin-left: 20px;
          padding-top: 40px;
          display: flex;
          flex-direction: column;
        }

        .page_right p {
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
};

export default CatalogueItemDetail;