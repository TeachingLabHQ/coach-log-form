function clearTeacherSelection() {
  var form = FormApp.getActiveForm();
  var items = form.getItems();
  var deleteConfirmation = true;
  const originalItemsNum = items.length;
  var itemCounts = 0;
  while (itemCounts < originalItemsNum) {
    const itemToDelete = items.shift();
    Logger.log(itemToDelete.getTitle());
    if (itemToDelete.getTitle() === "Teacher Selection") {
      deleteConfirmation = true;
    }
    if (deleteConfirmation) {
      form.deleteItem(itemToDelete);
    }
    itemCounts += 1;
  }
}

function updateTeacherQuestion() {
  var form = FormApp.getActiveForm();
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

function getAllCoaches() {
  var bodyData = {
    query: `{users  {
      email
      name
    id
    
    }}`,
  };
  var apiData = UrlFetchApp.fetch("https://api.monday.com/v2", {
    method: "post",
    headers: {
      contentType: "application/json",
      Authorization:
        "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjIzNDI2ODE2OCwidWlkIjozMTI4ODQ0NCwiaWFkIjoiMjAyMy0wMi0wM1QwMDozNjoyMC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6ODg4NDgxOSwicmduIjoidXNlMSJ9.oM37gRdrLf8UnnmuZIM-QWDRoT_GtgFLLyHpvnxGUtQ",
      "API-Version": "2023-10",
    },
    payload: bodyData,
  });
  var coaches = JSON.parse(apiData).data.users;
  return coaches;
}

function getSitesByProject() {
  // get data from project overview board
  var i = 1;
  var cursor = null;
  var apiRes;
  while (i != 0) {
    Logger.log("Monday data Page " + i + " retrieved.");
    var bodyData;
    if (i == 1) {
      bodyData = {
        query:
          "{boards(ids:6477891110){items_page(limit:500) {cursor items {name group{title}}}}}",
      };
    } else {
      bodyData = {
        query:
          '{next_items_page(limit:500, cursor:"' +
          cursor +
          '"){cursor items {name group{title}}}}',
      };
    }
    var apiData = UrlFetchApp.fetch("https://api.monday.com/v2", {
      method: "post",
      headers: {
        contentType: "application/json",
        Authorization:
          "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjIzNDI2ODE2OCwidWlkIjozMTI4ODQ0NCwiaWFkIjoiMjAyMy0wMi0wM1QwMDozNjoyMC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6ODg4NDgxOSwicmduIjoidXNlMSJ9.oM37gRdrLf8UnnmuZIM-QWDRoT_GtgFLLyHpvnxGUtQ",
        "API-Version": "2023-10",
      },
      payload: bodyData,
    });

    if (i == 1) {
      cursor = JSON.parse(apiData).data.boards[0].items_page.cursor;
    } else {
      cursor = JSON.parse(apiData).data.next_items_page.cursor;
    }
    if (cursor == null && i != 1) {
      i = 0;
      var concatArray = apiRes.data.boards[0].items_page.items.concat(
        JSON.parse(apiData).data.next_items_page.items,
      );
      apiRes.data.boards[0].items_page.items = concatArray;
    } else if (cursor == null && i == 1) {
      i = 0;
      apiRes = JSON.parse(apiData);
    }
    //cursor is not null, there are mo
    else {
      if (apiRes == null) {
        apiRes = JSON.parse(apiData);
      } else {
        var concatArray = apiRes.data.boards[0].items_page.items.concat(
          JSON.parse(apiData).data.next_items_page.items,
        );
        apiRes.data.boards[0].items_page.items = concatArray;
      }
      i++;
    }
  }
  let sitesByProject = {};
  apiRes["data"]["boards"][0]["items_page"]["items"].forEach((e) => {
    const projectName = e.group.title;
    const siteName = e.name;
    if (!sitesByProject[projectName]) {
      sitesByProject[projectName] = [e.name];
    } else {
      sitesByProject[projectName].push(siteName);
    }
  });
  Logger.log(sitesByProject);
  return sitesByProject;
}

function addNewQuestion() {
  var form = FormApp.getActiveForm();
  addCoachQuestion();
  form.addPageBreakItem().setTitle("Teacher Selection");
  addPartnerSitesQuestion();
}

function addCoachQuestion() {
  var coachesList = getAllCoaches();
  var coachNamesIds = [];
  var form = FormApp.getActiveForm();
  var dropdown = form.addListItem().setTitle("What is your name?");
  coachesList.forEach((c) => {
    coachNamesIds.push(`${c.name}-${c.id}`);
  });
  dropdown.setChoiceValues(coachNamesIds);
  Logger.log(coachNamesIds);
}

//create coaching partner questions
function addPartnerSitesQuestion() {
  var form = FormApp.getActiveForm();
  var projectQuestion = form.addListItem();
  projectQuestion.setTitle("Select a Project");
  var sitesByProject = getSitesByProject();
  var teachers = getteachersBySites();
  var choices = [];
  for (var key in sitesByProject) {
    var section = form.addPageBreakItem().setTitle(key);
    var schoolQuestion = form
      .addListItem()
      .setTitle("Select an Option for " + key);
    const uniqueSitesByProject = new Set(sitesByProject[key]);
    const uniqueSitesByProjectArray = [...uniqueSitesByProject];
    var schoolChoices = [];

    for (var school of uniqueSitesByProjectArray) {
      var teacherSection = form
        .addPageBreakItem()
        .setTitle(school)
        .setGoToPage(FormApp.PageNavigationType.SUBMIT);
      var teacherQuestion = form
        .addListItem()
        .setTitle("Select a teacher from " + school + " (" + key + ")");
      let uniqueTeacherSet = new Set();
      if (teachers[key] && teachers[key][school]) {
        uniqueTeacherSet = new Set(teachers[key][school]);
      }
      const uniqueTeacherArray = ["N/A"];
      uniqueTeacherArray.push(...uniqueTeacherSet);
      teacherQuestion.setChoiceValues(uniqueTeacherArray);
      schoolChoices.push(schoolQuestion.createChoice(school, teacherSection));
    }
    schoolQuestion.setChoices(schoolChoices);
    uniqueSitesByProjectArray.push("N/A");

    choices.push(projectQuestion.createChoice(key, section));
  }

  projectQuestion.setChoices(choices);
}

function sendToMonday(e) {
  const formResponse = {};
  e.response.getItemResponses().forEach((r) => {
    if (r.getItem().getTitle().toString().indexOf("Select a Project") != -1) {
      formResponse["coachingPartner"] = r.getResponse();
    } else if (
      r.getItem().getTitle().toString().indexOf("Select an Option for") != -1
    ) {
      formResponse["site"] = r.getResponse();
    } else if (
      r
        .getItem()
        .getTitle()
        .toString()
        .indexOf("Please Select Today's Date:") != -1
    ) {
      formResponse["date"] = r.getResponse();
    } else if (r.getItem().getTitle().toString().indexOf("Coach Name") != -1) {
      Logger.log(r.getResponse());
      formResponse["coachId"] = r.getResponse().split("-")[1];
    }
    Logger.log(formResponse);
  });
  // const itemData = {
  //   "name": e.response.getItemResponses()[0].getResponse(), // Assuming first question is for the item name
  //   // Add other fields as necessary
  // };

  const mondayToken =
    "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjIzNDI2ODE2OCwidWlkIjozMTI4ODQ0NCwiaWFkIjoiMjAyMy0wMi0wM1QwMDozNjoyMC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6ODg4NDgxOSwicmduIjoidXNlMSJ9.oM37gRdrLf8UnnmuZIM-QWDRoT_GtgFLLyHpvnxGUtQ";
  const boardId = "619766033";
  sendItemToMonday(formResponse, mondayToken, boardId);
}

function sendItemToMonday(itemData, token, boardId) {
  const url = `https://api.monday.com/v2`;
  const graphqlQuery = `
    mutation ($newItemName: String!, $columnVals: JSON!, $groupName: String!) {
      create_item (
        board_id: 6197660733, 
        item_name: $newItemName,
        group_id: $groupName,
        column_values: $columnVals,
        create_labels_if_missing: true) { 
          id 
        }
    }`;
  const columnVals = JSON.stringify({
    date: { date: itemData.date },
    people3: itemData.coachId,
    // short_text_2:textInput1.value,
    // email7:{email:email1.value, text:email1.value},
    // single_select9:{label:select4.value},
    // date6: { date:moment(date2.value).format("YYYY-MM-DD")},
    // short_text09:select5.value === 'Other' ? textInput2.value : select5.value,
    // short_text06: textInput3.value,
    // multi_select:multiselect1.value.toString(),
    // short_text_161:textInput4.value,multi_select_1:multiselect2.value.toString(),
    coaching_partners: { label: itemData.coachingPartner.toString() },
    short_text66: itemData.site.toString(),
  });
  console.log(columnVals);
  const payload = {
    query: graphqlQuery,
    variables: {
      newItemName: "newItemTest",
      columnVals: columnVals,
      groupName: "topics",
    },
  };

  const options = {
    method: "post",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    payload: JSON.stringify(payload),
  };
  try {
    var response = UrlFetchApp.fetch(url, options);
    Logger.log(response);
  } catch (e) {
    Logger.log(e);
  }
}

function getteachersBySites() {
  // get data from project overview board
  var i = 1;
  var cursor = null;
  var apiRes;
  while (i != 0) {
    Logger.log("Monday data Page " + i + " retrieved.");
    var bodyData;
    if (i == 1) {
      bodyData = {
        query:
          '{boards(ids:6197660733){items_page (limit:100) {items {column_values(ids:["short_text_2","coaching_partners","short_text66"]){text column{title}}}}}}',
      };
    } else {
      bodyData = {
        query:
          '{next_items_page(limit:500, cursor:"' +
          cursor +
          '"){cursor items {column_values(ids:["short_text_2","coaching_partners","short_text66"]){text column{title}}}}}',
      };
    }
    var apiData = UrlFetchApp.fetch("https://api.monday.com/v2", {
      method: "post",
      headers: {
        contentType: "application/json",
        Authorization:
          "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjIzNDI2ODE2OCwidWlkIjozMTI4ODQ0NCwiaWFkIjoiMjAyMy0wMi0wM1QwMDozNjoyMC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6ODg4NDgxOSwicmduIjoidXNlMSJ9.oM37gRdrLf8UnnmuZIM-QWDRoT_GtgFLLyHpvnxGUtQ",
        "API-Version": "2023-10",
      },
      payload: bodyData,
    });

    if (i == 1) {
      cursor = JSON.parse(apiData).data.boards[0].items_page.cursor;
    } else {
      cursor = JSON.parse(apiData).data.next_items_page.cursor;
    }
    if (cursor == null && i != 1) {
      i = 0;
      var concatArray = apiRes.data.boards[0].items_page.items.concat(
        JSON.parse(apiData).data.next_items_page.items,
      );
      apiRes.data.boards[0].items_page.items = concatArray;
    } else if (cursor == null && i == 1) {
      i = 0;
      apiRes = JSON.parse(apiData);
    }
    //cursor is not null, there are mo
    else {
      if (apiRes == null) {
        apiRes = JSON.parse(apiData);
      } else {
        var concatArray = apiRes.data.boards[0].items_page.items.concat(
          JSON.parse(apiData).data.next_items_page.items,
        );
        apiRes.data.boards[0].items_page.items = concatArray;
      }
      i++;
    }
  }
  let teachersBySite = {};
  apiRes["data"]["boards"][0]["items_page"]["items"].forEach((e) => {
    const projectName = e.column_values.filter((v) => {
      return v.column.title === "Site/Partner";
    })[0].text;
    const siteName = e.column_values.filter((v) => {
      return v.column.title === "School Name";
    })[0].text;
    const teacherName = e.column_values.filter((v) => {
      return v.column.title === "Coachee";
    })[0].text;
    Logger.log(siteName);
    //no project
    if (!teachersBySite[projectName]) {
      teachersBySite[projectName] = { [siteName]: [teacherName] };
    } else if (
      teachersBySite[projectName] &&
      !teachersBySite[projectName][siteName]
    ) {
      teachersBySite[projectName][siteName] = [teacherName];
    } else {
      teachersBySite[projectName][siteName].push(teacherName);
    }
  });
  Logger.log(teachersBySite);
  return teachersBySite;
}
