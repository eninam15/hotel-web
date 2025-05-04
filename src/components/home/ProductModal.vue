<template>
    <div class="modal fade show d-block" tabindex="-1" role="dialog" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog modal-lg modal-dialog-centered product-modal" role="document">
        <div class="modal-content shadow-xl border-radius-lg overflow-hidden">
          <!-- Header con gradiente y mejor posicionamiento -->
          <div class="modal-header bg-gradient-primary py-3">
            <h5 class="modal-title text-white mb-0 font-weight-bold">{{ product.title }}</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              aria-label="Close"
              @click="$emit('close')"
            ></button>
          </div>
          <div class="modal-body p-0">
            <div class="row g-0">
              <!-- Imagen con overlay para mobile -->
              <div class="col-md-6 position-relative product-image-container">
                <div class="position-relative h-100">
                  <img
                    :src="product.images[0]?.path || require('@/assets/img/no-producto.png')"
                    alt="product-image"
                    class="img-fluid w-100 h-100 product-image"
                  />
                  <div class="image-overlay d-md-none">
                    <div class="product-price-badge">
                      {{ formatCurrency(product.price) }}
                    </div>
                  </div>
                </div>
                <!-- Galería de miniaturas (si hay más de una imagen) -->
                <div v-if="product.images && product.images.length > 1" class="thumbnails-container">
                  <div 
                    v-for="(image, index) in product.images.slice(0, 4)" 
                    :key="index"
                    class="thumbnail"
                  >
                    <img :src="image.path" class="img-fluid border-radius-md" />
                  </div>
                </div>
              </div>
              
              <!-- Información del producto con mejor espaciado -->
              <div class="col-md-6">
                <div class="p-4 product-details">
                  <!-- Badge de disponibilidad -->
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="badge bg-gradient-success px-3 py-2" v-if="product.stock > 10">
                      <i class="fas fa-check-circle me-1"></i> En stock
                    </span>
                    <span class="badge bg-warning px-3 py-2" v-else-if="product.stock > 0">
                      <i class="fas fa-exclamation-circle me-1"></i> Pocas unidades
                    </span>
                    <span class="badge bg-danger px-3 py-2" v-else>
                      <i class="fas fa-times-circle me-1"></i> Agotado
                    </span>
                    
                    <!-- Precio visible solo en desktop -->
                    <h4 class="font-weight-bold text-primary m-0 d-none d-md-block">
                      {{ formatCurrency(product.price) }}
                    </h4>
                  </div>
                  
                  <!-- Descripción con scroll si es muy larga -->
                  <div class="description-container mb-3">
                    <h6 class="text-uppercase text-body text-xs font-weight-bolder">Descripción</h6>
                    <p class="mb-0 text-sm">{{ product.description }}</p>
                  </div>
                  
                  <!-- Información nutricional con formato mejorado -->
                  <div class="mb-3">
                    <h6 class="text-uppercase text-body text-xs font-weight-bolder">Información nutricional</h6>
                    <div class="p-2 bg-gray-100 border-radius-md">
                      <p class="mb-0 text-sm">{{ product.nutritional_information }}</p>
                    </div>
                  </div>
                  
                  <!-- Contador de cantidad -->
                  <div class="quantity-selector mb-4">
                    <h6 class="text-uppercase text-body text-xs font-weight-bolder mb-2">Cantidad</h6>
                    <div class="d-flex align-items-center">
                      <button 
                        class="btn btn-icon-only btn-rounded btn-outline-primary mb-0"
                        @click="decrementQuantity"
                        :disabled="quantity <= 1"
                      >
                        <i class="fas fa-minus"></i>
                      </button>
                      <span class="mx-3 font-weight-bold">{{ quantity }}</span>
                      <button 
                        class="btn btn-icon-only btn-rounded btn-outline-primary mb-0"
                        @click="incrementQuantity"
                        :disabled="quantity >= product.stock"
                      >
                        <i class="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                  
                  <!-- Botones con mejor estilo y organización -->
                  <div class="d-flex flex-wrap button-container">
                    <button
                      class="btn btn-lg bg-gradient-primary mb-0 me-2 add-to-cart-btn"
                      @click="addToCart"
                      :disabled="product.stock === 0"
                    >
                      <i class="fas fa-cart-plus me-2"></i> Agregar al carrito
                    </button>
                    <button
                      class="btn btn-lg btn-outline-primary mb-0 wishlist-btn"
                      @click="$emit('add-to-wishlist')"
                    >
                      <i class="fas fa-heart"></i>
                    </button>
                  </div>
                  
                  <!-- Información adicional para mobile -->
                  <div class="mt-3 d-md-none">
                    <div class="d-flex align-items-center">
                      <i class="fas fa-truck text-dark me-2"></i>
                      <span class="text-sm">Envío gratis en compras mayores a $50</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Footer con botones reposicionados -->
          <div class="modal-footer d-flex justify-content-between">
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="$emit('close')"
            >
              <i class="fas fa-arrow-left me-2"></i> Seguir comprando
            </button>
            <div class="d-none d-md-block">
              <button
                type="button"
                class="btn btn-sm btn-link text-secondary"
                @click="$emit('show-details')"
              >
                <i class="fas fa-info-circle me-1"></i> Ver detalles completos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ProductModal",
    props: {
      product: {
        type: Object,
        required: true,
      }
    },
    data() {
      return {
        quantity: 1
      };
    },
    methods: {
      formatCurrency(value) {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value);
      },
      incrementQuantity() {
        if (this.quantity < this.product.stock) {
          this.quantity++;
        }
      },
      decrementQuantity() {
        if (this.quantity > 1) {
          this.quantity--;
        }
      },
      addToCart() {
        this.$emit('add-to-cart', this.quantity);
      }
    },
  };
  </script>
  
  <style scoped>
  /* Estilos generales */
  .modal {
    z-index: 1050;
  }
  
  .modal-content {
    border: none;
  }
  
  .shadow-xl {
    box-shadow: 0 20px 27px 0 rgba(0, 0, 0, 0.05);
  }
  
  /* Estilos de la imagen */
  .product-image-container {
    height: 400px;
    overflow: hidden;
  }
  
  .product-image {
    object-fit: cover;
    object-position: center;
    transition: transform 0.3s ease;
  }
  
  .product-image:hover {
    transform: scale(1.05);
  }
  
  .image-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1rem;
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  }
  
  .product-price-badge {
    background: rgba(255,255,255,0.9);
    color: #344767;
    font-weight: bold;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    display: inline-block;
  }
  
  /* Contenedor con scroll para descripciones largas */
  .description-container {
    max-height: 100px;
    overflow-y: auto;
    scrollbar-width: thin;
  }
  
  .description-container::-webkit-scrollbar {
    width: 4px;
  }
  
  .description-container::-webkit-scrollbar-thumb {
    background-color: #d1d1d1;
    border-radius: 10px;
  }
  
  /* Galería de miniaturas */
  .thumbnails-container {
    position: absolute;
    bottom: 10px;
    left: 10px;
    right: 10px;
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  
  .thumbnail {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid white;
    box-shadow: 0 3px 5px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  
  .thumbnail:hover {
    transform: translateY(-5px);
  }
  
  .thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  /* Botones */
  .add-to-cart-btn {
    flex: 1;
  }
  
  .wishlist-btn {
    width: 50px;
    height: 50px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  
  .button-container {
    gap: 10px;
  }
  
  /* Adaptaciones responsivas */
  @media (max-width: 767.98px) {
    .modal-dialog {
      margin: 0.5rem;
      max-width: calc(100% - 1rem);
    }
    
    .product-details {
      padding: 1rem !important;
    }
    
    .product-image-container {
      height: 250px;
    }
    
    .add-to-cart-btn {
      width: 100%;
    }
    
    .button-container {
      margin-bottom: 1rem;
    }
    
    .modal-footer {
      padding: 0.75rem;
    }
    
    .thumbnails-container {
      position: static;
      margin-top: 10px;
      padding: 0 10px;
    }
    
    .thumbnail {
      width: 40px;
      height: 40px;
    }
  }
  
  /* Animaciones */
  .modal-content {
    animation: modalFadeIn 0.3s ease;
  }
  
  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>