'use client'
import { useEffect, useState } from 'react';
import { db, collection, getDocs, orderBy,query } from '../firebase';
import Link from 'next/link'

interface CatalogueItem {
  id: string;
  [key: string]: any;
  Genre: string;
  Name: string;
  Complexity: string;
  Mechanics: string;
  Duration: string;
  Players: string;
  geeklink: string;
  isAvailable: boolean;

}

function CataloguePage() {
  const [catalogue, setCatalogue] = useState<CatalogueItem[]>([]);

  useEffect(() => {
    const fetchCatalogue = async () => {
      const catalogueCollection = collection(db, 'catalogue');
      const q = query(catalogueCollection, orderBy('genre'));
      const catalogueSnapshot = await getDocs(q);
      const catalogueList = catalogueSnapshot.docs.map(doc => ({
        id: doc.id, // Ensure each item has a unique id
        Genre: doc.data().genre || 'Unknown Genre',
        Name: doc.data().name || 'Unknown Name',
        Complexity: doc.data().complexity || 'Unknown Complexity',
        Mechanics: doc.data().mechanics || 'Unknown Mechanics',
        Duration: doc.data().duration || 'Unknown Duration',
        Players: doc.data().players || 'Unknown Players',
        geeklink: doc.data().geek_url || 'Unknown URL',
        isAvailable: doc.data().isAvailable,

      }));
      setCatalogue(catalogueList);
    };

    fetchCatalogue();
  }, []);

  return (
    <div>
      <h1>Catalogue</h1>
      <ul>
        {catalogue.map(item => (
          <ul>
          <li key={item.id}>{item.Name}</li>
          <Link href={`/${item.id}`}> test </Link>
          <br/>
          </ul>
        ))}
      </ul>
    </div>
  );
}

export default CataloguePage;