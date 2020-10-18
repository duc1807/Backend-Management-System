const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// [✔] Connect to database
var mysql = require("mysql");

// Declare the partial view (navigation)
const MENU_PARTIAL = { menuPartial: "../partials/staff_nav" };

// Use middle to authorization
router.use(staffValidation);

var connection = mysql.createConnection({
  host: "sql12.freemysqlhosting.net",
  user: "sql12371466",
  password: "pZGVwZJwxy",
  database: "sql12371466",
  port: 3306,
  multipleStatements: true,
});

connection.connect(function (err) {
  if (!!err) console.log(err);
  else console.log("Connected");
});

// GET: Homepage for staff
router.get("/home", (req, res) => {
  res.render("./staff/home", {
    // Active: the status of list in navigation to know which page is focused
    active: { home: true },
    partials: MENU_PARTIAL,
  });
});

//==================================================== GET: Trainee account management pages
router.get("/account/trainee", (req, res) => {
  let sql = `SELECT *, Course.courseName 
             FROM TraineeAccount
             INNER JOIN Course ON TraineeAccount.course_id = Course.course_id;
             SELECT *, Course.courseName
             FROM Category
             INNER JOIN Course ON Category.category_id = Course.category_id;
             SELECT * FROM Category`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;
    const category = getCategory(rows[1], rows[2]);

    // var category = []

    // for(f = 0; f < rows[2].length; f++)
    // {
    //   category.push(
    //     {
    //       name: rows[2][f]['name'],
    //       description: []
    //     })
    // }

    // for (var i = 0; i < rows[1].length; i++)
    // {
    //   // var description = []
    //   for(var e = 0; e < category.length; e++)
    //   {
    //     // isExisted = false
    //     if(rows[1][i]['name'] == category[e].name)
    //     {
    //       // isExisted = true
    //       category[e].description.push({
    //         course_id: rows[1][i]['course_id'],
    //         courseName: rows[1][i]['courseName']
    //       })
    //       break
    //     }
    //   }
    // }
    res.render("./staff/manageTrainee", {
      result: rows[0],
      category: rows[1],
      type: category,
      active: { trainee: true },
      partials: MENU_PARTIAL,
    });
  });
});

// POST: Add trainee account
router.post("/account/trainee/add", (req, res) => {
  const {
    username,
    password,
    dob,
    mainPL,
    expDetail,
    name,
    age,
    education,
    toeic,
    location,
    course_id,
  } = req.body;

  let sql = `INSERT INTO TraineeAccount 
             (username, password, dob, mainPL, expDetail, name, age, education, toeic, location, course_id)
             VALUES ('${username}','${password}','${dob}','${mainPL}','${expDetail}','${name}',${age},'${education}','${toeic}','${location}', ${course_id})`;

  connection.query(sql, (err) => {
    if (err) throw err;
    res.redirect("/staff/account/trainee");
  });
});

// POST: Edit trainee account
router.post("/account/trainee/edit/:id", (req, res) => {
  const id = req.params.id;

  const {
    username,
    password,
    dob,
    mainPL,
    expDetail,
    name,
    age,
    education,
    toeic,
    location,
    course_id,
  } = req.body;

  let sql = `UPDATE TraineeAccount SET 
                username = '${username}',
                password = '${password}',
                dob = '${dob}',mainPL = '${mainPL}',
                expDetail = '${expDetail}',
                name = '${name}',
                age = '${age}',
                education = '${education}',
                toeic = '${toeic}' ,
                location = '${location}', 
                course_id = ${course_id}
              WHERE trainee_id = ${id}`;

  connection.query(sql, (err) => {
    if (err) throw err;
    res.redirect("/staff/account/trainee");
  });
});

// GET: Delete trainee account
router.get("/account/trainee/delete/:id", (req, res) => {
  const id = req.params.id;

  let sql = `DELETE FROM TraineeAccount WHERE trainee_id='${id}'`;

  connection.query(sql, (err) => {
    if (err) throw err;
    res.redirect("/staff/account/trainee");
  });
});

