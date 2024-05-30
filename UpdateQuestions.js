function updateTeacherQuestions() {
  var items = form.getItems();
  var newTeacherInfo = getteachersBySites();
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

function updateDistrictSchoolQuestions() {
  //get latest district sites
  const schoolsByDistrict = getSchoolsByDistrict();
  let latestDistrictSchoolOptions = [];
  for (const district in schoolsByDistrict) {
    const schoolsByDistrictSet = new Set(schoolsByDistrict[district]);
    const uniqueSchoolByDistrictList = [...schoolsByDistrictSet];
    for (const school of uniqueSchoolByDistrictList) {
      const districtSchoolOption = `${district}-${school}`;
      latestDistrictSchoolOptions.push(districtSchoolOption);
    }
  }
  //get current project site options from the dropdown
  const items = form.getItems();
  let currDistrictSchoolQuestion;
  for (const item of items) {
    if (
      item
        .getTitle()
        .toString()
        .indexOf(
          "Please select the project and the site that you are working on",
        ) != -1
    ) {
      currDistrictSchoolQuestion = item.asListItem();
      break;
    }
  }
  const currDistrictSchoolChoices = currDistrictSchoolQuestion
    .getChoices()
    .map((c) => c.getValue());
  const needUpdate = !(
    currDistrictSchoolChoices.length === latestDistrictSchoolOptions.length &&
    currDistrictSchoolChoices.every((c, idx) => {
      return c === latestDistrictSchoolOptions[idx];
    })
  );
  if (needUpdate) {
    currDistrictSchoolQuestion.setChoiceValues(latestDistrictSchoolOptions);
  }
}


