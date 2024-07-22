import Link from 'next/link'
import {Navbar} from '../app/navbar'
import '../css/page.css'
import CataloguePage from './catalogue'

export default function Page() {
  return (
    <div className = 'wrapper'>
      <Navbar />
 
      <CataloguePage />
    </div>
  )
}