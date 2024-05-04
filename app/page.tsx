import Navbar from "./components/Navbar";
import Leaderboard from "./components/Leaderboard";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex justify-center pt-20">
        <Leaderboard />
      </div>
    </>
  );
}
