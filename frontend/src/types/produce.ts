export interface Produce {
  id: string; farmer_id: string; crop_type: string; quantity: number;
  price: number; images_url: string[]; harvest_date: string;
  quality_grade: string; location: string;
}