function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    let food_item = ev.dataTransfer.getData("text");
    let food_cost = parseInt(getCostByID(food_item));
    let food_name = getFoodByID(food_item);
    let table_name = ev.target.id;
    let table = JSON.parse(sessionStorage.getItem(table_name));
    let table_bill = parseInt(table.price);
    table_bill += food_cost;
    let table_count = parseInt(table.count);
    ++table_count;
    let table_items = addFoodToBill(table.items, food_name, food_cost);
    table.price = table_bill;
    table.count = table_count;
    table.items = table_items;
    sessionStorage.setItem(table_name, JSON.stringify(table));
    updateBillSummary(table_name);
}

function getCostByID(food_item) {
    return JSON.parse(localStorage.getItem("menu"))[food_item]['price'];
}

function getFoodByID(food_item) {
    return JSON.parse(localStorage.getItem("menu"))[food_item]['dish_name'];
}

function addFoodToBill(items, food_name, food_cost) {
    for(let i=0; i<items.length; i++) {
        if(items[i]['item'] == food_name) {
            items[i]['quantity'] ++;
            return items;
        }
    }
    items.push({
        item: food_name,
        cost: food_cost,
        quantity: 1
    })
    return items;
}

function updateBillSummary(table_name) {
    let div = document.getElementById(table_name).parentElement;
    let p = div.getElementsByTagName('p')[0];
    let price = getTotalBillPriceOfTable(table_name);
    let count = getTotalBillCountOfTable(table_name);
    p.textContent = `Rs. ${price} | Total Items: ${count}`;
}

function getTotalBillPriceOfTable(table_name) {
    return JSON.parse(sessionStorage.getItem(table_name))["price"];
}

function getTotalBillCountOfTable(table_name) {
    return JSON.parse(sessionStorage.getItem(table_name))["count"];
}

function toggleModal(event) {
    if(event.target != closeButton) {
        let table_id = getTableID(event.target);
        generateBill(table_id);
    }
    else {
        cleanBill();
    }
    modal.classList.toggle("show-modal");
}

function getTableID(node) {
    if(node.nodeName == "H3") {
        return node.id;
    }
    else if(node.nodeName == "P") {
        return node.parentElement.getElementsByTagName('h3')[0].id;
    }
    return node.getElementsByTagName('h3')[0].id;
}

function generateBill(table_id) {
    updateBillHeading(table_id);
    addBillColumns();
    addTableItemsToBill(table_id);
    addTotalAmount(table_id);
}

function updateBillHeading(table_id) {
    document.getElementById('bill_heading').textContent = `${table_id} | Order Details`;
}

function addBillColumns() {
    let table = document.getElementById("table_bill");
    let table_row = document.createElement("tr");
    let sno = document.createElement("th");
    sno.textContent = "S.No";
    table_row.appendChild(sno);
    let item = document.createElement("th");
    item.textContent = "Item";
    table_row.appendChild(item);
    let price = document.createElement("th");
    price.textContent = "Price";
    table_row.appendChild(price);
    let quantity = document.createElement("th");
    quantity.textContent = "Quantity";
    table_row.appendChild(quantity);
    let delete_row = document.createElement("th");
    table_row.appendChild(delete_row);
    table.appendChild(table_row);
}

function addTableItemsToBill(table_id) {
    let table = document.getElementById("table_bill");
    let table_items = JSON.parse(sessionStorage.getItem(table_id))['items'];
    let items_length = table_items.length;
    for(let i=1; i<=items_length; i++) {
        let table_row = document.createElement("tr");
        let sno = document.createElement("td");
        sno.textContent = i;
        table_row.appendChild(sno);
        let item = document.createElement("td");
        item.textContent = table_items[i-1]['item'];
        table_row.appendChild(item);
        let price = document.createElement("td");
        price.textContent = table_items[i-1]['cost'];
        table_row.appendChild(price);
        let quantity = document.createElement("td");
        let data = document.createElement("input");
        data.value = table_items[i-1]['quantity'];
        data.min = "1";
        data.type = "number";
        data.name = "quantity";
        data.addEventListener("change", changeQuantity);
        quantity.appendChild(data);
        table_row.appendChild(quantity);
        let remove = document.createElement("td");
        remove.innerHTML = '<i class="fa-solid fa-trash"></i>';
        remove.addEventListener("click", removeItemFromBill);
        table_row.appendChild(remove);
        table.appendChild(table_row);
    }
}

