export default function TenderDetailPage({ params }: { params: { id: string } }) {
  return <div><h1 className="text-2xl font-bold">Tender #{params.id}</h1></div>;
}
