'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage, ref, uploadBytes } from '../../firebase'; // Adjust the path as necessary
import { Navbar } from '../navbar';

interface Game {
  name: string;
  genre: string;
  duration: string;
  players: string;
  mechanics: string;
  geeklink: string;
  complexity: string;
  isAvailable: boolean;
}

export default function AddPage() {
  const [game, setGame] = useState<Omit<Game, 'isAvailable'>>({
    name: '',
    genre: '',
    duration: '',
    players: '',
    mechanics: '',
    geeklink: '',
    complexity: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGame({
      ...game,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let imgPath = '';

      // If an image file is selected, upload it to Firebase Storage
      if (imageFile) {
        const storageRef = ref(storage, `Game_pic/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imgPath = storageRef.name; // Extract the filename part
      }

      // Add game details to Firestore
      await addDoc(collection(db, 'catalogue'), {
        ...game,
        isAvailable: true,
        img_path: imgPath, // Store only the filename part
      });

      alert('Game added successfully!');
      // Clear the form
      setGame({
        name: '',
        genre: '',
        duration: '',
        players: '',
        mechanics: '',
        geeklink: '',
        complexity: ''
      });
      setImageFile(null); // Clear the image file
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div className='wrapper'>
      <Navbar />
      <div className='container'>
        <br />
        <h1 className='add_header'>Add a Game</h1>
        <br />
        <form autoComplete="off" className='form-group' onSubmit={handleSubmit}>
          <label htmlFor="game-name">Name</label>
          <br />
          <input type='text' className='form-control' name='name' value={game.name} onChange={handleChange} required />
          <br /><br />
          
          <label htmlFor="game-genre">Genre</label>
          <br />
          <input type='text' className='form-control' name='genre' value={game.genre} onChange={handleChange} required />
          <br /><br />

          <label htmlFor="game-duration">Duration</label>
          <br />
          <input type='text' className='form-control' name='duration' value={game.duration} onChange={handleChange} required />
          <br /><br />

          <label htmlFor="game-players">Players</label>
          <br />
          <input type='text' className='form-control' name='players' value={game.players} onChange={handleChange} required />
          <br /><br />

          <label htmlFor="game-mechanics">Mechanics</label>
          <br />
          <input type='text' className='form-control' name='mechanics' value={game.mechanics} onChange={handleChange} required />
          <br /><br />

          <label htmlFor="game-link">BoardGameGeek Link </label>
          <br />
          <input type='text' className='form-control' name='geeklink' value={game.geeklink} onChange={handleChange} required />
          <br /><br />

          <label htmlFor="game-complexity">Complexity</label>
          <br />
          <input type='text' className='form-control' name='complexity' value={game.complexity} onChange={handleChange} required />
          <br /><br />

          <label htmlFor="game-image">Game Image</label>
          <br />
          <input
            type="file"
            className="form-control"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          <br /><br />

          <button type='submit' className='btn btn-success btn-md'>Add</button>
        </form>
      </div>
    </div>
  );
}