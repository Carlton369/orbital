import {Navbar} from '../../navbar'
import Link from 'next/link'
import '../../../css/page.css'


const Page = () => {
    return (
        <div>
            <Navbar/>
            <Link href = '/add_game'> Add a Game </Link>
        </div>
    )
}

export default Page;