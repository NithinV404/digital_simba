const stockImage = "https://randomuser.me/api/portraits/men/32.jpg";
const teamMembers = [
  { image: stockImage },
  { image: stockImage },
  { image: stockImage },
  { image: stockImage },
  { image: stockImage },
];

export default function Team() {
  return (
    <section className="py-20 bg-white w-full">
      <div className="flex flex-col items-center text-center mb-12">
        <p className="text-orange-500 font-semibold mb-2 text-lg">Team</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Meet our<span className="text-purple-500"> team</span>
        </h2>
        <p className="text-gray-600 max-w-2xl">
          Meet our dedicated team of professionals, committed to delivering
          excellence and innovation. With diverse expertise and a shared passion
          for success, we work together to achieve our goals and drive our
          mission forward.
        </p>
      </div>
      <div className="flex justify-center px-12 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5  w-full">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-4xl shadow overflow-hidden w-[250px] h-[360px] mx-auto"
            >
              <img
                src={member.image}
                alt={`Team member ${idx + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
