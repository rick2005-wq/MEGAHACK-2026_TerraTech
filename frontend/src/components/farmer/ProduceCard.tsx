export interface Produce { id: string; cropType: string; quantity: number; price: number; imageUrl: string; harvestDate: string; qualityGrade: string; }
export default function ProduceCard({ produce }: { produce: Produce }) {
  return (
    <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl overflow-hidden shadow-glass">
      <img src={produce.imageUrl} alt={produce.cropType} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-bold text-lg">{produce.cropType}</h3>
        <p className="text-grain-600 font-semibold">₹{produce.price}/kg</p>
        <p className="text-sm text-gray-500">Qty: {produce.quantity} kg · Grade: {produce.qualityGrade}</p>
      </div>
    </div>
  );
}