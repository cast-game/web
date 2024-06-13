import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";

const Landing = () => {
  return (
    <main className="flex items-center justify-center h-screen relative">
      <div className="flex flex-col gap-5 items-center text-center">
        <Image src={Logo} alt="cast.game" height={40} />
        <div className="flex flex-col gap-5 text-lg sm:text-xl">
          <span className=" opacity-80 max-w-sm">
            A prediction game to win $ for betting on popular casts on
            Farcaster.
          </span>
          <span>Coming soon...</span>
        </div>
      </div>
      <div className="flex gap-5 absolute bottom-5 transition-all">
        <Link href="https://warpcast.com/~/channel/castgame" target="_blank">
          <Image
            src="/warpcast-logo.png"
            alt="Join our channel on Farcaster"
            width={50}
            height={50}
            className="opacity-50 hover:opacity-100 transition ease-in-out duration-200"
          />
        </Link>
        <Link href="https://castgame.notion.site/cast-game-spec-6ee80b83da2f4f78b46acf1a68001adf" target="_blank">
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
