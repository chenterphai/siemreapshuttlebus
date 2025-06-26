export interface Transaction {
  _id: string;
  order_ref: string;
  departure_date: string;
  email: string;
  name: string;
  passager: number;
  phone: string;
  ticket_type: string;
  total: number;
  issued_date: string;
  status: string;
  special_request: string;
  payment_method: string;
  return_date?: string;
  trip: string;
  from?: string;
  to?: string;
}

export type TransactionList = Transaction[];

export type TransactionInsert = Omit<Transaction, "_id">;
