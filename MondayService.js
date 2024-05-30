function getEmployees() {
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


function getSchoolsByDistrict() {
  // get data from project overview board
  var i = 1;
  var cursor = null;
  var apiRes;
  while (i != 0) {
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
  let schoolsByDistrict = {};
  apiRes["data"]["boards"][0]["items_page"]["items"].forEach((e) => {
    const districtName = e.group.title;
    const schoolName = e.name;
    if (!schoolsByDistrict[districtName]) {
      schoolsByDistrict[districtName] = [e.name];
    } else {
      schoolsByDistrict[districtName].push(schoolName);
    }
  });
  Logger.log(schoolsByDistrict);
  return schoolsByDistrict;
}

function getTeachersBySchool() {
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
  let teachersBySchool = {};
  apiRes["data"]["boards"][0]["items_page"]["items"].forEach((e) => {
    const district = e.column_values.filter((v) => {
      return v.column.title === "District Name";
    })[0].text;
    const school = e.column_values.filter((v) => {
      return v.column.title === "School Name";
    })[0].text;
    const teacherName = e.column_values.filter((v) => {
      return v.column.title === "Coachee";
    })[0].text;
    Logger.log(school);
    //no districts
    if (!teachersBySchool[district]) {
      teachersBySchool[district] = { [school]: [teacherName] };
    } else if (
      teachersBySchool[district] &&
      !teachersBySchool[district][school]
    ) {
      teachersBySchool[district][school] = [teacherName];
    } else {
      teachersBySchool[district][school].push(teacherName);
    }
  });
  Logger.log(teachersBySchool);
  return teachersBySchool;
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
