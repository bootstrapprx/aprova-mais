import Image from "next/image";

import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <div className="hidden h-20 w-full border-t-2 border-border p-2 lg:block">
      <div className="mx-auto flex h-full max-w-screen-lg items-center justify-evenly">
        <Button size="lg" variant="ghost" className="w-full cursor-default">
          <Image
            src="/br.svg"
            alt="CESPE"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          CESPE
        </Button>

        <Button size="lg" variant="ghost" className="w-full cursor-default">
          <Image
            src="/br.svg"
            alt="FCC"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          FCC
        </Button>

        <Button size="lg" variant="ghost" className="w-full cursor-default">
          <Image
            src="/br.svg"
            alt="FGV"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          FGV
        </Button>
      </div>
    </div>
  );
};
