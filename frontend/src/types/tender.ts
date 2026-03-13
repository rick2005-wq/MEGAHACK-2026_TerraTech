export interface Tender {
  id: string; industry_id: string; crop_type: string;
  required_quantity: number; budget: number; deadline: string; status: "OPEN" | "CLOSED" | "AWARDED";
}