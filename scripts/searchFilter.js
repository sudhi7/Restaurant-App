function searchMenu() {
    var input, filter, ul, li, i, div, h3, h5;
    input = document.getElementById('food_input');
    filter = input.value.toUpperCase();
    ul = document.getElementById("menu_items");
    li = ul.getElementsByTagName('li');
    for (i = 0; i < li.length; i++) {
      div = li[i].getElementsByTagName('div')[0];
      h3 = div.getElementsByTagName('h3')[0];
      h5 = div.getElementsByTagName('h5')[0];
      let item_name = h3.textContent;
      let item_category = h5.textContent;
      if (item_name.toUpperCase().indexOf(filter) > -1 || item_category.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }

  function searchTable() {
      var input, filter, ol, li, i, div, h3, p;
      input = document.getElementById('table_input');
      filter = input.value.toUpperCase();
      ol = document.getElementById("tables");
      li = ol.getElementsByTagName('li');
      for(i=0; i<li.length; i++) {
        div = li[i].getElementsByTagName('div')[0];
        h3 = div.getElementsByTagName('h3')[0];
        let table_name = h3.textContent;
        if(table_name.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        }
        else {
            li[i].style.display = "none";
        }
      }
  }