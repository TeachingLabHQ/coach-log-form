function deleteProjectSiteTeacherSelection() {
  var form = FormApp.getActiveForm();
  var items = form.getItems();
  var itemsToDelete = [];
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    Logger.log(item.getTitle());
    if (
      item.getTitle().indexOf("select the project and the site") !== -1 ||
      item.getTitle().indexOf("Select a teacher") !== -1 ||
      item.getTitle().indexOf("Teacher Selection") !== -1
    ) {
      itemsToDelete.push(item);
    }
  }
  for (var j = 0; j < itemsToDelete.length; j++) {
    form.deleteItem(itemsToDelete[j]);
  }
}

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
