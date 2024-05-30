const form = FormApp.getActiveForm();

function addNewQuestions() {
  addCoachQuestion();
  addDistrictSchoolTeacherQuestion();
}

function addCoachQuestion() {
  var coachesList = getEmployees();
  var coachNameIds = [];
  var dropdown = form.addListItem().setTitle("What is your name?");
  coachesList.forEach((c) => {
    coachNameIds.push(`${c.name}(${c.id})`);
  });
  dropdown.setChoiceValues(coachNameIds);
}

function addDistrictSchoolTeacherQuestion() {
  const districtQuestion = form.addListItem();
  districtQuestion.setTitle(
    "Please select the district and the school that you are working for.",
  );
  var schoolsByDistrict = getSchoolsByDistrict();
  var teachers = getTeachersBySchool();

  //add the district school question
  var districtSchoolOptions = [];
  let teacherSectionList = [];
  for (var district in schoolsByDistrict) {
    const schoolsByDistrictSet = new Set(schoolsByDistrict[district]);
    const uniqueSchoolsByDistrictList = [...schoolsByDistrictSet];
    for (var school of uniqueSchoolsByDistrictList) {
      var districtSchoolOption = `${district}-${school}`;
      var teacherSection = form
        .addPageBreakItem()
        .setTitle(`Teacher Selection for ${school}`);
      var teacherQuestion = form
        .addListItem()
        .setTitle("Select a teacher from " + districtSchoolOption);
      let uniqueTeacherSet = new Set();
      if (teachers[district] && teachers[district][school]) {
        uniqueTeacherSet = new Set(teachers[district][school]);
      }
      teacherSectionList.push(teacherSection);
      let uniqueTeacherArray = [];
      uniqueTeacherArray.push(...uniqueTeacherSet);
      uniqueTeacherArray.push("N/A");
      teacherQuestion.setChoiceValues(uniqueTeacherArray);
      districtSchoolOptions.push(
        districtQuestion.createChoice(districtSchoolOption, teacherSection),
      );
    }
  }
  const coachingDetailsSection = form
    .addPageBreakItem()
    .setTitle("Coaching Details");
  for (const teacherSection of teacherSectionList) {
    teacherSection.setGoToPage(coachingDetailsSection);
  }
  districtQuestion.setChoices(districtSchoolOptions);
}

