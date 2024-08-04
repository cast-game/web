import Image from "next/image";

const OverviewCard = () => {
  // test data
  const gameTitle = "Testnet Demo Competition";
  const rewardPool = "1.21";
  const txCount = 86;
  const userCount = 35;
  const endsIn = "15:43:28";

  return (
    <div className="flex rounded items-center justify-center w-full flex-col p-8 bg-slate-200 rounded">
      <h1 className="text-3xl font-bold">{gameTitle}</h1>

      <div className="flex items-center gap-4 my-7">
        <div className="flex flex-col items-center rounded px-6 py-3 bg-slate-300 rounded">
          <div className="flex items-center gap-2">
            <Image
              src="/eth-logo.png"
              width={27}
              height={27}
              alt="Ethereum logo"
            />
            <span className="text-3xl font-bold">{rewardPool}</span>
          </div>
          <span className="text-lg">reward pool</span>
        </div>

        <div className="flex flex-col items-center px-6 py-3 bg-slate-300 rounded">
          <span className="text-3xl font-bold">{txCount}</span>
          <span className="text-lg">transactions</span>
        </div>

        <div className="flex flex-col items-center px-6 py-3 bg-slate-300 rounded">
          <span className="text-3xl font-bold">{userCount}</span>
          <span className="text-lg">participants</span>
        </div>
      </div>

      <p className="text-xl font-medium">
        Ends in <span className="font-bold">{endsIn}</span>
      </p>
    </div>
  );
};

export default OverviewCard;
