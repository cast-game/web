import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";

const Landing = () => {
	return (
		<main className="flex items-center justify-center h-screen relative">
			<div className="flex flex-col gap-5 items-center text-center">
				<Image src={Logo} alt="cast.game" height={55} className="opacity-70" />
				<div className="flex flex-col text-xl sm:text-2xl my-5">
					<span>Launching soon.</span>
					<span className="max-w-sm">
						Join{" "}
						<Link
							href={"https://cast.game/channel"}
							target="_blank"
						>
							<span className="font-bold hover:opacity-70 transition ease-in-out duration-200">/castgame</span>
						</Link>{" "}
						for updates.
					</span>
				</div>
				<div className="flex gap-5">
					<Link href="https://cast.game/channel" target="_blank">
						<Image
							src="/warpcast-logo.png"
							alt="Join our channel on Farcaster"
							width={40}
							height={40}
							className="opacity-50 hover:opacity-80 transition ease-in-out duration-200"
						/>
					</Link>
					<Link
						href="https:cast.game/about"
						target="_blank"
					>
						<Image
							src="/notion-logo.png"
							alt="Read more about cast.game"
							width={40}
							height={40}
							className="opacity-50 hover:opacity-80 transition ease-in-out duration-200"
						/>
					</Link>
				</div>
			</div>
		</main>
	);
};

export default Landing;
