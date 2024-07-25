'use client'
import { useEffect, useState } from 'react';
import { db, collection, getDocs, query, orderBy } from '../firebase';
import Link from 'next/link';
import ImageDisplay from '../components/display_image';
import '../css/page.css';

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
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query
  const key_arr = ['Genre', 'Complexity', 'Mechanics', 'Players'];

  // fetches catalogue
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

  // filters by name based on searchbox
  const filteredCatalogue = catalogue.filter(item =>
    item.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //group by selectbox option
  const groupedCatalogue = filteredCatalogue.reduce((acc, item) => {
    const key = item[sort_by as keyof CatalogueItem] || 'Unknown';

    //slice the string for genre and mechanics for games with multiple of them
    if (sort_by === 'Genre' || sort_by === 'Mechanics') {
      const categories = key.split(/[,\/]/).map((category:string) => category.trim());
      categories.forEach((category:string) => {
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(item);
      });
    } else {
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
    }

    return acc;
  }, {} as Record<string, CatalogueItem[]>);

  return (
    <div className="catalogue-container">
      <div className="header">

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

        <div className="search-box">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

      </div>

      <div className="catalogue-grid">
        {Object.keys(groupedCatalogue).map(group => (
          <div key={group} className="genre-group">
            <h2>{group}</h2> 

            <div className="games-grid">

              {groupedCatalogue[group].map(item => (
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
