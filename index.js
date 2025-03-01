// index.js
// 실행할 때 node index.js로 실행

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');
const db = require("./js/mysql"); // 수정된 mysql.js 모듈

const app = express();
const port = process.env.PORT || 5500;
const host = process.env.HOST || "0.0.0.0";

//const port = 5500; // 포트 번호를 5500으로 변경
//const host = "127.0.0.1"; // 본인 로컬 환경에서 돌릴때는 호스트를 127.0.0.1로 변경

db.init(); // 데이터베이스 연결 풀 초기화

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors()); // CORS를 전체로 허용하도록 설정

// 정적 파일 제공
app.use(express.static(path.join(__dirname)));
app.use('/assets', express.static(path.join(__dirname, '/assets')));
app.use('/css', express.static(path.join(__dirname, '/css')));
app.use('/sass', express.static(path.join(__dirname, '/sass')));
app.use('/tasty', express.static(path.join(__dirname, '/tasty')));
app.use('/images', express.static(path.join(__dirname, '/images')));
app.use('/js', express.static(path.join(__dirname, '/js')));

// 기본 라우트 설정
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/main_home.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/main_home.html'));
});

app.get('/history.html', (req, res) => {
  console.log("Serving /history.html");
  res.sendFile(path.join(__dirname, '/history.html'));
});

app.get('/gallery.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/gallery.html'));
});

app.get('/contact.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/contact.html'));
});

app.get('/player.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/player.html'));
});


// 이름 또는 연도 중 택 1개를 하면 DB에서 일치하는 내용 가져오기
app.get("/fetchData", async (req, res) => {
  try {
    const { name, year, position } = req.query; // position 추가

    // 기본 쿼리와 파라미터 배열 초기화
    let query = "";
    const params = [];

    // Position에 따라 사용할 테이블 결정
    if (position === 'Pitcher') {
      query = "SELECT * FROM db연결연습용투수 WHERE 1=1"; // 투수 테이블
    } else if (position === 'Hitter') {
      query = "SELECT * FROM db연결연습용타자 WHERE 1=1"; // 타자 테이블
    } else {
      return res.status(400).send("Invalid position"); // 유효하지 않은 포지션 처리
    }

    // 이름이 입력된 경우 쿼리에 추가
    if (name) {
      query += " AND Name LIKE ?";
      params.push(`%${name}%`); // name의 일부라도 포함하는 항목을 찾음
    }

    // 연도가 입력된 경우 쿼리에 추가
    if (year) {
      query += " AND Year = ?";
      params.push(year);
    }

    // 쿼리 실행
    const [results] = await db.query(query, params);
    res.json(results); // 결과를 배열 형태로 반환
  } catch (err) {
    console.error("Query execution error:", err);
    res.status(500).send("Database error");
  }
});

// 이름 자동완성 API 추가
app.get("/fetchNames", async (req, res) => {
  try {
    const { name, position } = req.query;

    // 기본 쿼리와 파라미터 배열 초기화
    let query = "";
    const params = [];

    // Position에 따라 사용할 테이블 결정
    if (position === 'Pitcher') {
      query = "SELECT DISTINCT Name FROM db연결연습용투수 WHERE Name LIKE ?";
    } else if (position === 'Hitter') {
      query = "SELECT DISTINCT Name FROM db연결연습용타자 WHERE Name LIKE ?";
    } else {
      return res.status(400).send("Invalid position"); // 유효하지 않은 포지션 처리
    }

    // 이름이 입력된 경우 쿼리에 추가
    params.push(`%${name}%`); // 입력된 이름이 포함되는 항목을 검색

    // 쿼리 실행
    const [results] = await db.query(query, params);

    // 결과를 배열로 반환 (이름만 추출)
    const names = results.map(row => row.Name);
    res.json(names);
  } catch (err) {
    console.error("Query execution error:", err);
    res.status(500).send("Database error");
  }
});

// 서버 동작중인 표시
app.listen(port, host, () =>
    console.log(`Server is running on http://${host}:${port}`)
);

// 서버 종료 시 데이터베이스 연결 종료
process.on('SIGINT', async () => {
    await db.close();
    process.exit();
});