// POST: Search for trainee accounts
router.post("/account/trainee/search", (req, res) => {
  const key = req.body.key;

  let sql = `SELECT *, Course.courseName 
             FROM TraineeAccount 
             INNER JOIN Course ON TraineeAccount.course_id = Course.course_id
             WHERE username LIKE '%${key}%';
             SELECT *, Course.courseName
             FROM Category
             INNER JOIN Course ON Category.category_id = Course.category_id;
             SELECT * FROM Category`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;
    const category = getCategory(rows[1], rows[2]);
    // var category = []
    // var isExisted = null

    // for(f = 0; f < rows[2].length; f++)
    // {
    //   category.push(
    //     {
    //       name: rows[2][f]['name'],
    //       description: []
    //     })
    // }

    // for (var i = 0; i < rows[1].length; i++)
    // {
    //   var description = []
    //   for(var e = 0; e < category.length; e++)
    //   {
    //     isExisted = false
    //     if(rows[1][i]['name'] == category[e].name)
    //     {
    //       isExisted = true
    //       category[e].description.push({
    //         course_id: rows[1][i]['course_id'],
    //         courseName: rows[1][i]['courseName']
    //       })
    //       break
    //     }
    //   }
    //   if (!isExisted) category.push({name: rows[1][i]['name'], description: description})
    // }
    res.render("./staff/manageTrainee", {
      result: rows[0],
      category: rows[1],
      type: category,
      key: key
    });
  });
});

//========================================================= End of Trainee account management pages


//========================================================= Trainer account management pages

// GET: Trainer account management
router.get("/account/trainer", (req, res) => {
  const sql = `SELECT *, Account.username, Account.user_id
              FROM TutorAccount
              INNER JOIN Account ON TutorAccount.tutor_id = Account.user_id`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("./staff/manageTrainer", {
      result: rows,
      active: { trainer: true },
      partials: MENU_PARTIAL,
    });
  });
});

// POST: Edit Trainer account
router.post("/account/trainer/edit/:id", (req, res) => {
  const { name, age, type, workingPlace, phone, email } = req.body;
  const id = req.params.id;

  const sql = `UPDATE TutorAccount 
               SET name = '${name}',
                   age = '${age}',
                   type = '${type}',
                   workingPlace = '${workingPlace}',
                   phone = '${phone}',
                   email = '${email}'
               WHERE tutor_id = ${id}`;

  connection.query(sql, (err) => {
    if (err) throw err;
    res.redirect("/staff/account/trainer");
  });
});

