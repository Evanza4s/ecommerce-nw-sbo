import PublicSection from "@/components/ui/PublicSection";
import Card from "@/components/ui/Card";

const ContactPage = () => {
  return (
    <PublicSection title="Contact the Developer">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 mt-8">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="flex flex-col px-6 py-8 gap-4 items-center justify-center">
            <div className="bg-dark/5 aspect-square rounded-xl w-full" />
            <div className="flex flex-col gap-1 items-center justify-center">
              <h3 className="font-semibold">Nama Mahasiswa</h3>
              <p className="font-bold">NIP</p>
              <p className="text-sm text-dark/60">Profil</p>
            </div>
          </Card>
        ))}
      </div>
    </PublicSection>
  );
};

export default ContactPage;
