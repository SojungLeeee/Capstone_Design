//index.js
//실행할 때 node index.js로 실행

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');
const db = require("./js/mysql"); // 수정된 mysql.js 모듈

const app = express();
// const port = process.env.PORT || 3030;
// const host = process.env.HOST || "0.0.0.0";


const port = 5500; // 포트 번호를 5500으로 변경
const host = "127.0.0.1"; // 호스트를 127.0.0.1로 변경


db.init(); // 데이터베이스 연결 풀 초기화

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors()); // CORS를 전체로 허용하도록 설정

// 정적 파일 제공
// app.use(express.static(path.join(__dirname, 'css')));
app.use('/images', express.static(path.join(__dirname, '/images')));
app.use('/js', express.static(path.join(__dirname, '/js')));

// 기본 라우트 설정
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});



//이름 또는 연도 중 택 1개를 하면 DB에서 일치하는 내용 가져오기
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
      query += " AND Name = ?"; // Name 열을 사용
      params.push(name);
    }

    // 연도가 입력된 경우 쿼리에 추가
    if (year) {
      query += " AND Year = ?"; // Year 열을 사용
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



// 서버 동작중인 표시
app.listen(port, host, () =>
    console.log(`Server is running on http://${host}:${port}`)
);

// 서버 종료 시 데이터베이스 연결 종료
process.on('SIGINT', async () => {
    await db.close();
    process.exit();
});
