'use client'
import { useEffect, useState } from 'react';
import { db, collection, getDocs, query, orderBy } from '../firebase';
import Link from 'next/link';
import ImageDisplay from '../components/display_image';
import '../css/page.css'; // Make sure this path is correct

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
  const [sort_by, setSortBy] = useState<string>('Genre'); // State for sorting field
  const key_arr = ['Genre', 'Complexity', 'Mechanics', 'Players'];

  // Fetches the whole catalogue
  useEffect(() => {
    const fetchCatalogue = async () => {
      const catalogueCollection = collection(db, 'catalogue');
      const q = query(catalogueCollection, orderBy(sort_by.toLowerCase())); // Use sort_by state here
      const catalogueSnapshot = await getDocs(q);
      const catalogueList = catalogueSnapshot.docs.map(doc => ({
        id: doc.id,
        Genre: doc.data().genre || 'Unknown Genre',
        Name: doc.data().name || 'Unknown Name',
        Complexity: doc.data().complexity || 'Unknown Complexity',
        Mechanics: doc.data().mechanics || 'Unknown Mechanics',
        Duration: doc.data().duration || 'Unknown Duration',
        Players: doc.data().players || 'Unknown Players',
        geeklink: doc.data().geeklink || 'Unknown URL',
        isAvailable: doc.data().isAvailable,
        img_path: doc.data().img_path,
      }));
      setCatalogue(catalogueList);
    };
    fetchCatalogue();
  }, [sort_by]);

  // Group catalogue items by genre
  const groupedCatalogue = catalogue.reduce((acc, item) => {
    const genre = item.Genre || 'Unknown Genre';
    if (!acc[genre]) {
      acc[genre] = [];
    }
    acc[genre].push(item);
    return acc;
  }, {} as Record<string, CatalogueItem[]>);

  return (
    <div className="catalogue-container">
      <div className="select-box">
        <label htmlFor="filter">Sort by:</label>
        <select id="filter" value={sort_by} onChange={(e) => setSortBy(e.target.value)}>
          {key_arr.map(key => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>
      <div className="catalogue-grid">
        {Object.keys(groupedCatalogue).map(genre => (
          <div key={genre} className="genre-group">
            <h2>{genre}</h2> {/* Genre header */}
            <div className="games-grid">
              {groupedCatalogue[genre].map(item => (
                <div key={item.id} className="catalogue-item">
                  <Link href={`/${item.id}`}>
                    <div className="image-container">
                      <ImageDisplay imagePath={`Game_pic/${item.img_path}`} />
                    </div>
                    <p>{item.Name}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CataloguePage;