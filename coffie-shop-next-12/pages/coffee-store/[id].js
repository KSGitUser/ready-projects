import { useRouter } from 'next/router'
import { Link } from 'next/link'

const CoffeeStore = () => {
  const router = useRouter()

  console.log(router)

  return (
    <>
      <div>Coffee Store</div>
      <Link href='/'>
        <a>Back to home</a>
      </Link>
    </>
  )
}

export default CoffeeStore
