export default function FarmerPublicProfilePage({ params }: { params: { id: string } }) {
  return <div><h1 className="text-2xl font-bold">Farmer Profile #{params.id}</h1></div>;
}
