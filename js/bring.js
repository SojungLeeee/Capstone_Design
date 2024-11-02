//bring.js
//search 버튼 누르면 데이터 가져오는 js


// positionSelect 요소의 값을 담을 변수를 선언
let selectedPosition = document.getElementById('positionSelect').value;

// positionSelect의 change 이벤트 리스너 추가
document.getElementById('positionSelect').addEventListener('change', function() {
    selectedPosition = this.value; // 사용자가 선택한 값으로 업데이트
});

document.getElementById('fetchDataButton').addEventListener('click', async function() {
  const name = document.getElementById('player-name').value;
  const year = document.getElementById('year').value;
  // const selectedPosition = document.getElementById('positionSelect').value;

  // 최소 하나의 입력이 필요
  if (!name && !year) {
    alert("이름 또는 연도 중 하나는 입력해야 합니다.");
    return; 
  }

  try {
    // 여기에서 포지션도 쿼리에 포함시킴
    const response = await fetch(`/fetchData?name=${encodeURIComponent(name)}&year=${encodeURIComponent(year)}&position=${encodeURIComponent(selectedPosition)}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Fetched data:', data);
    displayData(data);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
});

  

//////// db에서 이름 가져와서 선택하고 버튼클릭하면 가져오기
//이거쓸때는 server.js에서 /names부분 활성화
//일단은 혹시 모르니 남겨두기..

// document.addEventListener("DOMContentLoaded", async () => {
//     try {
//         const response = await fetch('http://127.0.0.1:5500/names'); // API 호출
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         else{
//             console.log('hi')
//         }
//         const names = await response.json(); // JSON 형식으로 응답 받기
//         const selectElement = document.querySelector('.nice-select.form-control .list'); // 커스터마이즈된 셀렉트의 리스트 요소 선택

//         // 기존 옵션 제거
//         selectElement.innerHTML = ''; // 기존 옵션 초기화

//         // 새로운 옵션 추가
//         names.forEach(name => {
//             const option = document.createElement('li');
//             option.textContent = name.NAME; // 화면에 보일 이름 추가
//             option.setAttribute('data-value', name.NAME); // 데이터 값 추가
//             option.className = 'option'; // 옵션 클래스 추가
//             selectElement.appendChild(option); // 리스트에 추가
//         });

//         // 기본 선택 항목 업데이트
//         const currentElement = document.querySelector('.nice-select.form-control .current');
//         currentElement.textContent =  '이름 선택'; // 첫 번째 이름으로 기본 선택 업데이트
//     } catch (error) {
//         console.error('Failed to fetch names:', error);
//     }
// });



// document.getElementById('fetchDataButton').addEventListener('click', async function() {
//     // 선택된 이름 가져오기
//     const selectedOption = document.querySelector('.nice-select.form-control .list .option.selected');
//     if (!selectedOption) {
//         alert("이름을 선택해 주세요.");
//         return;
//     }
  
//     const name = selectedOption.getAttribute('data-value'); // 선택된 이름의 value 가져오기
  
//     try {
//         const response = await fetch(`/fetchData?name=${encodeURIComponent(name)}`);
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         console.log('Fetched data:', data);
//         displayData(data);
//     } catch (error) {
//         console.error('Failed to fetch data:', error);
//     }
// });

// function displayData(data) {
//     const resultDiv = document.getElementById('result');
//     resultDiv.innerHTML = '';
  
//     if (data.length === 0) {
//         resultDiv.textContent = "일치하는 데이터가 없습니다.";
//         return;
//     }
  
//     data.forEach(row => {
//         const div = document.createElement('div');
//         div.textContent = JSON.stringify(row);
//         resultDiv.appendChild(div);
//     });
// }


//여기까지


//데이터 보여주기 (db에서 가져와서 표형식으로)
function displayData(data) {
  const tableBody = document.querySelector('table tbody'); // 기존 <table>의 <tbody> 선택

  // 기존 내용 제거
  tableBody.innerHTML = '';

  if (data.length === 0) {
      const noDataRow = document.createElement('tr');
      const noDataCell = document.createElement('td');
      noDataCell.colSpan = 6; // 모든 열을 차지하도록 설정 (6으로 수정)
      noDataCell.textContent = 'No data available';
      noDataRow.appendChild(noDataCell);
      tableBody.appendChild(noDataRow);
      return;
  }

  // 선택된 포지션 값 가져오기
  // const selectedPosition = document.querySelector('#positionSelect').value;
  const selectedPosition = document.getElementById('positionSelect').value;


  // 데이터에 따른 행 추가
  data.forEach((item) => {
      console.log(item); // 각 데이터 항목을 로그로 출력하여 확인

      const row = document.createElement('tr'); // 새로운 행 생성

      // 행에 데이터 셀 추가
      const nameCell = document.createElement('td');
      nameCell.textContent = item.Name; // 이름
      row.appendChild(nameCell);

      const yearCell = document.createElement('td');
      yearCell.textContent = item.Year; // 연도
      row.appendChild(yearCell);

      const positionCell = document.createElement('td');
      positionCell.textContent = selectedPosition.charAt(0).toUpperCase() + selectedPosition.slice(1); // 포지션
      row.appendChild(positionCell);

      const salaryCell = document.createElement('td');
      salaryCell.textContent = item.Salary ? `$${item.Salary}` : ''; // 연봉
      row.appendChild(salaryCell);

      const salaryNyCell = document.createElement('td');
      salaryNyCell.textContent = item['Salary(ny)'] ? `$${item['Salary(ny)']}` : ''; // 다음 해 연봉
      row.appendChild(salaryNyCell);

      const predSalaryCell = document.createElement('td');
      predSalaryCell.textContent = item['Pred_Salary'] !== undefined ? `$${item['Pred_Salary']}` : ''; // 예측된 연봉
      row.appendChild(predSalaryCell);

      tableBody.appendChild(row); // 행을 <tbody>에 추가
  });
}

