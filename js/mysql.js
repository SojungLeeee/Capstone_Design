//mysql.js
const mysql = require("mysql2/promise"); // Promise 기반 API를 사용

// 만약 cloudtype을 연동해서 쓸 시에는 아래 형식처럼..
// const dbInfo = {
//     host: "svc.sel5.cloudtype.app",  // 데이터베이스 주소
//     port: 30803,         // 데이터베이스 포트
//     user: "root",       // 로그인 계정
//     password: "1234",   // db만들때 비밀번호
//     database: "PKNU_DATA", // 엑세스할 데이터베이스 이름
// };


const dbInfo = {
    host: "svc.sel4.cloudtype.app",  // 데이터베이스 주소
    port: 32552,         // 데이터베이스 포트
    user: "root",       // 로그인 계정
    password: "1234",   // 비밀번호
    database: "baseball", // 엑세스할 데이터베이스
};

let pool; // 데이터베이스 연결 풀

module.exports = {
    init: function () {
        // 연결 풀 생성
        pool = mysql.createPool(dbInfo);
        return pool;
    },
    query: async function (sql, params) {
        // 쿼리 실행
        const [results, fields] = await pool.execute(sql, params);
        return [results, fields];
    },
    close: async function () {
        // 연결 풀 종료
        if (pool) {
            await pool.end();
        }
    },
};
