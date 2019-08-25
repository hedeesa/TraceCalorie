// storage controller
const StorageCtrl = (function() {
  return {
    storeItem: function(item) {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      items.push(item);
      localStorage.setItem("items", JSON.stringify(items));
    },
    getFromLocalStorage: function() {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateLocalStorage: function(newItem) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach((item, index) => {
        if (item.id === newItem.id) {
          items.splice(index, 1, newItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteFromLocalStorage: function(id) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach((item, index) => {
        if (item.id === id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearStorage: function() {
      localStorage.removeItem("items");
    }
  };
})();

// Item controller
const ItemCtrl = (function() {
  //constructor
  const Item = function(id, name, calorie) {
    this.id = id;
    this.name = name;
    this.calorie = calorie;
  };

  //Data structor
  const data = {
    items: StorageCtrl.getFromLocalStorage(),
    currentItem: null,
    totalCalorie: 0
  };
  return {
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    getItems: function() {
      return data.items;
    },
    logData: function() {
      return data;
    },
    addItem: function(meal, calorie) {
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      const newItem = new Item(ID, meal, Number(calorie));
      console.log(newItem);
      data.items.push(newItem);

      return newItem;
    },
    calculateCalories: function() {
      let total = 0;
      data.items.forEach(item => {
        total += item.calorie;
      });
      data.totalCalorie = total;
      return data.totalCalorie;
    },
    getElementById: function(id) {
      let found;
      data.items.forEach(item => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function(name, calorie) {
      let found;
      data.items.forEach(item => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calorie = calorie;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(id) {
      const ids = data.items.map(function(item) {
        return item.id;
      });
      const index = ids.indexOf(id);
      data.items.splice(index, 1);
    },
    clearItems: function() {
      data.items = [];
    }
  };
})();

// Ui Contorller
const UICtrl = (function() {
  const UISelectors = {
    itemList: "#list",
    lis: "#list li",
    addBtn: "#add-meal",
    updateBtn: "#update-meal",
    deleteBtn: "#delete-meal",
    backBtn: "#back",
    editBtn: ".edit",
    clearBtn: "#clearBtn",
    mealInput: "#meal-input",
    calorieInput: "#colarie-input",
    totalCalorie: "#total-calorie"
  };
  return {
    populateItemList: function(items) {
      let html = "";

      items.forEach(item => {
        html += `<li id="item-${item.id}">
        <div class="li-content">
          <span class="li-meal">${item.name}</span>:
          <span class="li-calorie">${item.calorie} Calories</span>
        </div>
        <a href="#"><i class="fas fa-pencil-alt color-secondary edit"></i></a>
      </li>`;
      });

      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getInputs: function() {
      return {
        meal: document.querySelector(UISelectors.mealInput).value,
        calorie: Number(document.querySelector(UISelectors.calorieInput).value)
      };
    },
    getSelectors: function() {
      return UISelectors;
    },
    addtoList: function(item) {
      let li = document.createElement("li");
      li.id = `item-${item.id}`;
      li.innerHTML = `<div class="li-content">
        <span class="li-meal">${item.name}</span>:
        <span class="li-calorie">${item.calorie} Calories</span>
      </div>
      <a href="#"><i class="fas fa-pencil-alt color-secondary edit"></i></a>`;

      document.querySelector(UISelectors.itemList).appendChild(li);
    },
    clearInputs: function() {
      document.querySelector(UISelectors.mealInput).value = "";
      document.querySelector(UISelectors.calorieInput).value = "";
    },
    updateTotalCalories: function() {
      const totalCalorie = ItemCtrl.calculateCalories();
      document.querySelector(
        UISelectors.totalCalorie
      ).textContent = totalCalorie;
    },
    readyToGetState: function() {
      document.querySelector(UISelectors.addBtn).style.display = "block";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.updateBtn).style.display = "none";

      document.querySelector(UISelectors.mealInput).value = "";
      document.querySelector(UISelectors.calorieInput).value = "";
    },
    addItemtoForm: function() {
      document.querySelector(
        UISelectors.mealInput
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelectors.calorieInput
      ).value = ItemCtrl.getCurrentItem().calorie;
      this.showEditState();
    },
    showEditState: function() {
      document.querySelector(UISelectors.addBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
    },
    updateList: function(item) {
      let lis = document.querySelectorAll(UISelectors.lis);
      lis = Array.from(lis);

      lis.forEach(li => {
        if (li.id === `item-${item.id}`) {
          document.querySelector(
            `#${li.id}`
          ).innerHTML = `<div class="li-content">
          <span class="li-meal">${item.name}</span>:
          <span class="li-calorie">${item.calorie} Calories</span>
        </div>
        <a href="#"><i class="fas fa-pencil-alt color-secondary edit"></i></a>`;
        }
      });
    },
    deleteFromList: function(id) {
      const liID = `item-${id}`;

      document.getElementById(liID).remove();
    },
    clearList: function() {
      document.querySelector(UISelectors.itemList).innerHTML = "";
    }
  };
})();
// App controller
const AppCtrl = (function(ItemCtrl, StorageCtrl, UICtrl) {
  const loadEventListener = function() {
    const selectors = UICtrl.getSelectors();

    document
      .querySelector(selectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    document
      .querySelector(selectors.itemList)
      .addEventListener("click", editMeal);

    document
      .querySelector(selectors.updateBtn)
      .addEventListener("click", updateMeal);

    document
      .querySelector(selectors.deleteBtn)
      .addEventListener("click", deleteMeal);

    document
      .querySelector(selectors.backBtn)
      .addEventListener("click", UICtrl.readyToGetState);

    document
      .querySelector(selectors.clearBtn)
      .addEventListener("click", clearAll);
  };

  const itemAddSubmit = function() {
    const inputs = UICtrl.getInputs();
    if (inputs.meal !== "" && inputs.calorie !== "") {
      const newItem = ItemCtrl.addItem(inputs.meal, inputs.calorie);

      UICtrl.addtoList(newItem);

      UICtrl.updateTotalCalories();

      StorageCtrl.storeItem(newItem);

      UICtrl.clearInputs();
    }
  };
  const editMeal = function(e) {
    if (e.target.classList.contains("edit")) {
      let id = e.target.parentNode.parentNode.id;
      id = parseInt(id.split("-")[1]);

      const itemToEdit = ItemCtrl.getElementById(id);

      ItemCtrl.setCurrentItem(itemToEdit);

      UICtrl.addItemtoForm();
    }
  };

  const updateMeal = function() {
    const inputs = UICtrl.getInputs();
    const item = ItemCtrl.updateItem(inputs.meal, inputs.calorie);

    UICtrl.updateList(item);
    UICtrl.updateTotalCalories();

    StorageCtrl.updateLocalStorage(item);

    UICtrl.readyToGetState();
  };
  const deleteMeal = function() {
    const item = ItemCtrl.getCurrentItem();

    ItemCtrl.deleteItem(item.id);

    UICtrl.deleteFromList(item.id);

    UICtrl.updateTotalCalories();

    StorageCtrl.deleteFromLocalStorage(item.id);

    UICtrl.readyToGetState();
  };
  const clearAll = function() {
    ItemCtrl.clearItems();

    UICtrl.clearList();

    UICtrl.updateTotalCalories();

    StorageCtrl.clearStorage();

    UICtrl.readyToGetState();
  };
  return {
    init: function() {
      UICtrl.readyToGetState();
      console.log("initializing");
      const items = ItemCtrl.getItems();
      UICtrl.updateTotalCalories();
      loadEventListener();
      UICtrl.populateItemList(items);
    }
  };
})(ItemCtrl, StorageCtrl, UICtrl);

AppCtrl.init();
