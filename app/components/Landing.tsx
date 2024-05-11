import Image from "next/image";
import Link from "next/link";

const Landing = () => {
  return (
    <main className="flex items-center justify-center h-screen relative">
      <div className="flex flex-col gap-5 items-center text-center">
        <span className="text-5xl sm:text-6xl text-[#864AF9] font-bold">
          cast.game
        </span>
        <div className="flex flex-col gap-5 text-lg sm:text-xl">
          <span className=" opacity-80 max-w-sm">
            A prediction game to win $ for betting on popular casts on
            Farcaster.
          </span>
          <span>Coming soon...</span>
        </div>
      </div>
      <div className="flex gap-5 absolute bottom-5 transition-all">
        <Link href="https://warpcast.com/castgame" target="_blank">
          <Image
            src="/warpcast-logo.png"
            alt="Join our channel on Farcaster"
            width={50}
            height={50}
            className="opacity-50 hover:opacity-100 transition ease-in-out duration-200"
          />
        </Link>
        <Link href="https://cast.game" target="_blank">
          <Image
            src="/notion-logo.png"
            alt="Read more about cast.game"
            width={50}
            height={50}
            className="opacity-50 hover:opacity-100 transition ease-in-out duration-200"
          />
        </Link>
      </div>
    </main>
  );
};

export default Landing;
