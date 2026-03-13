export interface Message {
  id: string; sender_id: string; receiver_id: string;
  message: string; translated_message?: string; timestamp: string;
}