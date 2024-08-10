import Navbar from "./components/Navbar";
import Leaderboard from "./components/Leaderboard";
import Landing from "./components/Landing";

export default function Home() {
  return (
    <>
      {/* <Landing /> */}
      <div className="flex justify-center pt-20">
        <Leaderboard />
      </div>
    </>
  );
}
