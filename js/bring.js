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

      const teamCell = document.createElement('td');
      teamCell.textContent = item.Team; // 연도
      row.appendChild(teamCell);

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



document.addEventListener("DOMContentLoaded", () => {
  const playerNameInput = document.getElementById("player-name");
  const positionSelect = document.getElementById("positionSelect");
  const nameSuggestions = document.getElementById("nameSuggestions");

  // name 입력란에서 사용자가 입력할 때마다 자동완성 목록을 가져옴
  playerNameInput.addEventListener("input", async () => {
    const name = playerNameInput.value.trim();
    const position = positionSelect.value;

    if (name.length < 1) return; // 최소 1자 이상 입력 시 조회

    try {
      // position과 name 값을 포함하여 API 요청
      const response = await fetch(`/fetchNames?name=${encodeURIComponent(name)}&position=${encodeURIComponent(position)}`);
      if (response.ok) {
        const names = await response.json();

        // 입력한 이름과 일치하는 이름이 있으면 datalist 초기화
        if (names.includes(name)) {
          nameSuggestions.innerHTML = ""; // datalist 초기화
          return;
        }

        // 자동완성 옵션을 비우고 새로운 목록 추가
        nameSuggestions.innerHTML = ""; // datalist 초기화
        names.forEach(name => {
          const option = document.createElement("option");
          option.value = name;
          nameSuggestions.appendChild(option);
        });
      } else {
        console.error("Failed to fetch names");
      }
    } catch (error) {
      console.error("Error fetching names:", error);
    }
  });
});
