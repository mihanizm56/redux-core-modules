import { reducerSuppliersName } from './constants';

export type SuppliersType = {
  id: string;
  name: string;
  contact_full_name: string;
  olf_id: string;
  payer_address: string;
  bank_name: string;
  swift: string;
  bank_address: string;
  payment_account: number;
  gln: number;
  nip: number;
  krs: number;
  vat: boolean;
  approved: boolean;
  approved_status?: string;
  country: string;
  warehouses_ids: Array<number>;
  signatory_doc_id: string;
  register_doc_id: string;
  payer_status_doc_id: string;
};

export type SuppliersState = {
  selected?: SuppliersType;
  suppliers: Array<SuppliersType>;
  loading: boolean;
};

export type ActionType = {
  type: string;
  payload: SuppliersState;
};

export type SuppliersStatePart = {
  [reducerSuppliersName]: SuppliersState;
};
