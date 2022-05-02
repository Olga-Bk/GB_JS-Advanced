const goods = [
  { title: 'Shirt', price: 150 },
  { title: 'Socks', price: 50 },
  { title: 'Jacket', price: 350 },
  { title: 'Shoes', price: 250 },
];

const BASE_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/';
const GET_GOODS_ITEMS = `${BASE_URL}catalogData.json`
const GET_BASKET_GOODS_ITEMS = `${BASE_URL}getBasket.json`

function service(url) {
  return fetch(url)
  .then((res) => res.json())
  }


class GoodsItem {
  constructor({ product_name, price }) {
    this.product_name = product_name;
    this.price = price;
  }
  render() {
    return `
    <div class="goods-item">
      <h3>${this.product_name}</h3>
      <p>${this.price}</p>
    </div>
  `;
  }
}

class GoodsList {
  items = [];
  filteredItems = []
  fetchGoods() {
    return service(GET_GOODS_ITEMS).then((data) => {
      this.items = data;
      this.filteredItems = data;
    });
  }
  filterItems(value) {
    this.filteredItems = this.items.filter(({ product_name }) => {
      return product_name.match(new RegExp(value, 'gui'))
    })
  }
  calculatePrice() {
    return this.items.reduce((prev, { price }) => {
      return prev + price;
    }, 0)
  }
  render() {
    const goods = this.filteredItems.map(item => {
      const goodItem = new GoodsItem(item);
      return goodItem.render()
    }).join('');
  
    document.querySelector('.goods-list').innerHTML = goods;
  }
}

class BasketGoodsList {
  items = [];
  fetchGoods() {
    return service(GET_BASKET_GOODS_ITEMS).then((data) => {
      this.items = data.contents;
    });
  }
}

const goodsList = new GoodsList();
goodsList.fetchGoods().then(() => {
  goodsList.render();
});

const basketGoodsList = new BasketGoodsList();
basketGoodsList.fetchGoods();

document.getElementsByClassName('search-button')[0].addEventListener('click', () => {
  const value = document.getElementsByClassName('goods-search')[0].value;
  goodsList.filterItems(value);
  goodsList.render();
})