function deleteAllQuestions() {
  var form = FormApp.getActiveForm();
  var items = form.getItems();
  const originalItemsNum = items.length;
  var itemCounts = 0;
  while (itemCounts < originalItemsNum) {
    const itemToDelete = items.shift();
    form.deleteItem(itemToDelete);
    itemCounts += 1;
  }
}
