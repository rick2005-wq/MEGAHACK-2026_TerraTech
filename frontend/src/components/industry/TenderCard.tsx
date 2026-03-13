export interface Tender { id: string; cropType: string; requiredQuantity: number; budget: number; deadline: string; }
export default function TenderCard({ tender }: { tender: Tender }) {
  return (
    <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-5 shadow-glass">
      <h3 className="font-bold text-lg">{tender.cropType}</h3>
      <p className="text-grain-600 font-semibold">Budget: ₹{tender.budget}</p>
      <p className="text-sm text-gray-500">Qty: {tender.requiredQuantity} kg · Deadline: {tender.deadline}</p>
    </div>
  );
}