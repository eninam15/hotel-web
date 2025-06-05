import api from './api.js';

export const hotelService = {
  // Obtener todos los hoteles (público)
  async getAllHoteles() {
    try {
      const response = await api.get('/hoteles');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener un hotel específico (público)
  async getHotel(id) {
    try {
      const response = await api.get(`/hoteles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Buscar hoteles con filtros (público)
  async buscarHoteles(filtros) {
    try {
      const response = await api.post('/hoteles/buscar', filtros);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Crear nuevo hotel (requiere autenticación)
  async createHotel(hotelData) {
    try {
      // Si hay foto, usar FormData
      const formData = new FormData();
      
      Object.keys(hotelData).forEach(key => {
        if (key === 'servicios' && Array.isArray(hotelData[key])) {
          hotelData[key].forEach((servicio, index) => {
            formData.append(`servicios[${index}]`, servicio);
          });
        } else if (key === 'foto' && hotelData[key] instanceof File) {
          formData.append('foto', hotelData[key]);
        } else if (hotelData[key] !== null && hotelData[key] !== undefined) {
          formData.append(key, hotelData[key]);
        }
      });

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await api.post('/hoteles', formData, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Actualizar hotel (requiere autenticación)
  async updateHotel(id, hotelData) {
    try {
      // Si hay foto, usar FormData
      if (hotelData.foto instanceof File) {
        const formData = new FormData();
        
        Object.keys(hotelData).forEach(key => {
          if (key === 'servicios' && Array.isArray(hotelData[key])) {
            hotelData[key].forEach((servicio, index) => {
              formData.append(`servicios[${index}]`, servicio);
            });
          } else if (key === 'foto' && hotelData[key] instanceof File) {
            formData.append('foto', hotelData[key]);
          } else if (hotelData[key] !== null && hotelData[key] !== undefined) {
            formData.append(key, hotelData[key]);
          }
        });

        // Laravel necesita _method para PUT en FormData
        formData.append('_method', 'PUT');

        const config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        };

        const response = await api.post(`/hoteles/${id}`, formData, config);
        return response.data;
      } else {
        // Sin foto, usar PUT normal
        const response = await api.put(`/hoteles/${id}`, hotelData);
        return response.data;
      }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Eliminar hotel (requiere autenticación)
  async deleteHotel(id) {
    try {
      const response = await api.delete(`/hoteles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};