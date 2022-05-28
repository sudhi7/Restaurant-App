function loadMenuFromAPI() {
    let promise = fetch('https://jsonblob.com/api/jsonBlob/980105242838581248').then(
        function(response) {
            return response.text();
        }).then(function(text) {
            return JSON.parse(text).categorys;
        }).then(function(categorys) {
            let menuItems = [];
            for(let i=0; i<categorys.length; i++) {
                let menuItem = categorys[i]['menu-items'];
                for(let j=0; j<menuItem.length; j++) {
                    menuItems.push(menuItem[j]);
                }
            }
            return menuItems;
        }).then(function(menuItems) {
            let food_items = [];
            for(let i=0; i<menuItems.length; i++) {
                let menuItem = menuItems[i];
                let food_name = menuItem['name'];
                let sub_items = menuItem['sub-items'];
                for(let j=0;j<sub_items.length;j++) {
                    let dish_name = food_name;
                    if(food_name !== sub_items[j]['name'])
                        dish_name = dish_name + " " + sub_items[j]['name'];
                    let food_item = {
                        dish_name: dish_name,
                        price: sub_items[j]['price'],
                        category_name: sub_items[j]['category_name']
                    }
                    food_items.push(food_item);
                }
            }
            return food_items;
        }).then(function(sub_items) {
            localStorage.setItem('menu', JSON.stringify(sub_items));
        });
}

function loadMenuFromLocal() {
    let ul_element = document.querySelector('ul');
    let menu = JSON.parse(localStorage.getItem('menu'));
    for(let i=0; i<menu.length; i++) {
        let li = document.createElement('li');
        li.id = i;
        li.draggable = 'true';
        li.addEventListener('dragstart', drag);
        let div = document.createElement('div');
        let h3 = document.createElement('h3');
        h3.textContent = menu[i].dish_name;
        div.appendChild(h3);
        let p = document.createElement('p');
        p.textContent = "Rs. " + menu[i].price;
        div.appendChild(p);
        let h5 = document.createElement('h5');
        h5.textContent = menu[i].category_name;
        div.appendChild(h5);
        li.appendChild(div);
        ul_element.appendChild(li);
    }
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }

function addTableDataToSession() {
    let ol = document.querySelector('ol');
    let li = ol.getElementsByTagName('li');
    let table_count = li.length;
    for(let i=0; i<table_count; i++) {
        let div = li[i].getElementsByTagName('div')[0];
        let h3 = div.getElementsByTagName('h3')[0];
        let table = {
            price: 0,
            count: 0,
            items : []
        }
        h3.id = h3.textContent;
        sessionStorage.setItem(h3.id, JSON.stringify(table));
    }
}

function initialisePage() {
    if(!localStorage.getItem('menu')) {
        loadMenuFromAPI();
    }
    loadMenuFromLocal();
    addTableDataToSession();
}

initialisePage();