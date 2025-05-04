<template>
    <div class="mb-4 col-xl-2 col-md-6">
      <div class="card product-card shadow-sm">
        <div class="card-wrapper">
          <div class="image-wrapper position-relative">
            <div class="ribbon-wrapper" v-if="false">
              <div class="ribbon bg-gradient-primary">
                {{ ribbonText }}
              </div>
            </div>
  
            <a class="d-block border-radius-xl">
              <img
                :src="
                  product.images[0]?.path || require('@/assets/img/no-producto.png')
                "
                alt="product-image"
                class="img-fluid border-radius-xl img-custom"
              />
            </a>
  
            <span
              class="badge position-absolute top-0 start-0 bg-primary text-dark m-2"
            >
              {{ product.label }}
            </span>
            <a
              class="position-absolute top-0 end-0 text-white m-2 cursor"
              @click="$emit('add-to-wishlist', product.id)"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Añadir a la lista de deseos"
            >
              <i class="fas fa-heart icon-heart"></i>
            </a>
          </div>
          <div class="content-wrapper px-3 pb-3 pt-1">
            <div class="product-info">
              <h6 class="card-title text-truncate cursor">{{ product.name }}</h6>
              <!-- Rating Stars -->
              <div class="rating mb-2">
                <i
                  v-for="star in 5"
                  :key="star"
                  class="fas fa-star"
                  :class="star <= product.rating ? 'text-warning' : 'text-muted'"
                ></i>
                <span class="rating-count ms-1">({{ product.ratingCount }})</span>
              </div>
              <div class="d-flex align-items-center justify-content-between">
                <span class="text-success fw-bold fs-6"
                  >{{ product.price }} bs</span
                >
                <span class="text-muted small">Stock: {{ product.stock }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <template v-if="!product.in_cart">
                  <a
                    class="add-to-cart"
                    @click="addToCart"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Agregar al carrito"
                  >
                    AGREGAR <i class="fas fa-cart-plus"></i>
                  </a>
                </template>
                <template v-else>
                  <div class="d-flex align-items-center gap-2">
                    <div class="quantity-control d-flex align-items-center">
                      <button
                        class="btn-quantity"
                        @click="updateQuantity('subtract')"
                      >
                        <i class="fa fa-minus"></i>
                      </button>
                      <input
                        type="text"
                        v-model="cartQuantity"
                        class="quantity-input"
                        :max="product.stock"
                        @input="validateInput"
                        @blur="updateQuantity('replace')"
                      />
                      <button class="btn-quantity" @click="updateQuantity('add')">
                        <i class="fa fa-plus"></i>
                      </button>
                    </div>
                    <a
                      class="delete-btn"
                      @click="removeFromCart"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Eliminar del carrito"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </a>
                  </div>
                </template>
                <a
                  class="text-secondary cursor"
                  @click="openDetailsModal"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Ver detalles"
                >
                  <i class="fas fa-eye"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductModal
        v-if="showModal"
        :product="product"
        @close="showModal = false"
        @add-to-cart="addToCart"
        @add-to-wishlist="$emit('add-to-wishlist', product.id)"
      />
    </div>
  </template>
  
  <script>
  import ProductModal from "./ProductModal.vue";
  //import userStore from "@/store/userStore";
  
  export default {
    name: "ProductCard",
    components: { ProductModal },
    props: {
      product: {
        type: Object,
        required: true,
      },
    },
    emits: [
      "add-to-cart",
      "update-quantity-item",
      "delete-product-cart",
      "add-to-wishlist",
    ],
    data() {
      return {
        //userStore,
        showModal: false,
        cartQuantityUpdated: 0,
      };
    },
    computed: {
      //isAuthenticated() {
        //return this.userStore.isAuthenticated();
      //},
      cartQuantity: {
        get() {
          return this.product.cart_quantity;
        },
        set(value) {
          this.cartQuantityUpdated = value;
        },
      },
      inStock() {
        return this.product.stock > 0;
      },
      ribbonText() {
        return "PROMO";
      },
    },
    methods: {
      openDetailsModal() {
        this.showModal = true;
      },
      validateInput() {
        if (this.cartQuantity < 1) {
          this.cartQuantity = 1;
        }
        if (this.cartQuantity > this.product.stock) {
          this.cartQuantity = this.product.stock;
        }
      },
      updateQuantity(operation) {
        switch (operation) {
          case "add":
            if (this.cartQuantity < this.product.stock) {
              this.increaseQuantity();
            }
            break;
          case "subtract":
            this.decreaseQuantity();
            break;
          case "replace":
            this.validateInput();
            this.$emit("update-quantity-item", this.product.id, {
              quantity: this.cartQuantityUpdated,
              operation: "replace",
            });
            break;
        }
      },
      increaseQuantity() {
        const newQuantity = this.cartQuantity * 1 + 1;
        if (newQuantity <= this.product.stock) {
          this.$emit("update-quantity-item", this.product.id, {
            quantity: 1,
            operation: "add",
          });
        }
      },
      decreaseQuantity() {
        if (this.cartQuantity > 1) {
          this.$emit("update-quantity-item", this.product.id, {
            quantity: 1,
            operation: "subtract",
          });
        } else {
          this.removeFromCart();
        }
      },
      removeFromCart() {
        this.$emit("delete-product-cart", this.product.id);
      },
      addToCart() {
        if(this.isAuthenticated){
          this.$emit("add-to-cart", this.product);
        }else{
          this.$notify({
          type: "warning",
          title: "Usuario no autenticado",
          text: "Para Agregar productos al carrito debe de autenticarse o crear una cuenta",
        });
        }
        
      },
    },
  };
  </script>
  
  <style scoped>
  .img-custom {
    width: 100%;
    height: 180px;
    object-fit: contain;
  }
  
  .icon-heart {
    color: rgb(180, 180, 180);
    transition: all 0.3s ease;
  }
  
  .icon-heart:hover {
    color: red;
  }
  
  .icon-heart.active {
    color: red;
  }
  
  .add-to-cart {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 18px;
    background-color: #5e72e4;
    color: rgb(255, 255, 255);
    font-weight: 600;
    font-size: 0.9rem;
    text-decoration: none;
    border-radius: 6px;
    transition: background-color 0.3s ease, transform 0.2s ease;
    cursor: pointer;
    border: none;
  }
  
  .add-to-cart i {
    font-size: 1rem;
  }
  
  .add-to-cart:hover {
    background-color: #4355b9; /* Color más oscuro al pasar el mouse */
    transform: scale(1.005);
  }
  
  .add-to-cart:active {
    transform: scale(0.95);
  }
  
  .quantity-control {
    background: #fff;
    border-radius: 8px;
    padding: 2px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .btn-quantity {
    border: none;
    background: transparent;
    color: #344767;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.2s ease;
    padding: 0;
  }
  
  .btn-quantity:hover {
    background: #f8f9fa;
  }
  
  .quantity-input {
    width: 40px;
    border: none;
    text-align: center;
    background: transparent;
    color: #344767;
    font-size: 0.875rem;
    padding: 0;
    -moz-appearance: textfield;
  }
  
  .quantity-input::-webkit-outer-spin-button,
  .quantity-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  .delete-btn {
    color: #cb0c9f;
    cursor: pointer;
    transition: color 0.2s ease;
    font-size: 0.875rem;
  }
  
  .delete-btn:hover {
    color: #e31cc0;
  }
  
  /* Rating stars styles */
  .rating {
    display: flex;
    align-items: center;
  }
  
  .rating .fa-star {
    font-size: 0.875rem;
    margin-right: 2px;
  }
  
  .rating .text-warning {
    color: #ffd700 !important;
  }
  
  .rating-count {
    font-size: 0.75rem;
    color: #67748e;
  }
  
  .ribbon-wrapper {
    width: 150px;
    height: 150px;
    overflow: hidden;
    position: absolute;
    top: -10px;
    left: -10px;
    z-index: 1;
  }
  
  .ribbon {
    position: relative;
    left: -35px;
    top: 30px;
    width: 170px;
    padding: 7px 0;
    background-image: linear-gradient(310deg, #7928ca 0%, #ff0080 100%);
    color: #fff;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    text-transform: uppercase;
    text-align: center;
    font-weight: bold;
    font-size: 0.75rem;
    line-height: 1;
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  }
  
  .ribbon:before,
  .ribbon:after {
    content: "";
    border-top: 3px solid #6e0045;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    position: absolute;
    bottom: -3px;
  }
  
  .ribbon:before {
    left: 0;
  }
  
  .ribbon:after {
    right: 0;
  }
  
  /* Mobile Responsive Layout */
  @media (max-width: 767px) {
    .card-wrapper {
      display: flex;
      flex-direction: row;
    }
  
    .image-wrapper {
      width: 120px;
      min-width: 120px;
    }
  
    .img-custom {
      height: 120px;
      width: 120px;
    }
  
    .content-wrapper {
      flex: 1;
    }
  
    .card-title {
      font-size: 0.9rem;
      margin-bottom: 0.1rem;
    }
  
    .card-text {
      font-size: 0.8rem;
      margin-bottom: 0.1rem;
    }
  
    .rating {
      margin-bottom: 0.1rem;
    }
  
    .rating .fa-star {
      font-size: 0.8rem;
    }
    .ribbon-wrapper {
      width: 100px;
      height: 100px;
      top: -5px;
      left: -5px;
    }
  
    .ribbon {
      width: 120px;
      padding: 5px 0;
      left: -30px;
      top: 20px;
      font-size: 0.65rem;
    }
  }
  </style>
  