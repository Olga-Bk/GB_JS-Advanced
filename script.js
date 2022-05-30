// const BASE_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/';
// const GET_GOODS_ITEMS = `${BASE_URL}catalogData.json`
// const GET_BASKET_GOODS_ITEMS = `${BASE_URL}getBasket.json`

const BASE_URL = 'http://localhost:8000/';
const GET_GOODS_ITEMS = `${BASE_URL}goods`
const GET_BASKET_GOODS_ITEMS = `${BASE_URL}basketgoods`

function service(url) {
  return fetch(url)
    .then((res) => res.json())
}

function servicePost(url, body) {
  return fetch(url, {
    method: 'POST',
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(body)
  })
}

function serviceDelete(url, id) {
  return fetch(`${url}/${id}`, {
    method: 'DELETE',
  })
}

function init() {

  const Search = Vue.component('search', {
    props: [
      'value'
    ],
    template: `
    <div class="search">
    <input type="text" class="goods-search" :value="value" @input="$emit('input',$event.target.value)/>
    // <button class="search-button" type="button" v-on:click="$emit('searchclick')">Искать</button>
</div>
    `
  })

  const CustomButton = Vue.component('button', {
    template: `
      <button class="search-button" type="button" v-on:click="$emit('click')">
         <slot></slot>
      </button>
    `
  })
  const basketGoods = Vue.component('basket-goods', {
    data() {
      return {
        basketGoodsItems: []
      }
    },
    template: `

    <div class="fixed-area">
         <div class="basket-card">
            <div class="basket-card__header">
               <h1 class="basket-card__header__title">basket card</h1>
               <div class="basket-card__header__delete-icon"
                  v-on:click="$emit('closeclick')"
               ></div>
            </div>
            <div class="basket-card__content">
               <basket-item v-for="item in basketGoodsItems" :item="item"></basket-item>

            </div>
         </div>
      </div>


      // <div v-if="isBasketVisible" class="basket">
      //               <div class="basket-item" v-for="item in filteredItems">
      //                   <h3>{{ item.product_name }}</h3>
      //                   <p>{{ item.price }}</p>
      //               </div>
      //           </div>
    `,
    mounted() {
      service(GET_BASKET_GOODS_ITEMS).then((basketGoods) => {
        this.basketGoodsItems = basketGoods
      })
    }
  })

  const goodsItem = Vue.component('goods-item', {
    props: [
      'item'
    ],
    template: `
      <div class="goods-item">
         <h3>{{ item.product_name }}</h3>
         <p>{{ item.price }}</p>
         <custom-button @click="$emit("addgood", item.id)>Добавить</custom-button>
      </div>
    `
  })

  const app = new Vue({
    el: '#root',
    data: {
      items: [],
      search: '',
      isBasketVisible: false,
    },
    methods: {

      setVisionCard() {
        this.cardIsVision = !this.cardIsVision
      },
      fetchGoods() {
        service(GET_GOODS_ITEMS).then((data) => {
          this.items = data;
          this.filteredItems = data;
        });
      },

      addGood(goodId) {
        servicePost(GET_BASKET_GOODS_ITEMS, {
          id: goodId,
        })
      },

      deleteGood (goodId){
        serviceDelete(GET_BASKET_GOODS_ITEMS, {
          id: goodId,
        })
      },

      
      // seachChangeHandler(value){
      //   this.seach = value;
      // }

    },
    computed: {
      calculatePrice() {
        return this.filteredItems.reduce((prev, {
          price
        }) => {
          return prev + price;
        }, 0)
      }
    },
    filteredItems() {
      return this.filteredItems = this.items.filter(({ product_name }) => {
        return product_name.match(new RegExp(this.search, 'gui'))
      })
    },
    
    mounted() {
      this.fetchGoods();
    }
  })
}
window.onload = init