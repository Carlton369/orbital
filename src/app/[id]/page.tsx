'use client'
import { useEffect, useState } from 'react';
import { db, doc, getDoc } from '../../firebase';
import { useParams } from 'next/navigation';
import {Navbar} from '../navbar'
import emailjs from '@emailjs/browser'

interface CatalogueItem {
  id: string;
  genre: string;
  name: string;
  complexity: string;
  mechanics: string;
  duration: string;
  players: string;
  geek_url: string;
  isAvailable: boolean;
}

const CatalogueItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState<CatalogueItem | null>(null);
  const [loading, setLoading] = useState(true);
    
  const [user] = useState<any>(null);

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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!item) {
    return <p>No item found</p>;
  }


  return (
    <div>
      <Navbar/>
      <h1>{item.name}</h1>
      <p>Genre: {item.genre}</p>
      <p>Complexity: {item.complexity}</p>
      <p>Mechanics: {item.mechanics}</p>
      <p>Duration: {item.duration}</p>
      <p>Players: {item.players}</p>
      <p>Available: {item.isAvailable ? 'Yes' : 'No'}</p>
  
    </div>
  );
};

export default CatalogueItemDetail;