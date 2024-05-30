function updateTeacherQuestions() {
  var items = form.getItems();
  var newTeacherInfo = getTeachersBySchool();
  var teacherQuestions = [];
  for (var i = 0; i < items.length; i++) {
    if (items[i].getTitle().toString().indexOf("Select a teacher from") != -1) {
      teacherQuestions.push(items[i]);
    }
  }
  for (teacherQuestion of teacherQuestions) {
    for (project of Object.entries(newTeacherInfo)) {
      if (teacherQuestion.getTitle().toString().indexOf(project[0]) != -1) {
        for (school of Object.entries(project[1])) {
          if (teacherQuestion.getTitle().toString().indexOf(school[0]) != -1) {
            var teacherDropdown = teacherQuestion.asListItem();
            uniqueTeacherSet = new Set(school[1]);
            const uniqueTeacherArray = [];
            uniqueTeacherArray.push(...uniqueTeacherSet);
            uniqueTeacherArray.push("N/A");
            teacherDropdown.setChoiceValues(uniqueTeacherArray);
          }
        }
      }
    }
  }
}

function updateCoachNameQuestion() {
  const items = form.getItems();
  const coachesList = getEmployees();
  let coachNameIds = [];
  let coachQuestion;
  for (var i = 0; i < items.length; i++) {
    if (items[i].getTitle().toString().indexOf("What is your name") != -1) {
      coachQuestion = items[i];
      break;
    }
  }
  coachesList.forEach((c) => {
    coachNameIds.push(`${c.name}-${c.id}`);
  });
  const coachDropdown = coachQuestion.asListItem();
  coachDropdown.setChoiceValues(coachNameIds);
}



