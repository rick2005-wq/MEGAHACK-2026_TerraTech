export default function TenderBidsPage({ params }: { params: { id: string } }) {
  return <div><h1 className="text-2xl font-bold">Bids for Tender #{params.id}</h1></div>;
}
