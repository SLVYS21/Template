const author1 = "myril.jpg";
const author2 = "immo2.jpeg";
const book = "book.png";
const book2 = "book2.png";

interface FormationCardProps {
  tag: string;
  title: string;
  description: string;
  profileImg: string;
  bookImg: string;
  author: string;
  titleBoldPart: string;
  themeColor?: string;
}

const FormationCard = ({
  tag,
  title,
  description,
  profileImg,
  bookImg,
  author,
  titleBoldPart,
  themeColor = 'from-purple-800 to-indigo-900',
}: FormationCardProps) => {
  return (
    <div
      className="relative bg-gradient-to-br p-4 rounded-xl shadow-lg w-full md:w-[40%] text-white flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6 overflow-visible"
      style={{ backgroundImage: `linear-gradient(to bottom right, ${themeColor})` }}
    >
      {/* Left section - Profile */}
      <div className="relative rounded-xl overflow-hidden group transition duration-300 ease-in-out hover:scale-105">
        <img
          src={profileImg}
          alt={author}
          className="w-[240px] h-[440px] object-cover rounded-xl border-4 border-white shadow-lg"
        />
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
          {/* Optional info area */}
          <h3 className="text-lg font-semibold">{titleBoldPart}</h3>
          <p className="text-sm">{author}</p>
        </div>
      </div>

      {/* Right section - Info */}
      <div className="flex-1 space-y-3 pt-2">
        <span className="bg-white text-black text-xs font-semibold px-3 py-1 rounded-full">{tag}</span>
        <h4 className="text-xl font-bold">{title}</h4>
        <p className="text-sm text-white/80">{description}</p>
        <button className="mt-4 bg-white text-blue-700 font-medium py-2 px-4 rounded-full hover:bg-blue-100 transition">
          En savoir plus
        </button>
      </div>

      {/* Book Image - Positioned between sections and drops below the card */}
      {/* <div className="absolute bottom-[-45px] left-1/2 transform -translate-x-1/2 md:left-40 md:right-40 md:translate-x-0 z-10">
        <img
          src={bookImg}
          alt="Book"
          className="w-[96px] md:w-[170px] h-[180px] rounded-xl"
        />
      </div> */}
    </div>
  );
};

export const Formations = () => {
  return (
    <div className="min-h-screen login-background p-10 flex flex-col md:flex-row justify-center items-start gap-10">
      <FormationCard
        tag="Formateur"
        title="ECOM AFRICA PRO"
        titleBoldPart="ECOM AFRICA PRO"
        description="Je suis impliqué dans le domaine du E-Commerce depuis près de 05 ans.

Mon parcours entrepreneurial a commencé en 2019 avec la vente en ligne en Afrique, où j'ai généré près de 3 000 000 de bénéfices en quelques mois."
        profileImg={author1}
        bookImg={book}
        author="Myril Sekou"
        themeColor="from-yellow-600 to-yellow-900"
      />
      {/* Right: Video & Button */}
      <div className="flex flex-col items-center gap-8 mt-10 md:mt-20">
        <video
          src="/ecom-promo.mp4"
          controls
          className="w-full max-w-md rounded-xl shadow-xl"
        />

        <button className="animate-zoom-shake px-6 py-3 bg-yellow-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-yellow-700 transition">
          Join Program
        </button>
      </div>
    </div>
  );
};
