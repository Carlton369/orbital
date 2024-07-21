
import Link from 'next/link'
import {Navbar} from '../app/navbar'
import '../css/page.css'

export default function Page() {
  return (
    <div className = 'wrapper'>
      <Navbar />
      <Link href="/dashboard">Dashboard</Link>
    </div>
  )
}