function addTotalAmount(table_id) {
    let section = document.getElementById("table_bill").parentElement;
    let h4 = document.createElement('h4');
    h4.textContent = "Total Amount: Rs." + JSON.parse(sessionStorage.getItem(table_id))['price'] + "/-";
    section.appendChild(h4);
}

function cleanBill() {
    let table = document.getElementById("table_bill");
    while(table.firstChild) {
        table.lastChild.remove();
    }
    let section = table.parentElement;
    section.lastChild.remove();
}

function closeSession(event) {
    let table_name = getTableNameFromHeader(event.target.parentElement.parentElement);
    initialiseSessionItem(table_name);
    updateBillSummary(table_name);
    cleanBill();
    modal.classList.toggle("show-modal");
}

function initialiseSessionItem(table_name) {
    let bill_data = JSON.parse(sessionStorage.getItem(table_name));
    bill_data['items'] = [];
    bill_data['price'] = 0;
    bill_data['count'] = 0;
    sessionStorage.setItem(table_name, JSON.stringify(bill_data));
}

function changeQuantity(event) {
    let qty = event.target.value;
    let sno = event.target.parentElement.parentElement.getElementsByTagName('td')[0];
    let index = parseInt(sno.textContent) - 1;
    let table_name = getTableNameFromHeader(event.target.parentElement.parentElement.parentElement.parentElement.parentElement);
    changeQuantityFromSession(table_name, index, qty);
    updateTotalAmount(table_name);
    updateBillSummary(table_name);
}

function getTableNameFromHeader(bill) {
    let header = bill.getElementsByTagName('header')[0];
    let h3 = header.getElementsByTagName('h3')[0];
    let table_name = h3.textContent;
    let index = table_name.indexOf(' ');
    return table_name.substring(0,index);
}

function changeQuantityFromSession(table_name, index, qty) {
    let bill_data = JSON.parse(sessionStorage.getItem(table_name));
    let items = bill_data['items'];
    let item = items[index];
    let unit_cost = item['cost'];
    let extra_qty = qty - item['quantity'];
    item['quantity'] = qty;
    let extra_cost = unit_cost * extra_qty;
    items[index] = item;
    bill_data['count'] += extra_qty;
    bill_data['price'] += extra_cost;
    bill_data['items'] = items;
    sessionStorage.setItem(table_name, JSON.stringify(bill_data));
}

function updateTotalAmount(table_id) {
    let section = document.getElementById("table_bill").parentElement;
    let h4 = section.getElementsByTagName('h4')[0];
    h4.textContent = "Total Amount: Rs." + JSON.parse(sessionStorage.getItem(table_id))['price'] + "/-";
}

function removeItemFromBill(event) {
    let div = event.target.parentElement.parentElement.parentElement.parentElement.parentElement;
    let table_name = getTableNameFromHeader(div);
    let sno = parseInt(event.target.parentElement.parentElement.getElementsByTagName('td')[0].textContent);
    removeItemFromSession(table_name, sno-1);
    cleanBill();
    generateBill(table_name);
}

function removeItemFromSession(table_name, index) {
    let bill_data = JSON.parse(sessionStorage.getItem(table_name));
    let items = bill_data['items'];
    let item = items[index];
    let unit_cost = parseInt(item['cost']);
    let qty = parseInt(item['quantity']);
    let cost = unit_cost * qty;
    items.splice(index,1);
    bill_data['items'] = items;
    bill_data['price'] = parseInt(bill_data['price']) - cost;
    bill_data['count'] =parseInt(bill_data['count']) - qty;
    sessionStorage.setItem(table_name, JSON.stringify(bill_data));
    updateBillSummary(table_name);
}

const triggers = document.getElementsByTagName('ol')[0].getElementsByTagName('li');
const modal = document.querySelector(".modal");
for(let i=0; i<triggers.length; i++) {
    triggers[i].addEventListener("click", toggleModal);
}
const closeButton = document.querySelector(".close-button");
closeButton.addEventListener("click", toggleModal);

const div = document.getElementsByTagName('footer')[0].getElementsByTagName('div')[0];
div.addEventListener("click", closeSession);
