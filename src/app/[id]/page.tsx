'use client'
import { useEffect, useState } from 'react';
import { auth, db, doc, getDoc, onAuthStateChanged } from '../../firebase';
import { useParams } from 'next/navigation';
import {Navbar} from '../navbar'
import ImageDisplay from '../../components/display_image';
import emailjs from '@emailjs/browser'
import '../../css/page.css'

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

const CatalogueItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState<CatalogueItem | null>(null);
  const [loading, setLoading] = useState(true);
  

  // to fetch item from db
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

  // to fetch user state
  useEffect(() => {
    // Set up an observer on the Auth object to listen for changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

    const [user, setUser] = useState<any>(null);
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!item) {
    return <p>No item found</p>;
  }

  const handleRent = () => {
    if (user){
      console.log('yay')
    } else {
      console.log("Please Log In First")
    }


  }
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
          <p> More info:
            <a href={item.geeklink} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ marginLeft: '5px' }}> 
                  {item.geeklink} 
            </a> 
          </p>
          <p>Available: {item.isAvailable ? 'Yes' : 'No'}</p>
          <button onClick={handleRent}> Rent </button>
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