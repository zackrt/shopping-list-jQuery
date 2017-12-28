'use strict';


// for a shopping list, our data model is pretty simple.
// we just have an array of shopping list items. each one
// is an object with a `name` and a `checked` property that
// indicates if it's checked off or not.
// we're pre-adding items to the shopping list so there's
// something to see when the page first loads.
const STORE = [
  {name: "apples", checked: false},
  {name: "oranges", checked: false},
  {name: "milk", checked: true},
  {name: "bread", checked: false}
];


// this function is reponsible for generating an HTML string representing
// a shopping list item. `item` is the object representing the list item.
// `itemIndex` is the index of the item from the shopping list array (aka,
// `STORE`).
function generateItemElement(item, itemIndex, template) {
  // we use an ES6 template string
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


// this function is reponsible for generating all the `<li>`s that will eventually get
// inserted into the shopping list `ul` in the com. it takes one argument,
// `shoppingList` which is the array representing the data in the shopping list.
function generateShoppingItemsString(shoppingList) {
  console.log("Generating shopping list element");
  // `items` will be an array of strings representing individual list items.
  // we use the array `.map` function
  // (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map?v=control)
  // to loop through `shoppingList`. For each item in `shoppingList`, we...
  const items = shoppingList.map(
    (item, index) => generateItemElement(item, index));
  // this function is responsible for returning a string, but `items` is an array.
  // we return `items.join` because that will join the individual strings in `items`
  // together into a single string.
  return items.join();
}


// we call `generateShoppingItemsString` to generate the string representing
  // the shopping list items
function renderShoppingList() {
  console.log("Rendering shopping list");
  // we call `generateShoppingItemsString` to generate the string representing
  // the shopping list items
  const shoppingListItemsString = generateShoppingItemsString(STORE);
  // we then find the `SHOPPING_LIST_ELEMENT_CLASS` element in the DOM,
  // (which happens to be a `<ul>` with the class `.js-shopping-list` on it )
  // and set its inner HTML to the value of `shoppingListItemsString`.
  $('.js-shopping-list').html(shoppingListItemsString);
}


// name says it all. responsible for adding a shopping list item.
function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  // adding a new item to the shopping list is as easy as pushing a new
  // object onto the `STORE` array. we set `name` to `itemName` and default
  // the new item to be unchecked (`checked: false`).
  //
  // Note that this function intentionally has *side effects* -- it mutates
  // the global variable STORE (defined at the top of this file).
  // Ideally you avoid side effects whenever possible,
  // and there are good approaches to these sorts of situations on the front
  // end that avoid side effects, but they are a bit too complex to get into
  // here. Later in the course, when you're learning React though, you'll
  // start to learn approaches that avoid this.
  STORE.push({name: itemName, checked: false});
}


// name says it all. responsible for deleting a list item.
function deleteListItem(itemIndex) {
  console.log(`Deleting item at index "${itemIndex}" from shopping list`);
  // as with `addItemToShoppingLIst`, this function also has the side effect of
  // mutating the global STORE value.
  //
  // we call `.splice` at the index of the list item we want to remove, with a length
  // of 1. this has the effect of removing the desired item, and shifting all of the
  // elements to the right of `itemIndex` (if any) over one place to the left, so we
  // don't have an empty space in our list.
  STORE.splice(itemIndex, 1);
}


// this function is reponsible for toggling the `checked` attribute on an item.
function toggleCheckedForListItem(itemIndex) {
  console.log(`Toggling checked property for item at index ${itemIndex}`);
  // if `checked` was true, it becomes false, and vice-versa. also, here again
  // we're relying on side effect / mutating the global `STORE`
  STORE[itemIndex].checked = !STORE[itemIndex].checked;
}


// responsible for watching for new item submissions. when those happen
// it gets the name of the new item element, zeros out the form input value,
// adds the new item to the list, and re-renders the shopping list in the DOM.
function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    // stop the default form submission behavior
    event.preventDefault();

    // we get the item name from the text input in the submitted form
    const newItemName = $('.js-shopping-list-entry').val();
    // now that we have the new item name, we remove it from the input so users
    // can add new items
    $('.js-shopping-list-entry').val("");
    // update the shopping list with the new item...
    addItemToShoppingList(newItemName);
    // then render the updated shopping list
    renderShoppingList();
  });
}


// this function is responsible for retieving the array index of a
// shopping list item in the DOM. recall that we're storing this value
// in a `data-item-index` attribute on each list item element in the DOM.
function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  // the value of `data-item-index` will be a string, so we need to convert
  // it to an integer, using the built-in JavaScript `parseInt` function.
  return parseInt(itemIndexString, 10);
}


// this function is responsible for noticing when users click the "checked" button
// for a shopping list item. when that happens it toggles the checked styling for that
// item.
function handleItemCheckClicked() {
  // note that we have to use event delegation here because list items are not originally
  // in the DOM on page load.
  $('.js-shopping-list').on("click", ".js-item-toggle", event => {
    // call the `getItemIndexFromElement` function just above on the target of
    // the current, clicked element in order to get the index of the clicked
    // item in `STORE`
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    // toggle the clicked item's checked attribute
    toggleCheckedForListItem(itemIndex);
    // render the updated shopping list
    renderShoppingList();
  });
}


// this function is responsible for noticing when users click the "Delete" button for
// a shopping list item. when that happens, it removes the item from the shopping list
// and then rerenders the updated shopping list.
function handleDeleteItemClicked() {
  // like in `handleItemCheckClicked`, we use event delegation

  $('.js-shopping-list').on("click", '.js-item-delete', event => {
    // get the index of the item in STORE
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    // delete the item
    deleteListItem(itemIndex);
    // render the updated shopping list
    renderShoppingList();
  });
}


// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
}


// when the page loads, call `handleShoppingList`
$(handleShoppingList);
