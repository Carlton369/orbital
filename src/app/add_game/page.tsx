'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust the path as necessary
import {Navbar} from '../navbar';

interface Game {
  name: string;
  genre: string;
  duration: string;
  players: string;
  mechanics: string;
  link: string;
  complexity: string;
  isAvailable: boolean;
}

export default function AddPage() {
  const [game, setGame] = useState<Omit<Game,'isAvailable'>>({
    name: '',
    genre: '',
    duration: '',
    players: '',
    mechanics: '',
    link: '',
    complexity: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGame({
      ...game,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'catalogue'), {
        ...game,
        isAvailable: true, // Set default value for isAvailable
      });
      alert('Game added successfully!');
      // Clear the form
      setGame({
        name: '',
        genre: '',
        duration: '',
        players: '',
        mechanics: '',
        link: '',
        complexity: ''
      });
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

          <label htmlFor="game-link">BoardGameGeek Link</label>
          <br />
          <input type='text' className='form-control' name='link' value={game.link} onChange={handleChange} required />
          <br /><br />

          <label htmlFor="game-complexity">Complexity</label>
          <br />
          <input type='text' className='form-control' name='complexity' value={game.complexity} onChange={handleChange} required />
          <br /><br />

          <button type='submit' className='btn btn-success btn-md'>Add</button>
        </form>
      </div>
    </div>
  );
}