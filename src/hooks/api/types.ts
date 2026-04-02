export interface House {
  id: number;
  address: string;
  homeowner: string;
  price: number;
  photoURL: string;
}

export interface HousesResponse {
  houses: House[];
  ok: boolean;
}