// GET: Delete trainer information
router.get("/account/trainer/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE TutorAccount
               SET name = ${null},
                  age = ${null},
                  type = ${null},
                  workingPlace = ${null},
                  phone = ${null},
                  email = ${null}
                WHERE tutor_id = ${id}`;

  connection.query(sql, (err) => {
    if (err) throw err;
    res.redirect("/staff/account/trainer");
  });
});

//========================================================= End of Trainer account management pages


//====================================================  Category management pages

// GET: Category management
router.get("/category", (req, res) => {
  let sql = `SELECT * FROM Category`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("./staff/category", {
      result: rows,
      active: { training: true },
      partials: MENU_PARTIAL,
    });
  });
});

// POST: Add new category
router.post("/category/add", (req, res) => {
  const { name, description } = req.body;

  let sqlCheck = `SELECT * FROM Category WHERE name='${name}'`;
  // Check if the category name is duplicated or not
  connection.query(sqlCheck, (err, rows) => {
    // If category name is duplicated, reload the page
    if (rows && rows.length) {
      res.redirect("/staff/category");
    } else {
      let sql = `INSERT INTO Category (name, description) VALUES ('${name}', '${description}')`;

      connection.query(sql, (err) => {
        if (err) throw err;
        res.redirect("/staff/category");
      });
    }
  });
});

// POST: Edit category
router.post("/category/edit/:id", (req, res) => {
  const id = req.params.id;

  const { name, description } = req.body;

  let sqlCheck = `SELECT * FROM Category WHERE name='${name}' OR category_id=${id}`;
  // Check if the category name is duplicated or not
  connection.query(sqlCheck, (err, rows) => {
    // If result contains only 1 result
    if (rows && rows.length < 2) {
      let sql = `UPDATE Category SET name = '${name}', description = '${description}' WHERE category_id = ${id}`;

      connection.query(sql, (err) => {
        if (err) throw err;
        res.redirect("/staff/category");
      });
    } else res.redirect("/staff/category");
  });
});

// GET: Delete category
router.get("/category/delete/:id", (req, res) => {
  const id = req.params.id;

  let sql = `DELETE FROM Category WHERE category_id = ${id}`;

  connection.query(sql, (err) => {
    if (err) throw err;
    res.redirect("/staff/category");
  });
});

// POST: Search category
router.post("/category/search", (req, res) => {
  const key = req.body.key;

  let sql = `SELECT * FROM Category WHERE name LIKE '%${key}%'`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("./staff/category", { result: rows, key: key });
  });
});

// GET: Redirect to courses of selected category
router.get("/category/redirect/:id", (req, res) => {
  const id = req.params.id;

  let sql = `SELECT *, TutorAccount.name 
                FROM Course 
                LEFT JOIN TutorAccount ON Course.tutor_id = TutorAccount.tutor_id 
                WHERE category_id = ${id}; 
                SELECT * 
                FROM TutorAccount`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;

    res.render("./staff/course", {
      result: rows[0],
      tutor: rows[1],
      joined: rows[2],
      category: id,
      partials: MENU_PARTIAL,
    });
  });
});

//========================================================= End of Category management pages

//========================================================= Course management pages

// POST: Add new Course
router.post("/category/course/add", (req, res) => {
  const { category_id, courseName, description } = req.body;
  var tutor = req.body.tutor;
  if (!tutor) tutor = null;

  let sqlCheck = `SELECT * FROM Course WHERE courseName='${courseName}'`;

  connection.query(sqlCheck, (err, rows) => {
    // If course name is deuplicated, reload the page
    if (rows && rows.length)
      res.redirect(`/staff/category/redirect/${category_id}`);
    else {
      let sql = `INSERT INTO Course (courseName, description, category_id, tutor_id)
             VALUES ('${courseName}','${description}', ${category_id}, ${tutor})`;

      connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.redirect(`/staff/category/redirect/${category_id}`);
      });
    }
  });
});

// POST : Edit course
router.post("/category/course/edit/:id", (req, res) => {
  const course_id = req.params.id;

  const { category_id, courseName, description, tutor } = req.body;

  let sqlCheck = `SELECT * FROM Course WHERE courseName='${courseName}' OR course_id=${course_id}`;

  connection.query(sqlCheck, (err, rows) => {
    if (err) throw err;
    // If the result only contain 1 result
    if (rows && rows.length < 2) {
      let sql = `UPDATE Course SET courseName='${courseName}', description='${description}', tutor_id=${tutor}
      WHERE course_id = ${course_id}`;

      connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.redirect(`/staff/category/redirect/${category_id}`);
      });
    } else {
      res.redirect(`/staff/category/redirect/${category_id}`);
    }
  });
});

// GET: Delete a course
router.get("/category/course/delete/:id", (req, res) => {
  const id = req.params.id;

  let sql = `SELECT category_id FROM Course WHERE course_id = ${id}; DELETE FROM Course WHERE course_id = ${id}`;
  connection.query(sql, (err, row) => {
    if (err) throw err;
    res.redirect(`/staff/category/redirect/${row[0][0]["category_id"]}`);
  });
});

// POST: Search courses
router.post("/category/course/search", (req, res) => {
  const key = req.body.key;

  let sql = `SELECT * FROM Course WHERE courseName LIKE '%${key}%'`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("./staff/course", { result: rows, key: key });
  });
});

//========================================================= End of Course management pages

//========================================================= Topic management pages
// GET: show  topics of a course
router.get("/category/course/redirect/:id", (req, res) => {
  const course_id = req.params.id;

  let sql = `SELECT *,TutorAccount.name FROM Topic LEFT JOIN TutorAccount ON Topic.tutor_id = TutorAccount.tutor_id
               WHERE course_id = ${course_id}; SELECT * FROM Course WHERE course_id = ${course_id};SELECT * FROM TutorAccount`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;
    res.render("./staff/topic", {
      result: rows[0],
      coursename: rows[1][0].courseName,
      tutor: rows[2],
      course_id: course_id,
      partials: MENU_PARTIAL,
    });
  });
});

// POST: Add new topic
router.post("/category/course/topic/add", (req, res) => {
  const { topicName, description, course_id } = req.body;
  var tutor = req.body.tutor;
  if (!tutor) tutor = null;

  let sqlCheck = `SELECT * FROM Topic WHERE topicName='${topicName}'`;

  connection.query(sqlCheck, (err, rows) => {
    if (err) throw err;
    // If the returned result only contain 1 result
    if (rows && rows.length)
      res.redirect(`/staff/category/course/redirect/${course_id}`);
    else {
      let sql = `INSERT INTO Topic ( topicName, description, tutor_id, course_id)
                    VALUES ('${topicName}','${description}', ${tutor}, ${course_id})`;

      connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.redirect(`/staff/category/course/redirect/${course_id}`);
      });
    }
  });
});
// GET: Delete topic
router.get("/category/course/topic/delete/:id", (req, res) => {
  const id = req.params.id;

  let sql = `SELECT course_id FROM Topic WHERE id = ${id}; DELETE FROM Topic WHERE id = ${id}`;
  connection.query(sql, (err, row) => {
    if (err) throw err;
    res.redirect(`/staff/category/course/redirect/${row[0][0]["course_id"]}`);
  });
});

// POST: Edit topic
router.post("/category/course/topic/edit/:id", (req, res) => {
  const id = req.params.id;

  const { course_id, topicName, description, tutor } = req.body;

  let sqlCheck = `SELECT * FROM Topic WHERE topicName='${topicName}' AND course_id=${course_id}`;

  connection.query(sqlCheck, (err, rows) => {
    if (err) throw err;
    // If there are not any topics with similar topic name and course id
    if (rows && rows.length < 1) {
      let sql = `UPDATE Topic SET 
                  topicName='${topicName}', 
                  description='${description}', 
                  tutor_id=${tutor}, 
                  course_id = ${course_id}
                 WHERE id = ${id}`;

      connection.query(sql, (err) => {
        if (err) throw err;
        res.redirect(`/staff/category/course/redirect/${course_id}`);
      });
    } else res.redirect(`/staff/category/course/redirect/${course_id}`);
  });
});

// Middleware validation for staff role
function staffValidation(req, res, next) {
  // Retrive token from the cookies
  const token = req.cookies["token"];
  // If the token is not existed, send 401 error
  if (!token) {
    res.redirect("/status/401");
  }
  // Check if the token is expired or not
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.redirect("/status/401");
    if (user.role != "staff") res.redirect("/status/401");
    next();
  });
}

// Function to combine all courses into each of its different category group
function getCategory(rows1, rows2) {
  var category = [];
  for (f = 0; f < rows2.length; f++) {
    // Push all the category name into array and empty description
    category.push({
      name: rows2[f]["name"],
      description: [],
    });
  }

  // rows1: INNER JOIN trainee account and coursename
  // rows2: INNER JOIN category and coursename

  for (var i = 0; i < rows1.length; i++) {
    for (var e = 0; e < category.length; e++) {
      if (rows1[i]["name"] == category[e].name) {
        // If course's category name equal category name at index e, push coursename and courseid into array
        category[e].description.push({
          course_id: rows1[i]["course_id"],
          courseName: rows1[i]["courseName"],
        });
        break;
      }
    }
  }
  return category;
}

module.exports = router;
