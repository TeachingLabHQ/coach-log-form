function addNewSection() {
  const items = form.getItems();
  for (item of items) {
    if (item.getTitle().indexOf("What is your name") !== -1) {
      form.addPageBreakItem().setTitle("test");
    }
  }
}