
import Image from "next/image";
import Link from "next/link";
import logo from '@/assets/logo.png'

export default function Home() {
  return (
    <div className="bg-gray-900 text-white min-h-screen p-8 flex items-center justify-center min-h-screen ">
      <div className="  rounded-2xl shadow-custom  h-72 w-72 p-6 items-end">
        <Image src={logo}  alt="logo" width={150} height={150} objectFit="contain" className="mx-auto" />
      
        <Link href="/create-wallet" className="block text-black font-bold bg-gray-300 text-center w-full rounded-lg py-2 my-2">
        Create new wallet
        </Link>
        <Link href="#" className="block text-black font-bold bg-gray-300 text-center w-full rounded-lg py-2 my-2">
        Import Wallet
        </Link>
        {/* <Link href="#" className="bg-gray-300 text-center w-full rounded-lg py-8 my-2">
        Import Wallet
        </Link> */}
      </div>

    </div>
  );
}
