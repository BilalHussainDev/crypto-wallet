import Link from "next/link";

const Home = () => {
  return (
    <div>
      <h1>My Crypto Wallet</h1>
      <button>
        <Link href="/create-account">Create Account</Link>
      </button>
      <button>
        <Link href="/restore-account">Restore Account</Link>
      </button>
    </div>
  );
};

export default Home;
