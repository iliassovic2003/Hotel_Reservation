import { api } from './api';

export interface Hotel {
  id: number;
  name: string;
  description: string;
  location: string;
  stars: number;
  imageUrl: string;
  amenities: string[];
}

export interface Room {
  id: number;
  hotelId: number;
  type: string;
  price: number;
  capacity: number;
  available: boolean;
}

export interface SearchParams {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
}

export const hotelService = {
  getAllHotels: () => 
    api.get('/api/hotels'),
  
  getHotelById: (id: number) => 
    api.get(`/api/hotels/${id}`),
  
  searchHotels: (params: SearchParams) => {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    
    return api.get(`/api/hotels/search?${queryString}`);
  },
  
  getHotelRooms: (hotelId: number) => 
    api.get(`/api/hotels/${hotelId}/rooms`)
};