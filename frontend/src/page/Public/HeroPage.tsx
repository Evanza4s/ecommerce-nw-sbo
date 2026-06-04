import Image from "next/image";
import Background from "../../assets/images/background_landingpage.jpeg";
import Model from "../../assets/images/model.png";
import { Button } from "@/components/ui/button";
import PublicSection from "@/components/ui/PublicSection";

const HeroPage = () => {
  return (
    <PublicSection className="px-0 py-0">
      <div className="flex w-full h-full relative justify-center items-baseline">
        <Image
          src={Background}
          alt="Background"
          className="absolute inset-0 -z-10 w-full h-full rounded-3xl blur-[5px]"
        />
        <div className="absolute inset-0 -z-10 bg-black/10 rounded-3xl" />

        <div className="grid min-h-162 items-center justify-center gap-36 px-8 pt-10 lg:grid-cols-2 lg:px-16">
          <div className="relative flex items-end justify-start">
            <Image
              src={Model}
              alt="Icon"
              className="h-auto w-full max-w-md object-contain drop-shadow-white/50"
            />
          </div>
          <div className="z-10 flex flex-col justify-center items-start">
            <h1 className="max-w-xl font-jakarta text-5xl font-bold leading-tight text-white lg:text-7xl">
              Future Style.
              <br />
              <span className="text-primary">Made</span> Today
            </h1>

            <p className="max-w-md text-light pt-8">
              Designed for modern lifestyles with clean silhouettes, <br />
              premium comfort, and timeless streetwear aesthetics.
            </p>

            <div className="mt-10 flex items-center gap-5">
              <Button size={"lg"}>
                Shop Now
              </Button>

              <Button variant={"outline"} size={"lg"}>
                Explore
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PublicSection>
  );
};

export default HeroPage;
