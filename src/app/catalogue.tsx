'use client'
import { useEffect, useState } from 'react';
import { db, collection, getDocs, orderBy,query, ref, storage, getDownloadURL } from '../firebase';
import Link from 'next/link'
import ImageDisplay from '../components/display_image'

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
  img_path: string;
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
        geeklink: doc.data().geeklink || 'Unknown URL',
        isAvailable: doc.data().isAvailable,
        img_path : doc.data().img_path,
  
      }));
      setCatalogue(catalogueList);
    };

    fetchCatalogue();
  }, []);

  return (
    <div>
      <ul>
        {catalogue.map(item => (
          <li key={item.id}>
            <Link href={`/${item.id}`}>

                <ImageDisplay imagePath={`Game_pic/${item.img_path}`} />
                <p>{item.Name}</p>
                
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CataloguePage;